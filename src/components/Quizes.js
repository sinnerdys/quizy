import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quizes.css';
import ModalQuiz from './ModalQuiz';
import ModalGetEnergy from './ModalGetEnergy'; // Импортируем модальное окно энергии
import TimeIcon from '../assets/timer.png';
import token from '../assets/TokenImage.png';
import completedIcon from '../assets/completedIcon.png'; // Импортируем иконку завершения

function Quizes({ userId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [completedCount, setCompletedCount] = useState(0); // Добавляем состояние для количества завершенных квизов
  const [showEnergyModal, setShowEnergyModal] = useState(false); // Добавляем состояние для модального окна энергии
  const [energy, setEnergy] = useState(0); // Добавляем состояние для энергии
  const [energyPacks, setEnergyPacks] = useState([]); // Добавляем состояние для пакетов энергии
  const navigate = useNavigate();

  const fetchUserQuizzes = async () => {
    if (!userId) {
      console.error('User ID is undefined');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getQuizzes?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const data = await response.json();

      console.log('Fetched quizzes:', data.quizzes);  // Добавляем логирование, чтобы проверить полученные данные

      // Фильтруем квизы только те, которые должны отображаться (display === true)
      const filteredQuizzes = data.quizzes.filter((quiz) => {
        console.log(`Quiz display value:`, quiz.display);  // Логируем значение display для каждого квиза
        return quiz.display;
      });

      console.log('Filtered quizzes:', filteredQuizzes);  // Логируем, чтобы проверить, какие квизы прошли фильтрацию

      const sortedQuizzes = filteredQuizzes.sort((a, b) => a.completed - b.completed);
      setQuizzes(sortedQuizzes);

      // Подсчитываем количество завершенных квизов
      const completedQuizzesCount = sortedQuizzes.filter((quiz) => quiz.completed).length;
      setCompletedCount(completedQuizzesCount);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user quizzes:', error);
      setLoading(false);
    }
  };

  const fetchUserEnergy = async () => {
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getEnergyInfo?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch energy');
      }
      const data = await response.json();
      setEnergy(data.energy);
    } catch (error) {
      console.error('Error fetching user energy:', error);
    }
  };

  const fetchEnergyPacks = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getEnergyPacks`);
      if (!response.ok) {
        throw new Error('Failed to fetch energy packs');
      }
      const data = await response.json();
      const validPacks = Object.values(data).filter((pack) => pack !== null); // Фильтруем null значения
      setEnergyPacks(validPacks);
    } catch (error) {
      console.error('Error fetching energy packs:', error);
    }
  };

  useEffect(() => {
    fetchUserQuizzes();
    fetchUserEnergy();
    fetchEnergyPacks();
  
    // Интервал обновления данных об энергии каждую секунду
    const energyInterval = setInterval(() => {
      fetchUserEnergy();
    }, 1000); // 1 секунда
  
    return () => clearInterval(energyInterval); // Очищаем интервал при размонтировании компонента
  }, [userId]);


  const openQuizModal = (quiz) => {
    setSelectedQuizId(quiz.id);
    setSelectedQuiz(quiz);
  };

  const closeQuizModal = () => {
    setSelectedQuizId(null);
    setSelectedQuiz(null);
  };

    // Функция для перехода на страницу квиза
    const openQuizPage = (quizId) => {
      navigate(`/quiz/${quizId}`);
      setSelectedQuiz(null);
      setSelectedQuizId(null); // Очищаем ID выбранного квиза
    };

  // Синхронизация `selectedQuizId` с `quizzes`
useEffect(() => {
  if (selectedQuizId) {
    const selected = quizzes.find((quiz) => quiz.id === selectedQuizId);
    if (selected) {
      setSelectedQuiz(selected);
    }
  }
}, [selectedQuizId, quizzes]);
  
  // Функция для открытия модального окна энергии
  const openEnergyModal = () => {
    setShowEnergyModal(true);
  };

  // Функция для закрытия модального окна энергии
  const closeEnergyModal = () => {
    setShowEnergyModal(false);
  };

  useEffect(() => {
    const section = document.querySelector('.quizes-section');
  
    if (showEnergyModal || selectedQuiz !== null) {
      // Убираем фиксированную высоту
      section?.classList.add('no-height');
    } else {
      // Возвращаем фиксированную высоту
      section?.classList.remove('no-height');
    }
  }, [showEnergyModal, selectedQuiz]);

  if (loading) return <p>Loading...</p>;

  // Вычисляем прогресс
  const totalQuizzes = quizzes.length;
  const progressPercentage = totalQuizzes > 0 ? (completedCount / totalQuizzes) * 100 : 0;

  return (
    <div className="quizes-section">
      <h3>Quizes</h3>
      <p>Play exciting games and earn more $QUIZY!</p>

      <div className="progress-container">
        <div className="progress-header">
          <span>Your progress:</span>
          <div className="energy-container">
            ⚡ {energy}
            <button className="energy-button" onClick={openEnergyModal}>
              +
            </button>
          </div>
        </div>
        <span className="progress-status">{completedCount}/{totalQuizzes} quizzes completed</span>
        <div className="progress-bar-quizes">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="quiz-list-desc">Available quizzes</div>
      <ul className="quiz-list">
        {quizzes.map((quiz, index) => (
          <li key={index} className="quiz-item">
            <div className="quiz-avatar">
              <img src={quiz.imageUrl} alt={quiz.title} />
            </div>
            <div className="quiz-info">
              <div className="quiz-title">{quiz.title}</div>
              <div className="quiz-details">
                <span className="quiz-reward">+{quiz.reward}</span>
                <img src={token} alt="QUIZY Token" className="reward-logo-quizes" />
                <span className="quiz-time">{quiz.displayTime} <img src={TimeIcon} alt="Time icon" className="time-icon" /></span>
              </div>
            </div>
            <button
              className={`quiz-button ${quiz.completed ? 'completed-button' : ''}`}
              onClick={() => openQuizModal(quiz)}
              disabled={quiz.completed}
            >
              {quiz.completed ? <img src={completedIcon} alt="Completed" className="completed-icon" /> : 'Open'}
            </button>
          </li>
        ))}
      </ul>
      {selectedQuiz && (
        <ModalQuiz
          quiz={selectedQuiz}
          onClose={closeQuizModal}
          onStart={() => openQuizPage(selectedQuizId)} // Используем selectedQuizId
          userId={userId}
          setEnergy={setEnergy}
        />
      )}
            {/* Модальное окно для получения энергии */}
            {showEnergyModal && (
        <ModalGetEnergy userId={userId} onClose={closeEnergyModal} energyPacks={energyPacks} />
      )}
    </div>
  );
}

export default Quizes;