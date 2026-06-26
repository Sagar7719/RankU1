import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./InfoPage.css";

const tabs = [
  { id: "about-us", label: "About Us" },
  { id: "contact-us", label: "Contact Us" },
  { id: "careers", label: "Careers" },
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "terms-conditions", label: "Terms & Conditions" },
  { id: "refund-policy", label: "Refund Policy" },
  { id: "shipping-policy", label: "Shipping Policy" },
];

const InfoPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(pageId || "about-us");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (pageId && tabs.some((tab) => tab.id === pageId)) {
      setActiveTab(pageId);
    } else {
      // Default to about-us if invalid ID
      navigate("/info/about-us", { replace: true });
    }
  }, [pageId, navigate]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/info/${tabId}`);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "about-us":
        return (
          <div className="info-content-pane">
            <h2>About RankU1</h2>
            <p className="lead-text">
              RankU1 is India's leading digital platform for premium competitive government exam preparation. 
              We offer standard real-exam user interfaces, micro-analytics, and peer ranking systems to help you achieve your goals.
            </p>
            
            <div className="stats-grid-info">
              <div className="stat-card-info">
                <h3>100K+</h3>
                <p>Active Aspirants</p>
              </div>
              <div className="stat-card-info">
                <h3>500+</h3>
                <p>Real-Exam Mock Tests</p>
              </div>
              <div className="stat-card-info">
                <h3>98.7%</h3>
                <p>Success & Satisfaction Rate</p>
              </div>
            </div>

            <h3>Our Vision</h3>
            <p>
              To democratize exam preparation by offering premium, high-fidelity mock exam systems accessible 
              to every aspirant across India. We bridge the gap between hard work and smart insights.
            </p>
            
            <h3>Why RankU1?</h3>
            <ul>
              <li><strong>Exact Exam UIs:</strong> Practice on exact replicas of TCS, IBPS, and State PSC test consoles.</li>
              <li><strong>Instant Performance Analytics:</strong> Get immediate, itemized scorecards, accuracy ratios, and time-taken metrics.</li>
              <li><strong>State-Level Leaderboards:</strong> Compare your scores against thousands of live competitors.</li>
            </ul>
          </div>
        );

      case "contact-us":
        return (
          <div className="info-content-pane">
            <h2>Contact Us</h2>
            <p className="lead-text">
              Have questions, issues, or suggestions? We are here to support you! Get in touch and our team will get back to you within 24 hours.
            </p>

            <div className="contact-layout">
              <div className="contact-details">
                <div className="detail-item">
                  <span className="icon">📧</span>
                  <div>
                    <h4>Email Support</h4>
                    <p>support@ranku1.com</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="icon">📞</span>
                  <div>
                    <h4>Helpline Number</h4>
                    <p>+91-7058293263</p>
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="icon">📍</span>
                  <div>
                    <h4>Headquarters</h4>
                    <p>RankU1 Learning Solutions Private Limited,<br />Pune, Maharashtra, India.</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-container">
                {formSubmitted ? (
                  <div className="contact-success-alert">
                    <span>🎉</span>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for reaching out. We will contact you soon.</p>
                  </div>
                ) : (
                  <form className="contact-info-form" onSubmit={handleSubmitContact}>
                    <div className="form-group-info">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        placeholder="John Doe" 
                        required 
                      />
                    </div>
                    <div className="form-group-info">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="john@example.com" 
                        required 
                      />
                    </div>
                    <div className="form-group-info">
                      <label>Subject</label>
                      <input 
                        type="text" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleInputChange} 
                        placeholder="Query regarding Mock Tests" 
                      />
                    </div>
                    <div className="form-group-info">
                      <label>Message</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        placeholder="Type your query here..." 
                        rows="4"
                        required 
                      ></textarea>
                    </div>
                    <button type="submit" className="info-submit-btn">Send Message</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        );

      case "careers":
        return (
          <div className="info-content-pane">
            <h2>Join Our Team</h2>
            <p className="lead-text">
              At RankU1, we are looking for passionate individuals who want to redefine how millions of students prepare for competitive exams.
            </p>

            <div className="careers-box">
              <h3>Current Openings</h3>
              
              <div className="job-card">
                <div className="job-header">
                  <h4>Senior React Developer</h4>
                  <span className="job-badge">Full-time (Remote)</span>
                </div>
                <p>Build scalable UI modules, replicate complex exam portals, and lead core frontend developments.</p>
                <span>Experience: 3+ Years | Stack: React, CSS, React Router</span>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h4>Curriculum Developer (Aptitude & General Studies)</h4>
                  <span className="job-badge">Full-time (Pune Office)</span>
                </div>
                <p>Create and curate advanced mock tests, analyze competitive exams, and manage syllabus frameworks.</p>
                <span>Experience: 2+ Years | Strong understanding of SSC / UPSC patterns</span>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h4>UI/UX Designer</h4>
                  <span className="job-badge">Contract / Part-time</span>
                </div>
                <p>Shape premium dashboards, design test series consoles, and create intuitive mobile/web app flows.</p>
                <span>Experience: 2+ Years | Portfolio of Figma design web mockups</span>
              </div>
            </div>

            <div className="apply-section">
              <p>Don't see a fit but believe you can contribute? Send your CV and a brief cover letter to <strong>careers@ranku1.com</strong>.</p>
            </div>
          </div>
        );

      case "privacy-policy":
        return (
          <div className="info-content-pane">
            <h2>Privacy Policy</h2>
            <p className="policy-date">Last updated: May 26, 2026</p>
            
            <p>
              RankU1 Learning Solutions operates the RankU1 online web app and services. 
              We respect your privacy and are committed to protecting it through our compliance with this policy.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us (e.g., your name, email, mobile number, and password) 
              when you create an account, purchase subscription plans, or interact with our helpline.
            </p>

            <h3>2. How We Use Information</h3>
            <p>
              We use your information to operate and personalize your experience, process transactions, 
              send security codes/OTPs, evaluate test score calculations, and provide active customer support.
            </p>

            <h3>3. Data Security</h3>
            <p>
              We implement industry-standard encryption protocols (SSL, bcrypt password hashing, secure tokens) to protect 
              your login and transactional data from unauthorized access.
            </p>

            <h3>4. Contact Details</h3>
            <p>If you have questions about this privacy policy, contact us at <strong>privacy@ranku1.com</strong>.</p>
          </div>
        );

      case "terms-conditions":
        return (
          <div className="info-content-pane">
            <h2>Terms & Conditions</h2>
            <p className="policy-date">Last updated: May 26, 2026</p>

            <p>
              By accessing and registering on RankU1, you agree to comply with and be bound by the following 
              Terms and Conditions of service.
            </p>

            <h3>1. Account Terms</h3>
            <ul>
              <li>You must be at least 13 years of age to register.</li>
              <li>You are responsible for keeping your login credentials (password, mobile OTP) confidential.</li>
              <li>Accounts cannot be shared between multiple users. Shared accounts are subject to suspension.</li>
            </ul>

            <h3>2. Subscriptions and Payments</h3>
            <p>
              Certain features require purchasing premium access plans. All payments must be made using authorized 
              gateways. Users are granted a personal, non-transferable, revocable license to access study modules.
            </p>

            <h3>3. Prohibited Content & Behavior</h3>
            <p>
              Aspirants are prohibited from attempting to scrape questions, replicate test engines, or disrupt the 
              performance of mock test systems. Violations will result in permanent termination of your account.
            </p>
          </div>
        );

      case "refund-policy":
        return (
          <div className="info-content-pane">
            <h2>Refund Policy</h2>
            <p className="policy-date">Last updated: May 26, 2026</p>

            <p>
              At RankU1, we believe in the quality of our mock test series. 
              We offer a simple and transparent refund process:
            </p>

            <h3>7-Day Satisfaction Guarantee</h3>
            <p>
              If you purchase a Premium Plan and find that it does not suit your needs, you can claim a **100% refund** 
              within **7 days** of the date of purchase.
            </p>

            <h3>Eligibility for Refunds</h3>
            <ul>
              <li>Refund requests must be submitted within 7 calendar days of purchase.</li>
              <li>The user must not have completed more than 3 full-length mock tests under their active premium plan.</li>
            </ul>

            <h3>How to Request a Refund</h3>
            <p>
              Send an email to <strong>support@ranku1.com</strong> from your registered email address with your transaction ID 
              and the reason for cancellation. Refund approval takes 2-3 business days. Approved refunds are credited to the 
              original payment method within 5-7 working days.
            </p>
          </div>
        );

      case "shipping-policy":
        return (
          <div className="info-content-pane">
            <h2>Shipping & Delivery Policy</h2>
            <p className="policy-date">Last updated: May 26, 2026</p>

            <p>
              RankU1 is a provider of 100% digital study materials, mock exam engine subscriptions, and live practice tests.
            </p>

            <h3>Digital Delivery</h3>
            <ul>
              <li>All test series and materials are delivered instantly to your dashboard upon payment.</li>
              <li>No physical product, books, or papers will be shipped to your billing address.</li>
              <li>Upon successful transaction, your account is upgraded in real-time, giving immediate access.</li>
            </ul>

            <p>
              If you experience any delay in digital activation after successful payment, please contact our support 
              helpline immediately at <strong>+91-7058293263</strong> or <strong>support@ranku1.com</strong>.
            </p>
          </div>
        );

      default:
        return <div>Select a valid page.</div>;
    }
  };

  return (
    <div className="info-page-container">
      <div className="info-layout">
        {/* SIDEBAR TABS */}
        <aside className="info-sidebar">
          <h3>Help & Company</h3>
          <div className="info-tabs-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`info-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENT VIEW */}
        <main className="info-content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default InfoPage;
