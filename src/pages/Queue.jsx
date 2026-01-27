import React, { useState, useEffect } from 'react';
import { queueService, staffService } from '../services';
import Layout from '../components/Layout';
import Toast, { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import './Queue.css';

const Queue = () => {
  const [queueItems, setQueueItems] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState({});
  const { toast, showToast, setToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qRes, sRes] = await Promise.all([
        queueService.getQueue(),
        staffService.getAll(),
      ]);
      setQueueItems(qRes.data);
      setStaff(sRes.data.filter((s) => s.availabilityStatus === 'Available'));
    } catch (error) {
      showToast('Failed to load queue data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStaff = async (queueId) => {
    const staffId = selectedStaff[queueId];
    if (!staffId) {
      showToast('Please select a staff member', 'error');
      return;
    }

    try {
      await queueService.assignFromQueue(staffId);
      showToast('Appointment assigned successfully', 'success');
      setAssigningId(null);
      setSelectedStaff({});
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Assignment failed', 'error');
    }
  };

  if (loading) return <Spinner />;

  const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Waiting Queue</h1>
          <span className="queue-count">{queueItems.length} waiting</span>
        </div>

        {queueItems.length === 0 ? (
          <div className="empty-state">
            <p>✓ No appointments in the queue!</p>
            <small>All appointments have been assigned to staff members.</small>
          </div>
        ) : (
          <div className="queue-list">
            {queueItems.map((item, index) => (
              <div key={item._id} className="queue-item">
                <div className="queue-position">
                  <span className="position-badge">{ordinal(index + 1)}</span>
                </div>

                <div className="queue-info">
                  <h3>{item.customerName}</h3>
                  <p>
                    <strong>Service:</strong> {item.service.serviceName}
                    <span className="duration">({item.service.duration}min)</span>
                  </p>
                  <p>
                    <strong>Requested Date:</strong> {new Date(item.appointmentDate).toLocaleDateString()}
                    {' at '} {item.appointmentTime}
                  </p>
                  {item.notes && (
                    <p>
                      <strong>Notes:</strong> {item.notes}
                    </p>
                  )}
                  <p className="added-time">
                    Added: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="queue-actions">
                  {assigningId === item._id ? (
                    <div className="assign-form">
                      <select
                        value={selectedStaff[item._id] || ''}
                        onChange={(e) => setSelectedStaff({ ...selectedStaff, [item._id]: e.target.value })}
                        className="staff-select"
                      >
                        <option value="">Select staff member</option>
                        {staff.filter((s) => s.serviceType === item.service.requiredStaffType).map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                      <button
                        className="btn-small btn-success"
                        onClick={() => handleAssignStaff(item._id)}
                      >
                        Assign
                      </button>
                      <button
                        className="btn-small btn-cancel"
                        onClick={() => { setAssigningId(null); setSelectedStaff({}); }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setAssigningId(item._id)}
                    >
                      Assign to Staff
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
};

export default Queue;
