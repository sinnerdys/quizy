import React, { useEffect } from 'react';
import './ModalGetEnergy.css'; // Подключаем файл стилей
import TelegramStarImage from '../assets/telegram_star.png'; // Импорт изображения звезды
import LightningIcon from '../assets/lightning.png'; // Импорт изображения молнии

function ModalGetEnergy({ onClose }) {
  useEffect(() => {
    const overlay = document.querySelector('.modal-energy-overlay');
    const modal = document.querySelector('.modal-energy');

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

  return (
    <div className="modal-energy-overlay">
      <div className="modal-energy">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-header">
          <img src={LightningIcon} alt="Energy" className="energy-icon" />
          <h2>Get more energy</h2>
        </div>
        <p>Next <span className="free-energy-link">free energy</span> recharge in: <strong>12:00:00</strong></p>
        <div className="energy-options">
          <button className="energy-option">
            <div className="energy-icon-container">
              <img src={LightningIcon} alt="Lightning" className="energy-icon-small" />
              <span>1</span>
            </div>
            <span className="energy-info">Single Energy</span>
            <span className="price"><img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 100 Stars</span>
          </button>
          <button className="energy-option">
            <div className="energy-icon-container">
              <img src={LightningIcon} alt="Lightning" className="energy-icon-small" />
              <span>3</span>
            </div>
            <span className="energy-info">Small Energy Pack</span>
            <span className="price"><img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 250 Stars</span>
          </button>
          <button className="energy-option">
            <div className="energy-icon-container">
              <img src={LightningIcon} alt="Lightning" className="energy-icon-small" />
              <span>7</span>
            </div>
            <span className="energy-info">Medium Energy Pack</span>
            <span className="price"><img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 500 Stars</span>
          </button>
          <button className="energy-option">
            <div className="energy-icon-container">
              <img src={LightningIcon} alt="Lightning" className="energy-icon-small" />
              <span>15</span>
            </div>
            <span className="energy-info">Large Energy Pack</span>
            <span className="price"><img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 800 Stars</span>
          </button>
        </div>
        <button className="confirm-pay-button">
          Confirm And Pay <img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 200
        </button>
      </div>
    </div>
  );
}

export default ModalGetEnergy;
