import React, { useState } from 'react';
import './QuizyWheel.css'; // Стили для компонента

const QuizyWheel = ({ userId, updateBalance }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);

  const handleSpin = async () => {
    if (!isSpinning) {
      setIsSpinning(true);

      try {
        const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/spinQuizyWheel?userId=${userId}`);
        const data = await response.json();

        if (data.success) {
          const randomPrize = data.prize;
          setPrize(randomPrize);

          // Обновляем баланс пользователя на фронтенде
          updateBalance(data.newBalance);

          setTimeout(() => {
            setIsSpinning(false);
            alert(`You won ${randomPrize} tokens!`);
          }, 3000); // Время вращения колеса
        } else {
          console.error('Ошибка получения приза:', data.error);
          setIsSpinning(false);
        }
      } catch (error) {
        console.error('Ошибка при получении приза:', error);
        setIsSpinning(false);
      }
    }
  };

  return (
    <div className="quizy-wheel-container">
      <h1>Quizy Wheel</h1>
      <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
        <div className="sector">500</div>
        <div className="sector">1000</div>
        <div className="sector">1500</div>
        <div className="sector">2000</div>
        <div className="sector">2500</div>
        <div className="sector">3000</div>
        <div className="sector">5000</div>
        <div className="sector">10000</div>
      </div>
      <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Tap to Spin'}
      </button>
      <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
    </div>
  );
};

export default QuizyWheel;
