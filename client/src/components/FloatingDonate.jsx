export default function FloatingDonate() {
  const floatingStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    backgroundColor: 'var(--accent-coral)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(244, 143, 104, 0.4)', // A soft coral glow
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    zIndex: 1000, // Ensures it stays on top of all other content
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const handleDonateClick = () => {
    // We will wire this up to Razorpay later!
    alert('Razorpay UPI Modal will open here!');
  };

  return (
    <button 
      style={floatingStyle} 
      onClick={handleDonateClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(244, 143, 104, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 143, 104, 0.4)';
      }}
    >
      <span>💖</span> Support the Dev
    </button>
  );
}