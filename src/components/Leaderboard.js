import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Стили для Leaderboard
import medalGold from '../assets/medal-gold.png'; // Импорт иконки медали (золото)
import medalSilver from '../assets/medal-silver.png'; // Импорт иконки медали (серебро)
import medalBronze from '../assets/medal-bronze.png'; // Импорт иконки медали (бронза)

function Leaderboard() {
  // Состояние для текущего пользователя
  const [currentUser, setCurrentUser] = useState({
    name: 'Loading...',
    tokens: 100756,
    rank: 2421591
  });

  // Топ-100 игроков
  const topPlayers = [
    { id: 1, name: 'Demon', tokens: 102456756, rank: 1, medal: 'gold' },
    { id: 2, name: 'James', tokens: 101455426, rank: 2, medal: 'silver' },
    { id: 3, name: 'BIG_BOSS', tokens: 97421224, rank: 3, medal: 'bronze' },
    { id: 4, name: 'QUARK', tokens: 8425127, rank: 4 },
    { id: 5, name: 'morris', tokens: 78421555, rank: 5 },
    { id: 6, name: 'Digazer', tokens: 24215521, rank: 6 },
    { id: 7, name: 'Woody25', tokens: 12464873, rank: 7 },
    // Добавь еще игроков для полного списка
  ];

  // Функция для отображения медали, если игрок в топ-3
  const getMedal = (medal) => {
    if (medal === 'gold') return <img src={medalGold} alt="Gold Medal" className="medal-icon" />;
    if (medal === 'silver') return <img src={medalSilver} alt="Silver Medal" className="medal-icon" />;
    if (medal === 'bronze') return <img src={medalBronze} alt="Bronze Medal" className="medal-icon" />;
    return null;
  };

  // Получение данных пользователя с Telegram WebApp API
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {}; // Получение информации о пользователе

    setCurrentUser({
      name: user.username || 'Anonymous', // Если нет username, отображаем "Anonymous"
      tokens: 100756, // Количество токенов по умолчанию
      rank: 2421591 // Место в рейтинге по умолчанию
    });
  }, []);

  return (
    <div className="leaderboard">
      {/* Заголовок */}
      <h1 className="leaderboard-title">Leaderboard</h1>

      {/* Информация о текущем пользователе */}
      <div className="current-user">
        <div className="user-info">
          <div className="user-icon">{currentUser.name.charAt(0)}</div>
          <div className="user-details">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-tokens">{currentUser.tokens.toLocaleString()} $QUIZY</span>
          </div>
        </div>
        <div className="user-rank">#{currentUser.rank}</div>
      </div>

      {/* Список топ-100 игроков */}
      <div className="top-players">
        <h3>Top-100 Players</h3>
        <ul className="players-list">
          {topPlayers.map(player => (
            <li key={player.id} className="player-item">
              <div className="player-info">
                <div className="player-icon">{player.name.charAt(0)}</div>
                <div className="player-details">
                  <span className="player-name">{player.name}</span>
                  <span className="player-tokens">{player.tokens.toLocaleString()} $QUIZY</span>
                </div>
              </div>
              <div className="player-rank">
                {getMedal(player.medal)}
                {!player.medal && <span>#{player.rank}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
