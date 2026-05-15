import React from 'react';

export default function SectionHeader({ number, title, description }) {
  return (
    <div className="section-header">
      <div className="section-header-inner">
        <span className="section-number">{number}</span>
        <div>
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </div>
      </div>
    </div>
  );
}
