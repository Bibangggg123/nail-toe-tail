import React, { useState } from 'react';
import '../styles/Services.css';

function Services() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const servicesData = [
    {
      id: 1,
      name: 'Classic Manicure',
      category: 'manicure',
      price: '100.00',
      duration: '1 hr',
      description: 'Professional nail shaping, cuticle care, and polish'
    },
    {
      id: 2,
      name: 'Russian Manicure',
      category: 'manicure',
      price: '100.00',
      duration: '1hr 30 min',
      description: 'Professional nail shaping, cuticle care, and polish'
    },
    {
      id: 3,
      name: 'Gel Manicure',
      category: 'manicure',
      price: '250.00',
      duration: '1 hr',
      description: 'Long-lasting gel polish with UV curing'
    },
    {
      id: 4,
      name: 'Acrylic Nails',
      category: 'manicure',
      price: '550.00',
      duration: '1 hr',
      description: 'Beautiful acrylic nail extensions'
    },
    {
      id: 5,
      name: 'Nail Art Design',
      category: 'design',
      price: '100.00',
      duration: '45 min',
      description: 'Custom hand-painted nail art (price may vary depending on the design)'
    },
    {
      id: 6,
      name: 'Ombre Gradient',
      category: 'design',
      price: '100.00',
      duration: '45 min',
      description: 'Trendy gradient nail design (price may vary depending on the design)'
    },
    {
      id: 7,
      name: 'Classic Pedicure',
      category: 'pedicure',
      price: '130.00',
      duration: '1 hr',
      description: 'Foot massage, polish, and nail care'
    },
    {
      id: 8,
      name: 'Gel Pedicure',
      category: 'pedicure',
      price: '250.00',
      duration: '1 hr',
      description: 'Long-lasting gel pedicure treatment'
    },
    {
      id: 9,
      name: 'French Tips',
      category: 'design',
      price: '100.00',
      duration: '30 min',
      description: 'Classic French manicure style (price may vary depending on the design)'
    },
    {
      id: 10,
      name: 'Nail Repair',
      category: 'care',
      price: '100.00',
      duration: '20 min',
      description: 'Repair and strengthen damaged nails'
    },
    {
      id: 11,
      name: 'Cuticle Treatment',
      category: 'care',
      price: '100.00',
      duration: '25 min',
      description: 'Deep cuticle care and rejuvenation'
    },
    {
      id: 12,
      name: 'Lash Extension',
      category: 'lash',
      price: '550.00',
      duration: '90 min',
      description: 'Beautiful eyelash extensions for a fuller look'
    },
    {
      id: 13,
      name: 'Lash Firm',
      category: 'lash',
      price: '250.00',
      duration: '60 min',
      description: 'Lift and firm treatment for natural lashes'
    },
    {
      id: 14,
      name: 'Foot Spa',
      category: 'spa',
      price: '380.00',
      duration: '60 min',
      description: 'Relaxing foot spa with pedicure and treatment'
    },
    {
      id: 15,
      name: 'Waxing',
      category: 'waxing',
      price: '150.00',
      duration: '30 min',
      description: 'Professional hair removal waxing service'
    }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? servicesData 
    : servicesData.filter(s => s.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'manicure', name: 'Manicure' },
    { id: 'pedicure', name: 'Pedicure' },
    { id: 'design', name: 'Nail Art' },
    { id: 'care', name: 'Nail Care' },
    { id: 'lash', name: 'Lash' },
    { id: 'spa', name: 'Spa' },
    { id: 'waxing', name: 'Waxing' }
  ];

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Choose from our wide range of professional nail services</p>
      </div>

      <div className="services-container">
        {/* Filter Buttons */}
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="services-list">
          {filteredServices.map(service => (
            <div key={service.id} className="service-item">
              <div className="service-details">
                <h3>{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-meta">
                  <span className="duration">⏱️ {service.duration}</span>
                </div>
              </div>
              <div className="service-price">₱{service.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;

