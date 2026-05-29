import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ExamManager = () => {
  const [exams, setExams] = useState([]);

  const [name, setName] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [pattern, setPattern] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [overview, setOverview] = useState('');
  const [category, setCategory] = useState('SSC');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [editingExam, setEditingExam] = useState(null);

  const categoriesList = [
    "SSC",
    "MPSC",
    "NEET",
    "JEE",
    "MHT-CET",
    "UPSC",
    "BANKING",
    "RAILWAY",
    "MH CET",
    "महाराष्ट्र पोलीस भरती",
    "Railways",
    "Defence",
    "State Exams",
    "Saral-Seva",
    "Others"
  ];

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExams();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('eligibility', eligibility);
      formData.append('pattern', pattern);
      formData.append('vacancies', vacancies);
      formData.append('overview', overview);
      formData.append('category', category);
      if (syllabusFile) {
        formData.append('syllabusPdf', syllabusFile);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingExam) {
        await api.put(`/exams/${editingExam._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditingExam(null);
      } else {
        await api.post('/exams', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setName('');
      setEligibility('');
      setPattern('');
      setVacancies('');
      setOverview('');
      setCategory('SSC');
      setSyllabusFile(null);
      setImageFile(null);
      setFileInputKey(prev => prev + 1);
      setImageInputKey(prev => prev + 1);
      fetchExams();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save exam. Please check upload limits.');
    }
  };

  const handleEditClick = (exam) => {
    setEditingExam(exam);
    setName(exam.name || '');
    setEligibility(exam.eligibility || '');
    setPattern(exam.pattern || '');
    setVacancies(exam.vacancies || '');
    setOverview(exam.overview || '');
    setCategory(exam.category || 'SSC');
    setSyllabusFile(null);
    setImageFile(null);
    setFileInputKey(prev => prev + 1);
    setImageInputKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingExam(null);
    setName('');
    setEligibility('');
    setPattern('');
    setVacancies('');
    setOverview('');
    setCategory('SSC');
    setSyllabusFile(null);
    setImageFile(null);
    setFileInputKey(prev => prev + 1);
    setImageInputKey(prev => prev + 1);
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam entry?')) {
      try {
        await api.delete(`/exams/${id}`);
        fetchExams();
        if (editingExam && editingExam._id === id) {
          handleCancelEdit();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Exam Management Hub</h1>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>

      <div className="grid-2col-sidebar">

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Active Exams</h3>
          <ul style={{ listStyle: 'none' }}>
            {exams.map(exam => (
              <li key={exam._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, paddingRight: '1rem' }}>
                  {exam.image ? (
                    <img
                      src={exam.image.startsWith('http') ? exam.image : `http://localhost:5000${exam.image}`}
                      alt={exam.name}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-input)' }}
                    />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      🎓
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{exam.name}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <strong>Category:</strong> {exam.category || 'Others'} <br />
                      <strong>Overview:</strong> {exam.overview || 'N/A'} <br />
                      <strong>Eligibility:</strong> {exam.eligibility} <br />
                      <strong>Pattern:</strong> {exam.pattern} <br />
                      <strong>Vacancies:</strong> {exam.vacancies} <br />
                      <strong>Syllabus:</strong> {exam.syllabusLink && exam.syllabusLink !== '#' ? <a href={exam.syllabusLink.startsWith('http') ? exam.syllabusLink : `http://localhost:5000${exam.syllabusLink}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>View Syllabus</a> : 'N/A'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditClick(exam)}
                    className="btn-outline"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam._id)}
                    className="btn-primary"
                    style={{ background: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {exams.length === 0 && (
              <li style={{ padding: '1rem', color: 'var(--text-muted)' }}>No exams found.</li>
            )}
          </ul>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editingExam ? 'Edit Exam' : 'Create New Exam'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Exam Name (e.g., UPSC)" value={name} onChange={e => setName(e.target.value)} required />
            <input type="text" placeholder="Eligibility" value={eligibility} onChange={e => setEligibility(e.target.value)} required />
            <input type="text" placeholder="Exam Pattern" value={pattern} onChange={e => setPattern(e.target.value)} required />
            <input type="text" placeholder="Vacancies (e.g., ~1,000)" value={vacancies} onChange={e => setVacancies(e.target.value)} required />
            <textarea placeholder="Exam Overview / Description" value={overview} onChange={e => setOverview(e.target.value)} style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', height: '100px', resize: 'vertical' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>Exam Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.75rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                Syllabus PDF File {editingExam && '(Leave empty to keep current)'}
              </label>
              <input
                key={fileInputKey}
                type="file"
                accept="application/pdf"
                onChange={e => setSyllabusFile(e.target.files[0])}
                style={{ padding: '0.5rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                Exam Screenshot / Logo Image {editingExam && '(Leave empty to keep current)'}
              </label>
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                style={{ padding: '0.5rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {editingExam ? 'Save Changes' : 'Create'}
              </button>
              {editingExam && (
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

export default ExamManager;
