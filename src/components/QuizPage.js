import React, { useEffect, useState, useRef } from 'react';
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

    // Добавим состояния для процентов и прогресса круга
    const [percentage, setPercentage] = useState(0);
    const [circleProgress, setCircleProgress] = useState(0);

    // Используем useRef для отслеживания правильных ответов
    const correctAnswersRef = useRef(0);  // Ссылка для отслеживания количества правильных ответов
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
        console.log('Selected option:', selectedOption);  // Логируем выбранный вариант
        setSelectedOption(selectedOption); // Просто устанавливаем выбранный вариант
    };
    
    const handleNextQuestion = () => {
        console.log('Selected option before next question:', selectedOption);  // Логируем выбранный вариант перед переходом к следующему вопросу
        if (selectedOption === null) {
            return;  // Останавливаем выполнение, если нет выбора
        }
    
        const correctOption = quiz.questions[currentQuestionIndex].correctOption;
        console.log('Correct option for current question:', correctOption);
    
        // Проверяем правильность ответа при переходе к следующему вопросу
        if (String(correctOption) === String(selectedOption)) {
            correctAnswersRef.current += 1; // Увеличиваем количество правильных ответов через ref
            console.log('Correct answer selected, correctAnswersCount:', correctAnswersRef.current); // Логируем правильные ответы
        }
    
        // Переход к следующему вопросу
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);  // Сброс выбранной опции после перехода
        } else {
            // Когда все вопросы пройдены, вычисляем награду
            setQuizCompleted(true);
            const rewardPerQuestion = quiz.reward / quiz.questions.length;
            console.log('Reward per question:', rewardPerQuestion);
            console.log('Correct answers count:', correctAnswersRef.current);  // Логируем количество правильных ответов из ref
            setReward(correctAnswersRef.current * rewardPerQuestion);  // Используем значение из ref
        }
    };

    useEffect(() => {
        console.log('Current question index:', currentQuestionIndex);
    }, [currentQuestionIndex]);
    
    useEffect(() => {
        console.log('Selected option:', selectedOption);
    }, [selectedOption]);

    
    // Анимация прогресса (процент и круг) — теперь хук всегда вызывается
    const progress = ((currentQuestionIndex + 1) / quiz?.questions.length) * 100;

    useEffect(() => {
        const interval = setInterval(() => {
            if (percentage < progress) {
                setPercentage((prev) => Math.min(prev + 1, progress)); // Увеличиваем процент
            }
        }, 50); // Интервал обновления процентов
  
        // Длина круга (радиус 50px)
        const circleLength = 2 * Math.PI * 50; // Рассчитываем длину круга
        setCircleProgress((progress / 100) * circleLength); // Рассчитываем прогресс круга
  
        // Очищаем интервал, когда анимация завершена
        return () => clearInterval(interval);
    }, [progress, percentage]);


    const handleCompleteQuiz = () => {
        onComplete();
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
                                <div className="percentage" style={{ opacity: percentage === progress ? 1 : 0 }}>
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
                                    onClick={() => handleOptionSelect(key)}  // Используем только onClick для изменения selectedOption
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        checked={selectedOption === key} // Обновляем состояние через selectedOption
                                        className="radio-input"
                                        readOnly // Только для отображения, не требуется изменять здесь
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
