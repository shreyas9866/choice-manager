import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// IMPORT OUR GLOBAL BRAIN
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const location = useLocation(); 
  const navigate = useNavigate();
  
  // GRAB THE TOKEN FROM CONTEXT
  const { token } = useContext(AuthContext);

  const [sessionTitle, setSessionTitle] = useState('');
  const [learningRate, setLearningRate] = useState(0.5);
  const [newChoiceName, setNewChoiceName] = useState('');
  const [choices, setChoices] = useState([]);
  const [sliderValues, setSliderValues] = useState({});
  const [currentContext, setCurrentContext] = useState('Default');
  const [suggestion, setSuggestion] = useState(null); 
  const [chartData, setChartData] = useState([]);
  
  const contextOptions = ['Default', 'Morning', 'Late Night', 'Sunny', 'Raining', 'Stressed', 'Celebration'];
  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  useEffect(() => {
    if (location.state && location.state.resumeSession) {
      const { title, learningRate, choices, historyLog } = location.state.resumeSession;
      setSessionTitle(title || ''); 
      setLearningRate(learningRate || 0.5);
      setChoices(calculateProbabilities(choices || [], currentContext));
      if (historyLog && historyLog.length > 0) setChartData(historyLog);
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const calculateProbabilities = (currentChoices, ctx) => {
    if (currentChoices.length === 0) return currentChoices;
    const maxQ = Math.max(...currentChoices.map(c => c.qValues[ctx] || 0), 0);
    const exponentials = currentChoices.map(c => Math.exp((c.qValues[ctx] || 0) - maxQ));
    const sumExponentials = exponentials.reduce((a, b) => a + b, 0);
    return currentChoices.map((choice, index) => ({
      ...choice,
      displayProbability: ((exponentials[index] / sumExponentials) * 100).toFixed(1)
    }));
  };

  useEffect(() => {
    if (choices.length > 0) {
      setChoices(prevChoices => calculateProbabilities(prevChoices, currentContext));
      setSuggestion(null); 
      setSliderValues({}); 
    }
  }, [currentContext]);

  const handleAddChoice = (e) => {
    e.preventDefault();
    if (!newChoiceName.trim()) return;
    const newChoice = { id: Date.now(), name: newChoiceName, qValues: {} };
    contextOptions.forEach(ctx => { newChoice.qValues[ctx] = 0; });
    const updatedChoices = [...choices, newChoice];
    setChoices(calculateProbabilities(updatedChoices, currentContext));
    setNewChoiceName('');
  };

  const handleRate = (id, rating) => {
    const updatedChoices = choices.map(choice => {
      if (choice.id === id) {
        const oldQ = choice.qValues[currentContext] || 0;
        const newQ = oldQ + learningRate * (rating - oldQ);
        return { ...choice, qValues: { ...choice.qValues, [currentContext]: newQ } };
      }
      return choice;
    });

    const newDataPoint = { step: `Rating ${chartData.length + 1}`, context: currentContext };
    updatedChoices.forEach(choice => {
      newDataPoint[choice.name] = parseFloat((choice.qValues[currentContext] || 0).toFixed(2));
    });

    setChartData([...chartData, newDataPoint]); 
    setChoices(calculateProbabilities(updatedChoices, currentContext));
    setSuggestion(null);
  };

  const handleSuggest = () => {
    if (choices.length === 0) return alert("Please add some choices first!");
    if (Math.random() < 0.15) {
      const randomIndex = Math.floor(Math.random() * choices.length);
      setSuggestion({ ...choices[randomIndex], reason: `Exploration 🎲 (Trying something different while it's ${currentContext}!)` });
    } else {
      const bestChoice = [...choices].sort((a, b) => (b.qValues[currentContext] || 0) - (a.qValues[currentContext] || 0))[0];
      setSuggestion({ ...bestChoice, reason: `Exploitation 🎯 (Going with the math. This is your highest rated option for: ${currentContext}.)` });
    }
  };

  const handleSaveSession = async () => {
    if (!sessionTitle.trim()) return alert("Please give your session a name before saving!");
    if (choices.length === 0) return alert("Please add at least one choice before saving!");
    
    // NEW: Stop them if they aren't logged in!
    if (!token) return alert("🔒 You must be logged in to save your sessions!");

    try {
      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // NEW: Attach the VIP Pass
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: sessionTitle, learningRate, choices, historyLog: chartData })
      });
      if (response.ok) {
        alert("✅ Session saved successfully!");
        setSessionTitle(''); setChoices([]); setChartData([]); setSuggestion(null);
        setSliderValues({}); setLearningRate(0.5); setCurrentContext('Default');
      } else {
        alert("❌ Failed to save session. Make sure you are logged in.");
      }
    } catch (error) {
      alert("❌ Server connection error.");
    }
  };

  const activeChartData = chartData.filter(d => d.context === currentContext);

  // --- DARK MODE STYLES ---
  const styles = {
    container: { padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#f8fafc' },
    headerBox: { backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', marginBottom: '2rem' },
    chartBox: { backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(12px)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', marginBottom: '2rem' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
    card: { backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
    input: { padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'white', marginRight: '1rem' },
    button: { 
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#f8fafc', 
      padding: '0.5rem 1rem', 
      borderRadius: '6px', 
      cursor: 'pointer', 
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },
    suggestionBox: { 
      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
      backdropFilter: 'blur(12px)', 
      border: '1px solid rgba(255, 255, 255, 0.2)', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      marginBottom: '2rem', 
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h2 style={{ marginTop: 0 }}>Setup Your Environment</h2>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Name this comparison..." value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} style={{ ...styles.input, flexGrow: 1, fontSize: '1.2rem', margin: 0 }} />
          <select style={{...styles.input, margin: 0}} value={currentContext} onChange={(e) => setCurrentContext(e.target.value)}>
            {contextOptions.map(ctx => <option key={ctx} value={ctx}>Context: {ctx}</option>)}
          </select>
          <button onClick={handleSaveSession} style={{...styles.button, backgroundColor: 'rgba(255,255,255,0.15)', color: 'white'}}>💾 Save</button>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ flexGrow: 1 }}>
            <label><strong>Learning Rate (α):</strong> {learningRate}</label>
            <input type="range" min="0.01" max="1" step="0.01" value={learningRate} onChange={(e) => setLearningRate(parseFloat(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
          </div>
        </div>

        <form onSubmit={handleAddChoice} style={{ display: 'flex' }}>
          <input style={{ ...styles.input, flexGrow: 1 }} type="text" placeholder="Add a new choice..." value={newChoiceName} onChange={(e) => setNewChoiceName(e.target.value)} />
          <button style={styles.button} type="submit">+ Add Option</button>
        </form>
      </div>

      {choices.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button onClick={handleSuggest} style={{...styles.button, fontSize: '1.2rem', padding: '1rem 2rem', borderRadius: '50px', boxShadow: '0 4px 15px rgba(255, 255, 255, 0.15)'}}>
            🤖 Suggest Next Move
          </button>
        </div>
      )}

      {suggestion && (
        <div style={styles.suggestionBox}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>The AI Suggests: <strong>{suggestion.name}</strong></h3>
          <p style={{ margin: '0 0 1rem 0', fontStyle: 'italic', color: '#cbd5e1' }}>{suggestion.reason}</p>
        </div>
      )}

      {choices.length > 0 && chartData.length > 0 && (
        <div style={styles.chartBox}>
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>Live Learning Curve: {currentContext}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="step" stroke="#cbd5e1" />
              <YAxis domain={[0, 10]} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ color: 'white' }} />
              {choices.map((choice, index) => (
                <Line key={choice.id} type="monotone" dataKey={choice.name} stroke={CHART_COLORS[index % CHART_COLORS.length]} strokeWidth={3} activeDot={{ r: 8 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.cardGrid}>
        {choices.map(choice => {
          const currentQ = choice.qValues[currentContext] || 0;
          return (
            <div key={choice.id} style={{ ...styles.card, border: suggestion?.id === choice.id ? '2px solid rgba(255, 255, 255, 0.7)' : '1px solid rgba(255,255,255,0.1)', transform: suggestion?.id === choice.id ? 'scale(1.02)' : 'scale(1)', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{choice.name}</h3>
                <span style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>{currentContext}</span>
              </div>
              <p><strong>Win Probability:</strong> {choice.displayProbability}%</p>
              <p style={{ color: '#cbd5e1' }}><em>Internal Q-Value: {currentQ.toFixed(2)}</em></p>
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}/>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Rate for {currentContext}: <strong>{sliderValues[choice.id] || 5}</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="range" min="1" max="10" step="1" value={sliderValues[choice.id] || 5} onChange={(e) => setSliderValues({...sliderValues, [choice.id]: parseInt(e.target.value)})} style={{ flexGrow: 1 }} />
                  <button style={styles.button} onClick={() => handleRate(choice.id, sliderValues[choice.id] || 5)}>Submit</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}