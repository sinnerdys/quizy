import React, { useState } from 'react';
import './Home.css'; // стили для мобильной версии
import logo from '../assets/logo.png'; // Импорт логотипа
import ModalTask from './ModalTask'; // Импортируем компонент модального окна

function Home({ balance }) {
  const [showMoreTasks, setShowMoreTasks] = useState(false); // состояние для показа дополнительных задач
  const [selectedTask, setSelectedTask] = useState(null); // состояние для выбранного задания
  const [isModalOpen, setIsModalOpen] = useState(false); // состояние для отображения модального окна

  // Каждая задача теперь содержит описание и ссылку для подписки
  const tasks = [
    { 
      id: 1, 
      title: 'Join QUIZY CHANNEL', 
      description: 'Subscribe to our official channel on Telegram to receive updates.', 
      reward: 500, 
      subscribeUrl: 'https://t.me/quizy_channel' 
    },
    { 
      id: 2, 
      title: 'Join QUIZY COMMUNITY', 
      description: 'Join our Telegram community and participate in discussions.', 
      reward: 500, 
      subscribeUrl: 'https://t.me/quizy_community' 
    },
    { 
      id: 3, 
      title: 'Subscribe to QUIZY (X)', 
      description: 'Follow QUIZY on X for the latest updates.', 
      reward: 500, 
      subscribeUrl: 'https://x.com/quizy' 
    },
    { 
      id: 4, 
      title: 'Follow QUIZY on Twitter', 
      description: 'Follow us on Twitter for more updates.', 
      reward: 500, 
      subscribeUrl: 'https://twitter.com/quizy' 
    },
    { 
      id: 5, 
      title: 'Share QUIZY with friends', 
      description: 'Share QUIZY with your friends and earn rewards.', 
      reward: 500, 
      subscribeUrl: 'https://t.me/quizy_invite' 
    },
    { 
      id: 6, 
      title: 'Complete QUIZY Challenge', 
      description: 'Complete the QUIZY challenge and earn rewards.', 
      reward: 500, 
      subscribeUrl: 'https://t.me/quizy_challenge' 
    }
  ];

  // Показываем только 4 задачи по умолчанию, остальные по нажатию кнопки "See more tasks"
  const displayedTasks = showMoreTasks ? tasks : tasks.slice(0, 4);

  const handleTaskOpen = (task) => {
    setSelectedTask(task); // Устанавливаем выбранное задание
    setIsModalOpen(true); // Открываем модальное окно
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
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
              <button className="task-button" onClick={() => handleTaskOpen(task)}>
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

      {/* Модальное окно */}
      {isModalOpen && <ModalTask task={selectedTask} onClose={handleCloseModal} />}
    </div>
  );
}

export default Home;
