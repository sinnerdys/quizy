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
  const [balance, setBalance] = useState(null); // Начальное значение - null
  const [user, setUser] = useState(null); // Состояние для данных пользователя
  const [referralCode, setReferralCode] = useState(null); // Состояние для реферального кода
  const [dailyRewardData, setDailyRewardData] = useState(null); // Данные для награды

  const navigate = useNavigate();

  useEffect(() => {
    // Запускаем приложение только один раз при загрузке
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#112558');
      window.Telegram.WebApp.setBackgroundColor('#112558');
      window.Telegram.WebApp.disableVerticalSwipes();

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
      const referralParam = window.Telegram.WebApp.initDataUnsafe.start_param; // Получаем реферальный код из start_param

      if (telegramUser) {
        console.log('User data from Telegram:', telegramUser);
        setUser(telegramUser); // Сохраняем пользователя в состоянии
        setReferralCode(referralParam); // Сохраняем реферальный код (если есть)
        fetchUserData(telegramUser); // Загружаем данные пользователя из Firebase
      } else {
        console.log('No user data from Telegram WebApp');
      }
    } else {
      console.log('Not running in Telegram WebApp');
    }

    // Прелоадер на 2 секунды
    const preloaderTimer = setTimeout(() => {
      setLoading(false); // Убираем прелоадер
    }, 2000);

    return () => clearTimeout(preloaderTimer);
  }, []);

  // Функция для загрузки данных пользователя (включая баланс) из Firebase
  const fetchUserData = async (user) => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUser?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setBalance(userData.balance); // Устанавливаем баланс пользователя из базы данных
      console.log('User data fetched successfully:', userData);

      // Проверяем ежедневную награду только при запуске
      checkDailyReward(user.id);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setBalance(0); // В случае ошибки устанавливаем баланс 0
    }
  };

  // Функция для проверки ежедневной награды
  const checkDailyReward = async (userId) => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/handleDailyReward?userId=${userId}`);
      const rewardData = await response.json();

      if (rewardData.success && rewardData.canClaimReward) { // Проверяем, доступна ли награда
        setDailyRewardData(rewardData); // Сохраняем данные награды
        setShowDailyReward(true); // Показываем экран награды
      } else {
        setShowDailyReward(false); // Награда уже получена сегодня или нет
        // Оставляем пользователя на текущем экране, не перенаправляем на Home сразу
      }
    } catch (error) {
      console.error('Error fetching daily reward data:', error);
      setShowDailyReward(false);
      // Если возникла ошибка, не перенаправляем, просто остаемся на текущем экране
    }
  };

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
          balance: balance, // Сохраняем текущий баланс
          referralCode, // Передаем реферальный код
        }),
      });

      const result = await response.json();
      console.log('User data saved successfully:', result);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Функция для обновления баланса
  const updateBalance = async (amount) => {
    setBalance((prevBalance) => {
      const newBalance = prevBalance + amount;
      return newBalance;
    });

    if (user) {
      await saveUserToFirebase(user, balance + amount); // Сохраняем обновленный баланс в Firebase
    }
  };

  // Функция для обновления баланса при возврате на экран
  const fetchBalance = async () => {
    if (user) {
      await fetchUserData(user); // Получаем актуальные данные баланса пользователя
    }
  };

  // Функция для перехода с DailyReward на Home
  const handleContinue = async () => {
    try {
      if (dailyRewardData && dailyRewardData.rewardAmount) {
        await updateBalance(dailyRewardData.rewardAmount); // Обновляем баланс в зависимости от награды
      }
      setShowDailyReward(false);
      navigate('/'); // Переход на Home после получения награды
    } catch (error) {
      console.error('Error during saving user data or balance update:', error);
    }
  };

  // Если данные еще загружаются или баланс не установлен, показываем прелоадер
  if (balance === null || loading) {
    return <Preloader />;
  }

  return (
    <div className="App">
      {showDailyReward ? (
        <DailyReward 
          onContinue={handleContinue} 
          userId={user?.id} 
          rewardAmount={dailyRewardData?.rewardAmount} // Передаем количество награды
          currentDay={dailyRewardData?.currentDay} // Передаем текущий день
        />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home userId={user?.id} balance={balance} updateBalance={updateBalance} fetchBalance={fetchBalance} />} />
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