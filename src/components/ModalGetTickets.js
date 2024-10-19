import React, { useState, useEffect } from 'react';
import './ModalGetTickets.css'; // Стили для этого поп-апа
import TicketImage from '../assets/ticket_image.png'; // Импорт изображения билета
import TelegramStarImage from '../assets/telegram_star.png'; // Импорт изображения звезды

function ModalGetTickets({ onClose }) {
  const [referralCode, setReferralCode] = useState(''); 

  // Функция для получения реферального кода
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};
    const startParam = tg.initDataUnsafe?.start_param;

    const fetchReferralCode = async (userId) => {
      try {
        console.log('Запрашиваем реферальный код для пользователя:', userId); 
        const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getReferralCode?userId=${userId}`);
        const data = await response.json();
        console.log('Ответ на запрос реферального кода:', data);  

        if (data.referralCode) {
          console.log('Получен существующий реферальный код:', data.referralCode);  
          setReferralCode(data.referralCode);
        } else {
          const generatedCode = generateReferralCode(userId);
          console.log('Создан новый реферальный код:', generatedCode);  
          setReferralCode(generatedCode);
          saveReferralCode(userId, generatedCode);
        }
      } catch (error) {
        console.error('Ошибка получения реферального кода:', error);
      }
    };

    const generateReferralCode = (userId) => {
      return `${userId}-${Math.random().toString(36).substring(2, 8)}`;
    };

    const saveReferralCode = async (userId, referralCode) => {
      try {
        console.log('Сохраняем реферальный код:', referralCode, 'для пользователя:', userId); 
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveReferralCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            referralCode,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save referral code');
        }
      } catch (error) {
        console.error('Ошибка сохранения реферального кода:', error);
      }
    };

    // Получение реферального кода при инициализации модального окна
    if (user.id) {
      if (startParam) {
        saveUserWithReferral(user.id, startParam).then(() => {
          fetchReferralCode(user.id);
        });
      } else {
        fetchReferralCode(user.id);
      }
    }
  }, []);

  const saveUserWithReferral = async (userId, referralCode) => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};

    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || user.first_name,
          referralCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user with referral code');
      }
    } catch (error) {
      console.error('Ошибка при сохранении пользователя с реферальным кодом:', error);
    }
  };

  // Функция для отправки приглашений друзьям
  const handleInviteFriends = () => {
    console.log('Текущий реферальный код:', referralCode);  
    
    if (!referralCode) {
      console.error('Реферальный код не сгенерирован!');
      return;
    }

    const tg = window.Telegram.WebApp;
    const referralLink = `https://t.me/Qqzgy_bot/game?startapp=${referralCode}`;
    const messageText = `Hey! Join QUIZY and get rewards! Use my referral link: ${referralLink}`;

    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`);
  };

  // Функция для покупки билета
  const handleBuyTicket = async () => {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id || '';

    if (!userId) {
      console.error('Не удалось получить ID пользователя');
      return;
    }

    try {
      // Отправляем запрос на создание инвойса для оплаты
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/createInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          chatId: tg.initDataUnsafe?.user?.id, // ID чата - это ID пользователя
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Инвойс успешно отправлен');
      } else {
        console.error('Ошибка при отправке инвойса:', result.error);
      }
    } catch (error) {
      console.error('Ошибка при отправке инвойса:', error);
    }
  };

  // Обработчик закрытия окна
  useEffect(() => {
    const overlay = document.querySelector('.modal-get-tickets-overlay');
    const modal = document.querySelector('.modal-get-tickets');

    if (overlay && modal) {
      setTimeout(() => {
        overlay.classList.add('open');
        modal.classList.add('open');
      }, 10);
    }

    const handleClickOutside = (event) => {
      if (event.target === overlay) {
        onClose();
      }
    };

    overlay.addEventListener('click', handleClickOutside);

    return () => {
      overlay.removeEventListener('click', handleClickOutside);
      if (overlay && modal) {
        overlay.classList.remove('open');
        modal.classList.remove('open');
      }
    };
  }, [onClose]);

  return (
    <div className="modal-get-tickets-overlay">
      <div className="modal-get-tickets">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-logo-container">
          <img src={TicketImage} alt="Ticket Logo" className="modal-ticket-logo" />
        </div>
        <h3 className="modal-h3">Get more tickets!</h3>
        <p className="modal-subtitle">
          To get additional tickets, you can invite friends or purchase them for 100 stars.
        </p>
        <div className="modal-buttons">
          <button className="invite-friends-button" onClick={handleInviteFriends}>
            Invite Friends
          </button>
          <button className="buy-tickets-button" onClick={handleBuyTicket}>
            Buy for <img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 100
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalGetTickets;
