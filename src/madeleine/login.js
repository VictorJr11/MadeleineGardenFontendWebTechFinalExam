import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from './services/UserService';
import { 
  LockOutlined, 
  UserOutlined, 
  MailOutlined, 
  EyeInvisibleOutlined, 
  EyeOutlined 
} from '@ant-design/icons';

const LoginPage = () => {
  const navigate = useNavigate();
  const [currentForm, setCurrentForm] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    resetToken: '',
    newPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await UserService.loginUser(loginData.username, loginData.password);
      setSuccessMessage('Login successful');
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.response?.data || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await UserService.registerUser(registerData);
      setSuccessMessage('Registration successful. Please login.');
      setCurrentForm('login');
    } catch (error) {
      setErrorMessage(error.response?.data || 'Registration failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await UserService.forgotPassword(forgotPasswordData.email);
      setSuccessMessage('Reset code sent');
      setCurrentForm('resetPassword');
      setResetPasswordData(prev => ({ ...prev, email: forgotPasswordData.email }));
    } catch (error) {
      setErrorMessage(error.response?.data || 'Failed to send reset code');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await UserService.resetPassword(resetPasswordData);
      setSuccessMessage('Password reset successful');
      setCurrentForm('login');
    } catch (error) {
      setErrorMessage(error.response?.data || 'Password reset failed');
    }
  };

  const FormWrapper = ({ children, title }) => (
    <div className="relative w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src="./imagesMg/Family/e28.jpeg" 
          alt="Madeleine Garden Logo" 
          className="w-32 h-32 object-contain mb-4 animate-bounce"
        />
      </div>

      <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4 border-2 border-green-600 transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700 animate-pulse">
          {title}
        </h2>
        
        {children}
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <FormWrapper title="Madeleine Garden Login">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <UserOutlined className="mx-3 text-green-600" />
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange(setLoginData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <LockOutlined className="mx-3 text-green-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleInputChange(setLoginData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="mx-3 text-green-600 hover:text-green-800 focus:outline-none"
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Login
          </button>
          
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={() => setCurrentForm('forgotPassword')}
              className="text-green-600 hover:text-green-800 text-sm hover:underline"
            >
              Forgot Password?
            </button>
            <button 
              type="button"
              onClick={() => setCurrentForm('register')}
              className="text-green-600 hover:text-green-800 text-sm hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );

  const renderRegisterForm = () => (
    <FormWrapper title="Create Account">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <UserOutlined className="mx-3 text-green-600" />
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleInputChange(setRegisterData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Choose a username"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <MailOutlined className="mx-3 text-green-600" />
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleInputChange(setRegisterData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <LockOutlined className="mx-3 text-green-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={registerData.password}
              onChange={handleInputChange(setRegisterData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Create a strong password"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="mx-3 text-green-600 hover:text-green-800 focus:outline-none"
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Register
          </button>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => setCurrentForm('login')}
              className="text-green-600 hover:text-green-800 text-sm hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );

  const renderForgotPasswordForm = () => (
    <FormWrapper title="Forgot Password">
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <MailOutlined className="mx-3 text-green-600" />
            <input
              type="email"
              name="email"
              value={forgotPasswordData.email}
              onChange={handleInputChange(setForgotPasswordData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Send Reset Code
          </button>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => setCurrentForm('login')}
              className="text-green-600 hover:text-green-800 text-sm hover:underline"
            >
              Remember your password? Login
            </button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );

  const renderResetPasswordForm = () => (
    <FormWrapper title="Reset Password">
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Reset Code
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <LockOutlined className="mx-3 text-green-600" />
            <input
              type="text"
              name="resetToken"
              value={resetPasswordData.resetToken}
              onChange={handleInputChange(setResetPasswordData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter reset code"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <div className="flex items-center border-2 border-green-500 rounded-lg hover:border-green-700 transition duration-300">
            <LockOutlined className="mx-3 text-green-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={resetPasswordData.newPassword}
              onChange={handleInputChange(setResetPasswordData)}
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter new password"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="mx-3 text-green-600 hover:text-green-800 focus:outline-none"
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Reset Password
          </button>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => setCurrentForm('login')}
              className="text-green-600 hover:text-green-800 text-sm hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </form>
    </FormWrapper>
  );


  return (
  <div 
    className="min-h-screen flex items-center justify-center bg-green-50 p-4"
    style={{
      backgroundImage: 'url("https://source.unsplash.com/1600x900/?garden,nature")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay'
    }}
  >
    <div className="w-full flex justify-center">
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          {successMessage}
        </div>
      )}

      {currentForm === 'login' && renderLoginForm()}
      {currentForm === 'register' && renderRegisterForm()}
      {currentForm === 'forgotPassword' && renderForgotPasswordForm()}
      {currentForm === 'resetPassword' && renderResetPasswordForm()}
    </div>
  </div>
);
};

export default LoginPage;