import React, { useState, useRef, useEffect } from 'react';
import './QuizyWheel.css';
import TicketImage from '../assets/ticket_image.png';

const QuizyWheel = () => {
    const canvasRef = useRef(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [prizes, setPrizes] = useState([]);
    const [sectorAngle, setSectorAngle] = useState(0);

    useEffect(() => {
        initializeWheel();
    }, []);

    const initializeWheel = async () => {
        try {
            const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/initializeWheel');
            const data = await response.json();

            if (data.success) {
                setPrizes(data.probabilities.map(item => item.prize));
                setSectorAngle(data.sectorAngle);
                drawWheel(data.probabilities.map(item => item.prize), data.sectorAngle);
            }
        } catch (error) {
            console.error('Error initializing wheel:', error);
        }
    };

    const drawWheel = (prizes, sectorAngle) => {
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
                const { prize, angle, sectorIndex } = data;
    
                // Количество полных оборотов
                const spins = 5;
                const finalRotation = spins * 360 + angle;
    
                if (canvasRef.current) {
                    canvasRef.current.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)';
                    canvasRef.current.style.transform = `rotate(${finalRotation}deg)`;
                }
    
                setTimeout(() => {
                    // Определение выигрышного сектора после вращения
                    const winningAngle = (finalRotation % 360 + 360) % 360; // Угол после вращения
                    const winningIndex = Math.floor(winningAngle / sectorAngle) % prizes.length; // Индекс сектора
    
                    alert(`You won ${prizes[winningIndex]} tokens!`);
                    setIsSpinning(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error spinning the wheel:', error);
            setIsSpinning(false);
        }
    };

    const handleRotationEnd = (prize) => {
        alert(`You won ${prize} tokens!`);
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
            <div className="wheel-container" style={{ position: 'relative' }}>
                <canvas ref={canvasRef} width="500" height="500"></canvas>
                {/* Стрелка */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100px',
                        height: '30px',
                        backgroundColor: '#152A60',
                        clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)',
                        transform: 'translate(-50%, -50%) rotate(90deg)',
                        borderRadius: '15px',
                    }}
                />
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
