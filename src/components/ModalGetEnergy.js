import React, { useEffect, useState } from 'react';
import './ModalGetEnergy.css'; // Подключаем файл стилей
import TelegramStarImage from '../assets/telegram_star.png'; // Импорт изображения звезды
import TelegramStarImageOption from '../assets/telegram_star_light.png'; // Импорт изображения звезды для кнопок
import LightningIcon from '../assets/lightning.png'; // Импорт изображения молнии

function ModalGetEnergy({ userId, onClose, energyPacks }) {
  const [selectedPack, setSelectedPack] = useState(null);
  const [nextEnergyIn, setNextEnergyIn] = useState(null);
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    const overlay = document.querySelector('.modal-get-energy-overlay');
    const modal = document.querySelector('.modal-get-energy');

    if (overlay && modal) {
      setTimeout(() => {
        overlay.classList.add('open');
        modal.classList.add('open');
      }, 10);
    }

    const handleClickOutside = (event) => {
      if (event.target === overlay) {
        onClose();
      }
    };

    overlay.addEventListener('click', handleClickOutside);

    return () => {
      overlay.removeEventListener('click', handleClickOutside);
      if (overlay && modal) {
        overlay.classList.remove('open');
        modal.classList.remove('open');
      }
    };
  }, [onClose]);

  useEffect(() => {
    if (userId) {
      fetchEnergyInfo();
    }
  }, [userId]);

  const fetchEnergyInfo = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getEnergyInfo?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch energy info');
      }
      const data = await response.json();
      setNextEnergyIn(data.nextEnergyIn);
      setEnergy(data.energy);
    } catch (error) {
      console.error('Error fetching energy info:', error);
    }
  };

  const handleSelectPack = (packIndex) => {
    setSelectedPack(packIndex);
  };

  // Добавляем useEffect для обновления таймера каждую секунду
  useEffect(() => {
    if (nextEnergyIn !== null && nextEnergyIn > 0 && energy === 0) {
      const interval = setInterval(() => {
        setNextEnergyIn((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(interval);
            fetchEnergyInfo(); // Сброс таймера и обновление информации при достижении 0
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);

      return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
    } else if (nextEnergyIn === 0 && energy === 0) {
      // Если энергия достигла 0, обновляем информацию
      fetchEnergyInfo();
    }
  }, [nextEnergyIn, energy]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="modal-get-energy-overlay">
      <div className="modal-get-energy">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-icon-container">
          <img src={LightningIcon} alt="Energy Icon" className="modal-energy-logo" />
        </div>
        <h2 className="modal-title">Get more energy</h2>
        {energy === 0 && nextEnergyIn !== null && (
          <p className="modal-subtitle">
            Next free energy recharge in: <strong>{formatTime(nextEnergyIn)}</strong>
          </p>
        )}
       <div className="energy-options">
  {energyPacks.length > 0 ? (
    energyPacks.map((pack, index) =>
      pack ? (
        <button
          key={index}
          className={`energy-option ${selectedPack === index ? 'selected' : ''}`}
          onClick={() => handleSelectPack(index)}
        >
          <div className="energy-pack">
            <img src={LightningIcon} alt="Lightning" />
            <span>{pack.count}</span>
          </div>
          <span className="energy-info">{pack.name}</span>
          <span className="price">
            <img src={TelegramStarImageOption} alt="Telegram Star" className="star-image-option" /> {pack.price}
          </span>
        </button>
      ) : null
    )
  ) : (
    <p>Loading energy packs...</p> // Показать сообщение при загрузке пакетов
  )}
</div>
<button className="confirm-pay-button" disabled={selectedPack === null}>
  Confirm And Pay{' '}
  <img src={TelegramStarImage} alt="Telegram Star" className="star-image" />{' '}
  {selectedPack !== null ? energyPacks[selectedPack].price : ''}
</button>
      </div>
    </div>
  );
}

export default ModalGetEnergy;
