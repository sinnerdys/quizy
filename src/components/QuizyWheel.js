import React, { useState } from 'react';
import './QuizyWheel.css'; // Стили для нашего компонента
import ArrowImage from './arrow_wheel.png'; // Добавьте путь к изображению стрелки

const QuizyWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = async () => {
    if (!isSpinning) {
      setIsSpinning(true);

      // Симулируем вращение и получение приза
      setTimeout(() => {
        setIsSpinning(false);
        const randomPrize = 1000; // Симулируем получение награды (замените на API)
        alert(`You won ${randomPrize} tokens!`);
      }, 3000); // Время вращения 3 секунды
    }
  };

  return (
    <div className="quizy-wheel-container">
      <h1>Quizy Wheel</h1>
      <div className="wheel-container">
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
        <img src={ArrowImage} alt="arrow" className="arrow" />
      </div>
      <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Tap to Spin'}
      </button>
      <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
    </div>
  );
};

export default QuizyWheel;
