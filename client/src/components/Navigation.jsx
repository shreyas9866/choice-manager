import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

// NEW: Set up the dynamic API URL for deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  let activeIndex = 0;
  if (location.pathname === '/history') activeIndex = 1;
  else if (location.pathname === '/dashboard') activeIndex = 2; 
  else if (location.pathname === '/about') activeIndex = 3;     

  const BUTTON_WIDTH = 110; 
  const GAP = 8; 

  // ==========================================
  // RAZORPAY FRONTEND LOGIC
  // ==========================================

  // 1. Helper function to dynamically load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. The main checkout function
  const handleDonateClick = async () => {
    if (!token) {
      alert("Please log in first to make a donation!");
      navigate('/auth', { state: { isLogin: true } });
      return;
    }

    const amountInput = window.prompt("Enter your donation amount (₹):", "150");
    
    if (!amountInput || isNaN(amountInput) || Number(amountInput) < 1) {
      return; 
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // 🚀 UPDATED: Using dynamic API_URL
      const orderResponse = await fetch(`${API_URL}/api/razorpay/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(amountInput) })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        alert("Failed to initialize payment. Try again.");
        return;
      }

      const options = {
        key: 'rzp_test_SqLjDe0ljeBLzM', 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'RL Choice Manager',
        description: 'Thank you for supporting the project! 💖',
        order_id: orderData.id, 
        
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true
            }
          }
        },

        handler: async function (response) {
          try {
            // 🚀 UPDATED: Using dynamic API_URL
            const verifyRes = await fetch(`${API_URL}/api/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            if (verifyRes.ok) {
              alert(`🎉 Payment Verified! Thank you so much for the support, ${user.name}!`);
            } else {
              alert("Payment verification failed! Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Something went wrong verifying the payment.");
          }
        },
        
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#0F172A' 
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong with the payment gateway.");
    }
  };

  // ==========================================
  // STYLES
  // ==========================================
  const styles = {
    navBox: { backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)', position: 'sticky', top: 0, zIndex: 100 },
    leftSection: { flex: 1, display: 'flex', justifyContent: 'flex-start' },
    centerSection: { flex: 1, display: 'flex', justifyContent: 'center' },
    rightSection: { flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' },
    logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', textDecoration: 'none', display: 'flex', alignItems: 'center' },
    linkContainer: { display: 'flex', position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '6px', borderRadius: '16px', gap: `${GAP}px`, border: '1px solid rgba(255, 255, 255, 0.05)' },
    slidingPill: { position: 'absolute', top: '6px', bottom: '6px', width: `${BUTTON_WIDTH}px`, transform: `translateX(${activeIndex * (BUTTON_WIDTH + GAP)}px)`, backgroundColor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', borderRadius: '12px', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 1 },
    link: (isActive) => ({ textDecoration: 'none', width: `${BUTTON_WIDTH}px`, textAlign: 'center', padding: '0.6rem 0', fontWeight: 'bold', fontSize: '1rem', color: isActive ? 'white' : '#94a3b8', transition: 'color 0.4s ease', position: 'relative', zIndex: 2 }),
    donateBtn: { backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(255, 77, 79, 0.4)', transition: 'all 0.2s ease' },
    loginBtn: { background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
    signUpBtn: { backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(4px)' }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <nav style={styles.navBox}>
      <div style={styles.leftSection}>
        <Link to="/" style={styles.logo}>
          🧠 RL Choice Manager
        </Link>
      </div>

      <div style={styles.centerSection}>
        <div style={styles.linkContainer}>
          <div style={styles.slidingPill} />
          <Link to="/" style={styles.link(activeIndex === 0)}>🏠 Home</Link>
          <Link to="/history" style={styles.link(activeIndex === 1)}>📚 History</Link>
          <Link to="/dashboard" style={styles.link(activeIndex === 2)}>🌍 Global</Link>
          <Link to="/about" style={styles.link(activeIndex === 3)}>ℹ️ About</Link>
        </div>
      </div>

      <div style={styles.rightSection}>
        <button 
          style={styles.donateBtn}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={handleDonateClick}
        >
          💖 Donate
        </button>
        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 0.5rem' }} />
        
        {user ? (
          <>
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Hey, {user.name}</span>
            <button style={styles.signUpBtn} onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button style={styles.loginBtn} onClick={() => navigate('/auth', { state: { isLogin: true } })}>Log In</button>
            <button style={styles.signUpBtn} onClick={() => navigate('/auth', { state: { isLogin: false } })}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}