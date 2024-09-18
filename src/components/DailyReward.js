import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './DailyReward.css';
import logo from '../assets/logo.png';

function DailyReward({ onContinue }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Добавляем состояние для отключения кнопки

  const handleContinue = () => {
    setShowConfetti(true);
    setIsButtonDisabled(true); // Делаем кнопку неактивной после нажатия

    // Показываем конфетти 4 секунды, потом вызываем onContinue
    setTimeout(() => {
      setShowConfetti(false);
      onContinue(); // Переходим на Home и обновляем баланс
    }, 5000);
  };

  return (
    <div className="daily-reward">
      {/* Анимация заголовка Day 1 */}
      <div className="day-title">
        <h1>Day 1</h1>
      </div>

      {/* Логотип и награда */}
      <div className="reward-center-content">
        <div className="reward-logo-container">
          <img src={logo} alt="QUIZY Logo" className="reward-logo-daily" />
        </div>
        <h1>+100 $QUIZY</h1>
        <h2>Your daily rewards</h2>
      </div>

      {/* Текст и кнопка внизу */}
      <div className="bottom-section">
        <p>Come back tomorrow for check-in next day. Skipping a day resets your streak.</p>
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={isButtonDisabled} // Делаем кнопку неактивной, если она уже была нажата
        >
          Continue
        </button>
      </div>

      {/* Конфетти */}
      {showConfetti && <Confetti />}
    </div>
  );
}

export default DailyReward;
