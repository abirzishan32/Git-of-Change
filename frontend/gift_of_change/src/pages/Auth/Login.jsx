import React from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
  }


  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold text-black"> Welcome to Gift of Change </h3>
        <p className="text-sm text-gray-500"> Please enter your details to login </p>

        <form onSubmit={handleLogin} className="w-full max-w-md mt-8">
          <Input
            value={email}
            onChange={(target) => setEmail(target.value)}
            label="Email"
            placeholder="johndoe@gmail.com"
            type="text"
            required
          />

          <Input
            value={password}
            onChange={(target) => setPassword(target.value)}
            label="Password"
            placeholder="Minimum 8 characters"
            type="password"
            required
          />

          <button type="submit" className="btn-primary"> Login </button>

          <p className="text-sm text-gray-500"> New to Gift of Change? <Link to="/signup" className="text-purple-600 font-medium hover:text-purple-700 transition-all duration-300"> Sign up </Link> </p>

        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;