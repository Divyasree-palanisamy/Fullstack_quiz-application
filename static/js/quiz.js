// Quiz Questions Database
const questions = [
    {
        question: "What is the main purpose of React?",
        options: ["To style web pages", "To build user interfaces", "To handle databases", "To add animations"],
        answer: "To build user interfaces",
        category: "Programming"
    },
    {
        question: "Which keyword is used to create a component in React?",
        options: ["function", "component", "create", "build"],
        answer: "function",
        category: "Programming"
    },
    {
        question: "What hook is used for state management in functional components?",
        options: ["useRef", "useEffect", "useState", "useContext"],
        answer: "useState",
        category: "Programming"
    },
    {
        question: "What does JSX stand for?",
        options: ["JavaScript Extension", "Java Syntax Expression", "JavaScript XML", "JavaScript Xpath"],
        answer: "JavaScript XML",
        category: "Programming"
    },
    {
        question: "Which method is used to render React content to the DOM?",
        options: ["ReactDOM.render()", "React.render()", "DOM.render()", "render()"],
        answer: "ReactDOM.render()",
        category: "Programming"
    },
    {
        question: "Which hook is used for performing side effects in functional components?",
        options: ["useFetch", "useEffect", "useState", "useReducer"],
        answer: "useEffect",
        category: "Programming"
    },
    {
        question: "How do you pass data from parent to child component in React?",
        options: ["Using hooks", "Using props", "Using state", "Using context"],
        answer: "Using props",
        category: "Programming"
    },
    {
        question: "Which of the following is not a valid React hook?",
        options: ["useFetch", "useEffect", "useRef", "useMemo"],
        answer: "useFetch",
        category: "Programming"
    },
    {
        question: "Which tool is commonly used to create a new React app?",
        options: ["npm init react-app", "create-react-app", "npx create-react-app", "react-start"],
        answer: "npx create-react-app",
        category: "Programming"
    },
    {
        question: "What is the purpose of `key` in a list rendering in React?",
        options: ["To set style", "To improve performance", "To identify each element uniquely", "To bind state"],
        answer: "To identify each element uniquely",
        category: "Programming"
    }
];

// Quiz State Variables
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let userAnswers = [];
let timeLeft = 60;
let timer;
let startTime;
let quizCompleted = false;

// DOM Elements
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const scoreEl = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");
const currentQuestionEl = document.getElementById("currentQuestion");
const totalQuestionsEl = document.getElementById("totalQuestions");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const completedSound = document.getElementById("completedSound");

// Initialize Quiz
function initQuiz() {
    shuffledQuestions = shuffleArray([...questions]);
    userAnswers = new Array(shuffledQuestions.length).fill(null);
    currentQuestion = 0;
    score = 0;
    timeLeft = 60;
    quizCompleted = false;

    totalQuestionsEl.textContent = shuffledQuestions.length;
    startTime = Date.now();

    loadQuestion();
    startTimer();
}

// Load Question
function loadQuestion() {
    const question = shuffledQuestions[currentQuestion];
    questionEl.textContent = question.question;
    currentQuestionEl.textContent = currentQuestion + 1;

    optionsEl.innerHTML = "";

    question.options.forEach((optionText, index) => {
        const option = document.createElement('div');
        option.className = 'option btn btn-outline-primary mb-2 w-100 text-start';
        option.textContent = optionText;
        option.addEventListener('click', () => selectOption(option, optionText));
        optionsEl.appendChild(option);
    });

    // Show previous answer if exists
    const previousAnswer = userAnswers[currentQuestion];
    if (previousAnswer) {
        const correctAnswer = shuffledQuestions[currentQuestion].answer;
        Array.from(optionsEl.children).forEach(option => {
            option.style.pointerEvents = 'none';
            if (option.textContent === correctAnswer) {
                option.classList.remove('btn-outline-primary');
                option.classList.add('btn-success');
            } else if (option.textContent === previousAnswer && previousAnswer !== correctAnswer) {
                option.classList.remove('btn-outline-primary');
                option.classList.add('btn-danger');
            } else {
                option.classList.remove('btn-outline-primary');
                option.classList.add('btn-secondary');
            }
        });
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }

    updateProgressBar();
    updateNavigationButtons();
}

