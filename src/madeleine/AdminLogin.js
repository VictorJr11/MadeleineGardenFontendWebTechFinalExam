import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is correctly imported
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Using axios for better error handling and configuration
      const response = await axios.post('http://localhost:8083/api/admins/login', 
        { 
          email, 
          password 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      // Check the response status
      if (response.status === 200) {
        // If login is successful
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'ADMIN');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error', error);
      
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data?.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
      
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
    }
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="bg-white shadow-md rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-primary">Admin Login</h2>
              
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="email" 
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="mb-6">
                  <label 
                    htmlFor="password" 
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;