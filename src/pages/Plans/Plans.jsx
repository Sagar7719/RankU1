import React from "react";
import "./Plans.css";
import { FaBolt } from "react-icons/fa";

function Plans() {
  return (
    <div className="plans-container">
      <button className="pre-heading-btn">
        <FaBolt /> Premium Access
      </button>

      <h1 className="plans-heading">Simple, Honest Pricing</h1>

      <p className="plans-subheading">
        Choose the plan that fits your ambition. Unlock the complete
        <br />
        RankU1 suite of analytics and mock tests.
      </p>

      <div className="plans-cards">

        {/* 6 MONTHS */}
        <div className="plan-card">
          <h2>6 Months Plan</h2>
          <p>Full access to all exams and test series for 6 months.</p>

          <div className="price-box">
            <h3 className="new-price"><span>₹</span>199</h3>

            <div className="price-row">
              <p className="old-price">₹499</p>
              <p className="discount">60% OFF</p>
            </div>

            <p className="duration">For 6 Months</p>
          </div>

          <ul>
            <li>All Exams Access</li>
            <li>Unlimited Tests</li>
            <li>Performance Analytics</li>
            <li>24/7 Support</li>
          </ul>

          <button className="plan-btn">Buy Now</button>
        </div>

        {/* 12 MONTHS */}
        <div className="plan-card premium-card">
          <div className="recommended-ribbon">RECOMMENDED</div>

          <h2>12 Months Plan</h2>
          <p>Best Value: Full year access to everything.</p>

          <div className="price-box">
            <h3 className="new-price"><span>₹</span>299</h3>

            <div className="price-row">
              <p className="old-price">₹999</p>
              <p className="discount">70% OFF</p>
            </div>

            <p className="duration">For 12 Months</p>
          </div>

          <ul>
            <li>All Exams Access</li>
            <li>Unlimited Tests</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
            <li>Mentorship Session</li>
          </ul>

          <button className="plan-btn center-btn">Buy Now</button>
        </div>

        {/* LIFETIME */}
        <div className="plan-card">
          <h2>Lifetime Access</h2>
          <p>One-time payment. Forever access.</p>

          <div className="price-box">
            <h3 className="new-price"><span>₹</span>999</h3>

            <div className="price-row">
              <p className="old-price">₹2000</p>
              <p className="discount">67% OFF</p>
            </div>

            <p className="duration">For 60 Months</p>
          </div>

          <ul>
            <li>Lifetime Access</li>
            <li>All Future Exams</li>
            <li>VIP Support</li>
            <li>Exclusive Content</li>
            <li>No Renewal Needed</li>
          </ul>

          <button className="plan-btn">Buy Now</button>
        </div>

      </div>
    </div>
  );
}

export default Plans;