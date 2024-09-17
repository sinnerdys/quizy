import React, { useEffect, useState } from 'react';
import './ModalTask.css'; // Стили для модального окна
import logo from '../assets/logo.png'; // Импортируем логотип

function ModalTask({ task, onComplete, onClose, showAlert }) { // Добавили showAlert как пропс
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [subscribeClicked, setSubscribeClicked] = useState(false); // Отслеживание нажатия на "Подписаться"

  // Логирование данных задачи
  useEffect(() => {
    console.log('Task Type:', task.type);
    console.log('Task Data:', task);
  }, [task]);

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
    window.open(task.subscribeUrl, '_blank'); // Открываем ссылку для подписки
    setSubscribeClicked(true); // Устанавливаем флаг, что пользователь нажал на "Подписаться"
  };

  const checkSubscription = async () => {
    setCheckingSubscription(true);
    try {
      console.log('Checking subscription for userId:', window.Telegram.WebApp.initDataUnsafe.user.id);
      console.log('Checking channel URL:', task.subscribeUrl);

      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/checkSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: window.Telegram.WebApp.initDataUnsafe.user.id, // Получаем ID пользователя Telegram
          channelUrl: task.subscribeUrl,
        }),
      });

      const result = await response.json();
      console.log('Check Subscription Result:', result);

      if (result.success && result.isSubscribed) {
        setIsSubscribed(true);
        setErrorMessage("");
        console.log('User is subscribed, completing task.');
        onComplete(task.id); // Выполняем задание
        onClose(); // Закрываем модальное окно после успешного выполнения задания
      } else {
        // В случае ошибки вызываем showAlert из Home.js
        showAlert("Failed to complete task. You are not subscribed to the channel.");
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

        {/* Если это задание на подписку, отображаем обе кнопки */}
        {task.type === "subscribe" && !isSubscribed && (
          <>
            <button className="subscribe-button" onClick={handleSubscribe}>
              Subscribe
            </button>
            <button
              className={`check-task-button ${!subscribeClicked ? 'disabled' : ''}`} // Меняем стиль, если кнопка не активна
              onClick={checkSubscription}
              disabled={!subscribeClicked || checkingSubscription} // Отключаем кнопку до нажатия на "Subscribe"
            >
              {checkingSubscription ? 'Checking...' : 'Check Task'}
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </>
        )}

        {/* Если задание не требует подписки или уже подписан */}
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
