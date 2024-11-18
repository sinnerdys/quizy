import React, { useEffect } from 'react';
import './ModalQuiz.css'; // Стили для модального окна
import TimeIcon from '../assets/timer.png';
import token from '../assets/TokenImage.png';

function ModalQuiz({ quiz, onClose, onStart, userId, setEnergy }) {
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

  const handleStartQuiz = async () => {
    try {
      // Проверяем наличие энергии и уменьшаем ее на сервере
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/startQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          quizId: quiz.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Обновляем энергию на фронтенде
        setEnergy((prevEnergy) => prevEnergy - 1);
        onStart(quiz.id); // Передаем ID текущего квиза
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

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
        <div className="quiz-modal-info">
          <span className="quiz-reward">+{quiz.reward} <img src={token} alt="QUIZY Token" className="reward-logo-quizes" /></span>
          <span className="quiz-time">{quiz.displayTime} <img src={TimeIcon} alt="Time icon" className="time-icon" /></span>
        </div>
        <button className="start-quiz-button" onClick={handleStartQuiz}>Start quiz</button>
      </div>
    </div>
  );
}

export default ModalQuiz;