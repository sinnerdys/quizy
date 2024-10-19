import React, { useEffect } from 'react';
import './ModalGetTickets.css'; // Стили для этого поп-апа
import TicketImage from '../assets/ticket_image.png'; // Импорт изображения билета
import TelegramStarImage from '../assets/telegram_star.png'; // Импорт изображения звезды (нужно добавить картинку)

function ModalGetTickets({ onClose }) {
  useEffect(() => {
    const overlay = document.querySelector('.modal-get-tickets-overlay');
    const modal = document.querySelector('.modal-get-tickets');

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
    <div className="modal-get-tickets-overlay">
      <div className="modal-get-tickets">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-logo-container">
          <img src={TicketImage} alt="Ticket Logo" className="modal-ticket-logo" />
        </div>
        <h3 className="modal-h3">Get more tickets!</h3>
        <p className="modal-subtitle">
          To get additional tickets, you can invite friends or purchase them for 100 stars.
        </p>
        <div className="modal-buttons">
          <button className="invite-friends-button" onClick={() => alert('Invite Friends functionality')}>
            Invite Friends
          </button>
          <button className="buy-tickets-button" onClick={() => alert('Buy for 100 stars functionality')}>
            Buy for <img src={TelegramStarImage} alt="Telegram Star" className="star-image" /> 100
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalGetTickets;
