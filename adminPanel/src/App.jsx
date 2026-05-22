import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import DashboardOverview from './pages/DashboardOverview'
import TestManager from './pages/TestManager'
import ExamManager from './pages/ExamManager'
import QuestionEditor from './pages/QuestionEditor'
import Settings from './pages/Settings'
import UserManager from './pages/UserManager'
import ForgotPassword from './pages/ForgotPassword'
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
          <Route path="/users" element={isAuthenticated ? <UserManager /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
      </main>

    </div>
  )
}

export default App
