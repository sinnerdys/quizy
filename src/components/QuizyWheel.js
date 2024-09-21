import React, { useState } from 'react';
import './QuizyWheel.css'; // Стили для нашего компонента
import ArrowImage from '../assets/arrow_wheel.png'; // Путь к изображению стрелки

const sectors = [500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];
const sectorAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

const getRandomSector = () => {
  const randomIndex = Math.floor(Math.random() * sectors.length);
  return { prize: sectors[randomIndex], angle: sectorAngles[randomIndex] };
};

const QuizyWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const handleSpin = async () => {
    if (!isSpinning) {
      setIsSpinning(true);

      // Генерация случайного сектора и его угла
      const { prize, angle } = getRandomSector();

      // Генерация полного вращения (например, 4 полных оборота) и точного угла для остановки
      const randomRotation = 1440 + angle - (rotationAngle % 360); // Обновляем текущий угол
      setRotationAngle(rotationAngle + randomRotation); // Обновляем текущий угол

      // Даем время на завершение анимации
      setTimeout(() => {
        // Корректируем положение после завершения анимации
        setRotationAngle((prevRotation) => prevRotation + 22.5); // Добавляем 22.5 градуса для центрирования текста
        setTimeout(() => {
          // Остановка колеса на нужном угле после завершения анимации
          setIsSpinning(false);
          // Выводим награду
          console.log(`You won ${prize} tokens!`);
        }, 300); // Даем дополнительное время для корректировки
      }, 3000); // Время вращения 3 секунды
    }
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
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,-175A175,175 0 0,1 123.744,-123.744L0,0Z"></path>
              <text transform="rotate(-65) translate(120)" textAnchor="middle">500</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M123.744,-123.744A175,175 0 0,1 175,0L0,0Z"></path>
              <text transform="rotate(-20) translate(120)" textAnchor="middle">1000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M175,0A175,175 0 0,1 123.744,123.744L0,0Z"></path>
              <text transform="rotate(25) translate(120)" textAnchor="middle">1500</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M123.744,123.744A175,175 0 0,1 0,175L0,0Z"></path>
              <text transform="rotate(70) translate(120)" textAnchor="middle">2000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M0,175A175,175 0 0,1 -123.744,123.744L0,0Z"></path>
              <text transform="rotate(115) translate(120)" textAnchor="middle">2500</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-123.744,123.744A175,175 0 0,1 -175,0L0,0Z"></path>
              <text transform="rotate(160) translate(120)" textAnchor="middle">3000</text>
            </g>
            <g className="slice">
              <path fill="#152A60" stroke="#4365C0" strokeWidth="5" d="M-175,0A175,175 0 0,1 -123.744,-123.744L0,0Z"></path>
              <text transform="rotate(205) translate(120)" textAnchor="middle">5000</text>
            </g>
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
      <button className="spin-button" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Tap to Spin'}
      </button>
      <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
    </div>
  );
};

export default QuizyWheel;
