import React, { useEffect, useState } from 'react';
import './ModalGetEnergy.css'; // Подключаем файл стилей
import TelegramStarImage from '../assets/telegram_star.png'; // Импорт изображения звезды
import TelegramStarImageOption from '../assets/telegram_star_light.png'; // Импорт изображения звезды для кнопок
import LightningIcon from '../assets/lightning.png'; // Импорт изображения молнии

function ModalGetEnergy({ onClose }) {
  const [selectedPack, setSelectedPack] = useState(null);

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

  const handleSelectPack = (packIndex) => {
    setSelectedPack(packIndex);
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
        <p className="modal-subtitle">Next free energy recharge in: <strong>12:00:00</strong></p>
        <div className="energy-options">
          {[
            { count: 1, name: 'Single Energy', price: 100 },
            { count: 3, name: 'Small Energy Pack', price: 250 },
            { count: 7, name: 'Medium Energy Pack', price: 500 },
            { count: 15, name: 'Large Energy Pack', price: 800 },
          ].map((pack, index) => (
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
              <span className="price"><img src={TelegramStarImageOption} alt="Telegram Star" className="star-image-option" /> {pack.price}</span>
            </button>
          ))}
        </div>
        <button className="confirm-pay-button" disabled={selectedPack === null}>
          Confirm And Pay <img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> {selectedPack !== null ? [100, 250, 500, 800][selectedPack] : '200'}
        </button>
      </div>
    </div>
  );
}

export default ModalGetEnergy;
