import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css'; // Стили для нашего компонента
import ArrowImage from '../assets/arrow_wheel.png'; // Путь к изображению стрелки

const QuizyWheel = () => {
    const wheelRef = useRef(null);
    const [isSpinning, setIsSpinning] = useState(false);
  
    const initialRotation = 1150 % 360;
  
    // Углы центров секторов
    const sectorAngles = [295, 340, 25, 70, 115, 160, 205, 251];
  
    // Состояние для хранения последнего угла
    const [lastAngle, setLastAngle] = useState(initialRotation);
  
    // Считываем последний угол из localStorage при монтировании компонента
    useEffect(() => {
      const savedAngle = localStorage.getItem('wheelLastAngle');
      if (savedAngle !== null) {
        setLastAngle(parseFloat(savedAngle));
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${parseFloat(savedAngle)}deg)`;
        }
      } else {
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${initialRotation}deg)`;
        }
      }
    }, [initialRotation]);
  
    const spinWheel = () => {
      if (isSpinning) return;
  
      const randomSector = Math.floor(Math.random() * sectorAngles.length);
      const sectorAngle = sectorAngles[randomSector];
  
      const spins = 5;
      const currentRotation = getCurrentRotation();
  
      const rotationNeeded =
        spins * 360 + ((360 - sectorAngle + currentRotation) % 360);
  
      setIsSpinning(true);
  
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
        wheelRef.current.style.transform = `rotate(${currentRotation + rotationNeeded}deg)`;
      }
  
      setTimeout(() => {
        handleRotationEnd();
      }, 5000);
    };
  
    const getCurrentRotation = () => {
      if (wheelRef.current) {
        const computedStyle = window.getComputedStyle(wheelRef.current);
        const transformMatrix = computedStyle.getPropertyValue('transform');
  
        let angle = 0;
        if (transformMatrix && transformMatrix !== 'none') {
          const values = transformMatrix
            .split('(')[1]
            .split(')')[0]
            .split(',');
          const a = values[0];
          const b = values[1];
          angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          if (angle < 0) angle += 360;
        } else {
          angle = lastAngle;
        }
        return angle;
      }
      return lastAngle;
    };
  
    const handleRotationEnd = () => {
      if (wheelRef.current) {
        const angle = getCurrentRotation();
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `rotate(${angle % 360}deg)`;
  
        // Сохраняем угол в localStorage
        localStorage.setItem('wheelLastAngle', angle % 360);
        setLastAngle(angle % 360);
      }
      setIsSpinning(false);
  
      // Дополнительная логика после вращения
    };
  

  return (
    <div className="quizy-wheel-container">
      <h1 className="header-title">Quizy Wheel</h1>
      <div className="wheel-container">
        <svg
          ref={wheelRef} // Добавили ref здесь
          width="300"
          height="300"
          viewBox="-150 -150 300 300"
          style={{ transform: `rotate(${initialRotation}deg)`, overflow: 'visible' }}
        >
          <g>
            {/* Сектор 1 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M0,-175A175,175 0 0,1 123.744,-123.744L0,0Z"
              ></path>
              <text transform="rotate(-65) translate(120)" textAnchor="middle">
                500
              </text>
            </g>
            {/* Сектор 2 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M123.744,-123.744A175,175 0 0,1 175,0L0,0Z"
              ></path>
              <text transform="rotate(-20) translate(120)" textAnchor="middle">
                1000
              </text>
            </g>
            {/* Сектор 3 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M175,0A175,175 0 0,1 123.744,123.744L0,0Z"
              ></path>
              <text transform="rotate(25) translate(120)" textAnchor="middle">
                1500
              </text>
            </g>
            {/* Сектор 4 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M123.744,123.744A175,175 0 0,1 0,175L0,0Z"
              ></path>
              <text transform="rotate(70) translate(120)" textAnchor="middle">
                2000
              </text>
            </g>
            {/* Сектор 5 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M0,175A175,175 0 0,1 -123.744,123.744L0,0Z"
              ></path>
              <text transform="rotate(115) translate(120)" textAnchor="middle">
                2500
              </text>
            </g>
            {/* Сектор 6 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M-123.744,123.744A175,175 0 0,1 -175,0L0,0Z"
              ></path>
              <text transform="rotate(160) translate(120)" textAnchor="middle">
                3000
              </text>
            </g>
            {/* Сектор 7 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M-175,0A175,175 0 0,1 -123.744,-123.744L0,0Z"
              ></path>
              <text transform="rotate(205) translate(120)" textAnchor="middle">
                5000
              </text>
            </g>
            {/* Сектор 8 */}
            <g className="slice">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="5"
                d="M-123.744,-123.744A175,175 0 0,1 0,-175L0,0Z"
              ></path>
              <text transform="rotate(251) translate(120)" textAnchor="middle">
                10000
              </text>
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
