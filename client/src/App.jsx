import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TrainingProvider } from './context/TrainingContext'; // <-- IMPORT THIS
import Dashboard from './pages/Dashboard';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import History from './pages/History';
import About from './pages/About';
import Auth from './pages/Auth'; 

function App() {
  return (
    <AuthProvider>
      <TrainingProvider> {/* <-- WRAP IT HERE */}
        <Router>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </TrainingProvider>
    </AuthProvider>
  );
}

export default App;