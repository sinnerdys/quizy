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
        <svg width="300" height="300" viewBox="-150 -150 300 300" style={{ overflow: 'visible' }}>
        <g transform="rotate(0)">
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,-150A150,150 0 0,1 106.066,-106.066L0,0Z"></path>
      <text transform="rotate(-22.5) translate(110, -10)" textAnchor="middle">500</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M106.066,-106.066A150,150 0 0,1 150,0L0,0Z"></path>
      <text transform="rotate(22.5) translate(110, -10)" textAnchor="middle">1000</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M150,0A150,150 0 0,1 106.066,106.066L0,0Z"></path>
      <text transform="rotate(67.5) translate(110, -10)" textAnchor="middle">1500</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M106.066,106.066A150,150 0 0,1 0,150L0,0Z"></path>
      <text transform="rotate(112.5) translate(110, -10)" textAnchor="middle">2000</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,150A150,150 0 0,1 -106.066,106.066L0,0Z"></path>
      <text transform="rotate(157.5) translate(110, -10)" textAnchor="middle">2500</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-106.066,106.066A150,150 0 0,1 -150,0L0,0Z"></path>
      <text transform="rotate(202.5) translate(110, -10)" textAnchor="middle">3000</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-150,0A150,150 0 0,1 -106.066,-106.066L0,0Z"></path>
      <text transform="rotate(247.5) translate(110, -10)" textAnchor="middle">5000</text>
    </g>
    <g className="slice">
      <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-106.066,-106.066A150,150 0 0,1 0,-150L0,0Z"></path>
      <text transform="rotate(292.5) translate(110, -10)" textAnchor="middle">10000</text>
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
