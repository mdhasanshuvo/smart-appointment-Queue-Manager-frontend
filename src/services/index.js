import api from './api';

export const authService = {
  signup: async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  demoLogin: async () => {
    const response = await api.post('/auth/demo-login');
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const staffService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/staff?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/staff', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },

  getLoad: async (date) => {
    const response = await api.get(`/staff/load/all?date=${date}`);
    return response.data;
  },
};

export const serviceService = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/services', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

export const appointmentService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/appointments?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.post(`/appointments/${id}/cancel`);
    return response.data;
  },

  complete: async (id) => {
    const response = await api.post(`/appointments/${id}/complete`);
    return response.data;
  },

  markNoShow: async (id) => {
    const response = await api.post(`/appointments/${id}/no-show`);
    return response.data;
  },
};

export const queueService = {
  getQueue: async () => {
    const response = await api.get('/queue');
    return response.data;
  },

  assignFromQueue: async (staffId) => {
    const response = await api.post('/queue/assign', { staffId });
    return response.data;
  },

  getCount: async () => {
    const response = await api.get('/queue/count');
    return response.data;
  },
};

export const dashboardService = {
  getStats: async (date) => {
    const params = date ? `?date=${date}` : '';
    const response = await api.get(`/dashboard/stats${params}`);
    return response.data;
  },

  getAppointmentsByDate: async (date) => {
    const response = await api.get(`/dashboard/appointments-by-date?date=${date}`);
    return response.data;
  },
};

export const activityLogService = {
  getLogs: async (limit = 10) => {
    const response = await api.get(`/activity-logs?limit=${limit}`);
    return response.data;
  },
};
