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
  const [loading, setLoading] = useState(true);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null); // Сохраняем данные пользователя
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#112558');
      window.Telegram.WebApp.setBackgroundColor('#112558');
      window.Telegram.WebApp.disableVerticalSwipes();

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
      if (telegramUser) {
        console.log('User data from Telegram:', telegramUser);
        setUser(telegramUser); // Сохраняем пользователя в состоянии
        saveUserToFirebase(telegramUser, balance); // Сохраняем данные пользователя
      } else {
        console.log('No user data from Telegram WebApp');
      }
    } else {
      console.log('Not running in Telegram WebApp');
    }

    const preloaderTimer = setTimeout(() => {
      setLoading(false);
      setShowDailyReward(true);
    }, 2000);

    return () => clearTimeout(preloaderTimer);
  }, []);

  // Функция для сохранения данных пользователя в Firebase
  const saveUserToFirebase = async (user, balance) => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || '',
          balance: balance,
        }),
      });

      const result = await response.json();
      console.log('User data saved successfully:', result);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Функция для обновления баланса
  const updateBalance = (amount) => {
    setBalance((prevBalance) => {
      const newBalance = prevBalance + amount;
      if (user) {
        saveUserToFirebase(user, newBalance); // Сохраняем новый баланс в Firebase
      }
      return newBalance;
    });
  };

  // Функция для перехода с DailyReward на Home
  const handleContinue = () => {
    updateBalance(100); // Обновляем баланс
    setShowDailyReward(false);
    navigate('/'); // Переход на Home
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
