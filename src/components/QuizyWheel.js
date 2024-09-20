import React, { useState } from 'react';
import './QuizyWheel.css'; // Стили для нашего компонента
import ArrowImage from '../assets/arrow_wheel.png'; // Добавьте путь к изображению стрелки

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
            <div className="sector" style={{ transform: 'rotate(0deg)' }}>
              <span>500</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(45deg)' }}>
              <span>1000</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(90deg)' }}>
              <span>1500</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(135deg)' }}>
              <span>2000</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(180deg)' }}>
              <span>2500</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(225deg)' }}>
              <span>3000</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(270deg)' }}>
              <span>5000</span>
            </div>
            <div className="sector" style={{ transform: 'rotate(315deg)' }}>
              <span>10000</span>
            </div>
          </div>
          <div className="center-circle">
            <img src={ArrowImage} alt="arrow" className="arrow" />
          </div>
        </div>
        <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
          {isSpinning ? 'Spinning...' : 'Tap to Spin'}
        </button>
        <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
      </div>
    );
  };
  
  export default QuizyWheel;
