import { useState, useEffect } from 'react';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the data from the backend when the page loads
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sessions');
        const data = await response.json();
        setSessions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
    card: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem' },
    choiceList: { listStyleType: 'none', padding: 0 },
    choiceItem: { padding: '0.5rem 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
    badge: { backgroundColor: 'var(--primary-teal)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}><h2>Loading database...</h2></div>;

  return (
    <div style={styles.container}>
      <h2>Your Saved Environments</h2>
      
      {sessions.length === 0 ? (
        <p>No sessions saved yet. Go to Home and save one!</p>
      ) : (
        sessions.map(session => (
          <div key={session._id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{session.title}</h3>
              <span style={styles.badge}>LR: {session.learningRate}</span>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
              Saved on: {new Date(session.createdAt).toLocaleDateString()}
            </p>

            <ul style={styles.choiceList}>
              {session.choices.map(choice => (
                <li key={choice._id} style={styles.choiceItem}>
                  <span><strong>{choice.name}</strong></span>
                  <span>Probability: {choice.probability}%</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}