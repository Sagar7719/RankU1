import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// Website Pages
import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import CurrentAffairs from "./pages/CurrentAffairs/CurrentAffairs";
import Plans from "./pages/Plans/Plans";
import NewsPage from "./pages/CurrentAffairs/NewsPage/NewsPage";
import Login from "./pages/Login/Login";


// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Dashboard/Analytics/Analytics";
import Library from "./pages/Dashboard/Library/Library";
import Overview from "./pages/Dashboard/Overview/Overview";
import SavedQuestions from "./pages/Dashboard/SavedQuestions/SavedQuestions";


function App() {
  return (
    <Routes>

      {/* WEBSITE */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/current-affairs" element={<CurrentAffairs />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/news-page" element={<NewsPage />} />
         <Route path="/login" element={<Login />} />
      {/* </Route> */}

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<Dashboard />}>
      <Route index element={<Overview />} />
        {/* <Route index element={<Library />} />   default page */}
        <Route path="analytics" element={<Analytics />} />
        <Route path="library" element={<Library />} />
        <Route path="saved-questions" element={<SavedQuestions />} />

      </Route>
      </Route>

    </Routes>
  );
}

export default App;