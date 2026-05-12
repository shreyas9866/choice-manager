import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  // --- MOCK AUTH STATE ---
  // We will replace this with real backend authentication later
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navStyle = {
    backgroundColor: 'var(--primary-teal)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const logoStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#333'
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center', // Ensures buttons and text align perfectly vertically
    fontWeight: '600'
  };

  const authButtonStyle = {
    backgroundColor: 'var(--accent-coral)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'opacity 0.2s'
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <Link to="/">RL Choices</Link>
      </div>
      
      <div style={linkContainerStyle}>
        <Link to="/">Home</Link>
        <Link to="/history">History</Link>
        <Link to="/about">About Us</Link>
        
        {/* --- AUTHENTICATION UI --- */}
        {isLoggedIn ? (
          // IF LOGGED IN: Show Account Info & Logout
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
            <span style={{ color: '#333' }}>👤 My Account</span>
            <button 
              onClick={() => setIsLoggedIn(false)} 
              style={{...authButtonStyle, backgroundColor: '#333'}}
            >
              Logout
            </button>
          </div>
        ) : (
          // IF LOGGED OUT: Show Login/Sign Up
          <div style={{ borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
            <button 
              onClick={() => setIsLoggedIn(true)} 
              style={authButtonStyle}
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}