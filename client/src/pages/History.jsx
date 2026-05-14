import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
// IMPORT OUR GLOBAL BRAIN
import { AuthContext } from '../context/AuthContext';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 
  
  // GRAB THE TOKEN FROM CONTEXT
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    // Only try to fetch if the user is actually logged in
    if (token) {
      fetchSessions();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions', {
        // ATTACH THE VIP PASS TO THE GET REQUEST
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSessions(data);
      } else {
        console.error("Failed to fetch:", data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setLoading(false);
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`, { 
        method: 'DELETE',
        // ATTACH VIP PASS
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) setSessions(sessions.filter(session => session._id !== id));
    } catch (error) { console.error(error); }
  };

  const handleClearAll = async () => {
    if (!window.confirm("🚨 WARNING: Delete ALL history? This cannot be undone.")) return;
    try {
      const response = await fetch('http://localhost:5000/api/sessions', { 
        method: 'DELETE',
        // ATTACH VIP PASS
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) setSessions([]);
    } catch (error) { console.error(error); }
  };

  const handleResume = (session) => {
    navigate('/', { state: { resumeSession: session } });
  };

  const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#cbd5e1' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { margin: 0, color: '#f8fafc' },
    card: { 
      backgroundColor: 'rgba(15, 23, 42, 0.75)', 
      backdropFilter: 'blur(10px)', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', 
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '1.5rem' 
    },
    choiceList: { listStyleType: 'none', padding: 0 },
    choiceItem: { padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    badge: { backgroundColor: 'rgba(0, 196, 159, 0.2)', border: '1px solid var(--primary-teal, #00C49F)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' },
    deleteBtn: { backgroundColor: 'rgba(255, 77, 79, 0.2)', color: '#ff4d4f', border: '1px solid rgba(255, 77, 79, 0.5)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
    resumeBtn: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', marginLeft: '1rem', backdropFilter: 'blur(4px)' },
    clearAllBtn: { backgroundColor: 'transparent', color: '#ff4d4f', border: '2px solid #ff4d4f', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    emptyBox: { textAlign: 'center', padding: '3rem', color: '#cbd5e1', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' },
    contextBadge: { backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: 'white' },
    loginPromptBtn: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.8rem 2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1rem', backdropFilter: 'blur(4px)' }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem', color: 'white' }}><h2>Loading database...</h2></div>;

  // IF NO TOKEN EXISTS, PROMPT THEM TO LOG IN FIRST
  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyBox}>
          <h2 style={{ color: 'white', margin: '0 0 1rem 0' }}>🔒 Access Denied</h2>
          <p>You must be logged in to view your saved RL environments.</p>
          <button style={styles.loginPromptBtn} onClick={() => navigate('/auth')}>
            Log In or Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>{user?.name}'s Saved Environments</h2>
        {sessions.length > 0 && <button style={styles.clearAllBtn} onClick={handleClearAll}>🗑️ Clear All</button>}
      </div>
      
      {sessions.length === 0 ? (
        <div style={styles.emptyBox}>
          <h3>No history found! Start training the AI on the Home page.</h3>
        </div>
      ) : (
        sessions.map(session => (
          <div key={session._id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{session.title}</h3>
                <span style={styles.badge}>LR: {session.learningRate}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '1rem' }}>
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <button style={styles.resumeBtn} onClick={() => handleResume(session)}>🚀 Resume Training</button>
                <button style={{...styles.deleteBtn, marginLeft: '0.5rem'}} onClick={() => handleDeleteSingle(session._id)}>Delete</button>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>

            <ul style={styles.choiceList}>
              {session.choices.map(choice => {
                const learnedContexts = Object.entries(choice.qValues || {}).filter(([ctx, val]) => val > 0);

                return (
                  <li key={choice._id} style={styles.choiceItem}>
                    <span style={{ fontSize: '1.1rem', color: 'white' }}><strong>{choice.name}</strong></span>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {learnedContexts.length === 0 ? (
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No ratings yet</span>
                      ) : (
                        learnedContexts.map(([ctx, val]) => (
                          <span key={ctx} style={styles.contextBadge}>
                            {ctx}: <strong>{val.toFixed(2)}</strong>
                          </span>
                        ))
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}