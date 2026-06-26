import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const examOptions = ['mpsc', 'UPSC', 'SSC', 'Banking', 'Railways', 'NEET', 'JEE'];

const seriesOptionsMap = {
  mpsc: ['MPSC Combine Group A', 'MPSC Combine Group B'],
  UPSC: ['UPSC CSE', 'UPSC CDS', 'UPSC NDA'],
  SSC: ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD'],
  Banking: ['Banking IBPS PO/Clerk', 'Banking SBI PO', 'Banking RBI Grade B'],
  Railways: ['Railways RRB NTPC', 'Railways Group D'],
  NEET: ['NEET series 1', 'Neet series 2'],
  JEE: ['JEE series 1', 'JEE series 2'],
};

const testTitleOptionsMap = {
  'MPSC Combine Group A': ['MPSC Combine Group A Test 01', 'MPSC Combine Group A Test 02'],
  'MPSC Combine Group B': ['MPSC Combine Group B Test 01', 'MPSC Combine Group B Test 02'],
  'UPSC CSE': ['UPSC CSE Test 01', 'UPSC CSE Test 02'],
  'UPSC CDS': ['UPSC CDS Test 01', 'UPSC CDS Test 02'],
  'UPSC NDA': ['UPSC NDA Test 01', 'UPSC NDA Test 02'],
  'SSC CGL': ['SSC CGL Test 01', 'SSC CGL Test 02'],
  'SSC CHSL': ['SSC CHSL Test 01', 'SSC CHSL Test 02'],
  'SSC MTS': ['SSC MTS Test 01', 'SSC MTS Test 02'],
  'SSC GD': ['SSC GD Test 01', 'SSC GD Test 02'],
  'Banking IBPS PO/Clerk': ['Banking IBPS PO/Clerk Test 01', 'Banking IBPS PO/Clerk Test 02'],
  'Banking SBI PO': ['Banking SBI PO Test 01', 'Banking SBI PO Test 02'],
  'Banking RBI Grade B': ['Banking RBI Grade B Test 01', 'Banking RBI Grade B Test 02'],
  'Railways RRB NTPC': ['Railways RRB NTPC Test 01', 'Railways RRB NTPC Test 02'],
  'Railways Group D': ['Railways Group D Test 01', 'Railways Group D Test 02'],
  'NEET series 1': ['NEET series 1 Test 01', 'NEET series 1 Test 02'],
  'Neet series 2': ['Neet series 2 Test 01', 'Neet series 2 Test 02'],
  'JEE series 1': ['JEE series 1 Test 01', 'JEE series 1 Test 02'],
  'JEE series 2': ['JEE series 2 Test 01', 'JEE series 2 Test 02'],
};

const examCategoryOptions = ['mocktests', 'Live Exam', 'PYQ', 'Sectional'];
const difficultyOptions = ['Easy', 'Medium', 'Hard'];
const durationSuggestions = ['90 Mins', '120 Mins', '60 Mins', '30 Mins', '20 Mins'];
const marksSuggestions = ['200 marks', '500 marks'];
const questionTypeOptions = ['MCQ', 'Written', 'Mixed'];
const testStatusOptions = [
  { value: 'free', label: 'Unlocked - Free Mock' },
  { value: 'locked', label: 'Locked - Paid Mock' },
  { value: 'availablesoon', label: 'Available Soon' },
  { value: 'scheduled', label: 'Scheduled' },
];

const createInitialForm = () => ({
  exam: 'mpsc',
  seriesTitle: 'MPSC Combine Group A',
  testTitle: 'MPSC Combine Group A Test 01',
  examCategory: 'mocktests',
  description: 'Full length MPSC Group A mock test 01 by ranku1',
  difficulty: 'Medium',
  questionsLimit: 100,
  duration: '90 Mins',
  marks: '200 marks',
  questionType: 'MCQ',
  teststatus: 'locked',
});

const buildDefaultDescription = (form) =>
  `Full length ${form.seriesTitle} ${form.testTitle} by ranku1`;

