import React from 'react';
import './Quizes.css'; 
import QuestionIcon from '../assets/question_icon.png'; // Импорт иконки для Coming Soon игр
import TimeIcon from '../assets/timer.png'; // Импорт иконки времени
import token from '../assets/TokenImage.png'; 

function Quizes() {
  const quizzes = [
    {
      title: 'CRYPTO HISTORY',
      reward: 1000,
      time: '2:30',
    },
    {
      title: 'CRYPTO HISTORY',
      reward: 1000,
      time: '2:30',
    },
    {
      title: 'CRYPTO HISTORY',
      reward: 1000,
      time: '2:30',
    },
    {
      title: 'CRYPTO HISTORY',
      reward: 1000,
      time: '2:30',
    },
  ];

  return (
    <div className="quizes-section">
      <h3>Quizes</h3>
      <p>Play exciting games and earn more $QUIZY!</p>
      
      <div className="progress-container">
        <div className="progress-header">
          <span>Your progress:</span>
          <div className="energy-container">
            ⚡ 1
            <button className="energy-button">+</button>
          </div>
        </div>
        <span className="progress-status">10/10 quizzes completed</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }}></div>
        </div>
      </div>

      <ul className="quiz-list">
        {quizzes.map((quiz, index) => (
          <li key={index} className="quiz-item">
            <div className="quiz-avatar">
              <img src={QuestionIcon} alt="Timer icon" />
            </div>
            <div className="quiz-info">
              <div className="quiz-title">{quiz.title}</div>
              <div className="quiz-details">
                <span className="quiz-reward">+{quiz.reward}</span><img src={token} alt="QUIZY Token" className="reward-logo-tasks" />
                <span className="quiz-time">{quiz.time} <img src={TimeIcon} alt="Time icon" className="time-icon" /></span>
              </div>
            </div>
            <button className="quiz-button">Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quizes;
