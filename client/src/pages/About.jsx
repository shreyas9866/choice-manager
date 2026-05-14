export default function About() {
  const styles = {
    container: {
      padding: '3rem 2rem',
      maxWidth: '800px',
      margin: '0 auto',
      color: '#cbd5e1', 
      lineHeight: '1.6',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '1rem',
      color: '#f8fafc', 
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#f8fafc', 
    },
    card: {
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      padding: '2rem',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '2rem',
    },
    h3: {
      marginTop: 0,
      color: '#f8fafc',
      fontSize: '1.4rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    highlight: {
      backgroundColor: 'rgba(0, 196, 159, 0.2)',
      border: '1px solid rgba(0, 196, 159, 0.4)',
      padding: '0.2rem 0.5rem',
      borderRadius: '6px',
      fontWeight: 'bold',
      color: 'white',
    },
    techBadge: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Under the Hood</h1>
        <p style={styles.subtitle}>
          How this application uses Reinforcement Learning to make optimal choices.
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🤖 The Contextual Bandit</h3>
        <p>
          Standard recommendation engines use collaborative filtering (showing you what similar users like). 
          This app uses a branch of Reinforcement Learning called the <strong>Contextual Bandit</strong>. 
        </p>
        <p>
          Instead of keeping a single score for an item, the AI maintains a dynamic dictionary of <span style={styles.highlight}>Q-Values</span> based on the current <em>Context</em> (e.g., Weather, Time of Day). It learns your preferences in real-time as the environment changes.
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🎲 Epsilon-Greedy Exploration</h3>
        <p>
          How does the AI know when to stick to a favorite, and when to try something new? It uses the <strong>Epsilon-Greedy</strong> strategy.
        </p>
        <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{color: 'white'}}>Exploitation (85% of the time):</strong> The AI checks the math and suggests the choice with the highest Q-Value for the current context.</li>
          <li><strong style={{color: 'white'}}>Exploration (15% of the time):</strong> The AI temporarily ignores the math and suggests a random choice. This prevents the algorithm from getting stuck in a "filter bubble" and allows it to discover if your tastes have changed!</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🛠️ Tech Stack</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {['React.js', 'Node.js', 'Express', 'MongoDB Atlas', 'Recharts', 'Vite'].map(tech => (
            <span key={tech} style={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}