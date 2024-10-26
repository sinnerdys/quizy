import React, { useEffect, useState } from 'react';
import './ModalTask.css'; // Стили для модального окна
import logo from '../assets/logo.png'; // Импортируем логотип

function ModalTask({ task, onComplete, onClose, showAlert }) { 
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeClicked, setSubscribeClicked] = useState(false); 

  useEffect(() => {
    const overlay = document.querySelector('.modal-task-overlay');
    const modal = document.querySelector('.modal-task');

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

  const handleSubscribe = () => {
    window.open(task.subscribeUrl, '_blank'); 
    setSubscribeClicked(true); 
  };

  const checkSubscription = async () => {
    setCheckingSubscription(true);
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/checkSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: window.Telegram.WebApp.initDataUnsafe.user.id, 
          channelUrl: task.subscribeUrl,
        }),
      });

      const result = await response.json();

      if (result.success && result.isSubscribed) {
        setIsSubscribed(true);
        onComplete(task.id); 
        onClose(); 
      } else {
        showAlert("You are not subscribed to the channel.", false); 
        onClose();
      }
    } catch (error) {
      showAlert("Failed to check subscription. Try again.", false); 
      onClose();
    } finally {
      setCheckingSubscription(false);
    }
  };

  return (
    <div className="modal-task-overlay">
      <div className="modal-task">
        <button className="close-button" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-logo-container">
        <img src={task.imageUrl} alt={task.title} className="modal-logo" />
        </div>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <div className="reward-info">
          <span>+{task.reward} $QUIZY</span>
        </div>

        {task.type === "subscribe" && !isSubscribed && (
          <>
            <button className="subscribe-button" onClick={handleSubscribe}>
              Subscribe
            </button>
            <button
              className={`check-task-button ${!subscribeClicked ? 'disabled' : ''}`} 
              onClick={checkSubscription}
              disabled={!subscribeClicked || checkingSubscription} 
            >
              {checkingSubscription ? 'Checking...' : 'Check Task'}
            </button>
          </>
        )}

        {(task.type !== "subscribe" || isSubscribed) && (
          <button className="check-task-button" onClick={() => onComplete(task.id)}>
            Complete Task
          </button>
        )}
      </div>
    </div>
  );
}

export default ModalTask;
