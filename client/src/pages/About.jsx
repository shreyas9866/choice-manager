export default function About() {
  const styles = {
    container: {
      padding: '3rem 2rem',
      maxWidth: '900px',
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
      color: '#94a3b8', 
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
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: '1rem',
      marginBottom: '1rem'
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
      color: 'white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },
    // NEW: Founder Section Styles
    founderCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      padding: '2rem',
      borderRadius: '16px',
      border: '1px solid rgba(0, 196, 159, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 196, 159, 0.1)',
      marginTop: '4rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    profileImage: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid #00C49F',
      boxShadow: '0 4px 20px rgba(0, 196, 159, 0.4)'
    },
    founderText: {
      flex: 1,
      minWidth: '250px',
      textAlign: 'left'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Under the Hood</h1>
        <p style={styles.subtitle}>
          The architecture, algorithms, and technology powering the RL Choice Manager.
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🤖 The Reinforcement Learning Engine</h3>
        <p>
          Standard recommendation engines use collaborative filtering. This application uses a branch of Reinforcement Learning called the <strong>Contextual Bandit</strong>. 
        </p>
        <p>
          Instead of keeping a single score for an item, the AI maintains a dynamic dictionary of <span style={styles.highlight}>Q-Values</span> based on the current <em>Context</em> (e.g., Weather, Time of Day). It actively learns user preferences in real-time as the environment changes, mathematically adjusting win probabilities using the Softmax function.
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🎲 Exploration vs. Exploitation</h3>
        <p>
          To prevent the algorithm from getting stuck in a "filter bubble", it utilizes the <strong>Epsilon-Greedy</strong> strategy to balance decision making:
        </p>
        <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{color: 'white'}}>Exploitation (85%):</strong> The AI trusts the math and suggests the choice with the absolute highest Q-Value for the current context.</li>
          <li><strong style={{color: 'white'}}>Exploration (15%):</strong> The AI temporarily ignores historical data and suggests a random choice, allowing the system to discover if user tastes have evolved.</li>
        </ul>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🌍 Global Hive Mind Analytics</h3>
        <p>
          Beyond individual user sessions, the backend runs aggregation pipelines to combine Q-Values across the entire database. This forms a "Global Hive Mind," visualizing the collective decision-making trends of all users interacting with the environments.
        </p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.h3}>🛠️ The Full-Stack Architecture</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          This project is a fully deployed, monetizable SaaS application featuring secure JWT authentication, RESTful APIs, and a cryptographic payment gateway.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* We added all your new tech here! */}
          {['React.js', 'Vite', 'Node.js', 'Express', 'MongoDB Atlas', 'JWT Auth', 'Razorpay API', 'Recharts', 'Vercel', 'Render'].map(tech => (
            <span key={tech} style={styles.techBadge}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* CREATOR / FOUNDER SECTION                  */}
      {/* ========================================== */}
      <div style={styles.founderCard}>
        {/* Replace 'your-photo.jpg' with your actual image file name once you put it in the public folder */}
        <img 
          src="/your-photo.jpg" 
          alt="Creator Profile" 
          style={styles.profileImage} 
          onError={(e) => {
            e.target.src = 'https://ui-avatars.com/api/?name=Creator&background=0F172A&color=00C49F&size=150';
          }}
        />
        <div style={styles.founderText}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Shreyas</h2>
          <h4 style={{ margin: '0 0 1rem 0', color: '#00C49F', textTransform: 'uppercase', letterSpacing: '1px' }}>Full-Stack Engineer & Creator</h4>
          <p style={{ margin: 0, color: '#cbd5e1' }}>
            Built this application to bridge the gap between complex machine learning algorithms and intuitive user interfaces. Passionate about scalable backend architecture, interactive data visualization, and building secure, production-ready web applications.
          </p>
        </div>
      </div>

    </div>
  );
}