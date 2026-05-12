import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingDonate from './components/FloatingDonate'; // <-- Import it here
import Home from './pages/Home';
import History from './pages/History';

const About = () => <div style={{ padding: '2rem' }}><h2>About Us</h2></div>;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
      </Routes>
      
      {/* Drops in the floating button globally */}
      <FloatingDonate /> 
    </Router>
  );
}

export default App;