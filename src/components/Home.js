import React, { useState, useEffect } from 'react';
import './Home.css'; // стили для мобильной версии
import logo from '../assets/logo.png'; // Импорт логотипа
import ModalTask from './ModalTask'; // Импортируем компонент модального окна

function Home({ userId }) {
  const [balance, setBalance] = useState(0);
  const [showMoreTasks, setShowMoreTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUserAndTasks?userId=${userId}`);
      const data = await response.json();
      setBalance(data.balance);
      setTasks(data.tasks || []); 
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

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
        fetchUserData(); 
        alert('Task successfully completed!');
      } else {
        alert('Failed to complete task. Try again.');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const displayedTasks = showMoreTasks ? tasks : tasks.slice(0, 4);

  if (loading) {
    return <div>Loading...</div>;
  }

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
