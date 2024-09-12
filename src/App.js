import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Friends from './components/Friends';
import BottomNav from './components/BottomNav';
import Preloader from './components/Preloader'; // Импортируем прелоадер
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  // Хук для перенаправления
  const navigate = useNavigate();

  useEffect(() => {
    // Таймер на 2 секунды, чтобы скрыть прелоадер
    const timer = setTimeout(() => {
      setLoading(false); // Прелоадер исчезнет через 2 секунды
      navigate('/'); // Перенаправляем на Home
    }, 2000);

    return () => clearTimeout(timer); // Очистка таймера
  }, [navigate]);

  return (
    <div className="App">
      {loading ? (
        <Preloader />  // Если загружается — показываем прелоадер
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
          <BottomNav /> {/* Навигация внизу */}
        </>
      )}
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
