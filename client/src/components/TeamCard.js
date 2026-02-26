import React from 'react';

function TeamCard({ name, role, rating, reviews, image, specialties, onBook }) {
  return (
    <div className="team-card-preview">
      <div className="team-photo-wrapper">
        <img src={image} alt={name} className="team-photo" />
      </div>
      <h3>{name}</h3>
      <p className="team-role">{role}</p>
      <div className="rating">
        {'⭐'.repeat(Math.floor(rating))}
        <span className="rating-num">{rating}</span>
        <span className="rating-reviews">({reviews} reviews)</span>
      </div>
      <div className="team-specialties">
        {specialties.map((s, i) => (
          <span key={i} className="team-spec-tag">{s}</span>
        ))}
      </div>
      <button className="btn btn-primary team-book-btn" onClick={onBook}>
        Book with {name}
      </button>
    </div>
  );
}

export default TeamCard;
