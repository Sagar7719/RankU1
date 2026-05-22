import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TestManager = () => {
  const [tests, setTests] = useState([]);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [testType, setTestType] = useState('Mock');
  const [isFree, setIsFree] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get('/tests');
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tests', { 
        title, 
        category, 
        duration, 
        description: description || 'Premium practice mock paper containing exam-pattern questions.', 
        difficulty,
        testType,
        isFree
      });
      fetchTests();
      // Clear inputs
      setTitle('');
      setCategory('');
      setDuration('');
      setDescription('');
      setDifficulty('Easy');
      setTestType('Mock');
      setIsFree(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create test');
    }
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this test? All questions will remain orphaned.')) {
      try {
        await api.delete(`/tests/${id}`);
        fetchTests();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Test Management Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Build, publish, and structure mock exams with smart dynamic properties.
          </p>
        </div>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem' }}>
        
        {/* Active Tests List */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Active Test Papers ({tests.length})</h3>
            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', color: 'var(--text-muted)' }}>
              Live in Database
            </span>
          </div>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tests.length > 0 ? (
              tests.map(t => (
                <li key={t._id} style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{t.title}</strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', lineLineheight: '1.4' }}>
                        {t.description || 'No description provided.'}
                      </p>
                      
                      {/* Dynamic Metas */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          {t.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          ⏳ {t.duration}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(250, 204, 21, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                          {t.testType || 'Mock'}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          background: t.difficulty === 'Easy' ? 'rgba(16,185,129,0.1)' : t.difficulty === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', 
                          padding: '2px 8px', 
                          borderRadius: '4px', 
                          color: t.difficulty === 'Easy' ? '#10b981' : t.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                          fontWeight: 600
                        }}>
                          {t.difficulty || 'Easy'}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          background: t.isFree !== false ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                          padding: '2px 8px', 
                          borderRadius: '4px', 
                          color: t.isFree !== false ? '#10b981' : '#f59e0b',
                          fontWeight: 700
                        }}>
                          {t.isFree !== false ? 'FREE' : 'PREMIUM'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                    <Link to={`/questions/${t._id}`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                      📋 Manage Questions
                    </Link>
                    <button onClick={() => handleDeleteTest(t._id)} className="btn-primary" style={{ background: 'var(--danger)', color: '#fff', padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No active tests found in database. Use the creator to add your first mock paper!
              </div>
            )}
          </ul>
        </div>

        {/* Enhanced Form Panel */}
        <div className="glass-panel" style={{ height: 'fit-content', position: 'sticky', top: '1rem' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✨</span> Create New Mock Paper
          </h3>
          
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Category Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Category</label>
              <input 
                type="text" 
                placeholder="e.g. महाराष्ट्र पोलीस भरती, UPSC, MPSC, SSC" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required 
              />
              
              {/* Category suggestions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                {['महाराष्ट्र पोलीस भरती', 'MPSC', 'UPSC', 'SSC', 'Banking'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className="btn-outline"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', height: 'auto', background: category === cat ? 'rgba(250, 204, 21, 0.08)' : 'transparent', borderColor: category === cat ? 'var(--primary)' : 'var(--border-color)', color: category === cat ? 'var(--primary)' : 'var(--text-muted)' }}
                    onClick={() => {
                      setCategory(cat);
                      setDescription(`RankU1 expert custom assessment series for ${cat} preparation. Fully matches the latest exam blueprint.`);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Test Title</label>
              <input 
                type="text" 
                placeholder="e.g. Combined Civil Services Paper 1" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
              
              {/* Title Suggestions */}
              {category && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {(category === 'महाराष्ट्र पोलीस भरती' 
                    ? ['Mega Mock Test 1', 'मराठी व्याकरण Special', 'अंकगणित Topicwise 1', 'PYQ 2022 Paper'] 
                    : category === 'UPSC' 
                    ? ['GS Prelims Paper 1', 'CSAT Sectional 1', 'General Studies PYQ 2023'] 
                    : category === 'MPSC' 
                    ? ['Combine State Services 1', 'GS Paper 2', 'Marathi Sectional Paper']
                    : category === 'SSC' 
                    ? ['CGL Mock Test 1', 'CHSL Sectional Quant', 'English Reasoning PYQ']
                    : ['Comprehensive Mock 1', 'Sectional Assessment', 'Practice PYQ Paper']
                  ).map(suggest => (
                    <button
                      key={suggest}
                      type="button"
                      className="btn-outline"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', height: 'auto' }}
                      onClick={() => setTitle(`${category} - ${suggest}`)}
                    >
                      💡 {suggest}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Description</label>
              <textarea 
                placeholder="Brief summary of syllabus coverage, topics, sections..." 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                rows="3"
                style={{ resize: 'none' }}
              />
            </div>

            {/* Duration Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 90 Mins, 120 Mins, 60 Mins" 
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                required 
              />
              
              {/* Duration Suggestions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                {['90 Mins', '120 Mins', '60 Mins', '30 Mins', '20 Mins'].map(dur => (
                  <button
                    key={dur}
                    type="button"
                    className="btn-outline"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', height: 'auto', background: duration === dur ? 'rgba(250, 204, 21, 0.08)' : 'transparent', borderColor: duration === dur ? 'var(--primary)' : 'var(--border-color)', color: duration === dur ? 'var(--primary)' : 'var(--text-muted)' }}
                    onClick={() => setDuration(dur)}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Side-by-side Dropdowns: Difficulty, Test Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Test Type</label>
                <select value={testType} onChange={e => setTestType(e.target.value)}>
                  <option value="Live">📡 Live Exam</option>
                  <option value="Mock">📝 Mock Test</option>
                  <option value="PYQ">📚 PYQ Paper</option>
                  <option value="Sectional">🧩 Sectional</option>
                  <option value="Topicwise">📍 Topic-wise</option>
                </select>
              </div>

            </div>

            {/* Is Free Test Select Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Access Tier</label>
              <select value={isFree ? 'free' : 'paid'} onChange={e => setIsFree(e.target.value === 'free')}>
                <option value="free">🔓 Unlocked / Free Mock</option>
                <option value="paid">🔒 Premium / Paid Mock</option>
              </select>
            </div>

            {/* Create Submit Button */}
            <button type="submit" className="btn-primary" style={{ padding: '0.8rem', justifyContent: 'center', fontSize: '1rem', marginTop: '0.5rem', borderRadius: '8px' }}>
              🚀 Add Mock Paper to Database
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TestManager;
