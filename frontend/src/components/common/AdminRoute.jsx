import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "./Spinner";

// Like ProtectedRoute, but also requires user.isAdmin — sends non-admins
// back to the dashboard rather than letting them reach the admin panel.
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner label="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
