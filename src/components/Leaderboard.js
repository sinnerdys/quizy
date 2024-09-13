import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Стили для Leaderboard
import medalGold from '../assets/medal-gold.png'; // Импорт иконки медали (золото)
import medalSilver from '../assets/medal-silver.png'; // Импорт иконки медали (серебро)
import medalBronze from '../assets/medal-bronze.png'; // Импорт иконки медали (бронза)

function Leaderboard() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Loading...',
    tokens: 0,
    rank: '...',
  });

  const [topPlayers, setTopPlayers] = useState([]); // Состояние для топ-игроков

  // Функция для отображения медали, если игрок в топ-3
  const getMedal = (medal) => {
    if (medal === 'gold') return <img src={medalGold} alt="Gold Medal" className="medal-icon" />;
    if (medal === 'silver') return <img src={medalSilver} alt="Silver Medal" className="medal-icon" />;
    if (medal === 'bronze') return <img src={medalBronze} alt="Bronze Medal" className="medal-icon" />;
    return null;
  };

  // Функция для получения данных с Firebase функции
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getLeaderboard');
      const players = await response.json();
      setTopPlayers(players);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  // Получение данных текущего пользователя с Telegram WebApp API
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {}; // Получение информации о пользователе

    setCurrentUser({
      name: user.username || 'Anonymous', // Если нет username, отображаем "Anonymous"
      tokens: 0, // Здесь вы можете получить данные о токенах из базы данных Firebase, если они там хранятся
      rank: '...', // Ранг будет рассчитан позже
    });

    fetchLeaderboardData(); // Получаем данные рейтинга из Firebase
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
