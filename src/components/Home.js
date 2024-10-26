import React, { useState, useEffect } from 'react';
import './Home.css'; 
import logo from '../assets/logo.png'; 
import completedIcon from '../assets/completedIcon.png'; 
import failedIcon from '../assets/failedIcon.png'; 
import ModalTask from './ModalTask'; 

function Home({ userId, balance, fetchBalance }) { // Добавляем fetchBalance для обновления баланса
  const [showMoreTasks, setShowMoreTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // Задачи
  const [tasksLoading, setTasksLoading] = useState(true); // Состояние загрузки для задач
  const [showAlert, setShowAlert] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(""); 
  const [isSuccessAlert, setIsSuccessAlert] = useState(false); 

  // Получаем задачи пользователя
  const fetchUserTasks = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getUserTasks?userId=${userId}`);
      const data = await response.json();

      const sortedTasks = data.tasks.sort((a, b) => a.completed - b.completed);
      setTasks(sortedTasks || []);
      setTasksLoading(false); // Отключаем загрузку задач
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      setTasksLoading(false); // Отключаем загрузку при ошибке
    }
  };

  // Загружаем задачи после монтирования компонента
  useEffect(() => {
    if (userId) {
      fetchUserTasks(); // Загружаем задачи
    }
  }, [userId]);

  // Обновляем баланс при возвращении на экран
  useEffect(() => {
    fetchBalance(); // Обновляем баланс из базы данных при возврате на экран
  }, [fetchBalance]); // Зависимость от функции обновления баланса

  const handleTaskOpen = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const showAlertMessage = (message, isSuccess) => {
    setAlertMessage(message);
    setIsSuccessAlert(isSuccess);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
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
        fetchUserTasks(); // Обновляем задачи после завершения задания
        fetchBalance(); // Обновляем баланс после завершения задания
        showAlertMessage("Task successfully completed!", true);
      } else {
        showAlertMessage("Failed to complete task. Try again.", false);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      showAlertMessage("Failed to complete task. Try again.", false);
    }
  };

  // Логика отображения задач
  const displayedTasks = showMoreTasks ? tasks : tasks.slice(0, 4);

  return (
    <div className="home">
      {showAlert && (
        <div className="alert">
          {isSuccessAlert 
            ? <img src={completedIcon} alt="Completed" className="alert-icon" />
            : <img src={failedIcon} alt="Failed" className="alert-icon" />
          }
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="header">
        <h2>QUIZY GAMES COMING SOON!</h2>
      </div>
      <div className="logo-container">
        <img src={logo} alt="QUIZY Logo" className="logo" />
      </div>

      {/* Отображаем баланс сразу, как он был передан */}
      <div className="balance">
        <h2>{!isNaN(balance) ? balance.toLocaleString() : '0'} $QUIZY</h2> {/* Проверка, чтобы баланс был числом */}
      </div>

      <div className="tasks-section">
        <h3>Tasks</h3>
        <ul className="task-list">
  {tasksLoading
    ? Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="task-item skeleton-item">
          <div className="task-info">
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-reward" />
          </div>
          <div className="skeleton-button" />
        </li>
      ))
    : displayedTasks.map(task => (
        <li key={task.id} className={`task-item ${task.completed ? 'task-completed' : ''}`}>
          <div className="task-info">
            <img src={task.imageUrl} alt={task.title} className="task-image" /> {/* Новое изображение задачи */}
            <div>
              <span className="task-title">{task.title}</span>
              <span className="task-reward">+{task.reward} QUIZY</span>
            </div>
          </div>
          <button
            className="task-button"
            onClick={() => handleTaskOpen(task)}
            disabled={task.completed}
          >
            {task.completed 
              ? <img src={completedIcon} alt="Completed" className="completed-icon" />
              : 'Open'}
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
          showAlert={showAlertMessage} 
        />
      )}
    </div>
  );
}

export default Home;