// Select Option
function selectOption(selectedEl, selectedAnswer) {
    const correctAnswer = shuffledQuestions[currentQuestion].answer;
    const prevAnswer = userAnswers[currentQuestion];
    const isCorrect = selectedAnswer === correctAnswer;

    // Update score
    if (prevAnswer === null) {
        if (isCorrect) {
            score++;
            correctSound.play();
        } else {
            wrongSound.play();
        }
    } else {
        const wasCorrect = prevAnswer === correctAnswer;
        if (wasCorrect && !isCorrect) {
            score--;
            wrongSound.play();
        } else if (!wasCorrect && isCorrect) {
            score++;
            correctSound.play();
        }
    }

    userAnswers[currentQuestion] = selectedAnswer;

    // Update UI
    Array.from(optionsEl.children).forEach(option => {
        option.style.pointerEvents = 'none';
        if (option.textContent === correctAnswer) {
            option.classList.remove('btn-outline-primary');
            option.classList.add('btn-success');
        } else if (option.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            option.classList.remove('btn-outline-primary');
            option.classList.add('btn-danger');
        } else {
            option.classList.remove('btn-outline-primary');
            option.classList.add('btn-secondary');
        }
    });

    nextBtn.disabled = false;
}

// Navigation
nextBtn.addEventListener('click', () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showScore();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

// Show Score
function showScore() {
    quizCompleted = true;
    clearInterval(timer);

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const percentage = (score / shuffledQuestions.length * 100).toFixed(1);

    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = "";
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';

    let message = "";
    if (percentage >= 90) {
        message = "🔥🔥 Excellent! Outstanding performance!";
    } else if (percentage >= 70) {
        message = "💫💫 Great job! Well done!";
    } else if (percentage >= 50) {
        message = "👍👍 Good effort! Keep practicing!";
    } else {
        message = "🫠🫠 Better luck next time! Don't give up!";
    }

    scoreEl.innerHTML = `
        <div class="alert alert-info">
            <h4 class="alert-heading">Your Results</h4>
            <p class="mb-2"><strong>Score:</strong> ${score} out of ${shuffledQuestions.length}</p>
            <p class="mb-2"><strong>Percentage:</strong> ${percentage}%</p>
            <p class="mb-2"><strong>Time Taken:</strong> ${timeTaken} seconds</p>
            <hr>
            <p class="mb-0">${message}</p>
        </div>
    `;
    scoreEl.style.display = 'block';

    progressBar.style.width = "100%";
    progressText.textContent = "100%";

    completedSound.play();

    // Save result to database
    saveQuizResult(score, shuffledQuestions.length, timeTaken);
}

// Save Quiz Result
async function saveQuizResult(score, totalQuestions, timeTaken) {
    try {
        const response = await fetch('/submit_quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: score,
                total_questions: totalQuestions,
                time_taken: timeTaken,
                quiz_type: 'general'
            })
        });

        const data = await response.json();
        if (data.success) {
            console.log('Quiz result saved successfully');
        }
    } catch (error) {
        console.error('Error saving quiz result:', error);
    }
}

// Reset Quiz
resetBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    scoreEl.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    prevBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    shuffledQuestions = shuffleArray([...questions]);
    userAnswers = new Array(shuffledQuestions.length).fill(null);
    loadQuestion();
    startTimer();
});

// Timer Functions
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerEl.style.color = 'red';
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            showScore();
        }
    }, 1000);
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;
    progressBar.style.width = progress + "%";
    progressText.textContent = Math.round(progress) + "%";
}

function updateNavigationButtons() {
    prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    nextBtn.textContent = currentQuestion === shuffledQuestions.length - 1 ? 'Finish' : 'Next';
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initQuiz); 