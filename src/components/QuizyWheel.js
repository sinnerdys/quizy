import React, { useState } from 'react';
import './QuizyWheel.css'; // Стили для нашего компонента
import ArrowImage from '../assets/arrow_wheel.png'; // Путь к изображению стрелки

const QuizyWheel = () => {
    const [rotationAngle, setRotationAngle] = useState(1150);
    const [isSpinning, setIsSpinning] = useState(false);
  
    const sectorAngles = [295, 340, 25, 70, 115, 160, 205, 251];
    const deltaAngles = sectorAngles.map(angle => (angle - 295 + 360) % 360);
  
    const spinWheel = () => {
      const randomSector = Math.floor(Math.random() * 8);
      const rotationNeeded = deltaAngles[randomSector];
      const totalRotation = rotationAngle + 5 * 360 + rotationNeeded;
  
      setRotationAngle(totalRotation);
      setIsSpinning(true);
  
      setTimeout(() => {
        setIsSpinning(false);
      }, 5000);
    };

  return (
    <div className="quizy-wheel-container">
      <h1 className="header-title">Quizy Wheel</h1>
      <div className="wheel-container">
        <svg
          width="300"
          height="300"
          viewBox="-150 -150 300 300"
          className={isSpinning ? 'spinning' : ''}
          style={{ transform: `rotate(${rotationAngle}deg)`, overflow: 'visible' }}
        >
          <g>
            {/* Сектор 1 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,-175A175,175 0 0,1 123.744,-123.744L0,0Z"></path>
              <text transform="rotate(-65) translate(120)" textAnchor="middle">500</text>
            </g>
            {/* Сектор 2 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M123.744,-123.744A175,175 0 0,1 175,0L0,0Z"></path>
              <text transform="rotate(-20) translate(120)" textAnchor="middle">1000</text>
            </g>
            {/* Сектор 3 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M175,0A175,175 0 0,1 123.744,123.744L0,0Z"></path>
              <text transform="rotate(25) translate(120)" textAnchor="middle">1500</text>
            </g>
            {/* Сектор 4 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M123.744,123.744A175,175 0 0,1 0,175L0,0Z"></path>
              <text transform="rotate(70) translate(120)" textAnchor="middle">2000</text>
            </g>
            {/* Сектор 5 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,175A175,175 0 0,1 -123.744,123.744L0,0Z"></path>
              <text transform="rotate(115) translate(120)" textAnchor="middle">2500</text>
            </g>
            {/* Сектор 6 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-123.744,123.744A175,175 0 0,1 -175,0L0,0Z"></path>
              <text transform="rotate(160) translate(120)" textAnchor="middle">3000</text>
            </g>
            {/* Сектор 7 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-175,0A175,175 0 0,1 -123.744,-123.744L0,0Z"></path>
              <text transform="rotate(205) translate(120)" textAnchor="middle">5000</text>
            </g>
            {/* Сектор 8 */}
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-123.744,-123.744A175,175 0 0,1 0,-175L0,0Z"></path>
              <text transform="rotate(251) translate(120)" textAnchor="middle">10000</text>
            </g>
          </g>
          <circle cx="0" cy="0" r="30" fill="#4365C0" />
        </svg>
        {/* Стрелка в центре */}
        <img src={ArrowImage} alt="Arrow" className="wheel-arrow" />
      </div>
      <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Tap to Spin'}
      </button>
      <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
    </div>
  );
};

export default QuizyWheel;
