import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import ArrowImage from '../assets/arrow_wheel.png';
import TicketImage from '../assets/ticket_image.png';
import TokenImageW from '../assets/TokenImage.png';

const QuizyWheel = () => {
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const initialRotation = 1150 % 360;

  useEffect(() => {
    const savedAngle = localStorage.getItem('wheelLastAngle');
    const angleToSet = savedAngle !== null ? parseFloat(savedAngle) : initialRotation;
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${angleToSet}deg)`;
    }
  }, [initialRotation]);

  const spinWheel = async () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id;

    if (!userId) {
      console.error('User ID not found.');
      setIsSpinning(false);
      return;
    }

    try {
      // Запрос к Firebase Function для получения приза и угла
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/handleWheelSpin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        const { prize, newBalance, angle, sectorId } = data;

        // Убедитесь, что сектор с указанным ID существует на SVG
        const selectedText = document.getElementById(`text-${sectorId}`);
        if (!selectedText) {
          alert('Something went wrong with determining the sector. Please try again later.');
          setIsSpinning(false);
          return;
        }

        const spins = 5; // Количество полных вращений
        const finalAngle = angle + spins * 360; // Увеличиваем угол на количество полных вращений

        if (wheelRef.current) {
          wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
          wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
        }

        setTimeout(() => {
          handleRotationEnd(prize, newBalance, finalAngle);
        }, 5000);
      } else {
        alert('Something went wrong. Please try again later.');
        setIsSpinning(false);
      }
    } catch (error) {
      console.error('Error handling wheel spin:', error);
      alert('Failed to handle the wheel spin. Please try again later.');
      setIsSpinning(false);
    }
  };

  const handleRotationEnd = (prize, newBalance, finalAngle) => {
    if (wheelRef.current) {
      // Сбрасываем анимацию и устанавливаем конечный угол
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = `rotate(${finalAngle % 360}deg)`;

      // Сохраняем последний угол в localStorage
      localStorage.setItem('wheelLastAngle', finalAngle % 360);
    }

    setIsSpinning(false);

    // Отображение результата пользователю
    alert(`You won ${prize} tokens! Your new balance is ${newBalance} tokens.`);
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
