import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import PrivateAdminRoute from './privetAdminRoute';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import SignUp from 'views/auth/signUp';
import SignIn from 'views/auth/signIn';
import NotFound from './views/NotFound';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Check if in development mode
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('role'); 
  //   }
  // }, []);

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/sign-up" element={
          <PrivateAdminRoute>
            <SignUp />
          </PrivateAdminRoute>
        } />
        <Route path="/*" element={<SignIn />} />
        <Route path="admin/*" element={
          <PrivateAdminRoute>
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          </PrivateAdminRoute>
        } />
        <Route path="rtl/*" element={
          <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
        } />
        <Route path="/" element={isAuthenticated ? <Navigate to="/admin" replace /> : <Navigate to="/auth/sign-In" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ChakraProvider>
  );
}
