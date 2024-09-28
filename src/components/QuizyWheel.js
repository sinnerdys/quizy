import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import ArrowImage from '../assets/arrow_wheel.png';
import TicketImage from '../assets/ticket_image.png';

const QuizyWheel = () => {
    const WIN_ANGLE = 50; // Угол, на котором должна остановиться стрелка
    const canvasRef = useRef(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const prizes = [500, 1000, 1500, 2000, 2500, 3000, 5000, 10000]; // Призы на колесе
    const numSectors = prizes.length; // Количество секторов

    useEffect(() => {
        drawWheel();
    }, []);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas.getContext) {
            console.error('Canvas not supported by your browser.');
            return;
        }

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 200; // Увеличиваем радиус для большего колеса

        // Угол для каждого сектора
        const sectorAngle = (2 * Math.PI) / numSectors;

        for (let i = 0; i < numSectors; i++) {
            // Начальный и конечный угол сектора
            const startAngle = i * sectorAngle;
            const endAngle = startAngle + sectorAngle;

            // Заполнение сектора цветом
            ctx.fillStyle = '#152A60'; // Цвет сектора
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();

            // Обводка границ сектора
            ctx.strokeStyle = '#4365C0';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Добавление текста приза в центр сектора
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sectorAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Arial';
            ctx.fillText(prizes[i], radius - 20, 10);
            ctx.restore();
        }

        // Рисуем обводку всего колеса
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#4365C0'; // Цвет обводки колеса
        ctx.lineWidth = 4;
        ctx.stroke();

        // Рисуем центральный круг
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = '#4365C0'; // Цвет центрального круга
        ctx.fill();
    };

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);

        // Случайный выбор сектора
        const randomSector = Math.floor(Math.random() * numSectors);
        const sectorAngle = (randomSector * 360) / numSectors; // Центральный угол выбранного сектора в градусах

        // Количество полных оборотов
        const spins = 5;

        // Расчет необходимого угла для вращения, чтобы колесо остановилось на нужном секторе
        const finalRotation = spins * 360 + sectorAngle - WIN_ANGLE;

        if (canvasRef.current) {
            canvasRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
            canvasRef.current.style.transform = `rotate(${finalRotation}deg)`;
        }

        setTimeout(() => {
            handleRotationEnd(randomSector);
        }, 5000);
    };

    const handleRotationEnd = (randomSector) => {
        if (canvasRef.current) {
            const finalAngle = (randomSector * 360) / numSectors - WIN_ANGLE;
            canvasRef.current.style.transition = 'none';
            canvasRef.current.style.transform = `rotate(${finalAngle}deg)`;

            // Показываем алерт с выигрышем
            alert(`You won ${prizes[randomSector]} tokens!`);
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
                <canvas ref={canvasRef} width="500" height="500"></canvas> {/* Увеличен размер canvas */}
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
