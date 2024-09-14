import React, { useState, useEffect } from 'react';
import './Friends.css'; // Стили для экрана друзей
import logo from '../assets/quizy_logo.png'; // Импорт логотипа
import token from '../assets/token.png'; // Импорт логотипа токена (или иконки)

function Friends() {
  const [referralCode, setReferralCode] = useState(''); // Состояние для реферального кода
  const [friends, setFriends] = useState([]); // Список друзей
  const [loading, setLoading] = useState(true); // Состояние загрузки

  // Функция для получения или создания реферального кода
  const fetchReferralCode = async (userId) => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getReferralCode?userId=${userId}`);
      const data = await response.json();

      if (data.referralCode) {
        setReferralCode(data.referralCode); // Используем существующий код
      } else {
        const generatedCode = generateReferralCode(userId); // Генерация нового кода
        setReferralCode(generatedCode);
        saveReferralCode(userId, generatedCode); // Сохранение нового кода в базе
      }
    } catch (error) {
      console.error('Ошибка получения реферального кода:', error);
    }
  };

  // Функция для генерации уникального реферального кода
  const generateReferralCode = (userId) => {
    return Math.random().toString(36).substring(2, 12) + userId; // Создаем уникальный код с userId
  };

  // Функция для сохранения реферального кода в базе данных
  const saveReferralCode = async (userId, referralCode) => {
    try {
      await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveReferralCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          referralCode,
        }),
      });
    } catch (error) {
      console.error('Error saving referral code:', error);
    }
  };

  // Функция для сохранения пользователя с возможным реферальным кодом
  const saveUserWithReferral = async (userId, referralCode) => {
    try {
      await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          referralCode, // Передаем реферальный код на сервер
        }),
      });
    } catch (error) {
      console.error('Error saving user with referral code:', error);
    }
  };

  // useEffect для загрузки данных при входе
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};
    const startParam = tg.initDataUnsafe?.start_param; // Получаем параметр start (реферальный код)

    // Если есть пользователь и реферальный код (start), сохраняем данные пользователя с реферальным кодом
    if (user.id && startParam) {
      saveUserWithReferral(user.id, startParam);
    }

    if (user.id) {
      fetchReferralCode(user.id); // Получаем или создаем реферальный код
    }

    // Загрузка списка друзей с сервера
    const fetchFriends = async () => {
      try {
        const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUserFriends?userId=${user.id}`);
        const friendsData = await response.json();
        setFriends(friendsData);
      } catch (error) {
        console.error('Ошибка получения списка друзей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // Обработчик нажатия на кнопку "Invite friends"
  const handleInviteFriends = () => {
    const tg = window.Telegram.WebApp;

    // Текст сообщения с реферальной ссылкой
    const referralLink = `https://t.me/Qqzgy_bot?start=${referralCode}`;
    const messageText = `Hey! Join QUIZY and get rewards! Use my referral link: ${referralLink}`;

    // Используем openTelegramLink для открытия Telegram с заранее сгенерированной ссылкой
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="friends">
      {/* Логотип и заголовок */}
      <div className="header-f">
        <img src={logo} alt="QUIZY Logo" className="quizy-logo" />
        <p>Invite friends and get more rewards</p>
      </div>

      {/* Список друзей */}
      <div className="friends-list-title"><h3>My friends</h3></div>
      <div className="friends-list-section">
        <ul className="friends-list">
          {friends.map(friend => (
            <li key={friend.id} className="friend-item">
              <div className="friend-info">
                <div className="friend-icon">{friend.name.charAt(0)}</div>
                <span className="friend-name">{friend.name}</span>
              </div>
              <div className="friend-reward">
                <span className="reward-text">+{friend.reward}</span>
                <img src={token} alt="QUIZY Token" className="reward-logo" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Кнопка для приглашения */}
      <div className="invite-button-container">
        <button className="invite-button" onClick={handleInviteFriends}>Invite friends</button>
      </div>
    </div>
  );
}

export default Friends;
