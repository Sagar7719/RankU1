import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// PAGES
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Settings from "./pages/Login/Settings";
import Register from "./pages/Register/Register";
import Exams from "./pages/Exams/Exams";
import Courses from "./pages/Courses/Courses";
import CurrentAffairs from "./pages/CurrentAffairs/CurrentAffairs";
import NewsPage from "./pages/CurrentAffairs/NewsPage/NewsPage";
import TestSeries from "./pages/TestSeries/TestSeries";
import TestSeriesDetail from "./pages/TestSeries/TestSeriesDetail";
import Updates from "./pages/Updates/Updates";
import Plans from "./pages/Plans/Plans";
import Rewards from "./pages/Rewards/Rewards";

// EXAM ENGINE
import InterfaceSelection from "./pages/ExamEngine/InterfaceSelection";
import PreTestInstructions from "./pages/ExamEngine/PreTestInstructions";
import ExamEngine from "./pages/ExamEngine/ExamEngine";
import ResultReport from "./pages/ExamEngine/ResultReport";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollToTop />

        <Routes>
          <Route element={<MainLayout />}>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/register" element={<Register />} />
            <Route path="/exam" element={<Exams />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/current-affairs" element={<CurrentAffairs />} />
            <Route path="/news-page/:id" element={<NewsPage />} />
            <Route path="/test-series" element={<TestSeries />} />
            <Route path="/test-series-detail/:id" element={<TestSeriesDetail />} />
            <Route path="/interface-selection/:testId" element={<InterfaceSelection />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Route>

          {/* Exam Engine Routes (No Header/Footer) */}
          <Route path="/test-instructions/:testId" element={<PreTestInstructions />} />
          <Route path="/take-test/:testId" element={<ExamEngine />} />
          <Route path="/result/:testId" element={<ResultReport />} />

        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;