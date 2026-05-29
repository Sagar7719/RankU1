/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Courses.css";
import { 
  FaBolt, 
  FaBullseye, 
  FaStar, 
  FaSearch, 
  FaUsers, 
  FaClock, 
  FaTimes, 
  FaPlay, 
  FaLock, 
  FaChevronDown, 
  FaChevronUp, 
  FaFileAlt, 
  FaCheckCircle, 
  FaGlobe, 
  FaVideo 
} from "react-icons/fa";

// Structured mock data for course contents
const mockCurriculum = {
  "IB PAID": {
    overview: "Comprehensive syllabus specifically designed for IB ACIO Executive aspirants. Covers exhaustive topics for Tier 1, descriptive preparation for Tier 2, and exclusive personality mentoring for Tier 3 Interviews.",
    highlights: [
      "120+ Hours of Live & Recorded Classes",
      "50+ Topic-wise Practice Tests",
      "10 Full-Length Mocks with Detailed Solutions",
      "Tier 2 Essay & Précis Writing Masterclasses",
      "1-on-1 Personality Guidance by ex-IB Officers",
      "Weekly Live Doubt Resolution Sessions"
    ],
    videos: [
      {
        title: "IB ACIO preparation masterclass",
        duration: "12 mins",
        url: "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"
      },
      {
        title: "Desk Job vs Field Job in Intelligence Bureau",
        duration: "8 mins",
        url: "https://www.youtube.com/embed/6iNf41K8Ld4?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop"
      },
      {
        title: "Descriptive English Writing strategy",
        duration: "15 mins",
        url: "https://www.youtube.com/embed/yF-78c6bB10?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop"
      }
    ],
    sections: [
      {
        title: "Section 1: Reasoning & Logical Aptitude",
        items: [
          { type: "video", title: "Introduction to Syllogism & Logic", duration: "45m" },
          { type: "video", title: "Advanced Coding-Decoding Techniques", duration: "50m" },
          { type: "doc", title: "Practice Sheet: Seating Arrangements", size: "2.4 MB" },
          { type: "video", title: "Blood Relations: Concept & Tricks", duration: "38m" }
        ]
      },
      {
        title: "Section 2: General Studies & Geopolitics",
        items: [
          { type: "video", title: "Indian Security System Structure", duration: "1h 10m" },
          { type: "doc", title: "Current Affairs Blueprint: Last 6 Months", size: "5.1 MB" },
          { type: "video", title: "Bilateral Relations & Border Issues", duration: "55m" },
          { type: "doc", title: "Geography Notes: Strategic Passages", size: "1.8 MB" }
        ]
      },
      {
        title: "Section 3: Numerical Ability",
        items: [
          { type: "video", title: "Speed Math & Vedic Tricks", duration: "40m" },
          { type: "video", title: "Data Interpretation (DI) Essentials", duration: "1h 05m" },
          { type: "doc", title: "Formula Sheet: Algebra & Mensuration", size: "1.2 MB" }
        ]
      },
      {
        title: "Section 4: English & Descriptive Skills",
        items: [
          { type: "video", title: "Grammar Rules & Spotting Errors", duration: "52m" },
          { type: "doc", title: "Sample Essay Templates (Tier-2)", size: "3.2 MB" },
          { type: "video", title: "Précis Writing Format & Practice", duration: "48m" }
        ]
      }
    ]
  },
  "IB INTERVIEW": {
    overview: "Specialized personality enrichment and interview preparation program led by retired senior officers. Focuses on confidence building, situation response, background profiling, and addressing security concerns.",
    highlights: [
      "2 Mock Interviews with feedback from retired panel members",
      "Detailed analysis of your DAF / Personal Profile",
      "Situation Reaction Test (SRT) worksheets",
      "Lectures on Internal Security challenges",
      "Body language, stress management, and presentation tips"
    ],
    videos: [
      {
        title: "IB ACIO Mock Interview of Topper - Rank 12",
        duration: "18 mins",
        url: "https://www.youtube.com/embed/HqJ4EwYmUgw?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1521791136364-706a16b3f553?w=600&auto=format&fit=crop"
      },
      {
        title: "How to answer background questions in IB Interview",
        duration: "10 mins",
        url: "https://www.youtube.com/embed/kK3hE5wex98?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop"
      },
      {
        title: "Current internal security challenges facing India",
        duration: "14 mins",
        url: "https://www.youtube.com/embed/5a8RjUaDly0?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop"
      }
    ],
    sections: [
      {
        title: "Section 1: Interview Panel & Protocol",
        items: [
          { type: "video", title: "Decoding the IB Interview Expectations", duration: "35m" },
          { type: "video", title: "Do's & Don'ts: Body Language & Attire", duration: "40m" }
        ]
      },
      {
        title: "Section 2: Bio-Data & Personal Profile Analysis",
        items: [
          { type: "video", title: "How to defend your gaps/career choices", duration: "50m" },
          { type: "doc", title: "DAF Analysis & Sample Questions", size: "1.5 MB" }
        ]
      },
      {
        title: "Section 3: Geopolitical & Internal Security",
        items: [
          { type: "video", title: "Key Threat Landscapes (Internal & Cyber)", duration: "1h 15m" },
          { type: "video", title: "Cross-border Relations & Intelligence Setup", duration: "58m" },
          { type: "doc", title: "Strategic Security Report Summaries", size: "4.8 MB" }
        ]
      },
      {
        title: "Section 4: Situation Reaction Tests (SRT)",
        items: [
          { type: "video", title: "Solving SRTs with Intelligence Logic", duration: "48m" },
          { type: "doc", title: "50 Scenario Practice Worksheet", size: "2.1 MB" }
        ]
      }
    ]
  }
};

