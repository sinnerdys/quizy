import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Стили для Leaderboard
import medalGold from '../assets/medal-gold.png'; // Импорт иконки медали (золото)
import medalSilver from '../assets/medal-silver.png'; // Импорт иконки медали (серебро)
import medalBronze from '../assets/medal-bronze.png'; // Импорт иконки медали (бронза)

function Leaderboard() {
  const [currentUser, setCurrentUser] = useState(null); // Изначально данные пустые
  const [topPlayers, setTopPlayers] = useState([]); // Начальное состояние - пустой массив
  const [error, setError] = useState(null); // Состояние для ошибки

  // Функция для отображения медали, если игрок в топ-3
  const getMedal = (rank) => {
    if (rank === 1) return <img src={medalGold} alt="Gold Medal" className="medal-icon" />;
    if (rank === 2) return <img src={medalSilver} alt="Silver Medal" className="medal-icon" />;
    if (rank === 3) return <img src={medalBronze} alt="Bronze Medal" className="medal-icon" />;
    return null;
  };

  // Функция для получения данных текущего пользователя с Firebase
  const fetchCurrentUserData = async (userId) => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUser?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      console.log('Current user data:', userData); // Отладка

      // Найти позицию пользователя в рейтинге
      const rank = topPlayers.findIndex(player => player.userId === userId) + 1 || 'Not ranked';

      setCurrentUser({
        name: userData.username || 'Anonymous',
        balance: userData.balance || 0,
        rank,
      });
    } catch (error) {
      console.error('Error fetching current user data:', error);
      setError('Failed to fetch current user data');
    }
  };

  // Функция для получения данных топ-игроков с Firebase
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

      if (Array.isArray(players)) {
        setTopPlayers(players);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to fetch leaderboard');
    }
  };

  // Получение данных текущего пользователя с Telegram WebApp API и данных из Firebase
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};

    console.log('Current Telegram User ID:', user.id); // Отладка: выводим ID текущего пользователя из Telegram

    fetchLeaderboardData().then(() => {
      fetchCurrentUserData(user.id); // Получаем данные текущего пользователя после загрузки лидеров
    });
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="leaderboard">
      {/* Заголовок */}
      <h1 className="leaderboard-title">Leaderboard</h1>

      {/* Информация о текущем пользователе */}
      {currentUser && (
        <div className="current-user">
          <div className="user-info">
            <div className="user-icon">{currentUser.name.charAt(0)}</div>
            <div className="user-details">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-balance">{currentUser.balance.toLocaleString()} $QUIZY</span>
            </div>
          </div>
          <div className="user-rank">
            {getMedal(currentUser.rank)}
            {currentUser.rank > 3 && <span>#{currentUser.rank}</span>}
          </div>
        </div>
      )}

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
