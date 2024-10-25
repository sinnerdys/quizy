import React, { useState, useEffect } from 'react';
import './Friends.css'; 
import userIcon from '../assets/friend_icon.png'; 
import premiumIcon from '../assets/telegram_star.png'; 
import token from '../assets/TokenImage.png'; 
import TicketImage from '../assets/ticket_image.png';

function Friends() {
  const [referralCode, setReferralCode] = useState(''); 
  const [friends, setFriends] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};
    const startParam = tg.initDataUnsafe?.start_param;

    const fetchReferralCode = async (userId) => {
      try {
        console.log('Запрашиваем реферальный код для пользователя:', userId); 
        const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getReferralCode?userId=${userId}`);
        const data = await response.json();
        console.log('Ответ на запрос реферального кода:', data);  
    
        if (data.referralCode) {
          console.log('Получен существующий реферальный код:', data.referralCode);  
          setReferralCode(data.referralCode);
        } else {
          const generatedCode = generateReferralCode(userId);
          console.log('Создан новый реферальный код:', generatedCode);  
          setReferralCode(generatedCode);
          saveReferralCode(userId, generatedCode);
        }
      } catch (error) {
        console.error('Ошибка получения реферального кода:', error);
      }
    };

    const generateReferralCode = (userId) => {
      return `${userId}-${Math.random().toString(36).substring(2, 8)}`;
    };

    const saveReferralCode = async (userId, referralCode) => {
      try {
        console.log('Сохраняем реферальный код:', referralCode, 'для пользователя:', userId); 
        const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveReferralCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            referralCode,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to save referral code');
        }
      } catch (error) {
        console.error('Error saving referral code:', error);
      }
    };

    const fetchFriends = async (userId) => {
      try {
        const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUserFriends?userId=${userId}`);
        const friendsData = await response.json();
        setFriends(friendsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка получения списка друзей:', error);
        setIsLoading(false);
      }
    };

    if (user.id) {
      // Сохраняем пользователя, если он пришел по реферальной ссылке
      if (startParam) {
        saveUserWithReferral(user.id, startParam).then(() => {
          // После сохранения пользователя с чужим реферальным кодом, создаем для него собственный реферальный код
          fetchReferralCode(user.id);
        });
      } else {
        // Если пользователь не по реферальной ссылке, сразу создаем для него код
        fetchReferralCode(user.id);
      }

      fetchFriends(user.id);
    }
  }, []);

  const saveUserWithReferral = async (userId, referralCode) => {
    try {
      const tg = window.Telegram.WebApp;
      const user = tg.initDataUnsafe?.user || {};
  
      console.log('Отправляем запрос с данными:', { userId, referralCode, firstName: user.first_name, username: user.username }); 
  
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || user.first_name,
          referralCode,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save user with referral code');
      }
    } catch (error) {
      console.error('Ошибка при сохранении пользователя с реферальным кодом:', error);
    }
  };
  

  const handleInviteFriends = () => {
    console.log('Текущий реферальный код:', referralCode);  
    
    if (!referralCode) {
      console.error('Реферальный код не сгенерирован!');
      return;
    }
  
    const tg = window.Telegram.WebApp;
    const referralLink = `https://t.me/Qqzgy_bot/game?startapp=${referralCode}`;
    const messageText = `Hey! Join QUIZY and get rewards! Use my referral link: ${referralLink}`;
  
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`);
  };

  return (
    <div className="friends">
      <h1 className="friends-title">Referrals</h1>
        <p className="friends-description">Invite new players and get more rewards</p>

        <div className="invite-section">
  <div className="invite-item">
    <div className="invite-left">
    <img src={userIcon} alt="User Icon" className="invite-icon" />
      <span className="invite-text">Invite friend</span>
    </div>
    <div className="invite-right">
      <span>1</span>
      <img src={TicketImage} alt="Ticket" className="ticket-logo" />
      <span>+1000</span>
      <img src={token} alt="QUIZY Token" className="reward-logo" />
    </div>
  </div>

  <hr className="divider" />

  <div className="invite-item">
    <div className="invite-left">
    <img src={premiumIcon} alt="Premium Icon" className="invite-icon" />
      <span className="invite-text">Invite Premium</span>
    </div>
    <div className="invite-right">
      <span>2</span>
      <img src={TicketImage} alt="Ticket" className="ticket-logo" />
      <span>+2000</span>
      <img src={token} alt="QUIZY Token" className="reward-logo" />
    </div>
  </div>
</div>

      <div className="friends-list-title"><h3>My friends</h3></div>
      <div className="friends-list-section">
        <ul className="friends-list">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <li key={index} className="friend-item skeleton-friend">
                  <div className="skeleton-icon skeleton-friend-icon" />
                  <div className="skeleton-text skeleton-friend-name" />
                  <div className="skeleton-text skeleton-friend-reward" />
                </li>
              ))
            : friends.map(friend => (
                <li key={friend.id} className="friend-item">
                  <div className="friend-info">
                    <div className="friend-icon">
                      {friend.username ? friend.username.charAt(0) : 'N/A'}
                    </div>
                    <span className="friend-name">{friend.username || 'Unknown Friend'}</span>
                  </div>
                  <div className="friend-reward">
                    <span className="reward-text">+{friend.reward}</span>
                    <img src={token} alt="QUIZY Token" className="reward-logo" />
                  </div>
                </li>
              ))}
        </ul>
      </div>

      <div className="invite-button-container">
        <button className="invite-button" onClick={handleInviteFriends}>Invite friends</button>
      </div>
    </div>
  );
}

export default Friends;
