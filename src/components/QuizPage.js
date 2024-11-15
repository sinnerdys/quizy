import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizPage.css';
import logo from '../assets/logo.png'; 
import token from '../assets/TokenImage.png';

function QuizPage({ userId, onComplete }) {
    const { quizId } = useParams();
    const navigate = useNavigate(); // Добавляем навигацию для перехода на другой экран
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(0); // Время для таймера
    const [intervalId, setIntervalId] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isRewardVisible, setIsRewardVisible] = useState(false); // Состояние для видимости блока с наградой

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
                setTimer(data.quizzes[0].timerInSeconds); // Задаем начальное время из данных
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
            const id = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
    
            // Очищаем интервал, чтобы предотвратить множественные интервалы
            return () => clearInterval(id);
        } else if (timer === 0) {
            onComplete();
        }
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

    // Функция для начисления награды и перехода на другой экран
    const handleCompleteQuiz = async () => {
        try {
            const totalReward = correctAnswersRef.current * (quiz.reward / quiz.questions.length); // Вычисляем награду

            // Отправляем запрос на сервер для обновления баланса
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

        // Переход на страницу Quizes.js
        navigate('/quizes');
    };

    // Анимация прогресса (процент и круг) — теперь хук всегда вызывается
    const progress = ((currentQuestionIndex + 1) / quiz?.questions.length) * 100;

    const finalProgress = (correctAnswersRef.current / quiz?.questions.length) * 100; // Прогресс на основе правильных ответов

    // Радиус круга
    const radius = 110;
    // Длина окружности
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        if (quizCompleted) {
            // Скрываем прогресс и начинаем с 0%
            setPercentage(0); 
            setCircleProgress(circumference); // Это скрывает прогресс круга (начинаем с полного скрытия)

            // Добавляем задержку перед началом анимации (например, 2 секунды)
            const timeout = setTimeout(() => {
                // Теперь начинаем анимацию через 2 секунды
                const totalDuration = 4000; // Время анимации (например, 4 секунды)
                const steps = 100; // Количество шагов (с 0 до 100%)
                const stepDuration = totalDuration / steps; // Время на каждый шаг (в миллисекундах)

                // Для анимации прогресса
                const interval = setInterval(() => {
                    setPercentage((prev) => {
                        const newPercentage = Math.min(prev + 1, finalProgress); // Увеличиваем процент плавно
                        if (newPercentage === finalProgress) clearInterval(interval); // Останавливаем интервал

                        // Вычисляем новый offset для круга
                        const progressDashoffset = circumference - (newPercentage / 100) * circumference;
                        setCircleProgress(progressDashoffset); // Обновляем прогресс круга

                        return newPercentage;
                    });
                }, stepDuration); // Интервал обновления процентов

                // Очистка интервала, когда анимация завершена
                return () => clearInterval(interval);
            }, 1000); // Задержка 2 секунды перед началом анимации

            // Очистка таймера
            return () => clearTimeout(timeout);
        }
    }, [quizCompleted, finalProgress, circumference]); // Запускать хук при завершении квиза


        // Задержка на 5 секунд перед тем, как блок с наградой станет видимым
        useEffect(() => {
            if (quizCompleted) {
                const rewardTimeout = setTimeout(() => {
                    setIsRewardVisible(true); // Показываем блок награды через 5 секунд
                }, 5500); // 5000 миллисекунд = 5 секунд
    
                // Очистка таймера
                return () => clearTimeout(rewardTimeout);
            }
        }, [quizCompleted]); // Этот эффект срабатывает при завершении квиза

    
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
                        <div className={`reward-display-quiz-complete ${isRewardVisible ? 'fade-in' : ''}`}>
                            <span>{reward}</span>
                            <img src={token} alt="QUIZY Logo" className="token-icon-quiz-complete" />
                        </div>
              
                        {/* Заголовок результатов */}
                        <div className="results">Your results</div>
              
                        {/* Круговой прогресс-бар */}
                        <div className="progress-circle">
                            <div className="circle">
                            <svg className="svg-circle" width="240" height="240">
            <circle
                cx="120"
                cy="120"
                r="110"
                className="circle-background"  // Применяем класс для фона
            />
            <circle
                cx="120"
                cy="120"
                r="110"
                className="circle-progress"  // Применяем класс для прогресса
                strokeDasharray={circumference}
                strokeDashoffset={circleProgress}  // Используем обновленный progress
                style={{
                    opacity: circleProgress === circumference ? 0 : 1,  // Скрываем до начала анимации
                    transition: 'stroke-dashoffset 0.2s ease-out', 
                    transform: 'rotate(-90deg)',  // Поворот круга, чтобы начальная точка была сверху // Плавное изменение круга
                    transformOrigin: '50% 50%' // Обеспечивает вращение вокруг центра круга
                }}
            />
        </svg>
                                <div className="percentage" style={{ opacity: percentage === finalProgress ? 1 : 1 }}>
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
