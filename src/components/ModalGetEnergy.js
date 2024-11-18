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

  useEffect(() => {
    if (energyPacks.length > 0) {
      setSelectedPack(0); // Устанавливаем первый пакет по умолчанию
    }
  }, [energyPacks]);

  const handleBuyEnergy = async () => {
    const tg = window.Telegram.WebApp; // Telegram WebApp объект
    const userId = tg.initDataUnsafe?.user?.id || ''; // Получение userId из Telegram WebApp
  
    if (!userId) {
      console.error('Не удалось получить ID пользователя');
      return;
    }
  
    if (selectedPack === null) {
      console.error('Не выбран пакет энергии');
      return;
    }
  
    try {
      // Отправка запроса на создание инвойса
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/createEnergyInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId, // Передача userId
          packId: selectedPack + 1, // Преобразование индекса selectedPack в packId (Firebase использует 1-based индексы)
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        console.log('Инвойс создан:', result.invoiceLink);
  
        // Проверка поддержки `tg.openInvoice` и вызов функции для открытия инвойса
        if (tg.openInvoice && typeof tg.openInvoice === 'function') {
          tg.openInvoice(result.invoiceLink, async (status) => {
            console.log('Invoice status:', status);
            if (status === 'paid') {
              console.log('Оплата успешна');
              // Обновляем информацию о энергии
              await fetchEnergyInfo();
  
              // Закрываем модальное окно после успешной оплаты
              onClose();
            } else {
              console.log('Платеж не завершен или был отменен.');
            }
          });
        } else {
          console.error('Telegram Payments API не поддерживается в этом контексте.');
        }
      } else {
        console.error('Ошибка получения инвойса:', result.error);
      }
    } catch (error) {
      console.error('Ошибка создания инвойса:', error);
    }
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
{energy > 0 ? (
  <p className="modal-subtitle">
    Energy restores for free every 12 hours.
  </p>
) : (
  nextEnergyIn !== null && (
    <p className="modal-subtitle">
      Next free energy recharge in: <strong>{formatTime(nextEnergyIn)}</strong>
    </p>
  )
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
            <p>Loading energy packs...</p>
          )}
        </div>
        <button 
  className="confirm-pay-button" 
  disabled={selectedPack === null} 
  onClick={handleBuyEnergy} // Привязываем обработчик к кнопке
>
  Buy for{' '}
  <img src={TelegramStarImage} alt="Telegram Star" className="star-image" />{' '}
  {selectedPack !== null ? energyPacks[selectedPack].price : ''}
</button>

      </div>
    </div>
  );
}

export default ModalGetEnergy;
