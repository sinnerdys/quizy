import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Стили для Leaderboard
import medalGold from '../assets/medal-gold.png'; // Импорт иконки медали (золото)
import medalSilver from '../assets/medal-silver.png'; // Импорт иконки медали (серебро)
import medalBronze from '../assets/medal-bronze.png'; // Импорт иконки медали (бронза)

function Leaderboard() {
  const [currentUser, setCurrentUser] = useState({
    name: '',
    balance: 0,
    rank: 'Not ranked',
  });
  const [topPlayers, setTopPlayers] = useState([]); // Начальное состояние - пустой массив
  const [error, setError] = useState(null); // Состояние для ошибки
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  // Функция для отображения медали, если игрок в топ-3
  const getMedal = (rank) => {
    if (rank === 1) return <img src={medalGold} alt="Gold Medal" className="medal-icon" />;
    if (rank === 2) return <img src={medalSilver} alt="Silver Medal" className="medal-icon" />;
    if (rank === 3) return <img src={medalBronze} alt="Bronze Medal" className="medal-icon" />;
    return null;
  };

  // Получаем данные пользователя с рангом и данные топ-игроков параллельно
  const fetchDataParallel = async (userId) => {
    try {
      const [leaderboardResponse, currentUserResponse] = await Promise.all([
        fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/getLeaderboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getCurrentUserWithRank?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ]);

      if (!leaderboardResponse.ok || !currentUserResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const players = await leaderboardResponse.json();
      const userData = await currentUserResponse.json();

      setTopPlayers(players || []); // Обновляем топ игроков

      // Обновляем данные текущего пользователя
      setCurrentUser({
        name: userData.username || 'Anonymous',
        balance: userData.balance || 0,
        rank: userData.rank || 'Not ranked',
      });
      setIsLoading(false); // Отключаем состояние загрузки
    } catch (error) {
      console.error('Error fetching leaderboard data or current user:', error);
      setError('Failed to fetch leaderboard or current user data');
      setIsLoading(false); // Отключаем состояние загрузки в случае ошибки
    }
  };

  // Получение данных с Telegram WebApp API
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user || {};

    console.log('Current Telegram User ID:', user.id); // Отладка: выводим ID текущего пользователя из Telegram

    fetchDataParallel(user.id); // Параллельно получаем данные топ игроков и текущего пользователя
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
          <div className="user-icon">
            {isLoading ? <div className="skeleton-icon" /> : currentUser.name.charAt(0)}
          </div>
          <div className="user-details">
            <span className="user-name">
              {isLoading ? <div className="skeleton-text" /> : currentUser.name}
            </span>
            <span className="user-balance">
              {isLoading ? <div className="skeleton-text" /> : `${currentUser.balance.toLocaleString()} $QUIZY`}
            </span>
          </div>
        </div>
        <div className="user-rank">
          {isLoading ? (
            <div className="spinner-l" />
          ) : (
            getMedal(currentUser.rank) || <span>#{currentUser.rank}</span>
          )}
        </div>
      </div>

      {/* Список топ-100 игроков */}
      <div className="top-players">
        <h3>Top-100 Players</h3>
        <ul className="players-list">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <li key={index} className="player-item">
                  <div className="player-info">
                    <div className="player-icon skeleton-icon" />
                    <div className="player-details">
                      <span className="player-name skeleton-text" />
                      <span className="player-balance skeleton-text" />
                    </div>
                  </div>
                  <div className="player-rank skeleton-rank" />
                </li>
              ))
            : topPlayers.map((player) => (
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
      </div>
    </div>
  );
}

export default Leaderboard;
