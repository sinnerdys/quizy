import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import ArrowImage from '../assets/arrow_wheel.png';
import TicketImage from '../assets/ticket_image.png';

const QuizyWheel = () => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    fetchPrizes();
  }, []);

  useEffect(() => {
    if (prizes.length > 0) {
      drawWheel(prizes);
      setInitialRotation();
    }
  }, [prizes]);

  const fetchPrizes = async () => {
    try {
      const response = await fetch('https://quizy-d6ffb-default-rtdb.firebaseio.com/prizes.json');
      const data = await response.json();
  
      if (data) {
        const fetchedPrizes = Object.keys(data).map((key) => data[key].value);
        setPrizes(fetchedPrizes.reverse()); // Исправлено
      } else {
        setPrizes([]); // Устанавливаем пустой массив, если данные отсутствуют
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

    // Угол для каждого сектора в радианах
    const sectorAngleRadians = (2 * Math.PI) / prizes.length;

    for (let i = 0; i < prizes.length; i++) {
      const startAngle = i * sectorAngleRadians;
      const endAngle = startAngle + sectorAngleRadians;

      ctx.fillStyle = '#152A60';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#4365C0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sectorAngleRadians / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.fillText(prizes[i], radius - 20, 10);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#4365C0';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#4365C0';
    ctx.fill();
  };

  const setInitialRotation = () => {
    // Устанавливаем начальный угол только один раз
    if (canvasRef.current) {
      canvasRef.current.style.transform = `rotate(${currentAngle}deg)`;
    }
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
      // Запрос к Firebase Function с передачей текущего угла
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/handleWheelSpin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isFirstSpin }), // Передаем userId и isFirstSpin на бэкенд
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Error response from server:', data);
        throw new Error(data.error || 'Failed to spin the wheel');
      }
  
      if (data.success) {
        const { prize, angle } = data;
  
        // Логирование значений prize и angle
        console.log('Prize:', prize);
        console.log('Angle:', angle);
  
        if (canvasRef.current) {
          // Устанавливаем поворот колеса согласно результату от бэкенда
          const totalAngle = currentAngle + angle; // Добавляем угол от бэкенда к текущему углу
  
          canvasRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
          canvasRef.current.style.transform = `rotate(${totalAngle}deg)`;
  
          setTimeout(() => {
            handleRotationEnd(prize);
            setCurrentAngle(totalAngle % 360); // Обновляем текущий угол после вращения
          }, 5000);
        }
  
        // После первого вращения больше не нужно добавлять целевой угол
        setIsFirstSpin(false);
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
      <div className="wheel-container">
        <canvas ref={canvasRef} width="500" height="500"></canvas>
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
