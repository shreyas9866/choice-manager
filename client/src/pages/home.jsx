import { useState } from 'react';

export default function Home() {
  // --- STATE ---
  const [sessionTitle, setSessionTitle] = useState(''); // Name of the comparison
  const [learningRate, setLearningRate] = useState(0.5);
  const [newChoiceName, setNewChoiceName] = useState('');
  const [choices, setChoices] = useState([]); // Starts completely empty!
  const [sliderValues, setSliderValues] = useState({}); // NEW: Keeps track of slider positions

  // --- RL MATH HELPERS ---
  const calculateProbabilities = (currentChoices) => {
    if (currentChoices.length === 0) return []; // Guard against empty arrays
    
    // Math.exp can blow up if values are too high, so we find the max Q value for stability
    const maxQ = Math.max(...currentChoices.map(c => c.qValue), 0);
    const exponentials = currentChoices.map(c => Math.exp(c.qValue - maxQ));
    const sumExponentials = exponentials.reduce((a, b) => a + b, 0);
    
    return currentChoices.map((choice, index) => ({
      ...choice,
      probability: ((exponentials[index] / sumExponentials) * 100).toFixed(1)
    }));
  };

  // --- HANDLERS ---
  const handleAddChoice = (e) => {
    e.preventDefault();
    if (!newChoiceName.trim()) return;

    const newChoice = {
      id: Date.now(),
      name: newChoiceName,
      qValue: 0,
      probability: 0
    };

    const updatedChoices = [...choices, newChoice];
    setChoices(calculateProbabilities(updatedChoices));
    setNewChoiceName('');
  };

  const handleRate = (id, rating) => {
    const updatedChoices = choices.map(choice => {
      if (choice.id === id) {
        // THE REINFORCEMENT LEARNING FORMULA: Q_new = Q_old + LR * (Reward - Q_old)
        const newQ = choice.qValue + learningRate * (rating - choice.qValue);
        return { ...choice, qValue: newQ };
      }
      return choice;
    });

    // Recalculate probabilities based on the new Q-values
    setChoices(calculateProbabilities(updatedChoices));
  };
  const handleSaveSession = async () => {
    if (!sessionTitle.trim()) {
      alert("Please give your session a name before saving!");
      return;
    }
    if (choices.length === 0) {
      alert("Please add at least one choice before saving!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: sessionTitle,
          learningRate: learningRate,
          choices: choices
        })
      });

      if (response.ok) {
        alert("✅ Session saved successfully to the database!");
        // Optional: clear the form to start fresh
        // setSessionTitle('');
        // setChoices([]);
      } else {
        alert("❌ Failed to save session.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Server connection error.");
    }
  };

  // --- STYLES ---
  const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
    headerBox: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
    card: { backgroundColor: 'var(--card-butter)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    button: { backgroundColor: 'var(--accent-coral)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    input: { padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', marginRight: '1rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h2>Setup Your Environment</h2>
        
        {/* Session Title Input & Save Button */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Name this comparison (e.g., Dinner Spots)..." 
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            style={{ ...styles.input, flexGrow: 1, fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}
          />
          <button 
           onClick={handleSaveSession} 
           style={{...styles.button, backgroundColor: 'var(--primary-teal)', color: '#333'}}>
            💾 Save Session
          </button>
        </div>
        
        <hr style={{ borderColor: 'rgba(0,0,0,0.1)', margin: '1.5rem 0' }}/>

        {/* Learning Rate Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label><strong>Learning Rate (α):</strong> {learningRate}</label>
          <br />
          <input 
            type="range" min="0.01" max="1" step="0.01" 
            value={learningRate} 
            onChange={(e) => setLearningRate(parseFloat(e.target.value))} 
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
          <small>Higher = adapts faster to recent ratings. Lower = remembers past ratings more.</small>
        </div>

        {/* Add Choice Form */}
        <form onSubmit={handleAddChoice} style={{ display: 'flex' }}>
          <input 
            style={{ ...styles.input, flexGrow: 1 }}
            type="text" 
            placeholder="Add a new choice..." 
            value={newChoiceName}
            onChange={(e) => setNewChoiceName(e.target.value)}
          />
          <button style={styles.button} type="submit">+ Add Option</button>
        </form>
      </div>

      {/* Empty State Message */}
      {choices.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <h3>No options added yet!</h3>
          <p>Type a choice above and click "+ Add Option" to start comparing.</p>
        </div>
      )}

      {/* Choices Grid */}
      <div style={styles.cardGrid}>
        {choices.map(choice => (
          <div key={choice.id} style={styles.card}>
            <h3>{choice.name}</h3>
            <p><strong>Win Probability:</strong> {choice.probability}%</p>
            <p><em>Internal Q-Value: {choice.qValue.toFixed(2)}</em></p>
            
            <hr style={{ borderColor: 'rgba(0,0,0,0.1)', margin: '1rem 0' }}/>
            
            {/* NEW SLIDER UI */}
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                Rate this choice: <strong>{sliderValues[choice.id] || 5}</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={sliderValues[choice.id] || 5} 
                  onChange={(e) => setSliderValues({...sliderValues, [choice.id]: parseInt(e.target.value)})}
                  style={{ flexGrow: 1 }}
                />
                <button 
                  style={{...styles.button, backgroundColor: 'var(--primary-teal)', color: '#333'}}
                  onClick={() => handleRate(choice.id, sliderValues[choice.id] || 5)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}