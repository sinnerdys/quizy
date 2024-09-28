import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css'; // Стили для нашего компонента
import ArrowImage from '../assets/arrow_wheel.png'; // Путь к изображению стрелки
import TicketImage from '../assets/ticket_image.png'; // Путь к изображению билета
import TokenImageW from '../assets/TokenImage.png'; // Путь к изображению токена

const QuizyWheel = () => {
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Начальный угол вращения (модуль 360 для избегания слишком большого значения)
  const initialRotation = 1150 % 360;

  // Углы центров секторов и соответствующие призы
  const sectorAngles = [
      { angle: 295, prize: 500 },
      { angle: 340, prize: 1000 },
      { angle: 25, prize: 1500 },
      { angle: 70, prize: 2000 },
      { angle: 115, prize: 2500 },
      { angle: 160, prize: 3000 },
      { angle: 205, prize: 5000 },
      { angle: 251, prize: 10000 }
  ];

  // Состояние для хранения последнего угла
  const [lastAngle, setLastAngle] = useState(initialRotation);

  // Считываем последний угол из localStorage при монтировании компонента
  useEffect(() => {
      const savedAngle = localStorage.getItem('wheelLastAngle');
      if (savedAngle !== null) {
          const parsedAngle = parseFloat(savedAngle);
          setLastAngle(parsedAngle);
          if (wheelRef.current) {
              wheelRef.current.style.transform = `rotate(${parsedAngle}deg)`;
          }
      } else {
          if (wheelRef.current) {
              wheelRef.current.style.transform = `rotate(${initialRotation}deg)`;
          }
      }
  }, [initialRotation]);

  const spinWheel = () => {
      if (isSpinning) return;

      setIsSpinning(true);

      // Случайный выбор сектора
      const randomSector = Math.floor(Math.random() * sectorAngles.length);
      const sectorAngle = sectorAngles[randomSector].angle;

      // Добавляем случайную корректировку в пределах 5 градусов, чтобы не попадать на грани
      const adjustment = Math.random() * 60 - 30; 
      const adjustedAngle = sectorAngle + adjustment;

      const spins = 5; // Количество полных оборотов
      const currentRotation = getCurrentRotation(); // Получаем текущий угол колеса

      // Расчет необходимого угла для вращения, чтобы колесо остановилось на нужном секторе
      const rotationNeeded = spins * 360 + ((360 - adjustedAngle + currentRotation) % 360);

      if (wheelRef.current) {
          wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
          wheelRef.current.style.transform = `rotate(${currentRotation + rotationNeeded}deg)`;
      }

      setTimeout(() => {
          handleRotationEnd(currentRotation + rotationNeeded);
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

  const handleRotationEnd = (finalAngle) => {
      if (wheelRef.current) {
          const angle = finalAngle % 360;
          wheelRef.current.style.transition = 'none';
          wheelRef.current.style.transform = `rotate(${angle}deg)`;

          // Сохраняем угол в localStorage
          localStorage.setItem('wheelLastAngle', angle);
          setLastAngle(angle);

          // Определение сектора, на котором остановилась стрелка
          let closestSector = sectorAngles[0];
          let minDifference = Math.abs(angle - sectorAngles[0].angle);
          for (let i = 1; i < sectorAngles.length; i++) {
              const difference = Math.abs(angle - sectorAngles[i].angle);
              if (difference < minDifference) {
                  minDifference = difference;
                  closestSector = sectorAngles[i];
              }
          }

          // Показываем алерт с выигрышем
          alert(`You won ${closestSector.prize} tokens!`);
      }
      setIsSpinning(false);
  };



  return (
    <div className="quizy-wheel-container">
      <h1 className="header-title">Quizy Wheel</h1>
      {/* Количество билетов с изображением */}
      <div className="tickets-container">
        <p>Your Tickets</p>
        <div className="tickets-count-container">
          <p className="tickets-count">30</p> {/* Замените на динамическое значение, если нужно */}
          <img src={TicketImage} alt="Ticket" className="ticket-image" />
        </div>
      </div>
      <div className="wheel-container">
        <svg
          ref={wheelRef}
          width="300"
          height="300"
          viewBox="-150 -150 300 300"
          style={{ transform: `rotate(${initialRotation}deg)`, overflow: 'visible' }}
        >
          <g>
            {/* Сектор 1 */}
            <g className="slice" id="sector-1">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M0,-175A175,175 0 0,1 123.744,-123.744L0,0Z"
              ></path>
              <text id="text-1" transform="rotate(-65) translate(120)" textAnchor="middle">
                500
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(-65) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 2 */}
            <g className="slice" id="sector-2">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M123.744,-123.744A175,175 0 0,1 175,0L0,0Z"
              ></path>
              <text id="text-2" transform="rotate(-20) translate(115)" textAnchor="middle">
                1000
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(-20) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 3 */}
            <g className="slice" id="sector-3">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M175,0A175,175 0 0,1 123.744,123.744L0,0Z"
              ></path>
              <text id="text-3" transform="rotate(25) translate(115)" textAnchor="middle">
                1500
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(25) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 4 */}
            <g className="slice" id="sector-4">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M123.744,123.744A175,175 0 0,1 0,175L0,0Z"
              ></path>
              <text id="text-4" transform="rotate(70) translate(115)" textAnchor="middle">
                2000
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(70) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 5 */}
            <g className="slice" id="sector-5">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M0,175A175,175 0 0,1 -123.744,123.744L0,0Z"
              ></path>
              <text id="text-5" transform="rotate(115) translate(115)" textAnchor="middle">
                2500
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(115) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 6 */}
            <g className="slice" id="sector-6">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M-123.744,123.744A175,175 0 0,1 -175,0L0,0Z"
              ></path>
              <text id="text-6" transform="rotate(160) translate(115)" textAnchor="middle">
                3000
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(160) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 7 */}
            <g className="slice" id="sector-7">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M-175,0A175,175 0 0,1 -123.744,-123.744L0,0Z"
              ></path>
              <text id="text-7" transform="rotate(205) translate(115)" textAnchor="middle">
                5000
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(205) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>

            {/* Сектор 8 */}
            <g className="slice" id="sector-8">
              <path
                fill="#152A60"
                stroke="#4365C0"
                strokeWidth="4"
                d="M-123.744,-123.744A175,175 0 0,1 0,-175L0,0Z"
              ></path>
              <text id="text-8" transform="rotate(251) translate(108)" textAnchor="middle">
                10000
              </text>
              <image
                href={TokenImageW}
                width="14"
                height="22"
                transform="rotate(251) translate(140, -18)" /* Исправили положение изображения */
              />
            </g>
          </g>
          <circle cx="0" cy="0" r="30" fill="#4365C0" />
        </svg>
        {/* Стрелка в центре */}
        <img src={ArrowImage} alt="Arrow" className="wheel-arrow" />
      </div>
      <div className="button-container">
        <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
          {isSpinning ? 'Spinning...' : 'Tap to Spin'}
        </button>
        <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 6 hours.</p>
      </div>
    </div>
  );
};

export default QuizyWheel;
