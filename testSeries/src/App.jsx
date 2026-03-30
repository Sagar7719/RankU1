import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ScrollToTop from "./components/ScrollToTop";

// PAGES
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Exams from "./pages/Exams/Exams";
import Courses from "./pages/Courses/Courses";
import CurrentAffairs from "./pages/CurrentAffairs/CurrentAffairs";
import TestSeries from "./pages/TestSeries/TestSeries";
import Updates from "./pages/Updates/Updates";
import Plans from "./pages/Plans/Plans";
import Rewards from "./pages/Rewards/Rewards";

function App() {
  return (
    <>
      {/* 🔥 THIS WAS MISSING */}
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exam" element={<Exams />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/test-series" element={<TestSeries />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/rewards" element={<Rewards />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;