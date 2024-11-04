import React, { useEffect } from 'react';
import './ModalQuiz.css'; // Стили для модального окна
import TimeIcon from '../assets/timer.png';
import token from '../assets/TokenImage.png';

function ModalQuiz({ quiz, onClose }) {
  useEffect(() => {
    const overlay = document.querySelector('.modal-quiz-overlay');
    const modal = document.querySelector('.modal-quiz');

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
    <div className="modal-quiz-overlay">
      <div className="modal-quiz">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-logo-container">
          <img src={quiz.imageUrl} alt={quiz.title} className="modal-logo" />
        </div>
        <h2>{quiz.title}</h2>
        <p>{quiz.description}</p>
        <div className="quiz-info">
          <span className="quiz-reward">+{quiz.reward}</span><img src={token} alt="QUIZY Token" className="reward-logo-quizes" />
          <span className="quiz-time">{quiz.time} <img src={TimeIcon} alt="Time icon" className="time-icon" /></span>
        </div>
        <button className="start-quiz-button">Start quiz</button>
      </div>
    </div>
  );
}

export default ModalQuiz;
