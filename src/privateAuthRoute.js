import { Navigate } from 'react-router-dom';

// Private route to protect authentication routes
const PrivateAuthRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token is stored in localStorage
  const userRole = localStorage.getItem('role'); // Retrieve the user's role

  // Check if user is logged in and has the admin role
  if (!token || userRole !== 'admin') {
    return <Navigate to="/auth/sign-in" replace />; // Redirect to login if not authorized
  }

  return children; // Allow access to signup if authenticated as admin
};

export default PrivateAuthRoute;
