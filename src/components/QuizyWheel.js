import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import ArrowImage from '../assets/arrow_wheel.png';
import TicketImage from '../assets/ticket_image.png';
import ConfettiExplosion from 'react-confetti-explosion';
import TokenImage from '../assets/TokenImage.png'; // Импорт вашего логотипа

const QuizyWheel = () => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [isExploding, setIsExploding] = useState(false); // Для конфетти

  useEffect(() => {
    fetchPrizes();
  }, []);

  useEffect(() => {
    if (prizes.length > 0) {
      drawWheel(prizes);
    }
  }, [prizes]);

  const fetchPrizes = async () => {
    try {
      const response = await fetch('https://quizy-d6ffb-default-rtdb.firebaseio.com/prizes.json');
      const data = await response.json();

      if (data) {
        const fetchedPrizes = Object.keys(data).map((key) => data[key].value);
        setPrizes(fetchedPrizes.reverse());
      } else {
        setPrizes([]);
      }
    } catch (error) {
      console.error('Error fetching prizes:', error);
    }
  };

  const drawWheel = (prizes) => {
    const canvas = canvasRef.current;
    if (!canvas.getContext) {
      console.error('Canvas not supported by your browser.');
      return;
    }

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 165;

    const sectorAngleRadians = (2 * Math.PI) / prizes.length;

    // Создание объекта для изображения
    const tokenImage = new Image();
    tokenImage.src = TokenImage;

    // Отрисовка происходит после загрузки изображения
    tokenImage.onload = () => {
      for (let i = 0; i < prizes.length; i++) {
          const startAngle = i * sectorAngleRadians - sectorAngleRadians / 2;
          const endAngle = startAngle + sectorAngleRadians;

          // Рисуем сектора
          ctx.fillStyle = '#152A60';
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#4365C0';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Рисуем текст с призом
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(startAngle + sectorAngleRadians / 2);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '20px Arial';
          ctx.fillText(prizes[i], radius - 40, 10); // Разместим текст немного левее

          // Рисуем изображение токена рядом с текстом
          const imageSize = 30; // Размер изображения
          ctx.drawImage(tokenImage, radius - 50, -imageSize / 2, imageSize, imageSize); // Рисуем изображение токена

          ctx.restore();
      }

      // Обводка колеса
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#4365C0';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Рисуем центральный круг
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fillStyle = '#4365C0';
      ctx.fill();
  };
};

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
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/handleWheelSpin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error response from server:', data);
        throw new Error(data.error || 'Failed to spin the wheel');
      }

      if (data.success) {
        const { prize, angle } = data;

        console.log('Prize:', prize);
        console.log('Angle:', angle);

        if (canvasRef.current) {
          const spins = 5; // Количество полных оборотов
          const initialOffset = 360 / prizes.length / 2; // Смещение для выравнивания стрелки на центре сектора
          const newAngle = spins * 360 + angle + initialOffset; // Добавляем смещение

          canvasRef.current.style.transition = 'none';
          canvasRef.current.style.transform = `rotate(0deg)`;

          setTimeout(() => {
            canvasRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
            canvasRef.current.style.transform = `rotate(${newAngle}deg)`;
          }, 50);

          setTimeout(() => {
            handleRotationEnd(prize);
            setIsSpinning(false);
          }, 5050);
        }
      }
    } catch (error) {
      console.error('Error spinning the wheel:', error);
      setIsSpinning(false);
    }
  };

  const handleRotationEnd = (prize) => {
    if (canvasRef.current) {
      alert(`You won ${prize} tokens!`);
    }
    setIsExploding(true); // Запускаем конфетти
    setTimeout(() => setIsExploding(false), 3000); // Конфетти исчезают через 3 секунды
    setIsSpinning(false);
  };

  return (
    <div className="quizy-wheel-container">
      <h1 className="header-title">Quizy Wheel</h1>
      <div className="tickets-container">
        <p>Your Tickets</p>
        <div className="tickets-count-container">
          <p className="tickets-count">30</p>
          <img src={TicketImage} alt="Ticket" className="ticket-image" />
        </div>
      </div>
      <div className="wheel-container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={canvasRef} width="500" height="500"></canvas>
        <img src={ArrowImage} alt="Arrow" className="wheel-arrow" />
        {isExploding && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <ConfettiExplosion />
          </div>
        )} {/* Конфетти */}
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
