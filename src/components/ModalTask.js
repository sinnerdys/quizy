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

    // Закрытие при нажатии на overlay
    const handleOverlayClick = (e) => {
      if (e.target === overlay) {
        onClose(); // Закрываем модальное окно
      }
    };

    overlay.addEventListener('click', handleOverlayClick);

    return () => {
      if (overlay && modal) {
        overlay.classList.remove('open');
        modal.classList.remove('open');
        overlay.removeEventListener('click', handleOverlayClick);
      }
    };
  }, [onClose]);

  const handleSubscribe = () => {
    window.open(task.subscribeUrl, '_blank');
  };

  const handleCheckTask = () => {
    onComplete(task.id); // Проверяем выполнение задания
  };

  return (
    <div className="modal-task-overlay">
      <div className="modal-task">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
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
