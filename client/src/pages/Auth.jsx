// 1. ADD useLocation to the import
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Grab the location

  // 3. Set default state based on what button was clicked in the Navbar
  // (If nothing was passed, default to true/Login)
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);

  // 4. Just in case they click "Sign Up" while already sitting on the Login page
  useEffect(() => {
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Success! Pass the token and user to our global state
      login(data.token, data.user);
      
      // Send them to the main dashboard
      navigate('/'); 

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* This is where your beautiful dark glass CSS comes in! */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '15px', width: '350px' }}>
        <h2 style={{ textAlign: 'center', color: 'white' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          
          {!isLogin && (
            <input 
              type="text" name="name" placeholder="Display Name" 
              value={formData.name} onChange={handleChange} required 
              className="glass-input"
            />
          )}

          <input 
            type="email" name="email" placeholder="Email Address" 
            value={formData.email} onChange={handleChange} required 
            className="glass-input"
          />

          <input 
            type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} required 
            className="glass-input"
          />

          <button type="submit" className="glass-button" style={{ marginTop: '1rem', padding: '0.8rem', cursor: 'pointer' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: '#4da6ff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;