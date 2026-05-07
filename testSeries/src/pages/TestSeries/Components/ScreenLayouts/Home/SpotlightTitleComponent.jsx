import React from 'react';

const SpotlightTitleComponent = ({
  gradientText = "RankU1 Test Series",
}) => {
  return (
    <div className="hero-title-wrapper">
      <h1 className="hero-title">
        <span className="hero-title-pre">
          <span className="pre-line1"></span>
          <span className="pre-line2"></span>
        </span>
        <span className="hero-title-gradient">{gradientText}</span>
      </h1>
    </div>
  );
};

export default SpotlightTitleComponent;