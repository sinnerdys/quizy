import React, { useState } from 'react';
import './Home.css'; // стили для мобильной версии
import logo from '../assets/logo.png'; // Импорт логотипа

function Home() {
  const [balance, setBalance] = useState(0); // начальный баланс токенов
  const [showMoreTasks, setShowMoreTasks] = useState(false); // состояние для показа дополнительных задач

  const tasks = [
    { id: 1, title: 'Join QUIZY CHANNEL', reward: 500 },
    { id: 2, title: 'Join QUIZY COMMUNITY', reward: 500 },
    { id: 3, title: 'Subscribe to QUIZY (X)', reward: 500 },
    { id: 4, title: 'Follow QUIZY on Twitter', reward: 500 },
    { id: 5, title: 'Share QUIZY with friends', reward: 500 },
    { id: 6, title: 'Complete QUIZY Challenge', reward: 500 }
  ];

  // Показываем только 4 задачи по умолчанию, остальные по нажатию кнопки "See more tasks"
  const displayedTasks = showMoreTasks ? tasks : tasks.slice(0, 4);

  // Обновляем баланс при выполнении задачи
  const completeTask = (reward) => {
    setBalance(balance + reward);
  };

  return (
    <div className="home">
      <div className="header">
        <h2>QUIZY GAMES COMING SOON!</h2>
      </div>
      <div className="logo-container">
        <img src={logo} alt="QUIZY Logo" className="logo" />
      </div>

      <div className="balance">
        <h2>{balance.toLocaleString()} $QUIZY</h2>
      </div>

      <div className="tasks-section">
        <h3>Tasks</h3>
        <ul className="task-list">
          {displayedTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className="task-reward">+{task.reward} $QUIZY</span>
              </div>
              <button className="task-button" onClick={() => completeTask(task.reward)}>
                Open
              </button>
            </li>
          ))}
        </ul>

        {/* Новый контейнер для выравнивания кнопки по центру */}
        <div className="see-more-container">
          <button 
            className="see-more-button" 
            onClick={() => setShowMoreTasks(!showMoreTasks)}
          >
            {showMoreTasks ? 'Show fewer tasks ▲' : 'See more tasks ▼'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
