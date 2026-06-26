import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TestResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navigation & Topper states
  const [activeTab, setActiveTab] = useState('attempts'); // 'attempts' or 'topper'
  const [topperName, setTopperName] = useState('');
  const [topperSubTitle, setTopperSubTitle] = useState('');
  const [topperRank, setTopperRank] = useState('');
  const [topperTotalTests, setTopperTotalTests] = useState(128);
  const [topperAccuracy, setTopperAccuracy] = useState(94);
  const [topperScore, setTopperScore] = useState('');
  const [topperAvatar, setTopperAvatar] = useState('https://i.pravatar.cc/40');
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [savingTopper, setSavingTopper] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const fetchResults = async () => {
    try {
      const res = await api.get('/admin/results');
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch test results');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopper = async () => {
    try {
      const res = await api.get('/admin/topper');
      setTopperName(res.data.name || '');
      setTopperSubTitle(res.data.subTitle || '');
      setTopperRank(res.data.rank || '');
      setTopperTotalTests(res.data.totalTests || 128);
      setTopperAccuracy(res.data.accuracy || 94);
      setTopperScore(res.data.score || '');
      setTopperAvatar(res.data.avatar || 'https://i.pravatar.cc/40');
      setIsAutomatic(res.data.isAutomatic !== false);
    } catch (err) {
      console.error('Failed to fetch topper details:', err);
    }
  };

  useEffect(() => {
    fetchResults();
    fetchTopper();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/reset this test attempt? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/admin/results/${id}`);
      setResults(results.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete test result');
    }
  };

  const handleTopperSubmit = async (e) => {
    e.preventDefault();
    setSavingTopper(true);
    try {
      const topperData = {
        name: topperName,
        subTitle: topperSubTitle,
        rank: topperRank,
        totalTests: Number(topperTotalTests),
        accuracy: Number(topperAccuracy),
        score: topperScore,
        avatar: topperAvatar,
        isAutomatic: isAutomatic
      };
      await api.put('/admin/topper', topperData);
      alert('Featured Topper updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update featured topper');
    } finally {
      setSavingTopper(false);
    }
  };

  const handleFeatureAsTopper = (r) => {
    setTopperName(r.userId?.name || 'Aryan K.');
    setTopperSubTitle(`Aspirant | ${r.testId?.category || 'General'}`);
    setTopperRank('AIR 1'); // Set a premium default rank
    
    // Count user's total attempts in results, scaled to make it look realistic
    const userAttemptsCount = results.filter(res => res.userId?._id === r.userId?._id).length;
    setTopperTotalTests(userAttemptsCount > 0 ? userAttemptsCount * 6 + 18 : 128);
    
    // Accuracy calculation
    const total = r.correctAnswers + r.wrongAnswers;
    const acc = total > 0 ? Math.round((r.correctAnswers / total) * 100) : 94;
    setTopperAccuracy(acc);
    
    const totalMarks = r.totalMarks || (r.correctAnswers + r.wrongAnswers + r.unattempted);
    setTopperScore(`${r.score}/${totalMarks}`);
    setTopperAvatar(r.userId?.profilePicture || 'https://i.pravatar.cc/40'); // Use profile picture or default
    
    setIsAutomatic(false); // Disable auto-mode since we are featuring a specific student
    setActiveTab('topper'); // Switch to Topper tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique categories for filtering
  const categories = ['ALL', ...new Set(results.map(r => r.testId?.category).filter(Boolean))];

  // Filtering logic
  const filteredResults = results.filter(r => {
    const userName = r.userId?.name?.toLowerCase() || '';
    const userEmail = r.userId?.email?.toLowerCase() || '';
    const testTitle = r.testId?.title?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = userName.includes(query) || userEmail.includes(query) || testTitle.includes(query);
    const matchesCategory = categoryFilter === 'ALL' || r.testId?.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calculate statistics from filtered results
  const totalAttempts = filteredResults.length;
  const avgScore = totalAttempts > 0 
    ? (filteredResults.reduce((acc, r) => acc + r.score, 0) / totalAttempts).toFixed(1) 
    : '0.0';
  const highScore = totalAttempts > 0 
    ? Math.max(...filteredResults.map(r => r.score)).toFixed(1) 
    : '0.0';

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text)' }}>Loading test results...</div>;
  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>;

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Test Results Manager</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button 
          className={activeTab === 'attempts' ? "btn-primary" : "btn-outline"}
          onClick={() => setActiveTab('attempts')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          📋 Test Attempts
        </button>
        <button 
          className={activeTab === 'topper' ? "btn-primary" : "btn-outline"}
          onClick={() => setActiveTab('topper')}
          style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          🏆 Featured Topper Settings
        </button>
      </div>

      {activeTab === 'attempts' ? (
        <>
          {/* Summary Cards */}
          <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Attempts</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent)' }}>{totalAttempts}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--primary)' }}>{avgScore}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Highest Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#10b981' }}>{highScore}</div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Search Candidates or Tests</label>
                <input 
                  type="text" 
                  placeholder="Search by student name, email, or test title..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ width: '200px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Filter by Category</label>
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Student Name & Email</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Test / Paper Title</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Performance</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Duration</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Attempted On</th>
                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No test results found.</td>
                    </tr>
                  ) : (
                    filteredResults.map(r => (
                      <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600 }}>{r.userId?.name || 'Unknown User'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.userId?.email || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{r.testId?.title || 'Unknown Test'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text)'
                          }}>
                            {r.testId?.category || 'General'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, color: r.score >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                              {r.score}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              / {r.totalMarks || (r.correctAnswers + r.wrongAnswers + r.unattempted)}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            C: <span style={{ color: '#10b981', fontWeight: 600 }}>{r.correctAnswers}</span> | 
                            W: <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{r.wrongAnswers}</span> | 
                            S: <span>{r.unattempted}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{r.duration || 'N/A'}</td>
                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                          {new Date(r.createdAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleFeatureAsTopper(r)}
                            style={{ 
                              background: 'rgba(59, 130, 246, 0.1)', 
                              color: '#3b82f6', 
                              border: '1px solid #3b82f6', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              fontSize: '0.85rem',
                              marginRight: '0.5rem',
                              fontWeight: 600
                            }}
                          >
                            🏆 Feature Topper
                          </button>
                          <button 
                            onClick={() => handleDelete(r._id)}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              color: 'var(--danger)', 
                              border: '1px solid var(--danger)', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              fontSize: '0.85rem' 
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Topper Settings Tab */
        <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Configure Featured Topper</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' }}>
            This updates the featured candidate profile and scorecard displayed in the hero section card on the Home Page.
          </p>

          <form onSubmit={handleTopperSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Auto vs Manual Mode Switch */}
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text)' }}>Automatic Topper Selection</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                  Automatically calculate and highlight the student with the highest mock test score.
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={isAutomatic}
                onChange={(e) => setIsAutomatic(e.target.checked)}
                style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Live Preview Card */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '10px', left: '15px', fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {isAutomatic ? 'Automatic Mode Preview (Uses live test data)' : 'Manual override Preview'}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <img 
                  src={topperAvatar || 'https://i.pravatar.cc/40'} 
                  alt="Avatar" 
                  style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} 
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>{topperName || 'Aryan K.'}</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{topperSubTitle || 'Aspirant | SSC CGL'}</p>
                </div>
                <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: '#000', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800' }}>
                  {topperRank || 'AIR 42'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Tests</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text)' }}>{topperTotalTests}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accuracy</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text)' }}>{topperAccuracy}%</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mock Score</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}>{topperScore || '178/200'}</div>
                </div>
              </div>
            </div>

            {isAutomatic && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.8rem', color: '#60a5fa', textAlign: 'center' }}>
                💡 Manual inputs below are disabled because <strong>Automatic Mode</strong> is enabled. Uncheck it above to configure manually.
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Candidate Name</label>
              <input 
                type="text" 
                placeholder="e.g. Aryan K." 
                value={topperName}
                onChange={(e) => setTopperName(e.target.value)}
                required={!isAutomatic}
                disabled={isAutomatic}
                style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Subtitle / Designation</label>
              <input 
                type="text" 
                placeholder="e.g. Aspirant | SSC CGL" 
                value={topperSubTitle}
                onChange={(e) => setTopperSubTitle(e.target.value)}
                required={!isAutomatic}
                disabled={isAutomatic}
                style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
              />
            </div>

            <div className="grid-2col-equal" style={{ gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Rank Badge</label>
                <input 
                  type="text" 
                  placeholder="e.g. AIR 42" 
                  value={topperRank}
                  onChange={(e) => setTopperRank(e.target.value)}
                  required={!isAutomatic}
                  disabled={isAutomatic}
                  style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Avatar Image URL</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={topperAvatar}
                  onChange={(e) => setTopperAvatar(e.target.value)}
                  required={!isAutomatic}
                  disabled={isAutomatic}
                  style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
                />
              </div>
            </div>

            <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Total Tests Taken</label>
                <input 
                  type="number" 
                  value={topperTotalTests}
                  onChange={(e) => setTopperTotalTests(e.target.value)}
                  required={!isAutomatic}
                  disabled={isAutomatic}
                  style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Accuracy Percentage (%)</label>
                <input 
                  type="number" 
                  max="100" 
                  min="0"
                  value={topperAccuracy}
                  onChange={(e) => setTopperAccuracy(e.target.value)}
                  required={!isAutomatic}
                  disabled={isAutomatic}
                  style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Mock Score Format</label>
                <input 
                  type="text" 
                  placeholder="e.g. 178/200" 
                  value={topperScore}
                  onChange={(e) => setTopperScore(e.target.value)}
                  required={!isAutomatic}
                  disabled={isAutomatic}
                  style={{ opacity: isAutomatic ? 0.5 : 1, cursor: isAutomatic ? 'not-allowed' : 'text' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ marginTop: '1rem', justifyContent: 'center' }}
              disabled={savingTopper}
            >
              {savingTopper ? 'Saving settings...' : '💾 Save Featured Topper'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TestResults;
