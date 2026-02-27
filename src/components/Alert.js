import React, { useEffect } from 'react'
import './Alert.css'

function Alert({ alert, type = 'warning', timeout = 0, onTimeout }) {
  
  useEffect(() => {
    if (timeout > 0 && onTimeout) {
      const timer = setTimeout(() => {
        onTimeout();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  if (!alert) return null;

  if (type === 'success') {
    return (
      <div className="success-alert-plate">
        <div className="success-alert-content">
          <div className="success-icon">✓</div>
          <span className="success-message">{alert}</span>
        </div>
      </div>
    )
  }

  const getAlertClass = () => {
    const baseClass = "alert alert-dismissible fade show";
    switch (type) {
      case 'danger':
        return `${baseClass} alert-danger`;
      case 'info':
        return `${baseClass} alert-info`;
      default:
        return `${baseClass} alert-warning`;
    }
  };

  return (
    <div className={getAlertClass()} role="alert">
      {alert}
      {timeout === 0 && (
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onTimeout}
        ></button>
      )}
    </div>
  )
}

export default Alert;
