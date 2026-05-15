import React from 'react';

export default function FormField({ label, required, error, children, hint, id, className = '' }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label className="form-label" htmlFor={id}>
          {label}
          {required && <span className="form-required" aria-label="required">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error" role="alert">{error}</span>}
    </div>
  );
}
