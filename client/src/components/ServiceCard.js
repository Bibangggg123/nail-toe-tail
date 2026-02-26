import React from 'react';

function ServiceCard({ icon, title, description, image }) {
  return (
    <div className="service-card">
      <div className="service-card-img-wrapper">
        <img src={image} alt={title} className="service-card-img" />
        <div className="service-card-img-overlay" />
      </div>
      <div className="service-card-body">
        <div className="service-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ServiceCard;
