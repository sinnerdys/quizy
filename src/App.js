import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Friends from './components/Friends';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/friends" element={<Friends />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
