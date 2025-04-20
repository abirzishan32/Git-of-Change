import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const Navbar = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearUser();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
            <h1 className="text-xl font-semibold text-green-800 tracking-wide"> 
              <span className="text-green-600">Gift</span> of <span className="text-green-600">Change</span> 
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;