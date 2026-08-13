import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './Login.css';
import agriLogo from './logo.png';
import { AuthContext } from '../../context/AuthContext';
import { decodeRoleFromToken, decodeIdFromToken } from '../../utils/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const savedRemember = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && savedPassword && savedRemember) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Enter a valid email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleLoginSuccess = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const userId = decodeIdFromToken(token);
      // const userId = '6806fbf298e9914ea6554bf3'
      // const userId = decoded.id || decoded._id; // Ensure correct field
      console.log('Decoded token:', decoded);
      // Save userId and token
      localStorage.setItem('token', token);
      localStorage.setItem('uId', userId);
      console.log(localStorage.getItem('uId')); 
      
      login(token, rememberMe);

      if (rememberMe) {
        localStorage.setItem('savedEmail', formData.email);
        localStorage.setItem('savedPassword', formData.password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
        localStorage.removeItem('rememberMe');
      }

      const role = decodeRoleFromToken(token);
      setMessage("Welcome back! Redirecting...");
      setTimeout(() => {
        if (role === 'Admin') navigate('/admin');
        else if (role === 'User') navigate('/user');
        else setMessage("Login successful, but role is invalid.");
      }, 500);
    } catch (decodeErr) {
      console.error('Error decoding token:', decodeErr);
      setMessage("Failed to decode token.");
    }
  }, [formData.email, formData.password, rememberMe, login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(
        'https://agri-products.onrender.com/api/auth/login',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const token = res.data.token;
      handleLoginSuccess(token);
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decodedGoogle = jwtDecode(credentialResponse?.credential);
      const { email, name } = decodedGoogle;

      const res = await axios.post(
        'https://agri-products.onrender.com/api/auth/google-login',
        { email, name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const token = res.data.token;
      handleLoginSuccess(token);
    } catch (err) {
      console.error("Google login failed:", err);
      setMessage("Google login failed. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={agriLogo} alt="Agri Products Logo" className="login-logo" />
        <h1>Welcome to Agri-Products</h1>
        <p>Real-Time Bidding & Quality Assurance at Your Fingertips</p>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="input-box">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Email Address</label>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-box">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Password</label>
            <span
              className="toggle-eye"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="extras">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(prev => !prev)}
              />
              Remember Me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="info-text">
            <p>Or sign in with Google</p>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMessage("Google Login Failed")}
            />
          </div>

          {message && <p className="info-text">{message}</p>}

          <div className="signup-link">
            Don’t have an account? <a href="/signup">Sign up here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