// Fallback generator for dynamically added courses
const getCourseDetails = (courseTitle) => {
  const normalizedTitle = courseTitle ? courseTitle.toUpperCase().trim() : "";
  if (mockCurriculum[normalizedTitle]) {
    return mockCurriculum[normalizedTitle];
  }
  
  return {
    overview: `Detailed learning module for ${courseTitle || "Premium Course"}. Hand-crafted to guarantee conceptual clarity and extensive practice.`,
    highlights: [
      "Flexible self-paced learning lectures",
      "High-quality downloadable study materials",
      "Topic-wise interactive questions & tests",
      "Doubt resolution support via forums"
    ],
    videos: [
      {
        title: `Introduction to ${courseTitle || "Course"} Curriculum`,
        duration: "5 mins",
        url: "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&mute=1",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"
      }
    ],
    sections: [
      {
        title: "Section 1: Foundations & Fundamentals",
        items: [
          { type: "video", title: "Core Concepts & Welcome Video", duration: "30m" },
          { type: "doc", title: "Introductory Reading & Blueprint", size: "1.1 MB" }
        ]
      },
      {
        title: "Section 2: Intermediate Concepts",
        items: [
          { type: "video", title: "Deep Dive & Case Studies", duration: "45m" },
          { type: "doc", title: "Advanced Workbook & Formula Guides", size: "2.0 MB" }
        ]
      }
    ]
  };
};

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coursesData, setCoursesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("All Exams");
  const [selectedType, setSelectedType] = useState("All Types");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedExploreCourse, setSelectedExploreCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [expandedSections, setExpandedSections] = useState({});
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [playingVideoTitle, setPlayingVideoTitle] = useState(null);

  // Simulated Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 180; // 3 minutes mock length

  useEffect(() => {
    let interval = null;
    if (isPlaying && selectedExploreCourse) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedExploreCourse]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const getSubtitleText = (videoTitle, secs) => {
    const title = videoTitle ? videoTitle.toUpperCase() : "";
    let subtitles = [];
    
    if (title.includes("PREPARATION MASTERCLASS")) {
      subtitles = [
        { time: 0, text: "Hello everyone, welcome to the Intelligence Bureau ACIO Exam Masterclass." },
        { time: 5, text: "Today, we are going to outline the strategic preparation blueprint for Tier 1 and Tier 2." },
        { time: 11, text: "The key to clearing IB ACIO is balancing General Awareness with Logical Reasoning." },
        { time: 17, text: "Let's first inspect the weightage of current affairs and international security in Section 2..." },
        { time: 24, text: "Remember, accuracy is more important than the number of questions attempted due to negative marking." },
        { time: 30, text: "Let's practice a sample logic problem on seating arrangement..." }
      ];
    } else if (title.includes("DESK JOB VS FIELD JOB")) {
      subtitles = [
        { time: 0, text: "A common question among aspirants is the difference between Desk Jobs and Field Jobs in the IB." },
        { time: 5, text: "While Field Jobs involve ground operations, desk jobs focus on cyber intelligence and reports analysis." },
        { time: 11, text: "Both roles are equally crucial for national security and require high integrity." },
        { time: 17, text: "Field officers work in close coordination with local administration and special forces." },
        { time: 23, text: "Desk officers process raw intelligence inputs gathered from foreign and domestic feeds." },
        { time: 29, text: "Let's explore the typical career progression for both profiles in the department..." }
      ];
    } else if (title.includes("DESCRIPTIVE ENGLISH")) {
      subtitles = [
        { time: 0, text: "Welcome to the Descriptive English Masterclass. Today, we will discuss essay writing rules." },
        { time: 5, text: "For Tier 2, you are expected to write an essay, a précis, and English comprehension answers." },
        { time: 11, text: "The essay carries 30 marks. Focus on structured arguments, clear facts, and correct grammar." },
        { time: 17, text: "Do not use overly complex vocabulary. Keep your sentences concise and impactful." },
        { time: 23, text: "Let's review a sample précis and identify how to condense it to one-third of its length..." }
      ];
    } else if (title.includes("MOCK INTERVIEW OF TOPPER")) {
      subtitles = [
        { time: 0, text: "Welcome to the Mock Interview analysis. Today we are reviewing the session of Topper Rank 12." },
        { time: 5, text: "Observe his entry, posture, and how he greets the panel members confidently." },
        { time: 11, text: "When asked about internal security, his response was structured and logical." },
        { time: 17, text: "Notice how he politely handles a question where he didn't know the exact statistics." },
        { time: 23, text: "Let's analyze the panel feedback regarding his body language and tone modulation..." }
      ];
    } else if (title.includes("BACKGROUND QUESTIONS")) {
      subtitles = [
        { time: 0, text: "Personal background and DAF questions form about 60% of the IB ACIO Interview." },
        { time: 5, text: "Be prepared to explain any gaps in your education or career shifts honestly." },
        { time: 11, text: "Always tie your personal experiences to qualities like leadership, adaptability, and resilience." },
        { time: 17, text: "Let's review a sample response to the question: 'Why do you want to join the Intelligence Bureau?'" },
        { time: 23, text: "Avoid generic answers. Explain your genuine interest in national security and service..." }
      ];
    } else if (title.includes("INTERNAL SECURITY")) {
      subtitles = [
        { time: 0, text: "Today's lecture covers the current internal security threats across different zones." },
        { time: 5, text: "We will analyze border management, left-wing extremism, and emerging cyber warfare challenges." },
        { time: 11, text: "Intelligence gathering is our first line of defense against asymmetric warfare." },
        { time: 17, text: "Let's look at the map displaying the strategic corridors and border checkposts..." },
        { time: 23, text: "Understanding regional history and geopolitical tensions is vital to assessing risk profiles..." }
      ];
    } else {
      subtitles = [
        { time: 0, text: "Welcome to the training course. We will be going over the core syllabus items today." },
        { time: 6, text: "Make sure you download the attached study guides and workbooks for self-study." },
        { time: 12, text: "We recommend dedicating 2 hours daily to solve mock exercises and quizzes." },
        { time: 18, text: "Let's start by introducing the fundamental principles of intelligence gathering..." }
      ];
    }

    let activeSub = "Select play to start the video lecture preview.";
    if (secs > 0) {
      activeSub = "Lecture preview in progress. Follow along with the transcript below.";
      for (let i = 0; i < subtitles.length; i++) {
        if (secs >= subtitles[i].time) {
          activeSub = subtitles[i].text;
        }
      }
    }
    return activeSub;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        if (response.ok) {
          const data = await response.json();
          setCoursesData(data);
        }
      } catch (error) {
        console.error("Error fetching courses for user page:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedExploreCourse) {
      document.body.classList.add("modal-open-lock");
    } else {
      document.body.classList.remove("modal-open-lock");
    }
    return () => {
      document.body.classList.remove("modal-open-lock");
    };
  }, [selectedExploreCourse]);

  // Filter courses based on search keyword and selects
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = 
      (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.subtitle && course.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.exam && course.exam.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExam = 
      selectedExam === "All Exams" || 
      (course.exam && (
        course.exam.toLowerCase().includes(selectedExam.toLowerCase()) ||
        selectedExam.toLowerCase().includes(course.exam.toLowerCase())
      ));

    const matchesType = 
      selectedType === "All Types" || 
      (course.type && course.type.toLowerCase() === selectedType.toLowerCase());

    return matchesSearch && matchesExam && matchesType;
  });

  // Extract unique exam tags dynamically from fetched courses
  const uniqueExams = ["All Exams", ...new Set(coursesData.map(c => c.exam).filter(Boolean))];

  const handleExplore = (course) => {
    setSelectedExploreCourse(course);
    setActiveTab("curriculum");
    setExpandedSections({ 0: true }); // Expand the first section by default
    setPlayingVideoUrl(null);
    setPlayingVideoTitle(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleCloseModal = () => {
    setSelectedExploreCourse(null);
    setPlayingVideoUrl(null);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedExam("All Exams");
    setSelectedType("All Types");
  };

  // Check if current user has active premium plan
  const checkUserHasActivePlan = () => {
    if (!user) return false;
    if (user.plan && user.plan.isActive) return true;
    try {
      const localPlan = localStorage.getItem(`userPlan_${user._id}`);
      if (localPlan && localPlan !== 'undefined') {
        const parsedPlan = JSON.parse(localPlan);
        if (parsedPlan && parsedPlan.expireDate && new Date(parsedPlan.expireDate) > new Date()) {
          return true;
        }
      }
    } catch (e) {
      console.error("Error parsing plan from local storage:", e);
    }
    return false;
  };

  const isPremiumUser = checkUserHasActivePlan();
  
  // Get current active details
  const courseDetails = selectedExploreCourse ? getCourseDetails(selectedExploreCourse.title) : null;

  // Toggle syllabus accordions
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Launch play state for video
  const playVideo = (video) => {
    setPlayingVideoUrl(video.url);
    setPlayingVideoTitle(video.title);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Handle CTA Enrollment button clicks
  const handleEnrollClick = (course) => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (course.isFree || course.price === 0 || (course.type && course.type.toLowerCase() === "free")) {
      navigate("/dashboard");
    } else {
      if (isPremiumUser) {
        navigate("/dashboard");
      } else {
        navigate("/plans");
      }
    }
  };

  return (
    <section className="courses-section">
      {/* Pre Heading */}
      <div className="pre-heading">
        <FaBolt /> ACADEMIC EXCELLENCE HUB
      </div>

      {/* Heading */}
      <h1 className="main-heading">
        Elevate Your Learning <br />
        <span className="yellow-highlight">Beyond Excellence.</span>
      </h1>

      {/* Description */}
      <p className="description">
        Access our curated library of premium courses, specifically engineered
        to help you conquer competitive exams with confidence.
      </p>

      {/* Features */}
      <div className="features">
        <span><FaBullseye /> Exam Focused</span>
        <span><FaBolt /> Live Classes</span>
        <span><FaStar /> Expert Curated</span>
      </div>

      {/* Search + Filter */}
      <div className="search-filter">
        {/* LEFT */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search courses or exams..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* RIGHT */}
        <div className="filters">
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
            {uniqueExams.map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>

          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="All Types">All Types</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* COURSES GRID */}
      {loading ? (
        <div className="courses-loading" style={{ color: "var(--text-secondary)", marginTop: "40px" }}>
          Loading courses...
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => {
            const hasImage = !!course.image;
            const imageUrl = hasImage 
              ? (course.image.startsWith("http") ? course.image : `http://localhost:5000${course.image}`) 
              : "";
            
            return (
              <div key={course._id || course.id} className="course-card">
                {/* Image Area with Gradient or Uploaded Banner */}
                <div 
                  className="course-image-area" 
                  style={{ 
                    background: hasImage ? `url(${imageUrl}) center/cover no-repeat` : course.gradient 
                  }}
                >
                  <div className="card-top-badges">
                    <span className={`badge-pricing ${course.type ? course.type.toLowerCase() : "paid"}`}>
                      {course.badgeText || (course.isFree ? "FREE" : "PAID")}
                    </span>
                    <span className="badge-category">{course.tagText || course.exam}</span>
                  </div>
                  {!hasImage && <div className="course-image-title">{course.title}</div>}
                </div>

                {/* Course Info Body */}
                <div className="course-card-body">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.subtitle}</p>

                  {/* Course Meta Info */}
                  <div className="course-stats">
                    <div className="stat-item">
                      <FaUsers />
                      <span>{course.students || "1.2k+"}</span>
                    </div>
                    <div className="stat-item">
                      <FaStar className="star-filled" />
                      <span>{course.rating || "4.9"}</span>
                    </div>
                    <div className="stat-item">
                      <FaClock />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Footer details */}
                  <div className="course-card-footer">
                    <div className="price-info">
                      {course.isFree ? (
                        <span className="free-price-text">FREE</span>
                      ) : (
                        <>
                          <span className="price-label">STARTING FROM</span>
                          <span className="price-value">₹{course.price || "1999"}</span>
                        </>
                      )}
                    </div>
                    <button className="explore-btn" onClick={() => handleExplore(course)}>
                      Explore <span className="arrow-sym">&gt;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-courses">
          <h2 className="no-courses-heading">No courses found</h2>
          <p className="no-courses-text">
            Try adjusting your search or filters to find what you are looking for.
          </p>
          <button className="reset-btn" onClick={handleReset}>Reset Filter</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREMIUM COURSE EXPLORER MODAL */}
      {/* ========================================================================= */}
      {selectedExploreCourse && courseDetails && (
        <div className="course-explorer-overlay" onClick={handleCloseModal}>
          <div className="course-explorer-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header Banner */}
            <div 
              className="explorer-banner"
              style={{
                background: selectedExploreCourse.image 
                  ? `url(${selectedExploreCourse.image.startsWith("http") ? selectedExploreCourse.image : `http://localhost:5000${selectedExploreCourse.image}`}) center/cover no-repeat` 
                  : selectedExploreCourse.gradient || "linear-gradient(135deg, #1e1b4b, #311042)"
              }}
            >
              <div className="explorer-banner-overlay"></div>
              
              <button className="explorer-close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>

              <div className="explorer-banner-content">
                <span className="explorer-badge-exam">{selectedExploreCourse.exam}</span>
                <h2 className="explorer-course-title">{selectedExploreCourse.title}</h2>
                <p className="explorer-course-subtitle">{selectedExploreCourse.subtitle}</p>
                
                <div className="explorer-banner-meta">
                  <span className="meta-item"><FaUsers /> {selectedExploreCourse.students || "1.2k+"} Students</span>
                  <span className="meta-item"><FaStar style={{ color: "#facc15" }} /> {selectedExploreCourse.rating || "4.9"} Rating</span>
                  <span className="meta-item"><FaClock /> {selectedExploreCourse.duration}</span>
                </div>
              </div>
            </div>

            {/* Modal Content Columns */}
            <div className="explorer-body">
              
              {/* Left Column - Navigation and Interactive Content */}
              <div className="explorer-main">
                
                {/* Tabs Navigator */}
                <div className="explorer-tabs">
                  <button 
                    className={`explorer-tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
                    onClick={() => setActiveTab("curriculum")}
                  >
                    Syllabus
                  </button>
                  <button 
                    className={`explorer-tab-btn ${activeTab === "videos" ? "active" : ""}`}
                    onClick={() => setActiveTab("videos")}
                  >
                    Mock Videos ({courseDetails.videos.length})
                  </button>
                  <button 
                    className={`explorer-tab-btn ${activeTab === "details" ? "active" : ""}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Overview & Highlights
                  </button>
                </div>

                {/* Tab Panel Content */}
                <div className="explorer-tab-panel">
                  
                  {/* Tab 1: Curriculum Syllabus */}
                  {activeTab === "curriculum" && (
                    <div className="panel-curriculum">
                      <p className="panel-intro-text">
                        Browse through the planned lessons, reference notes, and study blueprints configured for this course.
                      </p>
                      
                      <div className="syllabus-accordions">
                        {courseDetails.sections.map((section, idx) => {
                          const isExpanded = !!expandedSections[idx];
                          return (
                            <div key={idx} className={`syllabus-section-card ${isExpanded ? "expanded" : ""}`}>
                              <div className="section-header" onClick={() => toggleSection(idx)}>
                                <span className="section-title">{section.title}</span>
                                <span className="section-count-tag">{section.items.length} items</span>
                                <span className="section-arrow-icon">
                                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                              </div>

                              {isExpanded && (
                                <div className="section-body-items">
                                  {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="syllabus-item-row">
                                      <div className="item-row-left">
                                        {item.type === "video" ? (
                                          <FaVideo className="item-icon-video" />
                                        ) : (
                                          <FaFileAlt className="item-icon-doc" />
                                        )}
                                        <span className="item-title">{item.title}</span>
                                      </div>
                                      
                                      <div className="item-row-right">
                                        <span className="item-meta">{item.duration || item.size}</span>
                                        {selectedExploreCourse.isFree || (selectedExploreCourse.type && selectedExploreCourse.type.toLowerCase() === "free") || isPremiumUser ? (
                                          <span className="item-badge-unlocked text-green">Preview Available</span>
                                        ) : (
                                          <FaLock className="item-lock-icon" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Simulated & Interactive Video Preview Player */}
                  {activeTab === "videos" && (
                    <div className="panel-videos">
                      
                      {/* Interactive Video Player */}
                      <div className="video-player-frame">
                        {playingVideoUrl ? (
                          <div className="video-embed-container">
                            <iframe 
                              src={playingVideoUrl} 
                              title={playingVideoTitle}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="html5-video-player"
                              style={{ border: 'none' }}
                            ></iframe>
                            <div className="video-title-bar">
                              <span>{playingVideoTitle}</span>
                              <button className="stop-video-btn" onClick={() => {
                                setPlayingVideoUrl(null);
                                setIsPlaying(false);
                              }}>
                                Close Player
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="video-player-placeholder"
                            style={{ 
                              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.85)), url(${courseDetails.videos[0]?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"})`
                            }}
                          >
                            <button 
                              className="pulsing-play-button"
                              onClick={() => playVideo(courseDetails.videos[0])}
                            >
                              <FaPlay />
                            </button>
                            <span className="placeholder-video-title">
                              Watch Intro: {courseDetails.videos[0]?.title}
                            </span>
                            <span className="placeholder-duration">
                              Duration: {courseDetails.videos[0]?.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Playlist */}
                      <h4 className="playlist-heading">Course Preview & Sample Lectures</h4>
                      <div className="video-playlist-list">
                        {courseDetails.videos.map((vid, vidIdx) => {
                          const isCurrent = playingVideoTitle === vid.title;
                          return (
                            <div 
                              key={vidIdx} 
                              className={`playlist-item-card ${isCurrent ? "playing" : ""}`}
                              onClick={() => playVideo(vid)}
                            >
                              <div className="playlist-item-thumb" style={{ backgroundImage: `url(${vid.thumbnail})` }}>
                                <div className="thumb-play-overlay">
                                  <FaPlay />
                                </div>
                              </div>
                              <div className="playlist-item-details">
                                <span className="playlist-item-title">{vid.title}</span>
                                <span className="playlist-item-duration"><FaClock /> {vid.duration}</span>
                              </div>
                              <button className="playlist-play-btn">
                                {isCurrent ? "Playing" : "Watch"}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* Tab 3: Detailed Highlights */}
                  {activeTab === "details" && (
                    <div className="panel-details">
                      <div className="details-overview-section">
                        <h4>Course Overview</h4>
                        <p>{courseDetails.overview}</p>
                      </div>
                      
                      <div className="details-highlights-section">
                        <h4>What you'll get in this program</h4>
                        <div className="highlights-grid">
                          {courseDetails.highlights.map((hl, hlIdx) => (
                            <div key={hlIdx} className="highlight-item-bullet">
                              <FaCheckCircle className="highlight-bullet-icon" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="details-trust-section">
                        <div className="trust-card">
                          <FaGlobe className="trust-card-icon" />
                          <div>
                            <h5>Learn Anywhere</h5>
                            <p>Access classes via laptop, tablet, or smartphone anytime, anywhere.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Right Column - Premium Enrollment Card */}
              <div className="explorer-sidebar">
                <div className="enroll-card">
                  <span className={`enroll-card-badge ${selectedExploreCourse.isFree || (selectedExploreCourse.type && selectedExploreCourse.type.toLowerCase() === "free") ? "free" : "premium"}`}>
                    {selectedExploreCourse.isFree || (selectedExploreCourse.type && selectedExploreCourse.type.toLowerCase() === "free") ? "FREE COURSE" : "PREMIUM COURSE"}
                  </span>
                  
                  <div className="enroll-card-pricing">
                    {selectedExploreCourse.isFree || (selectedExploreCourse.type && selectedExploreCourse.type.toLowerCase() === "free") ? (
                      <span className="price-free">FREE</span>
                    ) : (
                      <>
                        <div className="price-tag-row">
                          <span className="price-amount">₹{selectedExploreCourse.price || "1999"}</span>
                          <span className="price-crossed">₹4,999</span>
                        </div>
                        <span className="price-subtext">Lifetime updates included</span>
                      </>
                    )}
                  </div>

                  <div className="enroll-features-list">
                    <div className="feat-line"><FaCheckCircle className="feat-check" /> Full Syllabus Coverage</div>
                    <div className="feat-line"><FaCheckCircle className="feat-check" /> Doubt Clearing Support</div>
                    <div className="feat-line"><FaCheckCircle className="feat-check" /> PDFs & Reference Slides</div>
                    <div className="feat-line"><FaCheckCircle className="feat-check" /> Desktop & Mobile Access</div>
                  </div>

                  {/* Main Call to Action */}
                  <button 
                    className="enroll-cta-button"
                    onClick={() => handleEnrollClick(selectedExploreCourse)}
                  >
                    {!user ? (
                      "Log In to Enroll"
                    ) : (selectedExploreCourse.isFree || (selectedExploreCourse.type && selectedExploreCourse.type.toLowerCase() === "free")) ? (
                      "Start Learning (Free)"
                    ) : isPremiumUser ? (
                      "Start Learning (Unlocked)"
                    ) : (
                      "Unlock with Premium Plan"
                    )}
                  </button>

                  <p className="enroll-card-disclaimer">
                    {!user ? (
                      "Create or sign in to your account to track study progress."
                    ) : (selectedExploreCourse.isFree || (selectedExploreCourse.type && selectedExploreCourse.type.toLowerCase() === "free")) ? (
                      "This course is completely free for registered students."
                    ) : isPremiumUser ? (
                      "Your Premium Membership has unlocked this course. Happy learning!"
                    ) : (
                      "Get this course and all other test series by purchasing our 6/12 month premium plans."
                    )}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default Courses;