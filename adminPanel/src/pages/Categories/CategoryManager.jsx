import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CategoryManager = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const detailsRef = useRef(null);

  const defaultCategories = [
    "SSC",
    "MPSC",
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, coursesRes] = await Promise.all([
        api.get('/exams'),
        api.get('/courses')
      ]);
      setExams(examsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error("Error fetching category details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Smooth scroll to details panel when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedCategory]);

  // Determine all unique categories dynamically
  const allCategoriesSet = new Set([
    ...defaultCategories,
    ...exams.map(e => e.category).filter(Boolean),
    ...courses.map(c => c.tagText).filter(Boolean),
    ...courses.map(c => c.exam).filter(Boolean)
  ]);

  const categories = Array.from(allCategoriesSet).map(catName => {
    const categoryExams = exams.filter(e => e.category?.toLowerCase() === catName.toLowerCase());
    const categoryCourses = courses.filter(c => 
      c.tagText?.toLowerCase() === catName.toLowerCase() || 
      c.exam?.toLowerCase() === catName.toLowerCase()
    );

    return {
      name: catName,
      examsCount: categoryExams.length,
      coursesCount: categoryCourses.length,
      exams: categoryExams,
      courses: categoryCourses
    };
  });

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>Loading categories...</div>;
  }

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Category Directory & Analytics</h1>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {categories.map((cat, idx) => {
          const totalItems = cat.examsCount + cat.coursesCount;
          return (
            <div 
              key={idx} 
              className="glass-panel" 
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer', 
                transform: selectedCategory?.name === cat.name ? 'scale(1.02)' : 'none',
                border: selectedCategory?.name === cat.name ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => handleCategorySelect(cat)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{cat.name}</h3>
                  <span style={{ fontSize: '1.5rem' }}>
                    {cat.name.includes("पोलीस") || cat.name.includes("Defence") ? "🛡️" :
                     cat.name.includes("BANK") ? "🏦" :
                     cat.name.includes("RAIL") ? "🚂" :
                     cat.name.includes("UPSC") || cat.name.includes("MPSC") ? "🏛️" : "🎓"}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span><strong>{cat.examsCount}</strong> Exams</span>
                  <span><strong>{cat.coursesCount}</strong> Courses</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', background: totalItems > 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)', color: totalItems > 0 ? '#3b82f6' : 'var(--text-muted)', padding: '0.25rem 0.6rem', borderRadius: '20px', fontWeight: 'bold' }}>
                  {totalItems > 0 ? 'Active' : 'Inactive'}
                </span>
                <span 
                  style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate trigger
                    handleCategorySelect(cat);
                  }}
                >
                  View Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL DRAWER / EXPANDED SECTION */}
      {selectedCategory && (
        <div ref={detailsRef} className="glass-panel" style={{ marginTop: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>Category: {selectedCategory.name}</h2>
            <button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setSelectedCategory(null)}>
              Close Panel
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* EXAMS IN CATEGORY */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '2px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                Exams List ({selectedCategory.examsCount})
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {selectedCategory.exams.map(exam => (
                  <li key={exam._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{exam.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vacancies: {exam.vacancies} | Eligibility: {exam.eligibility}</div>
                    </div>
                    <Link to="/exams" className="btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                      Edit Exam
                    </Link>
                  </li>
                ))}
                {selectedCategory.examsCount === 0 && (
                  <li style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No exams mapped to this category.</li>
                )}
              </ul>
            </div>

            {/* COURSES IN CATEGORY */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '2px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                Courses List ({selectedCategory.coursesCount})
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {selectedCategory.courses.map(course => (
                  <li key={course._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{course.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price: ₹{course.price} | Students: {course.students}</div>
                    </div>
                    <Link to="/courses" className="btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                      Edit Course
                    </Link>
                  </li>
                ))}
                {selectedCategory.coursesCount === 0 && (
                  <li style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>No courses mapped to this category.</li>
                )}
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
