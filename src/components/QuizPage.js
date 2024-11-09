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

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleCompleteQuiz = () => {
    onComplete();
  };

  if (loading) return <p>Loading...</p>;
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p>No questions available for this quiz.</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  return (
    <div className="quiz-page">
      {quizCompleted ? (
              <div className="completion-screen">
              {/* Блок с наградой */}
              <div className="reward-display-quiz-complete">
                <span>+1000</span>
                <img src={token} alt="QUIZY Logo" className="token-icon-quiz-complete" />
              </div>
          
              {/* Заголовок результатов */}
              <div className="results"><h2>Your results</h2></div>
          
              {/* Круговой прогресс-бар */}
              <div className="progress-circle">
                <div className="circle">
                  <svg>
                    <circle cx="120" cy="120" r="80" />
                    <circle
                      cx="120"
                      cy="120"
                      r="80"
                      style={{ strokeDashoffset: `calc(408 - (408 * ${Math.round((currentQuestionIndex + 1) / quiz.questions.length * 100)}) / 100)` }}
                    />
                  </svg>
                  <div className="percentage">{Math.round((currentQuestionIndex + 1) / quiz.questions.length * 100)}%</div>
                </div>
              </div>
          
              {/* Поздравительный текст */}
              <h3>Congratulations, you’ve completed this quiz! 🎉</h3>
              <p className="congratulations-text">Let’s keep testing your knowledge by playing more quizzes!</p>
          
              {/* Кнопка для получения награды */}
              <button className="claim-reward-button" onClick={handleCompleteQuiz}>Claim reward</button>
            </div>
      ) : (
        <>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="quiz-header">
            <div className="reward-display-quiz">
              <img src={logo} alt="QUIZY Logo" className="token-icon-quiz" />
              <span>0 $QUIZY</span>
            </div>
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
                    onClick={() => setSelectedOption(key)}
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