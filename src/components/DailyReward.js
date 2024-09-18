import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './DailyReward.css';
import logo from '../assets/logo.png';

function DailyReward({ userId, onContinue }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0); // Награда за день
  const [rewardDay, setRewardDay] = useState(1); // День награды

  useEffect(() => {
    // Функция для получения информации о награде с бэкенда
    const fetchRewardInfo = async () => {
      try {
        const response = await fetch(
          `https://us-central1-quizy-d6ffb.cloudfunctions.net/handleDailyReward?userId=${userId}`
        );
        const data = await response.json();

        if (data.success) {
          setRewardAmount(data.rewardAmount);
          setRewardDay(data.rewardStreak);
        } else {
          // Если награда уже получена сегодня
          setRewardAmount(0);
        }
      } catch (error) {
        console.error('Error fetching reward info:', error);
      }
    };

    fetchRewardInfo();
  }, [userId]);

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
        <h1>Day {rewardDay}</h1>
      </div>

      {/* Логотип и награда */}
      <div className="reward-center-content">
        <div className="reward-logo-container">
          <img src={logo} alt="QUIZY Logo" className="reward-logo-daily" />
        </div>
        <h1>+{rewardAmount} $QUIZY</h1>
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
