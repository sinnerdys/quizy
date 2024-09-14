import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Стили для Leaderboard
import medalGold from '../assets/medal-gold.png'; // Импорт иконки медали (золото)
import medalSilver from '../assets/medal-silver.png'; // Импорт иконки медали (серебро)
import medalBronze from '../assets/medal-bronze.png'; // Импорт иконки медали (бронза)

function Leaderboard() {
  const [currentUser, setCurrentUser] = useState({
    name: '',
    balance: 0,
    rank: 'Not ranked', // Изначально устанавливаем "Not ranked"
  });
  const [topPlayers, setTopPlayers] = useState([]); // Начальное состояние - пустой массив
  const [error, setError] = useState(null); // Состояние для ошибки
  const [loading, setLoading] = useState(true); // Состояние для индикации загрузки

  // Функция для отображения медали, если игрок в топ-3
  const getMedal = (rank) => {
    if (rank === 1) return <img src={medalGold} alt="Gold Medal" className="medal-icon" />;
    if (rank === 2) return <img src={medalSilver} alt="Silver Medal" className="medal-icon" />;
    if (rank === 3) return <img src={medalBronze} alt="Bronze Medal" className="medal-icon" />;
    return null;
  };

  // Функция для получения данных текущего пользователя напрямую из базы данных
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

      // Устанавливаем данные текущего пользователя
      setCurrentUser({
        name: userData.username || 'Anonymous',
        balance: userData.balance || 0,
        rank: userData.rank || 'Not ranked', // Получаем ранг напрямую из базы данных
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
        return players;
      }

      return [];
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to fetch leaderboard');
      return [];
    }
  };

  // Обновляем данные текущего пользователя на основе топ-100
  const updateCurrentUserFromLeaderboard = (userId, players) => {
    const currentPlayer = players.find((player) => player.userId === userId);
    if (currentPlayer) {
      setCurrentUser({
        name: currentPlayer.username || 'Anonymous',
        balance: currentPlayer.balance || 0,
        rank: currentPlayer.rank || 'Not ranked', // Используем ранг из данных топ-100
      });
    }
  };

  // Получение данных текущего пользователя с Telegram WebApp API и данных из Firebase
  useEffect(() => {
    const fetchData = async () => {
      const tg = window.Telegram.WebApp;
      const user = tg.initDataUnsafe?.user || {};

      console.log('Current Telegram User ID:', user.id); // Отладка: выводим ID текущего пользователя из Telegram

      const players = await fetchLeaderboardData(); // Получаем данные рейтинга из Firebase
      updateCurrentUserFromLeaderboard(user.id, players); // Обновляем данные текущего пользователя, если он в топ-100
      await fetchCurrentUserData(user.id); // Получаем данные текущего пользователя напрямую из базы данных

      setLoading(false); // Отключаем состояние загрузки после получения данных
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="leaderboard">
      {/* Заголовок */}
      <h1 className="leaderboard-title">Leaderboard</h1>

      {/* Информация о текущем пользователе */}
      {!loading && currentUser && (
        <div className="current-user">
          <div className="user-info">
            <div className="user-icon">{currentUser.name.charAt(0)}</div>
            <div className="user-details">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-balance">{currentUser.balance.toLocaleString()} $QUIZY</span>
            </div>
          </div>
          <div className="user-rank">
            {/* Проверка на отображение медали и ранга */}
            {getMedal(currentUser.rank) || <span>#{currentUser.rank}</span>}
          </div>
        </div>
      )}

      {/* Список топ-100 игроков */}
      <div className="top-players">
        <h3>Top-100 Players</h3>
        {!loading && (
          <ul className="players-list">
            {topPlayers.map((player) => (
              <li key={player.userId} className="player-item">
                <div className="player-info">
                  <div className="player-icon">{player.username.charAt(0)}</div>
                  <div className="player-details">
                    <span className="player-name">{player.username}</span>
                    <span className="player-balance">{player.balance.toLocaleString()} $QUIZY</span>
                  </div>
                </div>
                <div className="player-rank">
                  {getMedal(player.rank) || <span>#{player.rank}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
