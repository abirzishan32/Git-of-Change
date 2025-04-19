import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);
  
  // If still loading, show a loading state or outlet
  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="animate-pulse text-purple-500 text-xl">Loading...</div>
    </div>;
  }
  
  // If no user or token, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has the required role
  if (allowedRoles && allowedRoles.includes(user.role)) {
    return <Outlet />;
  }
  
  // Redirect based on role if they don't have permission
  return user.role === 'admin' 
    ? <Navigate to="/admin/dashboard" /> 
    : <Navigate to="/user/dashboard" />;
};

export default PrivateRoute;