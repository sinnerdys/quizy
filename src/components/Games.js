import React from 'react';
import './Games.css'; // Стили для экрана Games
import TimerIcon from '../assets/timer_icon.png'; // Импорт иконки для QUIZY TIMER
import QuestionIcon from '../assets/question_icon.png'; // Импорт иконки для Coming Soon игр

function Games() {
  const games = [
    {
      name: 'QUIZY TIMER',
      description: 'When timer will stop?',
      isAvailable: true,
      icon: TimerIcon,
    },
    {
      name: 'Coming Soon',
      description: 'Game coming soon',
      isAvailable: false,
      icon: QuestionIcon,
    },
    {
      name: 'Coming Soon',
      description: 'Game coming soon',
      isAvailable: false,
      icon: QuestionIcon,
    },
    {
      name: 'Coming Soon',
      description: 'Game coming soon',
      isAvailable: false,
      icon: QuestionIcon,
    },
  ];

  return (
    <div className="games">
      <h1 className="games-title">QUIZY GAMES</h1>
      <p className="games-subtitle">Play exciting games and earn more $QUIZY!</p>
      <div className="games-list">
        {games.map((game, index) => (
          <div key={index} className={`game-item ${game.isAvailable ? '' : 'disabled'}`}>
            <div className="game-info">
              <div className="game-icon">
                <img src={game.icon} alt={game.name} />
              </div>
              <div className="game-details">
                <span className="game-name">{game.name}</span>
                <span className="game-description">{game.description}</span>
              </div>
            </div>
            <button className="game-play-button" disabled={!game.isAvailable}>
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;
