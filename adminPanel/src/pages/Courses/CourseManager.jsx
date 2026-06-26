import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [exam, setExam] = useState('');
  const [type, setType] = useState('Paid');
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [badgeText, setBadgeText] = useState('PAID');
  const [tagText, setTagText] = useState('');
  const [students, setStudents] = useState('1.2k+');
  const [rating, setRating] = useState('4.9');
  const [duration, setDuration] = useState('');
  const [gradient, setGradient] = useState('linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)');
  
  const [imageFile, setImageFile] = useState(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    if (selectedType === 'Free') {
      setIsFree(true);
      setPrice(0);
      setBadgeText('FREE');
    } else {
      setIsFree(false);
      setBadgeText('PAID');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('exam', exam);
      formData.append('type', type);
      formData.append('price', price);
      formData.append('isFree', isFree);
      formData.append('badgeText', badgeText);
      formData.append('tagText', tagText || exam);
      formData.append('students', students);
      formData.append('rating', rating);
      formData.append('duration', duration);
      formData.append('gradient', gradient);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditingCourse(null);
      } else {
        await api.post('/courses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setTitle('');
      setSubtitle('');
      setExam('');
      setType('Paid');
      setPrice(0);
      setIsFree(false);
      setBadgeText('PAID');
      setTagText('');
      setStudents('1.2k+');
      setRating('4.9');
      setDuration('');
      setGradient('linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)');
      setImageFile(null);
      setImageInputKey(prev => prev + 1);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save course. Please check image upload size.');
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setTitle(course.title || '');
    setSubtitle(course.subtitle || '');
    setExam(course.exam || '');
    setType(course.type || 'Paid');
    setPrice(course.price ?? 0);
    setIsFree(course.isFree ?? false);
    setBadgeText(course.badgeText || 'PAID');
    setTagText(course.tagText || '');
    setStudents(course.students || '1.2k+');
    setRating(course.rating || '4.9');
    setDuration(course.duration || '');
    setGradient(course.gradient || 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)');
    setImageFile(null);
    setImageInputKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setTitle('');
    setSubtitle('');
    setExam('');
    setType('Paid');
    setPrice(0);
    setIsFree(false);
    setBadgeText('PAID');
    setTagText('');
    setStudents('1.2k+');
    setRating('4.9');
    setDuration('');
    setGradient('linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)');
    setImageFile(null);
    setImageInputKey(prev => prev + 1);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
        if (editingCourse && editingCourse._id === id) {
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
        <h1 className="page-title" style={{ margin: 0 }}>Course Management Hub</h1>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>

      <div className="grid-2col-sidebar">
        
        {/* LIST PANEL */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Active Courses</h3>
          <ul style={{ listStyle: 'none' }}>
            {courses.map(course => (
              <li key={course._id} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, paddingRight: '1rem' }}>
                  {course.image ? (
                    <img 
                      src={course.image.startsWith('http') ? course.image : `  ${course.image}`} 
                      alt={course.title} 
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', background: 'var(--bg-input)' }} 
                    />
                  ) : (
                    <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: course.gradient || 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center', padding: '4px' }}>
                      {course.title}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{course.title}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <strong>Sub:</strong> {course.subtitle} <br/>
                      <strong>Category:</strong> {course.tagText} | <strong>Type:</strong> {course.badgeText} ({course.isFree ? 'Free' : `₹${course.price}`}) <br/>
                      <strong>Stats:</strong> {course.students} students | {course.rating} ★ | {course.duration} duration
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEditClick(course)} 
                    className="btn-outline" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course._id)} 
                    className="btn-primary" 
                    style={{ background: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {courses.length === 0 && (
              <li style={{ padding: '1rem', color: 'var(--text-muted)' }}>No courses found.</li>
            )}
          </ul>
        </div>

        {/* FORM PANEL */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Course Title (e.g. IB PAID)" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="text" placeholder="Course Subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} required />
            <input type="text" placeholder="Exam Type (e.g. IB ACIO)" value={exam} onChange={e => setExam(e.target.value)} required />
            <input type="text" placeholder="Category Tag (e.g. IB ACIO, empty defaults to Exam)" value={tagText} onChange={e => setTagText(e.target.value)} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input type="text" placeholder="Students (e.g. 1.2k+)" value={students} onChange={e => setStudents(e.target.value)} required />
              <input type="text" placeholder="Rating (e.g. 4.9)" value={rating} onChange={e => setRating(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input type="text" placeholder="Duration (e.g. 12 MONTH)" value={duration} onChange={e => setDuration(e.target.value)} required />
              <select value={type} onChange={handleTypeChange}>
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
            </div>

            {!isFree && (
              <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(Number(e.target.value))} required />
            )}

            <input type="text" placeholder="CSS Gradient (used if no banner uploaded)" value={gradient} onChange={e => setGradient(e.target.value)} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                Course Banner Image {editingCourse && '(Leave empty to keep current)'}
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
                {editingCourse ? 'Save Changes' : 'Create'}
              </button>
              {editingCourse && (
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

export default CourseManager;
