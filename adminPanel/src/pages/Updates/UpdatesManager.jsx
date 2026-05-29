/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const UpdatesManager = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [author, setAuthor] = useState('RankU1 Team');
  const [editingUpdate, setEditingUpdate] = useState(null);

  const categoriesList = [
    "GENERAL",
    "EXAMS",
    "JOBS",
    "RESULTS",
    "ADMIT CARD",
    "NEWS",
    "MPSC",
    "POLICE BHARTI",
    "STUDY MATERIAL"
  ];

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/news');
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title,
        category,
        image,
        description,
        fullContent,
        author
      };

      if (editingUpdate) {
        await api.put(`/news/${editingUpdate._id}`, updateData);
        setEditingUpdate(null);
      } else {
        await api.post('/news', updateData);
      }

      // Reset form
      setTitle('');
      setCategory('GENERAL');
      setImage('');
      setDescription('');
      setFullContent('');
      setAuthor('RankU1 Team');
      
      fetchUpdates();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save exam update.');
    }
  };

  const handleEditClick = (item) => {
    setEditingUpdate(item);
    setTitle(item.title || '');
    setCategory(item.category || 'GENERAL');
    setImage(item.image || '');
    setDescription(item.description || '');
    setFullContent(item.fullContent || '');
    setAuthor(item.author || 'RankU1 Team');
  };

  const handleCancelEdit = () => {
    setEditingUpdate(null);
    setTitle('');
    setCategory('GENERAL');
    setImage('');
    setDescription('');
    setFullContent('');
    setAuthor('RankU1 Team');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this update entry?')) {
      try {
        await api.delete(`/news/${id}`);
        fetchUpdates();
        if (editingUpdate && editingUpdate._id === id) {
          handleCancelEdit();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete update entry.');
      }
    }
  };

  if (loading && updates.length === 0) {
    return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>Loading updates...</div>;
  }

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Exam Updates Manager</h1>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>

      <div className="grid-2col-sidebar">
        
        {/* LIST PANEL */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Active Exam Updates</h3>
          <ul style={{ listStyle: 'none' }}>
            {updates.map(item => (
              <li key={item._id} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, paddingRight: '1rem' }}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', background: 'var(--bg-input)' }} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/2a2a35/FFFFFF?text=%F0%9F%93%A2'; }}
                    />
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      📢
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.title}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <strong>Category:</strong> {item.category} | <strong>Author:</strong> {item.author || 'N/A'} <br/>
                      <strong>Published:</strong> {new Date(item.date).toLocaleDateString()} <br/>
                      <strong>Snipped Description:</strong> {item.description?.substring(0, 100)}...
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEditClick(item)} 
                    className="btn-outline" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className="btn-primary" 
                    style={{ background: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {updates.length === 0 && (
              <li style={{ padding: '1rem', color: 'var(--text-muted)' }}>No updates found.</li>
            )}
          </ul>
        </div>

        {/* FORM PANEL */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editingUpdate ? 'Edit Exam Update' : 'Create New Update'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Update Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <input 
              type="text" 
              placeholder="Image URL (Optional)" 
              value={image} 
              onChange={e => setImage(e.target.value)} 
            />

            <input 
              type="text" 
              placeholder="Author Name" 
              value={author} 
              onChange={e => setAuthor(e.target.value)} 
              required 
            />

            <textarea 
              placeholder="Short Description (used in cards / snippets)" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', height: '100px', resize: 'vertical' }} 
            />

            <textarea 
              placeholder="Full Content Details (markdown or HTML content)" 
              value={fullContent} 
              onChange={e => setFullContent(e.target.value)} 
              required
              style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', height: '180px', resize: 'vertical' }} 
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {editingUpdate ? 'Save Changes' : 'Create'}
              </button>
              {editingUpdate && (
                <button type="button" className="btn-outline" onClick={handleCancelEdit} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UpdatesManager;
