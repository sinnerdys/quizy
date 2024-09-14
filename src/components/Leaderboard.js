import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Стили для Leaderboard
import medalGold from '../assets/medal-gold.png'; // Импорт иконки медали (золото)
import medalSilver from '../assets/medal-silver.png'; // Импорт иконки медали (серебро)
import medalBronze from '../assets/medal-bronze.png'; // Импорт иконки медали (бронза)

function Leaderboard() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Loading...',
    balance: 0,
    rank: '...',
  });

  const [topPlayers, setTopPlayers] = useState([]); // Начальное состояние - пустой массив
  const [error, setError] = useState(null); // Состояние для ошибки

  // Функция для отображения медали, если игрок в топ-3
  const getMedal = (rank) => {
    if (rank === 1) return <img src={medalGold} alt="Gold Medal" className="medal-icon" />;
    if (rank === 2) return <img src={medalSilver} alt="Silver Medal" className="medal-icon" />;
    if (rank === 3) return <img src={medalBronze} alt="Bronze Medal" className="medal-icon" />;
    return null;
  };

  // Функция для получения данных с Firebase функции
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getLeaderboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const players = await response.json();

      // Убедимся, что данные являются массивом
      if (Array.isArray(players)) {
        setTopPlayers(players);

        // Поиск текущего пользователя в списке игроков для обновления его баланса и ранга
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe?.user || {};
        const currentPlayer = players.find((p) => p.userId === user.id);

        if (currentPlayer) {
          setCurrentUser({
            name: currentPlayer.username || 'Anonymous',
            balance: currentPlayer.balance,
            rank: players.findIndex((p) => p.userId === user.id) + 1,
          });
        } else {
          setCurrentUser((prev) => ({
            ...prev,
            rank: 'Not ranked', // Пользователь не найден в топ-100
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to fetch leaderboard');
    }
  };

  // Получение данных текущего пользователя с Telegram WebApp API
  useEffect(() => {
    fetchLeaderboardData(); // Получаем данные рейтинга из Firebase
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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
            <span className="user-balance">{currentUser.balance.toLocaleString()} $QUIZY</span>
          </div>
        </div>
        <div className="user-rank">#{currentUser.rank}</div>
      </div>

      {/* Список топ-100 игроков */}
      <div className="top-players">
        <h3>Top-100 Players</h3>
        <ul className="players-list">
          {topPlayers.map((player, index) => (
            <li key={index} className="player-item">
              <div className="player-info">
                <div className="player-icon">{player.username.charAt(0)}</div>
                <div className="player-details">
                  <span className="player-name">{player.username}</span>
                  <span className="player-balance">{player.balance.toLocaleString()} $QUIZY</span>
                </div>
              </div>
              <div className="player-rank">
                {getMedal(index + 1)}
                {index >= 3 && <span>#{index + 1}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leaderboard;
