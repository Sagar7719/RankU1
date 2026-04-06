import React from 'react';
import './HeroSection.css?v=2';
import SpotlightTitleComponent from './SpotlightTitleComponent';
import { FiZap, FiTrendingUp, FiAward } from 'react-icons/fi';
import BadgeComponent from '../../../Common/Badge/BadgeComponent';

const HeroSection = () => {
  return (  
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-content-inner">
            <BadgeComponent 
              variant="warning" 
              outline={true}
              icon={FiZap}
              className="hero-badge"
            >
              Premium Mock Tests
            </BadgeComponent>
            
            <SpotlightTitleComponent />

            <p className="hero-description">
              Experience the most exam-relevant practice platform.
              Designed by toppers,
              trusted by thousands of aspirants.
            </p>          
            
            <div className="hero-stats">
              <div className="hero-stat-item">
                <FiTrendingUp className="hero-stat-icon primary" size={24} strokeWidth={2.5} />
                <span className="hero-stat-text"><strong>500+</strong> Mock tests</span>
              </div>
              <div className="hero-stat-item">
                <FiAward className="hero-stat-icon success" size={24} strokeWidth={2.5} />
                <span className="hero-stat-text"><strong>10k+</strong> Selected Candidates</span> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;