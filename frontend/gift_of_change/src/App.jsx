import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Admin/Dashboard';
import UserDashboard from './pages/User/UserDashboard';
import MyDonations from './pages/User/MyDonations';



const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          {/* ADMIN ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>

          {/* USER ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/user-dashboard" element={<UserDashboard />} />
            <Route path="/user/my-donations" element={<MyDonations />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;