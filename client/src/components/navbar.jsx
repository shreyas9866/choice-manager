import { Link } from 'react-router-dom';

export default function Navbar() {
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
    fontWeight: '600'
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
      </div>
    </nav>
  );
}