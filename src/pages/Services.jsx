import React, { useState, useEffect } from 'react';
import { serviceService } from '../services';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import './Management.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: 30,
    requiredStaffType: 'Doctor',
    description: '',
  });
  const { toast, showToast, setToast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data);
    } catch (error) {
      showToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await serviceService.update(editingId, formData);
        showToast('Service updated successfully', 'success');
      } else {
        await serviceService.create(formData);
        showToast('Service created successfully', 'success');
      }
      setModalOpen(false);
      resetForm();
      fetchServices();
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
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.delete(id);
        showToast('Service deleted successfully', 'success');
        fetchServices();
      } catch (error) {
        showToast('Failed to delete service', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      serviceName: '',
      duration: 30,
      requiredStaffType: 'Doctor',
      description: '',
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
          <h1>Services Management</h1>
          <button className="btn btn-primary" onClick={openModal}>+ Add Service</button>
        </div>

        <div className="list-container">
          {services.length === 0 ? (
            <p className="empty-message">No services yet. Create one to get started.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Duration</th>
                  <th>Required Staff</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item) => (
                  <tr key={item._id}>
                    <td>{item.serviceName}</td>
                    <td>{item.duration} min</td>
                    <td>{item.requiredStaffType}</td>
                    <td>{item.description || '-'}</td>
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
          title={editingId ? 'Edit Service' : 'Add Service'}
          onClose={() => { setModalOpen(false); resetForm(); }}
          onSubmit={handleSubmit}
          submitText={editingId ? 'Update' : 'Create'}
        >
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Required Staff Type *</label>
              <select
                value={formData.requiredStaffType}
                onChange={(e) => setFormData({ ...formData, requiredStaffType: e.target.value })}
              >
                <option value="Doctor">Doctor</option>
                <option value="Consultant">Consultant</option>
                <option value="Support Agent">Support Agent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
          </form>
        </Modal>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
};

export default Services;
