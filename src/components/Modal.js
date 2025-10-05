// /client/src/components/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ content, onClose }) => {
  // Don't render if there's no content
  if (!content) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <img src={content.image} alt={content.title} className="modal-image" />
        <h2 className="modal-title">{content.title}</h2>
        <p className="modal-description">{content.description}</p>
      </div>
    </div>
  );
};

export default Modal;