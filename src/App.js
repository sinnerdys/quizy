import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Friends from './components/Friends';
import BottomNav from './components/BottomNav';
import Preloader from './components/Preloader';
import DailyReward from './components/DailyReward';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true); // Состояние для прелоадера
  const [showDailyReward, setShowDailyReward] = useState(false); // Состояние для DailyReward
  const [balance, setBalance] = useState(0); // Состояние для баланса
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#112558');
      window.Telegram.WebApp.setBackgroundColor('#112558');
      window.Telegram.WebApp.disableVerticalSwipes();
    }

    const preloaderTimer = setTimeout(() => {
      setLoading(false);
      setShowDailyReward(true);
    }, 2000);

    return () => clearTimeout(preloaderTimer);
  }, []);

  // Функция для обновления баланса
  const updateBalance = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  // Функция для перехода с DailyReward на Home
  const handleContinue = () => {
    updateBalance(100); // Добавляем награду за ежедневное посещение
    setShowDailyReward(false); // Скрываем DailyReward
    navigate('/'); // Переходим на Home
  };

  return (
    <div className="App">
      {loading ? (
        <Preloader />
      ) : showDailyReward ? (
        <DailyReward onContinue={handleContinue} />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home balance={balance} updateBalance={updateBalance} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
          <BottomNav />
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
