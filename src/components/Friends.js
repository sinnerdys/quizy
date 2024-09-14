import React, { useState, useEffect } from 'react';
import './Friends.css'; // Стили для экрана друзей
import logo from '../assets/quizy_logo.png'; // Импорт логотипа
import token from '../assets/token.png'; // Импорт логотипа токена (или иконки)

function Friends() {
  const [referralCode, setReferralCode] = useState(''); // Состояние для реферального кода
  const [friends, setFriends] = useState([]); // Список друзей

  // Генерация реферального кода для текущего пользователя
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};

    // Пример генерации реферального кода
    const generateReferralCode = (userId) => {
      return Math.random().toString(36).substring(2, 12) + userId; // Создаем уникальный код с userId
    };

    const generatedCode = generateReferralCode(user.id);
    setReferralCode(generatedCode);

    // Отправляем код на сервер, чтобы сохранить его в базе данных
    const saveReferralCode = async () => {
      try {
        await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveReferralCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            referralCode: generatedCode,
          }),
        });
      } catch (error) {
        console.error('Error saving referral code:', error);
      }
    };

    saveReferralCode();
  }, []);

  // Обработчик нажатия на кнопку "Invite friends"
  const handleInviteFriends = () => {
    const tg = window.Telegram.WebApp;

    // Текст сообщения с реферальной ссылкой
    const messageText = `Hey! Join QUIZY and get rewards! Use my referral link: https://t.me/your_bot_username?startapp=${referralCode}`;

    // Вызов встроенного метода для открытия поп-апа в Telegram
    tg.shareText(messageText, {
      link: `https://t.me/your_bot_username?startapp=${referralCode}`,
      success: () => {
        console.log('Invitation shared successfully!');
      },
      error: (err) => {
        console.error('Error sharing invitation:', err);
      },
    });
  };

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
