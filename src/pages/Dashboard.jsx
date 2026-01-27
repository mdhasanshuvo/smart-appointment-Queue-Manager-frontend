import React, { useState, useEffect } from 'react';
import { dashboardService, staffService, queueService, activityLogService } from '../services';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, queueRes, logsRes] = await Promise.all([
        dashboardService.getStats(selectedDate),
        queueService.getQueue(),
        activityLogService.getLogs(10),
      ]);

      setStats(statsRes.data);
      setQueue(queueRes.data);
      setActivityLogs(logsRes.data);
    } catch (error) {
      // Error handling - could show toast notification here
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-selector">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p className="stat-value">{stats?.totalAppointments || 0}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p className="stat-value">{stats?.completedAppointments || 0}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-value">{stats?.pendingAppointments || 0}</p>
        </div>
        <div className="stat-card queue">
          <h3>In Queue</h3>
          <p className="stat-value">{stats?.queueCount || 0}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section staff-load-section">
          <h2>Staff Load Summary</h2>
          <div className="staff-load-list">
            {stats?.staffLoadSummary?.map((staff) => (
              <div key={staff.staffId} className={`staff-load-item ${staff.status.toLowerCase()}`}>
                <span className="staff-name">{staff.staffName}</span>
                <span className="staff-load">
                  {staff.appointmentsToday} / {staff.dailyCapacity}
                </span>
                <span className={`staff-status ${staff.status.toLowerCase()}`}>
                  {staff.status}
                </span>
              </div>
            ))}
            {(!stats?.staffLoadSummary || stats.staffLoadSummary.length === 0) && (
              <p className="empty-message">No staff members available</p>
            )}
          </div>
        </div>

        <div className="section activity-log-section">
          <h2>Recent Activity</h2>
          <div className="activity-log-list">
            {activityLogs?.map((log, index) => (
              <div key={log._id || index} className="activity-log-item">
                <span className="log-time">{log.formattedTime}</span>
                <span className="log-description">{log.description}</span>
              </div>
            ))}
            {(!activityLogs || activityLogs.length === 0) && (
              <p className="empty-message">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {stats?.queueCount > 0 && (
        <div className="section queue-section">
          <h2>Waiting Queue ({stats.queueCount})</h2>
          <div className="queue-list">
            {queue?.map((item, index) => (
              <div key={item._id} className="queue-item">
                <span className="queue-position">#{item.position}</span>
                <div className="queue-details">
                  <strong>{item.appointment?.customerName}</strong>
                  <span className="queue-service">{item.appointment?.service?.serviceName}</span>
                  <span className="queue-time">{item.appointment?.appointmentTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
