// src/components/DailyReward.js
import React, { useState } from 'react';
import Confetti from 'react-confetti'; // Импортируем библиотеку для конфетти
import './DailyReward.css'; // Стили для экрана ежедневных наград
import logo from '../assets/logo.png'; // Импортируем логотип

function DailyReward({ onContinue }) {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleContinue = () => {
    setShowConfetti(true); // Показываем конфетти

    // Через 5 секунд вызываем функцию для перехода на экран Home
    setTimeout(() => {
      setShowConfetti(false); // Останавливаем конфетти
      onContinue(); // Вызываем функцию перехода на Home
    }, 3000); // Через 5 секунд
  };

  return (
    <div className="daily-reward">
      {/* Блок с логотипом и наградой по центру */}
      <div className="reward-center-content">
        <div className="reward-logo-container">
          <img src={logo} alt="QUIZY Logo" className="reward-logo-daily" />
        </div>
        <h1>+100 $QUIZY</h1>
        <h2>Your daily rewards</h2>
      </div>

      {/* Нижний блок с текстом и кнопкой */}
      <div className="bottom-section">
        <p>Come back tomorrow for check-in next day. Skipping a day resets your streak.</p>
        <button className="continue-button" onClick={handleContinue}>
          Continue
        </button>
      </div>

      {/* Конфетти */}
      {showConfetti && <Confetti />}
    </div>
  );
}

export default DailyReward;
