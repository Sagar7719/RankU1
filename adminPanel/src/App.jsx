import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/Auth/AdminLogin'
import DashboardOverview from './pages/Dashboard/DashboardOverview'
import TestManager from './pages/Tests/TestManager'
import ExamManager from './pages/Exams/ExamManager'
import QuestionEditor from './pages/Questions/QuestionEditor'
import Settings from './pages/Settings/Settings'
import UserManager from './pages/Users/UserManager'
import ForgotPassword from './pages/Auth/ForgotPassword'
import TestResults from './pages/Tests/TestResults'
import CourseManager from './pages/Courses/CourseManager'
import UpdatesManager from './pages/Updates/UpdatesManager'
import CategoryManager from './pages/Categories/CategoryManager'
import RevenueManager from './pages/Revenue/RevenueManager'
import PlanManager from './pages/Plans/PlanManager'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

function App() {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return (
    <div className={isAuthenticated ? "admin-layout" : ""}>
      
      {isAuthenticated && <Sidebar />}

      <main className={isAuthenticated ? "main-content" : ""}>
        {isAuthenticated && <Topbar />}
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={isAuthenticated ? <DashboardOverview /> : <Navigate to="/login" />} />
          <Route path="/exams" element={isAuthenticated ? <ExamManager /> : <Navigate to="/login" />} />
          <Route path="/series" element={isAuthenticated ? <TestManager /> : <Navigate to="/login" />} />
          <Route path="/questions/:testId" element={isAuthenticated ? <QuestionEditor /> : <Navigate to="/login" />} />
          <Route path="/test-results" element={isAuthenticated ? <TestResults /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <UserManager /> : <Navigate to="/login" />} />
          <Route path="/courses" element={isAuthenticated ? <CourseManager /> : <Navigate to="/login" />} />
          <Route path="/categories" element={isAuthenticated ? <CategoryManager /> : <Navigate to="/login" />} />
          <Route path="/revenue" element={isAuthenticated ? <RevenueManager /> : <Navigate to="/login" />} />
          <Route path="/plans" element={isAuthenticated ? <PlanManager /> : <Navigate to="/login" />} />
          <Route path="/updates" element={isAuthenticated ? <UpdatesManager /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
      </main>

    </div>
  )
}

export default App
