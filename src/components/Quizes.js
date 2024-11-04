import React, { useEffect, useState } from 'react';
import './Quizes.css';
import TimeIcon from '../assets/timer.png';
import token from '../assets/TokenImage.png';

function Quizes({ userId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Получаем список квизов пользователя
  const fetchUserQuizzes = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getQuizzes?userId=${userId}`);
      const data = await response.json();

      // Сортируем и сохраняем квизы
      const sortedQuizzes = data.quizzes.sort((a, b) => a.completed - b.completed);
      setQuizzes(sortedQuizzes || []);
      setLoading(false); // Отключаем загрузку квизов
    } catch (error) {
      console.error('Error fetching user quizzes:', error);
      setLoading(false); // Отключаем загрузку при ошибке
    }
  };

  useEffect(() => {
    fetchUserQuizzes();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

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

      <div className="quiz-list-desc"><p>Available quizzes</p></div>
      <ul className="quiz-list">
        {quizzes.map((quiz, index) => (
          <li key={index} className="quiz-item">
            <div className="quiz-avatar">
              <img src={quiz.imageUrl} alt={quiz.title} />
            </div>
            <div className="quiz-info">
              <div className="quiz-title">{quiz.title}</div>
              <p className="quiz-description">{quiz.description}</p>
              <div className="quiz-details">
                <span className="quiz-reward">+{quiz.reward}</span>
                <img src={token} alt="QUIZY Token" className="reward-logo-quizes" />
                <span className="quiz-time">{quiz.time} <img src={TimeIcon} alt="Time icon" className="time-icon" /></span>
              </div>
            </div>
            <button className="quiz-button" disabled={quiz.completed}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quizes;