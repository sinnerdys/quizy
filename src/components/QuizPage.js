import React, { useEffect, useState } from 'react';
import './QuizPage.css';

function QuizPage({ quizId, onComplete, userId }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`https://us-central1-quizy-d6ffb.cloudfunctions.net/getQuizzes?userId=${userId}&quizId=${quizId}`);
      const data = await response.json();
      console.log('Fetched quiz data:', data); // Для проверки структуры данных
  
      if (data.questions) {
        // Преобразуем объект вопросов в массив
        const questionsArray = Object.keys(data.questions).map((key) => ({
          id: key,
          ...data.questions[key],
        }));
        setQuiz({ ...data, questions: questionsArray });
        setTimer(data.time);
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

  // Таймер
  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
      setIntervalId(id);
    } else if (timer === 0 && intervalId) {
      clearInterval(intervalId);
      onComplete(); // Завершаем квиз по окончании времени
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleNextQuestion = () => {
    setSelectedOption(null); // Сбрасываем выбранный ответ
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(); // Завершаем квиз, если вопросы закончились
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p>No questions available for this quiz.</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <h2>{quiz.title}</h2>
      <p>Play exciting games and earn more $QUIZY!</p>

      <div className="timer">
        <span>{Math.floor(timer / 60).toString().padStart(2, '0')}</span>:
        <span>{(timer % 60).toString().padStart(2, '0')}</span>
      </div>

      <div className="question-section">
        <h3>{currentQuestionIndex + 1}. {currentQuestion.question}</h3>
        <div className="options">
          {Object.entries(currentQuestion.options).map(([key, option]) => (
            <button
              key={key}
              className={`option ${selectedOption === key ? 'selected' : ''}`}
              onClick={() => setSelectedOption(key)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        className="next-question-button"
        onClick={handleNextQuestion}
        disabled={selectedOption === null}
      >
        Next question ({currentQuestionIndex + 1}/{quiz.questions.length})
      </button>
    </div>
  );
}

export default QuizPage;