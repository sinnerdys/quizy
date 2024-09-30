import React, { useState, useEffect } from 'react';
import './GameTimer.css'; // Стили для экрана GameTimer
import TimeIcon from '../assets/icons/time.svg'; // Импорт иконки времени

function GameTimer({ onBack }) {
  const [hours, setHours] = useState(3);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  // Инициализация кнопки "Back" в Telegram Web App
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    // Показываем кнопку "Back"
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      onBack(); // Возвращаемся на предыдущий экран через пропс onBack
    });

    return () => {
      tg.BackButton.hide(); // Скрываем кнопку при размонтировании компонента
    };
  }, [onBack]);

  // Функция обратного отсчета таймера
  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [hours, minutes, seconds]);

  // Функция для преобразования времени в массив цифр
  const formatTimeToDigits = (time) => {
    return String(time).padStart(2, '0').split('');
  };

  // Функция для выбора времени
  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="game-timer">
      <h1 className="game-title">QUIZY TIMER</h1>

      <div className="timer-container">
        <h2 className="timer-subtitle">When timer will stop?</h2>
        <div id="countdown-timer">
          <div className="time-unit">
            <div className="time-digits">
              {formatTimeToDigits(hours).map((digit, index) => (
                <span key={`hours-${index}`} className="time-digit">{digit}</span>
              ))}
            </div>
            <div className="time-label">hours</div>
          </div>
          <span className="time-colon">:</span>
          <div className="time-unit">
            <div className="time-digits">
              {formatTimeToDigits(minutes).map((digit, index) => (
                <span key={`minutes-${index}`} className="time-digit">{digit}</span>
              ))}
            </div>
            <div className="time-label">minutes</div>
          </div>
          <span className="time-colon">:</span>
          <div className="time-unit">
            <div className="time-digits">
              {formatTimeToDigits(seconds).map((digit, index) => (
                <span key={`seconds-${index}`} className="time-digit">{digit}</span>
              ))}
            </div>
            <div className="time-label">seconds</div>
          </div>
        </div>
      </div>

      <div className="select-block">
        <h3 className="select-title">Choose your select</h3>
        {['02:50:00', '06:30:30', '07:30:30'].map((time, index) => (
          <div
            key={index}
            className={`select-item ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => handleSelectTime(time)}
          >
            <input
              type="radio"
              name="select"
              checked={selectedTime === time}
              onChange={() => handleSelectTime(time)}
            />
            <span className="select-text">
              {time}
              <img src={TimeIcon} alt="time icon" className="time-icon" />  
            </span>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button className="make-bet-button">Make bet</button>
        <button className="bet-multiplier-button">x1</button>
      </div>
    </div>
  );
}

export default GameTimer;
