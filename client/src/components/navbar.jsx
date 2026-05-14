import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// IMPORT OUR NEW GLOBAL BRAIN
import { AuthContext } from '../context/AuthContext'; 

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // GRAB THE USER AND LOGOUT FUNCTION FROM CONTEXT
  const { user, logout } = useContext(AuthContext);

  let activeIndex = 0;
  if (location.pathname === '/history') activeIndex = 1;
  else if (location.pathname === '/about') activeIndex = 2;

  const BUTTON_WIDTH = 110; 
  const GAP = 8; 

  const styles = {
    navBox: {
      backgroundColor: 'rgba(15, 23, 42, 0.65)', 
      backdropFilter: 'blur(16px)', 
      WebkitBackdropFilter: 'blur(16px)', 
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)', 
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    leftSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start'
    },
    centerSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '1rem'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#f8fafc', 
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
    },
    linkContainer: {
      display: 'flex',
      position: 'relative',
      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      padding: '6px',
      borderRadius: '16px',
      gap: `${GAP}px`,
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    slidingPill: {
      position: 'absolute',
      top: '6px',
      bottom: '6px',
      width: `${BUTTON_WIDTH}px`,
      transform: `translateX(${activeIndex * (BUTTON_WIDTH + GAP)}px)`,
      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', 
      borderRadius: '12px',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', 
      zIndex: 1, 
    },
    link: (isActive) => ({
      textDecoration: 'none',
      width: `${BUTTON_WIDTH}px`,
      textAlign: 'center',
      padding: '0.6rem 0',
      fontWeight: 'bold',
      fontSize: '1rem',
      color: isActive ? 'white' : '#94a3b8', 
      transition: 'color 0.4s ease',
      position: 'relative',
      zIndex: 2, 
    }),
    donateBtn: {
      backgroundColor: '#ff4d4f', 
      color: 'white',
      border: 'none',
      padding: '0.5rem 1.2rem',
      borderRadius: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      boxShadow: '0 4px 15px rgba(255, 77, 79, 0.4)',
      transition: 'all 0.2s ease',
    },
    loginBtn: {
      background: 'transparent',
      border: 'none',
      color: '#cbd5e1',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    signUpBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '0.5rem 1.2rem',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Kick them back to home after logging out
  };

  return (
    <nav style={styles.navBox}>
      
      {/* 1. LEFT - Logo */}
      <div style={styles.leftSection}>
        <Link to="/" style={styles.logo}>
          🧠 RL Choice Manager
        </Link>
      </div>

      {/* 2. CENTER - Navigation */}
      <div style={styles.centerSection}>
        <div style={styles.linkContainer}>
          <div style={styles.slidingPill} />
          <Link to="/" style={styles.link(activeIndex === 0)}>🏠 Home</Link>
          <Link to="/history" style={styles.link(activeIndex === 1)}>📚 History</Link>
          <Link to="/about" style={styles.link(activeIndex === 2)}>ℹ️ About</Link>
        </div>
      </div>

      {/* 3. RIGHT - Actions */}
      <div style={styles.rightSection}>
        <button 
          style={styles.donateBtn}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => alert("Thanks for the support! (Hook up Stripe/PayPal later!)")}
        >
          💖 Donate
        </button>
        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }} />
        
        {/* --- DYNAMIC AUTH BUTTONS --- */}
        
        {user ? (
          <>
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Hey, {user.name}</span>
            <button style={styles.signUpBtn} onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            {/* Tell the Auth page to show Login */}
            <button style={styles.loginBtn} onClick={() => navigate('/auth', { state: { isLogin: true } })}>Log In</button>
            
            {/* Tell the Auth page to show Sign Up */}
            <button style={styles.signUpBtn} onClick={() => navigate('/auth', { state: { isLogin: false } })}>Sign Up</button>
          </>
        )}

      </div>
    </nav>
  );
}