import React, { useState, useEffect } from 'react';
import { appointmentService, serviceService, staffService } from '../services';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    customerName: '',
    service: '',
    assignedStaff: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: '10:00',
    notes: '',
  });
  const { toast, showToast, setToast } = useToast();

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptRes, svcRes, stfRes] = await Promise.all([
        appointmentService.getAll({ appointmentDate: selectedDate }),
        serviceService.getAll(),
        staffService.getAll(),
      ]);
      setAppointments(aptRes.data);
      setServices(svcRes.data);
      setStaff(stfRes.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await appointmentService.update(editingId, formData);
        showToast('Appointment updated successfully', 'success');
      } else {
        const result = await appointmentService.create(formData);
        if (result.data.addedToQueue) {
          showToast('No eligible staff available. Added to queue.', 'warning');
        } else {
          showToast('Appointment created successfully', 'success');
        }
      }
      setModalOpen(false);
      setConflict(null);
      resetForm();
      fetchData();
    } catch (error) {
      if (error.response?.status === 409) {
        setConflict(error.response?.data?.message);
      } else {
        showToast(error.response?.data?.message || 'Operation failed', 'error');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      customerName: item.customerName,
      service: item.service._id,
      assignedStaff: item.assignedStaff?._id || '',
      appointmentDate: item.appointmentDate.split('T')[0],
      appointmentTime: item.appointmentTime,
      notes: item.notes,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      try {
        await appointmentService.delete(id);
        showToast('Appointment cancelled', 'success');
        fetchData();
      } catch (error) {
        showToast('Failed to cancel appointment', 'error');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'Completed') {
        await appointmentService.complete(id);
      } else if (newStatus === 'No-Show') {
        await appointmentService.markNoShow(id);
      }
      showToast('Status updated', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      service: '',
      assignedStaff: '',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00',
      notes: '',
    });
    setEditingId(null);
  };

  const openModal = () => {
    resetForm();
    setConflict(null);
    setModalOpen(true);
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Appointments</h1>
          <button className="btn btn-primary" onClick={openModal}>+ New Appointment</button>
        </div>

        <div className="date-filter">
          <label>View appointments for:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="list-container">
          {appointments.length === 0 ? (
            <p className="empty-message">No appointments for this date.</p>
          ) : (
            <div className="appointments-grid">
              {appointments.map((apt) => (
                <div key={apt._id} className={`appointment-card status-${apt.status.toLowerCase()}`}>
                  <div className="apt-header">
                    <h3>{apt.customerName}</h3>
                    <span className={`status status-${apt.status.toLowerCase()}`}>{apt.status}</span>
                  </div>
                  <div className="apt-details">
                    <p><strong>Service:</strong> {apt.service.serviceName}</p>
                    <p><strong>Time:</strong> {apt.appointmentTime}</p>
                    <p><strong>Staff:</strong> {apt.assignedStaff?.name || 'Unassigned'}</p>
                    {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                  </div>
                  <div className="apt-actions">
                    <button className="btn-small btn-edit" onClick={() => handleEdit(apt)}>Edit</button>
                    {apt.status === 'Scheduled' && (
                      <>
                        <button className="btn-small btn-success" onClick={() => handleStatusChange(apt._id, 'Completed')}>Complete</button>
                        <button className="btn-small btn-warning" onClick={() => handleStatusChange(apt._id, 'No-Show')}>No-Show</button>
                      </>
                    )}
                    <button className="btn-small btn-delete" onClick={() => handleDelete(apt._id)}>Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={modalOpen}
          title={editingId ? 'Edit Appointment' : 'New Appointment'}
          onClose={() => { setModalOpen(false); resetForm(); setConflict(null); }}
          onSubmit={handleSubmit}
          submitText={editingId ? 'Update' : 'Create'}
        >
          {conflict && (
            <div className="conflict-warning">
              <strong>⚠️ Conflict Detected:</strong>
              <p>{conflict}</p>
              <p>Please choose a different staff member or time.</p>
            </div>
          )}
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Service *</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                required
              >
                <option value="">Select a service</option>
                {services.map((svc) => (
                  <option key={svc._id} value={svc._id}>{svc.serviceName} ({svc.duration}min)</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Assign Staff (optional)</label>
              <select
                value={formData.assignedStaff}
                onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
              >
                <option value="">Auto-assign if available</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.serviceType})</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="2"
              />
            </div>
          </form>
        </Modal>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
};

export default Appointments;
