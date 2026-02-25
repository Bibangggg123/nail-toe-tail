import React from 'react';
import '../styles/Team.css';
import img18 from '../images/images18.jpg';
import img19 from '../images/images19.jpg';

function Team({ setCurrentPage }) {
  const teamMembers = [
    {
      id:          1,
      name:        'Rose',
      role:        'Senior Nail & Beauty Specialist',
      rating:      4.8,
      reviews:     245,
      image:       img18,
      bio:         'Expert in all nail services with 10 years of experience',
      specialties: ['Nail Design', 'Gel Nails', 'Lash Extension', 'Waxing'],
      facebook:    'https://www.facebook.com/mingg.gayy.7',
    },
    {
      id:          2,
      name:        'Pangging',
      role:        'Beauty & Spa Specialist',
      rating:      4.9,
      reviews:     280,
      image:       img19,
      bio:         'Specialist in complete beauty and spa treatments',
      specialties: ['Pedicure', 'Lash Firm', 'Foot Spa', 'Complete Care'],
      facebook:    'https://www.facebook.com/syloren.lalisan',
    },
  ];

  return (
    <div className="team-page">
      <div className="team-header">
        <h1>Meet Our Specialists</h1>
        <p>Professional nail artists and specialists ready to make you beautiful</p>
      </div>

      <div className="team-container">
        <div className="team-members-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-member-card">

              <div className="member-image-wrapper">
                <img src={member.image} alt={member.name} className="member-photo" />
              </div>

              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>

              <div className="member-rating">
                <div className="stars">
                  {'⭐'.repeat(Math.floor(member.rating))}
                  <span className="rating-number">{member.rating}</span>
                </div>
                <span className="review-count">({member.reviews} reviews)</span>
              </div>

              <div className="specialties">
                <h4>Specialties:</h4>
                <div className="specialty-tags">
                  {member.specialties.map((spec, idx) => (
                    <span key={idx} className="specialty-tag">{spec}</span>
                  ))}
                </div>
              </div>

              {/* Facebook Profile Link */}
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="team-fb-link"
              >
                <span>📘</span>
                View Facebook Profile
              </a>

              <button
                className="btn btn-primary team-book-btn-full"
                onClick={() => setCurrentPage && setCurrentPage('booking')}
              >
                Book with {member.name}
              </button>

            </div>
          ))}
        </div>

        {/* Visit Our Facebook Page */}
        <div className="team-fb-page-section">
          <p className="team-fb-page-label">💬 Connect with us!</p>
          <a
            href="https://www.facebook.com/profile.php?id=100075906679095"
            target="_blank"
            rel="noopener noreferrer"
            className="team-fb-page-btn"
          >
            📘 Visit Our Facebook Page
          </a>
        </div>

      </div>
    </div>
  );
}

export default Team;