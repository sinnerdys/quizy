import React, { useState, useEffect } from 'react';
import './GameTimer.css'; // Стили для экрана GameTimer
import TimeIcon from '../assets/icons/time.svg'; // Импорт иконки времени

function GameTimer({ onBack }) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [randomTimes, setRandomTimes] = useState([]); // Состояние для хранения случайных времен
  const [isBetPlaced, setIsBetPlaced] = useState(false); // Отслеживаем, сделана ли ставка
  const [userId, setUserId] = useState(''); // Идентификатор пользователя из Telegram

  useEffect(() => {
    // Получаем ID пользователя из Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      setUserId(window.Telegram.WebApp.initDataUnsafe.user.id);
    }

    // Показываем кнопку "Back"
    const tg = window.Telegram.WebApp;
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      onBack(); // Возвращаемся на предыдущий экран через пропс onBack
    });

    return () => {
      tg.BackButton.hide(); // Скрываем кнопку при размонтировании компонента
    };
  }, [onBack]);

  // Получение состояния таймера из Firebase
  useEffect(() => {
    const fetchTimerState = async () => {
      try {
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getCurrentTimer');
        const timerData = await response.json();
        setMinutes(Math.floor(timerData.remainingTime / 60));
        setSeconds(timerData.remainingTime % 60);
      } catch (error) {
        console.error('Error fetching timer state:', error);
      }
    };
    fetchTimerState();

    // Обновляем таймер каждые 5 секунд
    const interval = setInterval(fetchTimerState, 5000);
    return () => clearInterval(interval);
  }, []);

  // Запрос случайных вариантов времени с сервера
  useEffect(() => {
    const fetchRandomTimes = async () => {
      try {
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getRandomTimes');
        if (!response.ok) {
          throw new Error('Failed to fetch random times');
        }
        const times = await response.json();
        setRandomTimes(times);
      } catch (error) {
        console.error('Error fetching random times:', error);
      }
    };

    fetchRandomTimes();
  }, []);

  // Функция для выбора времени
  const handleSelectTime = (time) => {
    if (!isBetPlaced) {
      setSelectedTime(time);
    }
  };

  // Функция для отправки выбора пользователя на сервер при нажатии кнопки "Make bet"
  const handleMakeBet = async () => {
    if (!selectedTime) {
      alert('Please select a time before making a bet.');
      return;
    }

    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUserSelection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          selectedTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Error saving selection');
      }

      // Блокируем изменение ставки после успешной отправки
      setIsBetPlaced(true);
      alert('Your selection has been saved successfully!');
    } catch (error) {
      console.error('Error making bet:', error);
    }
  };

  return (
    <div className="game-timer">
      <h1 className="game-title">QUIZY TIMER</h1>

      <div className="timer-container">
        <h2 className="timer-subtitle">When timer will stop?</h2>
        <div id="countdown-timer">
          <div className="time-unit">
            <div className="time-digits">
              {String(minutes).padStart(2, '0')}
            </div>
            <div className="time-label">minutes</div>
          </div>
          <span className="time-colon">:</span>
          <div className="time-unit">
            <div className="time-digits">
              {String(seconds).padStart(2, '0')}
            </div>
            <div className="time-label">seconds</div>
          </div>
        </div>
      </div>

      <div className="select-block">
        <h3 className="select-title">Choose your select</h3>
        {randomTimes.map((time, index) => (
          <div
            key={index}
            className={`select-item ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => handleSelectTime(time)}
          >
            <input
              type="radio"
              name="select"
              checked={selectedTime === time}
              readOnly
              disabled={isBetPlaced} // Делаем input неактивным после выбора
            />
            <span className="select-text">
              <img src={TimeIcon} alt="time icon" className="time-icon" />
              {time}
            </span>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button
          className="make-bet-button"
          onClick={handleMakeBet}
          disabled={isBetPlaced} // Делаем кнопку неактивной после выбора
        >
          Make bet
        </button>
        <button className="bet-multiplier-button">x1</button>
      </div>
    </div>
  );
}

export default GameTimer;
