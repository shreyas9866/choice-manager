import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// NEW: Set up the dynamic API URL for deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic colors for the bars
  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        // 🚀 UPDATED: Using dynamic API_URL instead of hardcoded localhost
        const response = await fetch(`${API_URL}/api/analytics/global`);
        const data = await response.json();
        setGlobalData(data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  // Extract all unique choice names across all contexts to create our bars
  const allChoices = new Set();
  globalData.forEach(dataPoint => {
    Object.keys(dataPoint).forEach(key => {
      if (key !== 'context') allChoices.add(key);
    });
  });
  const choiceArray = Array.from(allChoices);

  const styles = {
    container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: '#f8fafc' },
    headerBox: { backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', marginBottom: '2rem', textAlign: 'center' },
    chartBox: { backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(12px)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', color: 'white' }}><h2>Loading Hive Mind Data... 🧠</h2></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem' }}>Global Hive Mind Analytics 🌍</h1>
        <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1.2rem' }}>
          Discover how the community trains their AI. These are the average Q-Values combined from every user across the globe.
        </p>
      </div>

      {globalData.length > 0 ? (
        <div style={styles.chartBox}>
          <h3 style={{ marginTop: 0, textAlign: 'center', marginBottom: '2rem' }}>Average Win Probabilities by Context</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={globalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="context" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: 'white' }} />
              
              {choiceArray.map((choiceName, index) => (
                <Bar 
                  key={choiceName} 
                  dataKey={choiceName} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={styles.headerBox}>
          <h3>No global data found yet! Be the first to train an environment.</h3>
        </div>
      )}
    </div>
  );
}