import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MainLayout from "./layout/MainLayout";

function App() {
  return (

    <Routes>

      {/* Layout Wrapper */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Route>

    </Routes>

  );
}

export default App;