// Updates.jsx
import React, { useState } from 'react';
import './Updates.css';

const Updates = () => {
  // Sample data for notifications
  const [notifications] = useState([
    {
      id: 1,
      date: '18 Feb',
      title: 'SSC CGL 2024 Tier-I Exam Dates Announced',
      description: 'Stay updated with the latest changes in SSC CGL 2024',
      link: '#',
    },
    {
      id: 2,
      date: '18 Feb',
      title: 'RRB NTPC CEN 01/2024 Official Notification Out',
      description: 'Stay updated with latest RRB NTPC notification.',
      link: '#',
    },
    {
      id: 3,
      date: '03 Feb',
      title: 'UPSC Civil Services Bharti 2026',
      description: 'Stay updated with latest UPSC notification.',
      link: '#',
    },
  ]);

  return (
    <div className="updates-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="notification-badge">
            <span className="badge-icon">🔔</span>
            <span>REAL-TIME NOTIFICATIONS</span>
          </div>
          <h1 className="hero-title">
            Stay Ahead of the <span className="gradient-text">Curve</span>
          </h1>
          <p className="hero-description">
            Get instant updates on the latest government notifications, application windows,
            admit cards, and results.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button className="tab-btn active">Latest Updates</button>
        <button className="tab-btn active">Live Exams</button>
        <button className="tab-btn active">Admit Cards</button>
        <button className="tab-btn active">Results</button>
      </div>

      {/* Notifications Grid */}
      <div className="notifications-grid">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div className="card-date">
              <span className="date-day">{notification.date.split(' ')[0]}</span>
              <span className="date-month">{notification.date.split(' ')[1]}</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">{notification.title}</h3>
              <p className="card-description">{notification.description}</p>
              <a href={notification.link} className="read-more">
                Read Full Details →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Don't Just Stay Updated, Get Prepared.</h2>
          <button className="cta-button">
            Start Mock Test
            <span className="button-icon">⚡</span>
          </button>
          <p className="cta-description">
            Practice with our industry-level mock tests designed by experts
          </p>
        </div>
      </div>
    </div>
  );
};

export default Updates;