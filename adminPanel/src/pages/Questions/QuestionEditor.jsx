import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const QuestionEditor = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [testDetails, setTestDetails] = useState(null);

  const [subject, setSubject] = useState('General Awareness');
  const [questionType, setQuestionType] = useState('MCQ');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [explanation, setExplanation] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    fetchQuestions();
    fetchTestDetails();
  }, [testId]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/questions/test/${testId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTestDetails = async () => {
    try {
      const res = await api.get('/tests');
      const currentTest = res.data.find((t) => t._id === testId);
      if (currentTest) {
        setTestDetails(currentTest);
        if (currentTest.questionType === 'Written') {
          setQuestionType('Written');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionChange = (index, val) => {
    const newOptions = [...options];
    newOptions[index] = val;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
    setMarks(1);
    setNegativeMarks(0.25);
    setSubject('General Awareness');
    setExplanation('');
    setEditingQuestion(null);
    setQuestionType(testDetails?.questionType === 'Written' ? 'Written' : 'MCQ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pdfFile) {
      setIsUploading(true);
      setUploadStatus({ success: null, message: '' });

      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('subject', subject);
      formData.append('marks', marks);
      formData.append('negativeMarks', negativeMarks);
      formData.append('questionType', questionType);

      try {
        const res = await api.post(`/questions/import-pdf/${testId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadStatus({
          success: true,
          message: res.data.message || 'Successfully imported questions!',
        });
        setPdfFile(null);
        const fileInput = document.getElementById('pdf-file-input');
        if (fileInput) fileInput.value = '';
        fetchQuestions();
      } catch (err) {
        console.error(err);
        setUploadStatus({
          success: false,
          message: err.response?.data?.message || 'Failed to parse and import PDF questions.',
        });
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (!questionText.trim()) {
      alert('Please enter the Question Text first.');
      return;
    }

    if (questionType === 'MCQ' && options.some((opt) => !opt.trim())) {
      alert('Please enter all 4 Options.');
      return;
    }

    try {
      const questionData = {
        testId,
        questionType,
        questionText,
        options: questionType === 'MCQ' ? options : [],
        correctOptionIndex: questionType === 'MCQ' ? Number(correctOptionIndex) : null,
        marks: Number(marks),
        negativeMarks: Number(negativeMarks),
        subject,
        explanation,
      };

      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion._id}`, questionData);
        setEditingQuestion(null);
      } else {
        await api.post('/questions', questionData);
      }

      fetchQuestions();
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEditClick = (q) => {
    setEditingQuestion(q);
    setQuestionText(q.questionText || '');
    setQuestionType(q.questionType || 'MCQ');
    setOptions(q.options && q.options.length ? q.options : ['', '', '', '']);
    setCorrectOptionIndex(q.correctOptionIndex !== undefined && q.correctOptionIndex !== null ? q.correctOptionIndex : 0);
    setMarks(q.marks !== undefined ? q.marks : 1);
    setNegativeMarks(q.negativeMarks !== undefined ? q.negativeMarks : 0.25);
    setSubject(q.subject || 'General Awareness');
    setExplanation(q.explanation || '');
    setPdfFile(null);
    const fileInput = document.getElementById('pdf-file-input');
    if (fileInput) fileInput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
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

  const getSubmitButtonText = () => {
    if (editingQuestion) return '💾 Save Changes';
    if (pdfFile) return isUploading ? '⏳ Uploading and Parsing PDF...' : '🚀 Automatic Add from PDF';
    return '➕ Add Question';
  };

  return (
    <div className="content-scrollable" style={{ padding: '2rem', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Question Management Hub</h1>
          {testDetails && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Managing questions for: <strong style={{ color: 'var(--primary)' }}>{testDetails.testTitle}</strong> ({testDetails.examCategory})
            </p>
          )}
        </div>
        <Link to="/series" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          ← Back to Test Series
        </Link>
      </div>

      <div className="grid-2col-equal" style={{ gap: '2rem', alignItems: 'start' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '85vh' }}>
          <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Current Questions ({questions.length})</h3>
            <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', color: 'var(--text-muted)' }}>
              Live in Test
            </span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '1rem 1.5rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {questions.map((q, idx) => (
                <li
                  key={q._id}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '1rem', color: '#fff' }}>Q{idx + 1}</strong>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 600 }}>
                        {q.subject || 'General Awareness'}
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        {q.questionType || 'MCQ'}
                      </span>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        Marks: {q.marks} | -{q.negativeMarks}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditClick(q)}
                        style={{
                          background: 'rgba(250, 204, 21, 0.1)',
                          border: '1px solid var(--primary)',
                          color: 'var(--primary)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid var(--danger)',
                          color: '#ef4444',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <strong style={{ display: 'block', marginBottom: '1rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
                    {q.questionText}
                  </strong>

                  {q.questionType !== 'Written' && q.options && q.options.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.25rem', marginBottom: '0.75rem' }}>
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: q.correctOptionIndex === i ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                            border: q.correctOptionIndex === i ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.03)',
                            borderRadius: '6px',
                            color: q.correctOptionIndex === i ? '#10b981' : 'var(--text-muted)',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <span>{i === q.correctOptionIndex ? '✓' : '•'}</span>
                          <span style={{ wordBreak: 'break-word' }}>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '6px',
                        borderLeft: '3px solid var(--primary)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.4',
                      }}
                    >
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Explanation:</span> {q.explanation}
                    </div>
                  )}
                </li>
              ))}
              {questions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  No questions found in this test paper yet. Fill out the form on the right to add some.
                </div>
              )}
            </ul>
          </div>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            {editingQuestion ? '✏️ Edit Question' : '✨ Add Questions'}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Subject / Section</label>
              <input
                type="text"
                placeholder="e.g. General Awareness, Marathi Grammar, Quantitative Aptitude"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Question Type</label>
              <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} style={{ width: '100%' }}>
                <option value="MCQ">MCQ</option>
                <option value="Written">Written</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Question Text</label>
              <textarea
                placeholder="Enter question content (Leave empty if importing PDF below)..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows="3"
              />
            </div>

            {questionType === 'MCQ' && (
              <>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Options</label>
                  <div style={{ display: 'grid', gap: '0.6rem' }}>
                    {options.map((opt, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '70px', fontWeight: '600' }}>Option {i + 1}</span>
                        <input
                          type="text"
                          placeholder={`Enter option ${i + 1}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(i, e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Correct Option</label>
                  <select value={correctOptionIndex} onChange={(e) => setCorrectOptionIndex(Number(e.target.value))} style={{ width: '100%' }}>
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>+ Marks</label>
                <input type="number" step="0.1" value={marks} onChange={(e) => setMarks(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>- Marks</label>
                <input type="number" step="0.01" value={negativeMarks} onChange={(e) => setNegativeMarks(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Detailed Explanation</label>
              <textarea
                placeholder="Explain why the answer is correct (optional)..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows="2"
              />
            </div>

            {!editingQuestion && (
              <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
                  <input
                    id="pdf-file-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                    style={{ cursor: 'pointer', width: '100%', fontSize: '0.85rem' }}
                  />
                </div>

                {uploadStatus.message && (
                  <div
                    style={{
                      background: uploadStatus.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: uploadStatus.success ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      color: uploadStatus.success ? '#34d399' : '#f87171',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {uploadStatus.message}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  padding: '0.8rem',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  opacity: isUploading ? 0.7 : 1,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                }}
                disabled={isUploading}
              >
                {getSubmitButtonText()}
              </button>
              {editingQuestion && (
                <button type="button" className="btn-outline" onClick={handleCancelEdit} style={{ flex: 1, justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem', borderRadius: '8px' }}>
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