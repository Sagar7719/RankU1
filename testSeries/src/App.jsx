import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MainLayout from "./layout/MainLayout";
import Updates from "./pages/Updates/Updates";
import Exam from "./pages/Exam/Exam";
import Rewards from "./pages/Rewards/Rewards";


function App() {
  return (

    <Routes>

      {/* Layout Wrapper */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/exam" element={<Exam />} /> 
        <Route path="/rewards" element={<Rewards />} />

      </Route>

    </Routes>

  );
}

export default App;
