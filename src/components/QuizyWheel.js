import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import ModalWin from './ModalWin'; // Импортируем компонент поп-апа
import ModalGetTickets from './ModalGetTickets'; // Импортируем новый поп-ап для получения билетов
import ArrowImage from '../assets/arrow_wheel.png';
import TicketImage from '../assets/ticket_image.png';
import ConfettiExplosion from 'react-confetti-explosion';
import TokenImage from '../assets/TokenImage.png'; // Импорт вашего логотипа

const QuizyWheel = () => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [isExploding, setIsExploding] = useState(false); // Для конфетти
  const [showModal, setShowModal] = useState(false); // Состояние для управления модальным окном
  const [showTicketsModal, setShowTicketsModal] = useState(false); // Состояние для показа поп-апа билетов
  const [prizeAmount, setPrizeAmount] = useState(null); // Состояние для хранения суммы выигрыша
  const [tickets, setTickets] = useState(0);
  const [nextTicketIn, setNextTicketIn] = useState(0);

  // Функция для получения информации о билетах
  const fetchTicketInfo = async () => {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id;

    const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getTicketInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    setTickets(data.tickets);
    setNextTicketIn(data.nextTicketIn);
  };

  useEffect(() => {
    fetchTicketInfo();
  }, []);

  useEffect(() => {
    if (!showModal && !showTicketsModal) {  // Останавливаем таймер, если открыто хоть одно модальное окно
      const interval = setInterval(() => {
        setNextTicketIn(prev => (prev > 0 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [nextTicketIn, showModal, showTicketsModal]);

  useEffect(() => {
    fetchPrizes();
  }, []);

  useEffect(() => {
    if (prizes.length > 0) {
      setupCanvas();
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

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Устанавливаем масштаб с учетом плотности пикселей устройства
    const scale = window.devicePixelRatio || 1;

    // Определяем размеры канваса
    const width = 500;  // Визуальная ширина
    const height = 500; // Визуальная высота

    // Увеличиваем разрешение канваса с учетом плотности пикселей
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Устанавливаем стиль канваса на его визуальный размер
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Масштабируем контекст для четкости
    ctx.scale(scale, scale);

    // Отрисовываем колесо
    drawWheel(prizes);
  };

  const drawWheel = (prizes) => {
    const canvas = canvasRef.current;
    if (!canvas.getContext) {
      console.error('Canvas not supported by your browser.');
      return;
    }

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2 / window.devicePixelRatio; // Учитываем масштаб
    const centerY = canvas.height / 2 / window.devicePixelRatio;
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
        ctx.font = '18px Arial';
        ctx.fillText(prizes[i], radius - 34, 10); // Разместим текст немного левее

        // Рисуем изображение токена рядом с текстом
        const imageWidth = 14; // Ширина изображения
        const imageHeight = 22; // Высота изображения (можете экспериментировать)
        const imageX = radius - 30; // Позиция изображения по горизонтали
        const imageY = -imageHeight / 2 + 3; // Центрируем по вертикали относительно текста
        ctx.drawImage(tokenImage, imageX, imageY, imageWidth, imageHeight); // Рисуем изображение токена

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
            fetchTicketInfo();  // Обновляем информацию о билетах
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
      // Вместо alert показываем модальное окно с выигрышем
      setPrizeAmount(prize); // Устанавливаем выигрыш для отображения в поп-апе
      setTimeout(() => {
        setShowModal(true); // Показываем поп-ап с задержкой
        setIsExploding(true); // Запускаем конфетти после выигрыша
        setTimeout(() => setIsExploding(false), 3000); // Конфетти исчезают через 3 секунды
      }, 300); // Добавляем задержку в 300 миллисекунд
    }
  };
  
    // Открытие поп-апа для получения билетов
    const handleGetTicketsClick = () => {
      setShowTicketsModal(true); // Показываем поп-ап при нажатии на кнопку "Get tickets for spin"
    };

  // Функция для закрытия поп-апа и запуска конфетти
  const closeModal = () => {
    setShowModal(false); // Закрываем поп-ап
    if (isExploding) setIsExploding(false); // Конфетти запускаются только при выигрыше
    setShowTicketsModal(false); // Закрываем поп-ап с билетами
    setIsSpinning(false); // Сбрасываем состояние вращения
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="quizy-wheel-container">
      <h1 className="header-title">Quizy Wheel</h1>
      <div className="tickets-container">
        <p>Your Tickets</p>
        <div className="tickets-count-container">
          <p className="tickets-count">{tickets}</p>
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
      {tickets > 0 ? (
          <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
            Tap to Spin
          </button>
        ) : (
          <button className="spin-button" onClick={handleGetTicketsClick}>
            Get tickets for spin
          </button>
        )}
        {tickets > 0 ? (
        <p className="info-text">Spin to win guaranteed prizes. You have a free spin every 3 hours.</p>
      ) : (
        <p className="info-text">Next free spin in {formatTime(nextTicketIn)}</p>
      )}
      </div>
          {/* Модальное окно выигрыша */}
          {showModal && <ModalWin prizeAmount={prizeAmount} onClose={closeModal} />}
          {showTicketsModal && <ModalGetTickets onClose={closeModal} />}
    </div>
  );
};

export default QuizyWheel;
