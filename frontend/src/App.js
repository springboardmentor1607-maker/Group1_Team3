import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ProtectedRoute from "./component/ProtectedRoute.js";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/profile";
import ReportIssue from "./Pages/ReportIssue.jsx";
import Chatbot from "./components/Chatbot";
import ViewComplaints from "./Pages/ViewComplaints";
import ComplaintDetails from "./Pages/ComplaintsDetails";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import { Navigate } from "react-router-dom";



function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/dashboard",
    "/admin-dashboard"
  ];

  const hideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );
  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        
        <Route path="/dashboard" element = {
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportissue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW ROUTES ADDED BELOW */}

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <ViewComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/admin-dashboard" element= {<ProtectedRoute>
          <AdminDashboard/>
          </ProtectedRoute>}/>

          <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <Chatbot />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;