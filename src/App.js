import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Friends from './components/Friends';
import BottomNav from './components/BottomNav';
import Preloader from './components/Preloader';
import DailyReward from './components/DailyReward';
import Quizes from './components/Quizes';
import QuizyWheel from './components/QuizyWheel';
import GameTimer from './components/GameTimer';
import QuizPage from './components/QuizPage';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [balance, setBalance] = useState(null); // Начальное значение - null
  const [user, setUser] = useState(null); // Состояние для данных пользователя
  const [referralCode, setReferralCode] = useState(null); // Состояние для реферального кода
  const [dailyRewardData, setDailyRewardData] = useState(null); // Данные для награды
  const [hasCheckedDailyReward, setHasCheckedDailyReward] = useState(false); // Флаг проверки награды
  const [tickets, setTickets] = useState(0);
  const [nextTicketIn, setNextTicketIn] = useState(0);
  const [isPremium, setIsPremium] = useState(false); // Добавлено состояние для хранения премиум-статуса пользователя

  const navigate = useNavigate();
  const location = useLocation(); // Добавляем хук для получения текущего маршрута

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#27469B');
      window.Telegram.WebApp.setBackgroundColor('#27469B');
      window.Telegram.WebApp.disableVerticalSwipes();

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
      const referralParam = window.Telegram.WebApp.initDataUnsafe.start_param; // Получаем реферальный код из start_param

      if (telegramUser) {
        console.log('User data from Telegram:', telegramUser);
        setUser(telegramUser); // Сохраняем пользователя в состоянии
        setReferralCode(referralParam); // Сохраняем реферальный код (если есть)
        setIsPremium(telegramUser.is_premium || false); // Сохраняем статус премиум-пользователя
        fetchUserData(telegramUser, referralParam); // Загружаем данные пользователя из Firebase
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
  const fetchUserData = async (user, referralCode) => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUser?userId=${user.id}`, {
        method: 'GET',
        mode: 'cors', // Включаем поддержку CORS
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Если пользователь не найден, создаем нового пользователя
        console.log('User not found, creating new user...');
        await createUser(user, referralCode);
        return; // Прекращаем выполнение функции, так как новый пользователь уже создан
      }

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

  // Функция для создания нового пользователя в Firebase
  const createUser = async (user, referralCode) => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUser', {
        method: 'POST',
        mode: 'cors', // Включаем поддержку CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || '',
          balance: referralCode ? 500 : 0, // Если есть реферальный код, добавляем бонус
          referralCode: referralCode || null, // Передаем реферальный код, если есть
          is_premium: user.is_premium || false // Передаем статус премиум
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const result = await response.json();
      console.log('User created successfully:', result);

      setBalance(referralCode ? 500 : 0); // Устанавливаем баланс нового пользователя
      checkDailyReward(user.id); // Проверяем ежедневную награду для нового пользователя
    } catch (error) {
      console.error('Error creating user:', error);
      setBalance(0); // В случае ошибки устанавливаем баланс 0
    }
  };

  // Функция для проверки ежедневной награды
  const checkDailyReward = async (userId) => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/handleDailyReward?userId=${userId}`, {
        method: 'GET',
        mode: 'cors', // Включаем поддержку CORS
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const rewardData = await response.json();

      if (rewardData.success && rewardData.canClaimReward) {
        // Если можно получить награду, показываем экран награды
        setDailyRewardData(rewardData);
        setShowDailyReward(true);
      } else {
        // Если награда уже была получена, перенаправляем на Home
        setShowDailyReward(false);
        if (!hasCheckedDailyReward) {
          navigate('/'); // Перенаправляем на Home, если награда уже получена
        }
      }

      // Отмечаем, что проверка завершена
      setHasCheckedDailyReward(true);
    } catch (error) {
      console.error('Error fetching daily reward data:', error);
      setShowDailyReward(false);
      if (!hasCheckedDailyReward) {
        navigate('/'); // Если возникла ошибка, сразу переходим на Home
      }
      setHasCheckedDailyReward(true);
    }
  };

  // Функция для сохранения данных пользователя в Firebase
  const saveUserToFirebase = async (user, balance) => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUser', {
        method: 'POST',
        mode: 'cors', // Включаем поддержку CORS
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
          is_premium: user.is_premium || false // Передаем статус премиум
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

  const fetchTicketInfo = async () => {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id;

    const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getTicketInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    setTickets(data.tickets);
    setNextTicketIn(data.nextTicketIn);
  };

  useEffect(() => {
    fetchTicketInfo().then(() => setLoading(false));
  }, []);

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
  if (balance === null || loading || !hasCheckedDailyReward) {
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
            <Route path="/quizes" element={<Quizes userId={user?.id} />} />
            <Route path="/quiz/:quizId" element={<QuizPage userId={user?.id} />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/wheel" element={<QuizyWheel tickets={tickets} nextTicketIn={nextTicketIn} fetchTicketInfo={fetchTicketInfo} />} />
            <Route path="/game-timer" element={<GameTimer onBack={() => navigate('/games')} />} />
          </Routes>
                    {/* Условный рендеринг BottomNav */}
            {location.pathname !== '/game-timer' && !location.pathname.startsWith('/quiz/') && <BottomNav />}
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
