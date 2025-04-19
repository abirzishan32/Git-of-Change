import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Admin/Dashboard';
import UserDashboard from './pages/User/UserDashboard';
import MyDonations from './pages/User/MyDonations';
import Home from './pages/home';
import DonateForm from './pages/DonateForm';
import { UserContext, UserProvider } from './context/userContext';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';


const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading){
    return <Outlet />
  }

  if (!user){
    return <Navigate to="/login" />
  }  

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/home" />
}

const App = () => {
  return (
    <UserProvider>
      <div className="min-h-screen bg-black">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            
            {/* Donation Routes */}
            <Route path="/donate/:domainId" element={<DonateForm />} />
            <Route path="/donate" element={<DonateForm />} />

            {/* ADMIN ROUTES */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Route>

            {/* USER ROUTES */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/user-dashboard" element={<UserDashboard />} />
              <Route path="/user/my-donations" element={<MyDonations />} />
            </Route>

            {/* DEFAULT ROUTES */}
            <Route path="/" element={<Root/>} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;