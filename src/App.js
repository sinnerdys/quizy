import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Friends from './components/Friends';
import BottomNav from './components/BottomNav';
import Preloader from './components/Preloader';
import DailyReward from './components/DailyReward'; // Импортируем DailyReward
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false); // Состояние для отслеживания перенаправления
  const [showDailyReward, setShowDailyReward] = useState(true); // Для отображения экрана наград
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, что Telegram WebApp доступен
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.expand(); // Расширяем приложение на всю высоту

      // Устанавливаем кастомный цвет для шапки
      window.Telegram.WebApp.setHeaderColor('#112558');

      // Устанавливаем кастомный цвет для нижней панели
      window.Telegram.WebApp.setBackgroundColor('#112558');

      // Отключаем вертикальные свайпы, если необходимо
      window.Telegram.WebApp.disableVerticalSwipes(); 
    }

    // Таймер на 2 секунды для прелоадера
    const timer = setTimeout(() => {
      setLoading(false); // Прелоадер исчезает через 2 секунды
    }, 2000);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, []);

  const handleContinue = () => {
    setShowDailyReward(false); // Скрываем экран наград
    navigate('/'); // Перенаправляем на Home
  };

  return (
    <div className="App">
      {loading ? (
        <Preloader />  // Если загружается — показываем прелоадер
      ) : showDailyReward ? (
        <DailyReward onContinue={handleContinue} /> // Показываем экран наград
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
