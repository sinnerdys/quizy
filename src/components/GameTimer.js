import React, { useState, useEffect } from 'react';
import './GameTimer.css'; // Стили для экрана GameTimer
import TimeIcon from '../assets/icons/time.svg'; // Импорт иконки времени

function GameTimer({ onBack }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [randomTimes, setRandomTimes] = useState([]); // Состояние для хранения случайных времен
  const [isBetPlaced, setIsBetPlaced] = useState(false); // Отслеживаем, сделана ли ставка
  const [userId, setUserId] = useState(''); // Идентификатор пользователя из Telegram
  const [reward, setReward] = useState(null); // Состояние для хранения информации о выигрыше

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

  // Получение состояния таймера из Firebase при первой загрузке
  useEffect(() => {
    const fetchTimerState = async () => {
      try {
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getCurrentTimer');
        if (!response.ok) {
          throw new Error('Failed to fetch timer state');
        }
        const timerData = await response.json();

        if (isNaN(timerData.remainingTime)) {
          throw new Error('Invalid timer data received');
        }

        // Устанавливаем начальное значение оставшегося времени
        setRemainingTime(timerData.remainingTime);
      } catch (error) {
        console.error('Error fetching timer state:', error);
      }
    };

    fetchTimerState();
  }, []);

  // Локальный отсчет таймера каждую секунду
  useEffect(() => {
    if (remainingTime === null) return;

    // Устанавливаем начальные значения часов, минут и секунд
    setHours(Math.floor(remainingTime / 3600));
    setMinutes(Math.floor((remainingTime % 3600) / 60));
    setSeconds(remainingTime % 60);

    // Запускаем интервал для обновления каждую секунду
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          const newTime = prevTime - 1;
          setHours(Math.floor(newTime / 3600));
          setMinutes(Math.floor((newTime % 3600) / 60));
          setSeconds(newTime % 60);
          return newTime;
        } else {
          clearInterval(interval);
          checkForWinner(); // Проверяем, выиграл ли пользователь
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  // Запрос случайных вариантов времени с сервера
  useEffect(() => {
    const fetchRandomTimes = async () => {
      try {
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getRandomTimes');
        if (!response.ok) {
          throw new Error('Failed to fetch random times');
        }
        const times = await response.json();

        if (!Array.isArray(times) || times.some(time => typeof time !== 'string')) {
          throw new Error('Invalid random times data received');
        }

        setRandomTimes(times);
      } catch (error) {
        console.error('Error fetching random times:', error);
      }
    };

    fetchRandomTimes();
  }, []);

  // Функция для преобразования времени в массив цифр
  const formatTimeToDigits = (time) => {
    return String(time).padStart(2, '0').split('');
  };

  // Функция для выбора времени
  const handleSelectTime = (time) => {
    if (isBetPlaced) return;

    const [selectedMinutes, selectedSeconds] = time.split(':').map(Number);
    const selectedTotalSeconds = selectedMinutes * 60 + selectedSeconds;

    // Проверяем, что выбранное время еще не прошло
    if (selectedTotalSeconds >= remainingTime) {
      setSelectedTime(time);
    } else {
      alert('This time has already passed. Please select another time.');
    }
  };

  // Функция для отправки выбора пользователя на сервер при нажатии кнопки "Make bet"
  const handleMakeBet = async () => {
    if (!selectedTime) {
      alert('Please select a time before making a bet.');
      return;
    }

    try {
      // Проверяем текущее состояние таймера перед отправкой ставки
      const timerResponse = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getCurrentTimer');
      if (!timerResponse.ok) {
        throw new Error('Failed to fetch timer state');
      }
      const timerData = await timerResponse.json();

      if (isNaN(timerData.remainingTime)) {
        throw new Error('Invalid timer data received');
      }

      const [selectedMinutes, selectedSeconds] = selectedTime.split(':').map(Number);
      const selectedTotalSeconds = selectedMinutes * 60 + selectedSeconds;

      // Проверяем, что выбранное время еще не прошло
      if (selectedTotalSeconds >= timerData.remainingTime) {
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
      } else {
        alert('The selected time has already passed. Please select a valid time.');
      }
    } catch (error) {
      console.error('Error making bet:', error);
    }
  };

  // Функция для проверки, выиграл ли пользователь
  const checkForWinner = async () => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/determineWinners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error determining winner');
      }

      const result = await response.json();
      if (result.isWinner) {
        setReward(result.reward);
        alert(`Congratulations! You've won ${result.reward} tokens!`);
      }
    } catch (error) {
      console.error('Error determining winner:', error);
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
              {time}
              <img src={TimeIcon} alt="time icon" className="time-icon" />
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

      {reward && (
        <div className="reward-container">
          <p>Congratulations! You've won {reward} tokens!</p>
        </div>
      )}
    </div>
  );
}

export default GameTimer;
