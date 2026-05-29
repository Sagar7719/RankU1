import React from 'react';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted">
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => document.body.classList.toggle('sidebar-open')}
          style={{ marginRight: '0.5rem' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        Admin <span style={{fontSize: '10px'}}>&gt;</span> 
        <span style={{ color: 'var(--text-main)', padding: '0.25rem 0.75rem', background: 'var(--bg-input)', borderRadius: '6px' }}>Dashboard</span>
      </div>
      
      <div className="topbar-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Search metrics, students, or exams..." />
        <div style={{display: 'flex', gap: '0.25rem', color: 'var(--text-muted)'}}>
          <span style={{background: 'var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>⌘</span>
          <span style={{background: 'var(--border-color)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>K</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="topbar-icon-btn" title="Theme Toggle" onClick={() => document.body.classList.toggle('light-mode')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
        <button className="topbar-icon-btn" title="Notifications" onClick={() => alert('No new notifications')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <div className="system-hub-badge">SYSTEM HUB</div>
      </div>
    </div>
  );
};

export default Topbar;
