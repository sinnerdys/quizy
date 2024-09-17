import React, { useEffect, useState } from 'react';
import './ModalTask.css'; // Стили для модального окна
import logo from '../assets/logo.png'; // Импортируем логотип

function ModalTask({ task, onComplete, onClose }) {
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [subscribeClicked, setSubscribeClicked] = useState(false); // Для отслеживания нажатия "Subscribe"

  useEffect(() => {
    const overlay = document.querySelector('.modal-task-overlay');
    const modal = document.querySelector('.modal-task');

    if (overlay && modal) {
      setTimeout(() => {
        overlay.classList.add('open');
        modal.classList.add('open');
      }, 10);
    }

    return () => {
      if (overlay && modal) {
        overlay.classList.remove('open');
        modal.classList.remove('open');
      }
    };
  }, []);

  const handleSubscribe = () => {
    window.open(task.subscribeUrl, '_blank');
    setSubscribeClicked(true); // Пользователь нажал "Subscribe"
  };

  const checkSubscription = async () => {
    setCheckingSubscription(true);
    try {
      // Проверяем наличие данных для запроса
      const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
      const channelUrl = task.subscribeUrl;

      if (!userId || !channelUrl) {
        console.error('Missing userId or subscribeUrl');
        setErrorMessage("Unable to verify subscription.");
        setCheckingSubscription(false);
        return;
      }

      console.log('Checking subscription for userId:', userId);
      console.log('Checking channel URL:', channelUrl);

      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/checkSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          channelUrl,
        }),
      });

      const result = await response.json();
      if (result.success && result.isSubscribed) {
        setIsSubscribed(true);
        setErrorMessage("");
        onComplete(task.id); // Если подписан, выполняем задание
      } else {
        setErrorMessage("You are not subscribed to the channel.");
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setErrorMessage("Failed to check subscription.");
    } finally {
      setCheckingSubscription(false);
    }
  };

  return (
    <div className="modal-task-overlay">
      <div className="modal-task">
        <button className="close-button" onClick={onClose}>✕</button>
        <div className="modal-logo-container">
          <img src={logo} alt="QUIZY Logo" className="modal-logo" />
        </div>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <div className="reward-info">
          <span>+{task.reward} $QUIZY</span>
        </div>

        {/* Если это задание на подписку, отображаем кнопки подписки и проверки */}
        {task.type === "subscribe" && !isSubscribed && (
          <>
            <button className="subscribe-button" onClick={handleSubscribe}>
              Subscribe
            </button>
            <button
              className={`check-task-button ${!subscribeClicked ? 'disabled' : ''}`}
              onClick={checkSubscription}
              disabled={!subscribeClicked || checkingSubscription} // Отключаем кнопку, пока не нажата Subscribe
            >
              {checkingSubscription ? 'Checking...' : 'Check task'}
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {!subscribeClicked && <p className="info-message">Please subscribe to the channel first</p>}
          </>
        )}

        {/* Если это не задание на подписку или уже подписан */}
        {(task.type !== "subscribe" || isSubscribed) && (
          <button className="check-task-button" onClick={() => onComplete(task.id)}>
            Complete Task
          </button>
        )}
      </div>
    </div>
  );
}

export default ModalTask;
