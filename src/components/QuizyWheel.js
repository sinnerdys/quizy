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
      <h1 className="header-title">Quizy Wheel</h1> {/* Закрепляем заголовок */}
      <div className="wheel-container">
        <svg width="300" height="300" viewBox="-150 -150 300 300" style={{ overflow: 'visible' }}>
          <g transform="rotate(0)">
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,-175A175,175 0 0,1 123.744,-123.744L0,0Z"></path>
              <text id="sector1" transform="rotate(-65) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>500</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M123.744,-123.744A175,175 0 0,1 175,0L0,0Z"></path>
              <text id="sector2" transform="rotate(-20) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>1000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M175,0A175,175 0 0,1 123.744,123.744L0,0Z"></path>
              <text id="sector3" transform="rotate(25) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>1500</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M123.744,123.744A175,175 0 0,1 0,175L0,0Z"></path>
              <text id="sector4" transform="rotate(70) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>2000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,175A175,175 0 0,1 -123.744,123.744L0,0Z"></path>
              <text id="sector5" transform="rotate(115) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>2500</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-123.744,123.744A175,175 0 0,1 -175,0L0,0Z"></path>
              <text id="sector6" transform="rotate(160) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>3000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-175,0A175,175 0 0,1 -123.744,-123.744L0,0Z"></path>
              <text id="sector7" transform="rotate(205) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>5000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-123.744,-123.744A175,175 0 0,1 0,-175L0,0Z"></path>
              <text id="sector8" transform="rotate(251) translate(120)" textAnchor="middle" style={{ fill: "white", fontSize: "20px", fontWeight: "bold" }}>10000</text>
            </g>
          </g>
          {/* Круг в центре */}
          <circle cx="0" cy="0" r="30" fill="#4365C0" />
          <image xlinkHref={ArrowImage} x="-25" y="-25" height="50px" width="100px" />
        </svg>
      </div>
      <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Tap to Spin'}
      </button>
      <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
    </div>
  );
};

export default QuizyWheel;
