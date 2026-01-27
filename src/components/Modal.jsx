import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, title, children, onClose, onSubmit, submitText = 'Save', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{cancelText}</button>
          {onSubmit && <button className="btn btn-primary" onClick={onSubmit}>{submitText}</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