const TestManager = () => {
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState(createInitialForm());
  const [editingTest, setEditingTest] = useState(null);

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

  const availableSeries = useMemo(() => {
    return seriesOptionsMap[formData.exam] || [];
  }, [formData.exam]);

  const availableTitles = useMemo(() => {
    return testTitleOptionsMap[formData.seriesTitle] || [];
  }, [formData.seriesTitle]);

  const resetForm = () => {
    setFormData(createInitialForm());
    setEditingTest(null);
  };

  const handleExamChange = (value) => {
    const nextSeries = (seriesOptionsMap[value] || [])[0] || '';
    const nextTitle = (testTitleOptionsMap[nextSeries] || [])[0] || '';

    setFormData((prev) => ({
      ...prev,
      exam: value,
      seriesTitle: nextSeries,
      testTitle: nextTitle,
    }));
  };

  const handleSeriesChange = (value) => {
    const nextTitle = (testTitleOptionsMap[value] || [])[0] || '';

    setFormData((prev) => ({
      ...prev,
      seriesTitle: value,
      testTitle: nextTitle,
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'questionsLimit' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const testData = {
        exam: formData.exam,
        testTitle: formData.testTitle,
        examCategory: formData.examCategory,
        seriesTitle: formData.seriesTitle,
        description: formData.description || buildDefaultDescription(formData),
        difficulty: formData.difficulty,
        questionsLimit: Number(formData.questionsLimit) || 0,
        duration: formData.duration,
        marks: formData.marks,
        questionType: formData.questionType,
        teststatus: formData.teststatus,
      };

      if (editingTest) {
        await api.put(`/tests/${editingTest._id}`, testData);
      } else {
        await api.post('/tests', testData);
      }

      await fetchTests();
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save test');
    }
  };

  const handleEditClick = (t) => {
    setEditingTest(t);
    setFormData({
      exam: t.exam || 'mpsc',
      testTitle: t.testTitle || '',
      examCategory: t.examCategory || 'mocktests',
      seriesTitle: t.seriesTitle || '',
      description: t.description || '',
      difficulty: t.difficulty || 'Medium',
      questionsLimit: t.questionsLimit || 0,
      duration: t.duration || '90 Mins',
      marks: t.marks || '200 marks',
      questionType: t.questionType || 'MCQ',
      teststatus: t.teststatus || 'locked',
    });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this test? All questions will remain orphaned.')) {
      try {
        await api.delete(`/tests/${id}`);
        await fetchTests();
        if (editingTest && editingTest._id === id) {
          resetForm();
        }
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
            Create and manage tests using the exact backend schema.
          </p>
        </div>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>

      <div className="grid-2col-asymmetric">
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Active Test Papers ({tests.length})</h3>
            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', color: 'var(--text-muted)' }}>
              Live in Database
            </span>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tests.length > 0 ? (
              tests.map((t) => (
                <li
                  key={t._id}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{t.testTitle}</strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
                        {t.description || 'No description provided.'}
                      </p>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          {t.exam}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          {t.seriesTitle}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(250, 204, 21, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                          {t.examCategory}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          ⏳ {t.duration}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          🏁 {t.marks}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', color: '#3b82f6', fontWeight: 600 }}>
                          {t.questionType}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            background: t.difficulty === 'Easy' ? 'rgba(16,185,129,0.1)' : t.difficulty === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: t.difficulty === 'Easy' ? '#10b981' : t.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                            fontWeight: 600,
                          }}
                        >
                          {t.difficulty || 'Easy'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            background: t.teststatus === 'free' ? 'rgba(16,185,129,0.1)' : t.teststatus === 'locked' ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.15)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: t.teststatus === 'free' ? '#10b981' : t.teststatus === 'locked' ? '#f59e0b' : '#cbd5e1',
                            fontWeight: 700,
                          }}
                        >
                          {t.teststatus}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px', color: '#3b82f6', fontWeight: 600 }}>
                          No.of Q: {t.questionCount ?? 0}
                        </span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.12)', padding: '2px 8px', borderRadius: '4px', color: '#c084fc', fontWeight: 600 }}>
                          🎯 Limit: {t.questionsLimit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                    <Link to={`/questions/${t._id}`} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                      📋 Manage Questions
                    </Link>
                    <button onClick={() => handleEditClick(t)} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteTest(t._id)} className="btn-primary" style={{ background: 'var(--danger)', color: '#fff', padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No active tests found in database. Use the creator to add your first test!
              </div>
            )}
          </ul>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content', position: 'sticky', top: '1rem' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✨</span> {editingTest ? 'Edit Test' : 'Create New Test'}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-2col-equal" style={{ gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Exam</label>
                <select value={formData.exam} onChange={(e) => handleExamChange(e.target.value)}>
                  {examOptions.map((exam) => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Series Title</label>
                <select value={formData.seriesTitle} onChange={(e) => handleSeriesChange(e.target.value)}>
                  {availableSeries.map((series) => (
                    <option key={series} value={series}>{series}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Test Title</label>
              <input
                type="text"
                placeholder="Enter test title, e.g. MPSC Combine Group A Test 03"
                value={formData.testTitle}
                onChange={(e) => handleChange('testTitle', e.target.value)}
                required
              />
              {availableTitles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {availableTitles.map((title) => (
                    <button
                      key={title}
                      type="button"
                      className="btn-outline"
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        height: 'auto',
                        background: formData.testTitle === title ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
                        borderColor: formData.testTitle === title ? 'var(--primary)' : 'var(--border-color)',
                        color: formData.testTitle === title ? 'var(--primary)' : 'var(--text-muted)',
                      }}
                      onClick={() => handleChange('testTitle', title)}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid-2col-equal" style={{ gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Exam Category</label>
                <select value={formData.examCategory} onChange={(e) => handleChange('examCategory', e.target.value)}>
                  {examCategoryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Difficulty</label>
                <select value={formData.difficulty} onChange={(e) => handleChange('difficulty', e.target.value)}>
                  {difficultyOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Description</label>
              <textarea
                placeholder="Full length MPSC Group A mock test 01 by ranku1"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="3"
                style={{ resize: 'none' }}
              />
            </div>

            <div className="grid-2col-equal" style={{ gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Duration</label>
                <input
                  type="text"
                  placeholder="Enter duration, e.g. 90 Mins"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {durationSuggestions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="btn-outline"
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        height: 'auto',
                        background: formData.duration === option ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
                        borderColor: formData.duration === option ? 'var(--primary)' : 'var(--border-color)',
                        color: formData.duration === option ? 'var(--primary)' : 'var(--text-muted)',
                      }}
                      onClick={() => handleChange('duration', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Marks</label>
                <input
                  type="text"
                  placeholder="Enter marks, e.g. 200 marks"
                  value={formData.marks}
                  onChange={(e) => handleChange('marks', e.target.value)}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {marksSuggestions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="btn-outline"
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        height: 'auto',
                        background: formData.marks === option ? 'rgba(250, 204, 21, 0.08)' : 'transparent',
                        borderColor: formData.marks === option ? 'var(--primary)' : 'var(--border-color)',
                        color: formData.marks === option ? 'var(--primary)' : 'var(--text-muted)',
                      }}
                      onClick={() => handleChange('marks', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-2col-equal" style={{ gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Question Type</label>
                <select value={formData.questionType} onChange={(e) => handleChange('questionType', e.target.value)}>
                  {questionTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Test Status</label>
                <select value={formData.teststatus} onChange={(e) => handleChange('teststatus', e.target.value)}>
                  {testStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Question Limit</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={formData.questionsLimit}
                onChange={(e) => handleChange('questionsLimit', e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.8rem', justifyContent: 'center', fontSize: '1rem', borderRadius: '8px' }}>
                {editingTest ? '💾 Save Changes' : '🚀 Add Test to Database'}
              </button>
              {editingTest && (
                <button type="button" className="btn-outline" onClick={handleCancelEdit} style={{ flex: 1, padding: '0.8rem', justifyContent: 'center', fontSize: '1rem', borderRadius: '8px' }}>
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

export default TestManager;