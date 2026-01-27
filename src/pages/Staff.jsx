import React, { useState, useEffect } from 'react';
import { staffService } from '../services';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import './Management.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: 'Doctor',
    dailyCapacity: 5,
    availabilityStatus: 'Available',
  });
  const { toast, showToast, setToast } = useToast();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      setStaff(response.data);
    } catch (error) {
      showToast('Failed to load staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await staffService.update(editingId, formData);
        showToast('Staff updated successfully', 'success');
      } else {
        await staffService.create(formData);
        showToast('Staff created successfully', 'success');
      }
      setModalOpen(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffService.delete(id);
        showToast('Staff deleted successfully', 'success');
        fetchStaff();
      } catch (error) {
        showToast('Failed to delete staff', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      serviceType: 'Doctor',
      dailyCapacity: 5,
      availabilityStatus: 'Available',
    });
    setEditingId(null);
  };

  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Staff Management</h1>
          <button className="btn btn-primary" onClick={openModal}>+ Add Staff</button>
        </div>

        <div className="list-container">
          {staff.length === 0 ? (
            <p className="empty-message">No staff members yet. Create one to get started.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service Type</th>
                  <th>Daily Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.serviceType}</td>
                    <td>{item.dailyCapacity}</td>
                    <td><span className={`status status-${item.availabilityStatus.toLowerCase()}`}>{item.availabilityStatus}</span></td>
                    <td className="actions">
                      <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Modal
          isOpen={modalOpen}
          title={editingId ? 'Edit Staff' : 'Add Staff'}
          onClose={() => { setModalOpen(false); resetForm(); }}
          onSubmit={handleSubmit}
          submitText={editingId ? 'Update' : 'Create'}
        >
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Service Type *</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="Doctor">Doctor</option>
                <option value="Consultant">Consultant</option>
                <option value="Support Agent">Support Agent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Daily Capacity</label>
              <input
                type="number"
                value={formData.dailyCapacity}
                onChange={(e) => setFormData({ ...formData, dailyCapacity: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </form>
        </Modal>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
};

export default Staff;
