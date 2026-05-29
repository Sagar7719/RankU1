import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const QuestionEditor = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.25);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/questions', {
        testId,
        questionText,
        options,
        correctOptionIndex: Number(correctOptionIndex),
        marks: Number(marks),
        negativeMarks: Number(negativeMarks)
      });
      fetchQuestions();
      setQuestionText('');
      setOptions(['', '', '', '']);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Question Editor</h1>
        <Link to="/tests" className="btn-outline">← Back to Tests</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <h3 style={{ marginBottom: '1rem' }}>Current Questions ({questions.length})</h3>
          <ul style={{ listStyle: 'none' }}>
            {questions.map((q, idx) => (
              <li key={q._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <button 
                  onClick={() => handleDeleteQuestion(q._id)} 
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--danger)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}
                >
                  Delete
                </button>
                <strong style={{ display: 'block', marginBottom: '0.5rem', paddingRight: '4rem' }}>Q{idx + 1}: {q.questionText}</strong>
                {q.options.map((opt, i) => (
                  <div key={i} style={{ color: q.correctOptionIndex === i ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {i === q.correctOptionIndex ? '✓ ' : '○ '}{opt}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add Question</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <textarea 
              placeholder="Question Text" 
              value={questionText} 
              onChange={e => setQuestionText(e.target.value)} 
              rows="3" 
              required
            />
            
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Correct Option</label>
                <select value={correctOptionIndex} onChange={e => setCorrectOptionIndex(e.target.value)} style={{ width: '100%' }}>
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>+ Marks</label>
                  <input type="number" step="0.1" value={marks} onChange={e => setMarks(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>- Marks</label>
                  <input type="number" step="0.1" value={negativeMarks} onChange={e => setNegativeMarks(e.target.value)} style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add Question</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default QuestionEditor;
