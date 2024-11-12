import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizPage.css';
import logo from '../assets/logo.png'; 
import token from '../assets/TokenImage.png';

function QuizPage({ userId, onComplete }) {
    const { quizId } = useParams();
    const navigate = useNavigate(); 
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Состояния для прогресса и круга
    const [percentage, setPercentage] = useState(0);  // Процент правильных ответов
    const [circleProgress, setCircleProgress] = useState(0);  // Прогресс для круга

    // Используем useRef для отслеживания правильных ответов
    const correctAnswersRef = useRef(0);  
    const [reward, setReward] = useState(0);
  

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

    const handleOptionSelect = (selectedOption) => {
        console.log('Selected option:', selectedOption);  
        setSelectedOption(selectedOption); 
    };
    
    const handleNextQuestion = () => {
        console.log('Selected option before next question:', selectedOption);  
        if (selectedOption === null) {
            return;  
        }
    
        const correctOption = quiz.questions[currentQuestionIndex].correctOption;
        console.log('Correct option for current question:', correctOption);
    
        // Проверяем правильность ответа при переходе к следующему вопросу
        if (String(correctOption) === String(selectedOption)) {
            correctAnswersRef.current += 1; // Увеличиваем количество правильных ответов через ref
            console.log('Correct answer selected, correctAnswersCount:', correctAnswersRef.current); 
        }

        // Вычисляем процент правильных ответов
        const progressByCorrectAnswers = (correctAnswersRef.current / quiz.questions.length) * 100;
        setPercentage(progressByCorrectAnswers); // Обновляем процент правильных ответов

        // Переход к следующему вопросу
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);  
        } else {
            setQuizCompleted(true);
            const rewardPerQuestion = quiz.reward / quiz.questions.length;
            setReward(correctAnswersRef.current * rewardPerQuestion);
        }
    };

    // Функция для начисления награды и перехода на другой экран
    const handleCompleteQuiz = async () => {
        try {
            const totalReward = correctAnswersRef.current * (quiz.reward / quiz.questions.length); 

            const response = await fetch('https://us-central1-quizy-d6ffb.cloudfunctions.net/completeQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    quizId,
                    correctAnswersCount: correctAnswersRef.current,
                    totalReward,
                }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Quiz completed successfully!');
                console.log('New balance:', data.newBalance);
            } else {
                console.error('Error completing quiz:', data.error);
            }
        } catch (error) {
            console.error('Error sending request to complete quiz:', error);
        }

        navigate('/quizes');
    };

    // Для прогресса по вопросам
    const progressByQuestions = ((currentQuestionIndex + 1) / quiz?.questions.length) * 100;

    useEffect(() => {
        const circleLength = 2 * Math.PI * 50; // Рассчитываем длину круга
        setCircleProgress((percentage / 100) * circleLength); // Рассчитываем прогресс круга

        const interval = setInterval(() => {
            if (percentage < progressByCorrectAnswers) {
                setPercentage((prev) => Math.min(prev + 1, progressByCorrectAnswers)); 
            }
        }, 50);

        return () => clearInterval(interval);
    }, [percentage, correctAnswersRef.current]); // Обновляем только при изменении правильных ответов

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
                            <span>{reward}</span>
                            <img src={token} alt="QUIZY Logo" className="token-icon-quiz-complete" />
                        </div>
              
                        {/* Заголовок результатов */}
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
                                        strokeDasharray={circleProgress}
                                        strokeDashoffset={circleProgress}
                                        style={{
                                            transition: 'stroke-dashoffset 5s ease-out', // Плавное изменение круга
                                        }}
                                    />
                                </svg>
                                <div className="percentage" style={{ opacity: percentage === progressByCorrectAnswers ? 1 : 0 }}>
                                    {percentage}%
                                </div>
                            </div>
                        </div>
              
                        {/* Поздравительный текст */}
                        <div className="congratulations">
                            <h3 className="congratulations-text-title">Congratulations, you’ve completed this quiz! 🎉</h3>
                            <p className="congratulations-text">Let’s keep testing your knowledge by playing more quizzes!</p>
                        </div>
              
                        {/* Кнопка для получения награды */}
                        <button className="claim-reward-button" onClick={handleCompleteQuiz}>Claim reward</button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Прогресс-бар по вопросам */}
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressByQuestions}%` }}></div>
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
                                    onClick={() => handleOptionSelect(key)}  
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        checked={selectedOption === key} 
                                        className="radio-input"
                                        readOnly 
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
