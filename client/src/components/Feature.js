import React from 'react';

function Feature({ icon, title, desc }) {
  return (
    <div className="feature-box">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default Feature;
