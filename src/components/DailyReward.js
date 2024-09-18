import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './DailyReward.css';
import logo from '../assets/logo.png';

function DailyReward({ onContinue, rewardAmount, currentDay }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleContinue = () => {
    setShowConfetti(true);
    setIsButtonDisabled(true); // Делаем кнопку неактивной после нажатия

    // Показываем конфетти 4 секунды, потом вызываем onContinue
    setTimeout(() => {
      setShowConfetti(false);
      onContinue(); // Переходим на Home и обновляем баланс
    }, 4000);
  };

  return (
    <div className="daily-reward">
      {/* Анимация заголовка с динамическим днем */}
      <div className="day-title">
        <h1>Day {currentDay}</h1> {/* Используем currentDay */}
      </div>

      {/* Логотип и награда */}
      <div className="reward-center-content">
        <div className="reward-logo-container">
          <img src={logo} alt="QUIZY Logo" className="reward-logo-daily" />
        </div>
        <h1>+{rewardAmount} $QUIZY</h1> {/* Используем rewardAmount */}
        <h2>Your daily rewards</h2>
      </div>

      {/* Текст и кнопка внизу */}
      <div className="bottom-section">
        <p>Come back tomorrow for check-in next day. Skipping a day resets your streak.</p>
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={isButtonDisabled || rewardAmount === 0} // Кнопка неактивна, если награда уже получена
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
