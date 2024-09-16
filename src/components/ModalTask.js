import React, { useEffect } from 'react';
import './ModalTask.css'; // Стили для модального окна
import logo from '../assets/logo.png'; // Импортируем логотип

function ModalTask({ task, onComplete, onClose }) {
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
  };

  const handleCheckTask = () => {
    // Выполняем задание и закрываем модальное окно
    onComplete(task.id);
  };

  return (
    <div className="modal-task-overlay" onClick={onClose}> {/* Закрытие при нажатии вне модального окна */}
      <div className="modal-task" onClick={(e) => e.stopPropagation()}> {/* Остановка распространения клика */}
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
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
