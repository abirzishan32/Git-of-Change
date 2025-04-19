import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }


    if(!password) {
      setError('Password is required');
      return;
    }


    setError("");

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const {token, role} = response.data;

      if(token){
        localStorage.setItem("token", token);

        if(role === "admin"){
          navigate("/admin/dashboard");
        }
        else{
          navigate("/user/dashboard");
        }
      }

    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("An unexpected error occurred");
      }
    }
 
  }


  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
        <p className="text-gray-400 mb-8">Sign in to continue your journey</p>

        <form onSubmit={handleLogin} className="w-full max-w-md">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="johndoe@gmail.com"
            type="text"
            required
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
            required
          />

          {error && <p className="text-red-500 text-sm mt-2 mb-4">{error}</p>}

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium mt-6 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"> 
            Login 
          </button>

          <p className="text-sm text-gray-400 mt-6 text-center">
            New to Gift of Change? <Link to="/register" className="text-purple-500 font-medium hover:text-purple-400 transition-all duration-300">Sign up</Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;