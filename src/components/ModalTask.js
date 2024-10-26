import React, { useEffect, useState } from 'react';
import './ModalTask.css'; // Стили для модального окна


function ModalTask({ task, onComplete, onClose, showAlert }) { 
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeClicked, setSubscribeClicked] = useState(false); 
  const [boostClicked, setBoostClicked] = useState(false); // Новый стейт для boost

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

  const handleBoost = async () => {
    if (task.boostUrl) {
      window.open(task.boostUrl);
      setBoostClicked(true);

      // Проверка статуса буста после клика
      try {
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/completeTask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: window.Telegram.WebApp.initDataUnsafe.user.id, taskId: task.id }),
        });

        const result = await response.json();

        if (result.success) {
          showAlert("Boost task completed successfully!", true);
          onComplete(task.id);
        } else {
          showAlert(result.message || "Failed to complete boost task. Try again.", false);
        }
      } catch (error) {
        console.error('Error checking boost status:', error);
        showAlert("Error checking boost status. Please try again.", false);
      }
    }
  };

  const handleSubscribe = () => {
    if (task.type === 'social') {
      // Для типа 'social' используем openLink для мгновенного перехода без подтверждения
      window.Telegram.WebApp.openLink(task.subscribeUrl);
    } else if (task.type === 'subscribe') {
      // Для типа 'subscribe' используем стандартный window.open с подтверждением
      window.open(task.subscribeUrl, '_blank');
      console.log("Subscribe button clicked"); // Проверка
    }
    setSubscribeClicked(true);
  };

  const checkSubscription = async () => {
    // Проверка для типа 'subscribe'
    if (task.type === 'subscribe') {
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
    } else if (task.type === 'social') {
      // Если тип 'social', сразу завершаем задание без проверки
      onComplete(task.id);
      onClose();
    }
  };

   // Определяем, выполнено ли задание для friends
   const canClaimReward = task.type === 'friends' && task.currentFriendsCount >= task.requiredFriends;



  console.log("task.type:", task.type);
  console.log("isSubscribed:", isSubscribed);

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

 {/* Логика для задания boost */}
 {task.type === "boost" ? (
          <>
            <button
              className="subscribe-button"
              onClick={handleBoost}
            >
              Boost Channel
            </button>
            <button
              className={`check-task-button ${boostClicked ? '' : 'disabled'}`}
              onClick={() => boostClicked && onComplete(task.id)}
              disabled={!boostClicked}
            >
              Check Task
            </button>
          </>
        ) : task.type === "friends" ? (
          <button
            className={`check-task-button ${canClaimReward ? '' : 'disabled'}`}
            onClick={() => {
              if (canClaimReward) {
                onComplete(task.id);
                onClose();
              }
            }}
            disabled={!canClaimReward}
          >
            Claim Reward
          </button>
        ) : (
          <>
            {(task.type === "subscribe" || task.type === "social") && !isSubscribed && (
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
            {(task.type !== "subscribe" && task.type !== "social" || isSubscribed) && (
              <button className="check-task-button" onClick={() => onComplete(task.id)}>
                Complete Task
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ModalTask;
