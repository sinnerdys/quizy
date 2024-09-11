import React from 'react';
import './Friends.css'; // Стили для экрана друзей
import logo from '../assets/quizy_logo.png'; // Импорт логотипа
import token from '../assets/token.png'; // Импорт логотипа токена (или иконки)

function Friends() {
  const friends = [
    { id: 1, name: 'Demon', reward: 100 },
    { id: 2, name: 'James', reward: 100 },
    { id: 3, name: 'BIG_BOSS', reward: 100 },
    { id: 4, name: 'morris', reward: 100 },
    { id: 5, name: 'Woody25', reward: 100 },
    { id: 6, name: 'Woody25', reward: 100 },
    { id: 7, name: 'Woody25', reward: 100 },
    { id: 8, name: 'Woody25', reward: 100 }
  ];

  return (
    <div className="friends">
      {/* Логотип и заголовок */}
      <div className="header-f">
        <img src={logo} alt="QUIZY Logo" className="quizy-logo" />
        <p>Invite friends and get more rewards</p>
      </div>

      {/* Список друзей */}
      <div className="friends-list-title"><h3>22 friends</h3></div>
      <div className="friends-list-section">
        <ul className="friends-list">
          {friends.map(friend => (
            <li key={friend.id} className="friend-item">
              <div className="friend-info">
                <div className="friend-icon">{friend.name.charAt(0)}</div>
                <span className="friend-name">{friend.name}</span>
              </div>
              <div className="friend-reward">
                <span className="reward-text">+{friend.reward}</span>
                <img src={token} alt="QUIZY Token" className="reward-logo" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Кнопка для приглашения */}
      <div className="invite-button-container">
        <button className="invite-button">Invite friends</button>
      </div>
    </div>
  );
}

export default Friends;
