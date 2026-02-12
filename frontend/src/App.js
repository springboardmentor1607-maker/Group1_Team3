import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProtectedRoute from "./component/ProtectedRoute.js";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
        
        <Route path="/dashboard" element = {
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
