import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/Courses/Courses";
import CurrentAffairs from "./pages/CurrentAffairs/CurrentAffairs";
import NewsPage from "./pages/CurrentAffairs/NewsPage/NewsPage";
import Plans from "./pages/Plans/Plans";



function App() {
  return (
    // <BrowserRouter>

    <Routes>

      {/* Layout Wrapper */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/plans" element={<Plans />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/current-affairs" element={<CurrentAffairs />} /> 
        <Route path="/news-page" element={<NewsPage />} /> 
        </Route>
    </Routes>
    // </BrowserRouter>
    );
}

export default App;