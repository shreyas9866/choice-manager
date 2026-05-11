import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Placeholder pages for now
const Home = () => <div style={{ padding: '2rem' }}><h2>Home: RL Environment</h2></div>;
const History = () => <div style={{ padding: '2rem' }}><h2>History: Past Choices</h2></div>;
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
    </Router>
  );
}

export default App;