import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="sidebar-logo-text" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          RankU1 
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.55rem', lineHeight: '1', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.5px' }}>
            <span>CONTROL</span>
            <span>CENTER</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">ANALYTICS</div>
        
        <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} end>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </NavLink>
        
        <NavLink to="/test-results" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} style={{justifyContent: 'space-between'}}>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            Test Results
          </div>
          <div style={{width: '24px', height: '16px', background: 'var(--danger)', borderRadius: '4px', opacity: 0.8}}></div>
        </NavLink>

        <div className="nav-section-title">CONTENT</div>
        
        <NavLink to="/exams" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          Exams
        </NavLink>
        
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
          Categories
        </NavLink>
        
        <NavLink to="/series" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
          Test Series
        </NavLink>

        <NavLink to="/courses" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
          Courses
        </NavLink>

        <NavLink to="/updates" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          Exam Updates
        </NavLink>
      </nav>

      <div className="user-profile">
        <div className="user-avatar">A</div>
        <div className="user-info">
          <div className="name">SAGAR</div>
          <div className="role">Admin</div>
        </div>
        <button className="btn-logout" onClick={handleLogout} title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
