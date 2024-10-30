import React from 'react';
import './Quizes.css'; 

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
            <div className="quiz-info">
              <div className="quiz-title">{quiz.title}</div>
              <div className="quiz-reward">
                +{quiz.reward} ⚡
              </div>
              <div className="quiz-time">
                {quiz.time} ⏰
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
