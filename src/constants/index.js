/**
 * Application-wide constants
 */

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-Show',
};

// Staff Types
export const STAFF_TYPES = {
  DOCTOR: 'Doctor',
  CONSULTANT: 'Consultant',
  SUPPORT_AGENT: 'Support Agent',
};

// Availability Status
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'Available',
  ON_LEAVE: 'On Leave',
};

// Service Durations (in minutes)
export const SERVICE_DURATIONS = [15, 20, 30, 45, 60, 90, 120];

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Toast Duration
export const TOAST_DURATION = 3000; // 3 seconds

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM d, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Queue Position Display
export const MAX_QUEUE_DISPLAY = 50;

// Activity Log Limits
export const ACTIVITY_LOG_LIMIT = 10;

// Staff Load Status Colors
export const LOAD_STATUS_COLORS = {
  OK: '#4caf50',
  NEAR_CAPACITY: '#ff9800',
  FULL: '#f44336',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#667eea',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  DANGER: '#f44336',
  INFO: '#2196f3',
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1440,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  ASSIGNED: 'Assigned successfully',
};
