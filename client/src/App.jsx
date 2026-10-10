import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Movies from "./pages/Movies";
import ProtectedRoute from "./components/ProtectedRoute";
import MovieDetails from "./components/MovieDetails";
import MyCollection from "./pages/MyCollection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/movie/:id"
        element={
          <ProtectedRoute>
            <MovieDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-collection"
        element={
          <ProtectedRoute>
            <MyCollection />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
