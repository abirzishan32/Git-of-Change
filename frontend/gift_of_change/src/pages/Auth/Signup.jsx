import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();

    if(!name) {
      setError('Name is required');
      return;
    }


    if(!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }


    if(!password) {
      setError('Password is required');
      return;
    }


    setError("");
    setLoading(true);

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
        ...(adminInviteToken ? { adminInviteToken } : {})
      });

      const {token, role} = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);

        if(role === "admin"){
          navigate("/admin/dashboard");
        }
        else{
          navigate("/home");
        }
      }
        

    }
    catch(error){
      console.error("Registration error:", error);
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("An unexpected error occurred. Please check your connection and try again.");
      }
    }
    finally {
      setLoading(false);
    }
 
  }
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Create an account
        </h3>
        <p className="text-gray-400 mb-8">
          Join us today and be part of the change
        </p>

        <form onSubmit={handleSignup} className="w-full max-w-md flex flex-col gap-2">
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
            placeholder="John Doe"
            type="text"
            required
          />
          
          <Input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="johndoe@gmail.com"
            type="email"
            required
          />
          
          <Input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Create a strong password"
            type="password"
            required
          />
          
          <Input 
            value={adminInviteToken}
            onChange={(e) => setAdminInviteToken(e.target.value)}
            label="Admin Invite Token"
            placeholder="Optional - for admin registration"
            type="password"
          />

          {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium mt-6 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          
          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-purple-500 font-medium hover:text-purple-400 transition-all duration-300">Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
};

export default Signup;