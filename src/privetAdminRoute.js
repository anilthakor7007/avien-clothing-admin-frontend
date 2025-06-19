import { Navigate } from 'react-router-dom';

// Private route to protect admin routes
const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Assume token is stored in localStorage
  const userRole = localStorage.getItem('role'); // Retrieve the user's role

  // Check if user is logged in and has the admin role
  if (!token || userRole !== 'admin') {
    return <Navigate to="/auth/sign-in" replace />; // Redirect to login if not authorized
  }

  return children; // Allow access if authenticated and has admin role
};

export default PrivateAdminRoute;
