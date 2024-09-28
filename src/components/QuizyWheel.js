import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import ArrowImage from '../assets/arrow_wheel.png';
import TicketImage from '../assets/ticket_image.png';

const QuizyWheel = () => {
    const WIN_ANGLE = 22.5; // Центральный угол сектора справа от стрелки
    const canvasRef = useRef(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const numSectors = 8; // Количество секторов

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
        const radius = 165;

        // Угол для каждого сектора
        const sectorAngle = (2 * Math.PI) / numSectors;
        const prizes = [500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];

        for (let i = 0; i < numSectors; i++) {
            const startAngle = i * sectorAngle;
            const endAngle = startAngle + sectorAngle;

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
            ctx.rotate(startAngle + sectorAngle / 2);
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
            // Запрос к Firebase Function
            const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/handleWheelSpin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (data.success) {
                const { prize, angle } = data;

                // Количество полных оборотов
                const spins = 5;
                const finalRotation = spins * 360 + angle - WIN_ANGLE;

                if (canvasRef.current) {
                    canvasRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
                    canvasRef.current.style.transform = `rotate(${finalRotation}deg)`;
                }

                setTimeout(() => {
                    handleRotationEnd(prize);
                }, 5000);
            }
        } catch (error) {
            console.error('Error spinning the wheel:', error);
            setIsSpinning(false);
        }
    };

    const handleRotationEnd = (prize) => {
        if (canvasRef.current) {
            // Показываем алерт с выигрышем
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
