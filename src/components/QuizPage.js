import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './QuizPage.css';
import logo from '../assets/logo.png'; 
import token from '../assets/TokenImage.png';

function QuizPage({ userId, onComplete }) {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Состояние для подсчета правильных ответов, награды и процента
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [reward, setReward] = useState(0);
  const [percentage, setPercentage] = useState(0); // Процент правильных ответов

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getQuizzes?userId=${userId}&quizId=${quizId}`);
      const data = await response.json();
      console.log('Fetched quiz data:', data);

      if (data.quizzes && data.quizzes[0].questions) {
        setQuiz({ ...data.quizzes[0], questions: data.quizzes[0].questions });
        setTimer(data.quizzes[0].timerInSeconds || 0);
      } else {
        console.error('Quiz has no questions.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [quizId, userId]);

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
      setIntervalId(id);
    } else if (timer === 0 && intervalId) {
      clearInterval(intervalId);
      onComplete();
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  // Обработчик для выбора ответа
  const handleOptionSelect = (selectedOption) => {
    setSelectedOption(selectedOption);

    // Проверка правильности ответа
    if (quiz.questions[currentQuestionIndex].correctOption === selectedOption) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }
  };

  // Обработчик для перехода к следующему вопросу
  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Когда все вопросы пройдены, вычисляем награду и процент
      setQuizCompleted(true);
      const totalReward = correctAnswersCount * (quiz.reward / quiz.questions.length);
      setReward(totalReward);

      // Рассчитываем процент правильных ответов
      const totalQuestions = quiz.questions.length;
      const correctPercentage = (correctAnswersCount / totalQuestions) * 100;
      setPercentage(correctPercentage); // Устанавливаем процент
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p>No questions available for this quiz.</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  return (
    <div className="quiz-page">
      {quizCompleted ? (
        <div className="completion-screen">
          <div className="background-image"></div>
          <div className="content">
            {/* Блок с наградой */}
            <div className="reward-display-quiz-complete">
              <span>{reward} $QUIZY</span>
              <img src={token} alt="QUIZY Logo" className="token-icon-quiz-complete" />
            </div>
            <div className="results">Your results</div>

            {/* Круговой прогресс-бар */}
            <div className="progress-circle">
              <div className="circle">
                <svg className="svg-circle" width="240" height="240">
                  <circle cx="120" cy="120" r="110" stroke="#0E2258" strokeWidth="15" />
                  <circle
                    cx="120"
                    cy="120"
                    r="110"
                    stroke="#34519C"
                    strokeWidth="15"
                    strokeDasharray={2 * Math.PI * 110}
                    strokeDashoffset={(2 * Math.PI * 110) * (1 - (percentage / 100))}
                    style={{
                      transition: 'stroke-dashoffset 5s ease-out', // Плавное изменение круга
                    }}
                  />
                </svg>
                <div className="percentage" style={{ opacity: percentage === 100 ? 1 : 0 }}>
                  {Math.round(percentage)}%
                </div>
              </div>
            </div>

            {/* Поздравительный текст */}
            <div className="congratulations">
              <h3 className="congratulations-text-title">Congratulations, you’ve completed this quiz! 🎉</h3>
              <p className="congratulations-text">Let’s keep testing your knowledge by playing more quizzes!</p>
            </div>

            {/* Кнопка для получения награды */}
            <button className="claim-reward-button" onClick={handleNextQuestion}>Claim reward</button>
          </div>
        </div>
      ) : (
        <>
          <div className="quiz-header">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
          </div>

          <div className="timer-container">
            <div className="time-digit">{minutes[0]}</div>
            <div className="time-digit">{minutes[1]}</div>
            <span className="time-colon">:</span>
            <div className="time-digit">{seconds[0]}</div>
            <div className="time-digit">{seconds[1]}</div>
          </div>

          <div className="question-section">
            <h3>{currentQuestionIndex + 1}. {currentQuestion.question}</h3>
            <div className="options">
              {Object.entries(currentQuestion.options || {}).map(([key, option]) => (
                option && (
                  <div
                    key={key}
                    className={`option ${selectedOption === key ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(key)}
                  >
                    <input
                      type="radio"
                      name="option"
                      checked={selectedOption === key}
                      onChange={() => setSelectedOption(key)}
                      className="radio-input"
                    />
                    <span className="option-text">{option}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          <button
            className="next-question-button"
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 
              `Complete quiz (${currentQuestionIndex + 1}/${quiz.questions.length})` : 
              `Next question (${currentQuestionIndex + 1}/${quiz.questions.length})`}
          </button>
        </>
      )}
    </div>
  );
}

export default QuizPage;
