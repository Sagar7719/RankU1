import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ExamManager = () => {
  const [exams, setExams] = useState([]);
  
  const [name, setName] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [pattern, setPattern] = useState('');
  const [vacancies, setVacancies] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/exams', { name, eligibility, pattern, vacancies, syllabusLink: '#' });
      setName('');
      setEligibility('');
      setPattern('');
      setVacancies('');
      fetchExams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam entry?')) {
      try {
        await api.delete(`/exams/${id}`);
        fetchExams();
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Active Exams</h3>
          <ul style={{ listStyle: 'none' }}>
            {exams.map(exam => (
              <li key={exam._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{exam.name}</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    <strong>Eligibility:</strong> {exam.eligibility} <br/>
                    <strong>Pattern:</strong> {exam.pattern} <br/>
                    <strong>Vacancies:</strong> {exam.vacancies}
                  </div>
                </div>
                <div>
                  <button onClick={() => handleDeleteExam(exam._id)} className="btn-primary" style={{ background: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Delete</button>
                </div>
              </li>
            ))}
            {exams.length === 0 && (
              <li style={{ padding: '1rem', color: 'var(--text-muted)' }}>No exams found.</li>
            )}
          </ul>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Exam</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Exam Name (e.g., UPSC)" value={name} onChange={e => setName(e.target.value)} required />
            <input type="text" placeholder="Eligibility" value={eligibility} onChange={e => setEligibility(e.target.value)} required />
            <input type="text" placeholder="Exam Pattern" value={pattern} onChange={e => setPattern(e.target.value)} required />
            <input type="text" placeholder="Vacancies (e.g., ~1,000)" value={vacancies} onChange={e => setVacancies(e.target.value)} required />
            <button type="submit" className="btn-primary">Create</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ExamManager;
