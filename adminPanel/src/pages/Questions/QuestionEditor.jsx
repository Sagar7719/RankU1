/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const QuestionEditor = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [subject, setSubject] = useState('General Awareness');
  const [explanation, setExplanation] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/questions/test/${testId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionChange = (index, val) => {
    const newOptions = [...options];
    newOptions[index] = val;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        testId,
        questionText,
        options,
        correctOptionIndex: Number(correctOptionIndex),
        marks: Number(marks),
        negativeMarks: Number(negativeMarks),
        subject,
        explanation
      };

      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion._id}`, questionData);
        setEditingQuestion(null);
      } else {
        await api.post('/questions', questionData);
      }

      fetchQuestions();
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      setMarks(1);
      setNegativeMarks(0.25);
      setSubject('General Awareness');
      setExplanation('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEditClick = (q) => {
    setEditingQuestion(q);
    setQuestionText(q.questionText || '');
    setOptions(q.options || ['', '', '', '']);
    setCorrectOptionIndex(q.correctOptionIndex !== undefined ? q.correctOptionIndex : 0);
    setMarks(q.marks !== undefined ? q.marks : 1);
    setNegativeMarks(q.negativeMarks !== undefined ? q.negativeMarks : 0.25);
    setSubject(q.subject || 'General Awareness');
    setExplanation(q.explanation || '');
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
    setMarks(1);
    setNegativeMarks(0.25);
    setSubject('General Awareness');
    setExplanation('');
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        fetchQuestions();
        if (editingQuestion && editingQuestion._id === id) {
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
        <h1 className="page-title" style={{ margin: 0 }}>Question Editor</h1>
        <Link to="/series" className="btn-outline">← Back to Test Series</Link>
      </div>

      <div className="grid-2col-equal">
        
        <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <h3 style={{ marginBottom: '1rem' }}>Current Questions ({questions.length})</h3>
          <ul style={{ listStyle: 'none' }}>
            {questions.map((q, idx) => (
              <li key={q._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEditClick(q)} 
                    style={{ background: 'var(--primary)', color: '#000', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestion(q._id)} 
                    style={{ background: 'var(--danger)', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}
                  >
                    Delete
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <strong style={{ margin: 0 }}>Q{idx + 1}</strong>
                  <span style={{ 
                    padding: '0.15rem 0.4rem', 
                    borderRadius: '4px', 
                    fontSize: '0.7rem', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    color: '#3b82f6',
                    fontWeight: 600
                  }}>
                    {q.subject || 'General Awareness'}
                  </span>
                  <span style={{ 
                    padding: '0.15rem 0.4rem', 
                    borderRadius: '4px', 
                    fontSize: '0.7rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    color: 'var(--text-muted)'
                  }}>
                    Marks: {q.marks} | -{q.negativeMarks}
                  </span>
                </div>
                
                <strong style={{ display: 'block', marginBottom: '0.5rem', paddingRight: '8rem' }}>{q.questionText}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 1rem', marginBottom: '0.5rem' }}>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{ color: q.correctOptionIndex === i ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {i === q.correctOptionIndex ? '✓ ' : '○ '}{opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', borderLeft: '3px solid var(--accent)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Explanation:</span> {q.explanation}
                  </div>
                )}
              </li>
            ))}
            {questions.length === 0 && (
              <li style={{ padding: '1rem', color: 'var(--text-muted)' }}>No questions found.</li>
            )}
          </ul>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Subject / Section</label>
              <input 
                type="text" 
                placeholder="e.g. General Awareness, Marathi Grammar, Quantitative Aptitude" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Question Text</label>
              <textarea 
                placeholder="Enter question content..." 
                value={questionText} 
                onChange={e => setQuestionText(e.target.value)} 
                rows="3" 
                required
              />
            </div>
            
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Options</label>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {options.map((opt, i) => (
                  <input 
                    key={i}
                    type="text" 
                    placeholder={`Option ${i + 1}`} 
                    value={opt} 
                    onChange={e => handleOptionChange(i, e.target.value)} 
                    required 
                  />
                ))}
              </div>
            </div>

            <div className="grid-2col-equal" style={{ gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Correct Option</label>
                <select value={correctOptionIndex} onChange={e => setCorrectOptionIndex(e.target.value)} style={{ width: '100%' }}>
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>+ Marks</label>
                  <input type="number" step="0.1" value={marks} onChange={e => setMarks(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>- Marks</label>
                  <input type="number" step="0.1" value={negativeMarks} onChange={e => setNegativeMarks(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Detailed Explanation</label>
              <textarea 
                placeholder="Explain why the option is correct (optional)..." 
                value={explanation} 
                onChange={e => setExplanation(e.target.value)} 
                rows="3" 
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {editingQuestion ? 'Save Changes' : 'Add Question'}
              </button>
              {editingQuestion && (
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

export default QuestionEditor;
