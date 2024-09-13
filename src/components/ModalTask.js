// src/components/ModalTask.js
import React, { useEffect } from 'react';
import './ModalTask.css'; // Стили для модального окна
import logo from '../assets/logo.png'; // Импортируем логотип

function ModalTask({ task, onClose }) {
  // Для плавного появления модального окна добавим эффект
  useEffect(() => {
    // Когда модальное окно открыто, добавляем класс 'open' для плавного появления
    const overlay = document.querySelector('.modal-task-overlay');
    const modal = document.querySelector('.modal-task');

    if (overlay && modal) {
      setTimeout(() => {
        overlay.classList.add('open');
        modal.classList.add('open');
      }, 10); // Добавляем небольшой тайм-аут, чтобы анимация сработала правильно
    }

    // Убираем класс 'open' при закрытии окна
    return () => {
      if (overlay && modal) {
        overlay.classList.remove('open');
        modal.classList.remove('open');
      }
    };
  }, []);

  const handleSubscribe = () => {
    // Переход на ссылку подписки
    window.open(task.subscribeUrl, '_blank');
  };

  const handleCheckTask = () => {
    // Логика проверки выполнения задания
    alert('Checking task...'); // Здесь будет проверка
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
        <button className="subscribe-button" onClick={handleSubscribe}>Subscribe</button>
        <button className="check-task-button" onClick={handleCheckTask}>Check task</button>
      </div>
    </div>
  );
}

export default ModalTask;
