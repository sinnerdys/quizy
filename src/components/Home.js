import React, { useState, useEffect } from 'react';
import './Home.css'; 
import logo from '../assets/logo.png'; 
import completedIcon from '../assets/completedIcon.png'; 
import ModalTask from './ModalTask'; 

function Home({ userId }) {
  const [balance, setBalance] = useState(0);
  const [showMoreTasks, setShowMoreTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(""); 
  const [isSuccessAlert, setIsSuccessAlert] = useState(false); 

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
        fetchUserData(); 

        showAlertMessage("Task successfully completed!", true);
      } else {
        showAlertMessage("Failed to complete task. Try again.", false);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      showAlertMessage("Failed to complete task. Try again.", false);
    }
  };

  const displayedTasks = showMoreTasks ? tasks : tasks.slice(0, 4);

  return (
    <div className="home">
      {showAlert && (
        <div className="alert">
          {isSuccessAlert && <img src={completedIcon} alt="Completed" className="alert-icon" />}
          <span>{alertMessage}</span>
        </div>
      )}

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
          showAlert={showAlertMessage} // Передаем функцию для показа алерта
        />
      )}
    </div>
  );
}

export default Home;
