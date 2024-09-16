import React, { useState, useEffect } from 'react';
import './Home.css'; // стили для мобильной версии
import logo from '../assets/logo.png'; // Импорт логотипа
import ModalTask from './ModalTask'; // Импортируем компонент модального окна

function Home({ userId, balance, updateBalance }) {
  const [tasks, setTasks] = useState([]); // Список задач
  const [showMoreTasks, setShowMoreTasks] = useState(false); // Состояние для показа всех задач
  const [selectedTask, setSelectedTask] = useState(null); // Выбранное задание для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модального окна
  const [error, setError] = useState(null); // Ошибки загрузки данных

  // Получение данных пользователя (баланс и задачи)
  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUserAndTasks?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setTasks(data.tasks || []); // Обновляем задачи
      } else {
        setError('Failed to load user tasks');
      }
    } catch (err) {
      console.error('Error fetching user tasks:', err);
      setError('Error fetching tasks');
    }
  };

  // useEffect для загрузки данных при изменении userId
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleTaskOpen = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/completeTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, taskId }),
      });

      const result = await response.json();
      if (result.success) {
        fetchUserData(); // Обновляем данные после выполнения задания
        updateBalance(result.reward); // Обновляем баланс пользователя
        alert('Task successfully completed!');
      } else {
        alert('Failed to complete task. Try again.');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const displayedTasks = showMoreTasks ? tasks : tasks.slice(0, 4);

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
        {error && <div className="error-message">{error}</div>}
        <ul className="task-list">
          {displayedTasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'task-completed' : ''}`}>
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className="task-reward">+{task.reward} $QUIZY</span>
              </div>
              <button
                className="task-button"
                onClick={() => handleTaskOpen(task)}
                disabled={task.completed}
              >
                {task.completed ? 'Completed' : 'Open'}
              </button>
            </li>
          ))}
        </ul>

        <div className="see-more-container">
          <button className="see-more-button" onClick={() => setShowMoreTasks(!showMoreTasks)}>
            {showMoreTasks ? 'Show fewer tasks ▲' : 'See more tasks ▼'}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ModalTask
          task={selectedTask}
          onComplete={handleTaskComplete}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Home;
