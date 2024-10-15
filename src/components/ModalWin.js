import React, { useEffect } from 'react';
import './ModalWin.css'; // Стили для модального окна
import logo from '../assets/logo.png'; // Импортируем логотип токена

function ModalWin({ prizeAmount, onClose }) {
  useEffect(() => {
    const overlay = document.querySelector('.modal-win-overlay');
    const modal = document.querySelector('.modal-win');

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
    <div className="modal-win-overlay">
      <div className="modal-win">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-win-logo-container">
          <img src={logo} alt="QUIZY Logo" className="modal-win-logo" />
        </div>
        <h3>You win</h3>
        <p className="prize-amount">+{prizeAmount} $QUIZY</p>
        <button className="get-prize-button" onClick={onClose}>
          Get Prize
        </button>
      </div>
    </div>
  );
}

export default ModalWin;
