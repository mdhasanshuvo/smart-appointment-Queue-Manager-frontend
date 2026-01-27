import React, { useState } from 'react';
import './Toast.css';

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  };

  return { toast, showToast, setToast };
};

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};

export default Toast;
