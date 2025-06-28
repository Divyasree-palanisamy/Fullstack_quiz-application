// Quiz Questions Database
const questions = [
    // React Basics
    {
        question: "What is the main purpose of React?",
        options: ["To style web pages", "To build user interfaces", "To handle databases", "To add animations"],
        answer: "To build user interfaces",
        category: "React Basics",
        difficulty: "easy"
    },
    {
        question: "Which keyword is used to create a component in React?",
        options: ["function", "component", "create", "build"],
        answer: "function",
        category: "React Basics",
        difficulty: "easy"
    },
    {
        question: "What does JSX stand for?",
        options: ["JavaScript Extension", "Java Syntax Expression", "JavaScript XML", "JavaScript Xpath"],
        answer: "JavaScript XML",
        category: "React Basics",
        difficulty: "easy"
    },
    {
        question: "Which method is used to render React content to the DOM?",
        options: ["ReactDOM.render()", "React.render()", "DOM.render()", "render()"],
        answer: "ReactDOM.render()",
        category: "React Basics",
        difficulty: "medium"
    },
    {
        question: "How do you pass data from parent to child component in React?",
        options: ["Using hooks", "Using props", "Using state", "Using context"],
        answer: "Using props",
        category: "React Basics",
        difficulty: "medium"
    },
    {
        question: "Which tool is commonly used to create a new React app?",
        options: ["npm init react-app", "create-react-app", "npx create-react-app", "react-start"],
        answer: "npx create-react-app",
        category: "React Basics",
        difficulty: "easy"
    },
    {
        question: "What is the purpose of `key` in a list rendering in React?",
        options: ["To set style", "To improve performance", "To identify each element uniquely", "To bind state"],
        answer: "To identify each element uniquely",
        category: "React Basics",
        difficulty: "medium"
    },
    // ... (rest of the questions as before)
];

// Quiz Settings
let quizSettings = {
    category: null,
    difficulty: null,
    questionCount: null,
    timer: null
};

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
const quizSetup = document.getElementById("quizSetup");
const quizInterface = document.getElementById("quizInterface");
const startQuizBtn = document.getElementById("startQuizBtn");
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

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateStartButton();
});

function setupEventListeners() {
    // Category selection
    document.querySelectorAll('#categoryOptions .setup-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#categoryOptions .setup-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            quizSettings.category = option.dataset.category;
            updateStartButton();
        });
    });

    // Difficulty selection
    document.querySelectorAll('#difficultyOptions .setup-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#difficultyOptions .setup-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            quizSettings.difficulty = option.dataset.difficulty;
            updateStartButton();
        });
    });

    // Question count selection
    document.querySelectorAll('#questionCountOptions .setup-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#questionCountOptions .setup-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            quizSettings.questionCount = parseInt(option.dataset.count);
            updateStartButton();
        });
    });

    // Timer selection
    document.querySelectorAll('#timerOptions .setup-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('#timerOptions .setup-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            quizSettings.timer = parseInt(option.dataset.timer);
            updateStartButton();
        });
    });

    // Start quiz button
    startQuizBtn.addEventListener('click', startQuiz);
}

function updateStartButton() {
    const isComplete = quizSettings.category && quizSettings.difficulty && quizSettings.questionCount !== null && quizSettings.timer !== null;
    startQuizBtn.disabled = !isComplete;
}

function startQuiz() {
    // Filter questions based on settings
    let filteredQuestions = questions;
    if (quizSettings.category !== 'all') {
        const categoryMap = {
            'basics': 'React Basics',
            'hooks': 'React Hooks',
            'advanced': 'Advanced React'
        };
        filteredQuestions = filteredQuestions.filter(q => q.category === categoryMap[quizSettings.category]);
    }
    if (quizSettings.difficulty !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === quizSettings.difficulty);
    }
    // Shuffle and limit questions
    shuffledQuestions = shuffleArray([...filteredQuestions]).slice(0, quizSettings.questionCount);
    if (shuffledQuestions.length === 0) {
        alert('No questions available for the selected criteria. Please try different settings.');
        return;
    }
    // Initialize quiz
    userAnswers = new Array(shuffledQuestions.length).fill(null);
    currentQuestion = 0;
    score = 0;
    timeLeft = quizSettings.timer || 60;
    quizCompleted = false;
    totalQuestionsEl.textContent = shuffledQuestions.length;
    startTime = Date.now();
    // Show quiz interface
    quizSetup.style.display = 'none';
    quizInterface.classList.add('active');
    loadQuestion();
    if (quizSettings.timer > 0) {
        startTimer();
    } else {
        timerEl.style.display = 'none';
    }
}

function loadQuestion() {
    const question = shuffledQuestions[currentQuestion];
    questionEl.textContent = question.question;
    currentQuestionEl.textContent = currentQuestion + 1;
    optionsEl.innerHTML = "";
    question.options.forEach((optionText, index) => {
        const option = document.createElement('div');
        option.className = 'option';
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
                option.classList.add('correct');
            } else if (option.textContent === previousAnswer && previousAnswer !== correctAnswer) {
                option.classList.add('incorrect');
            } else {
                option.classList.add('disabled');
            }
        });
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
    updateProgressBar();
    updateNavigationButtons();
}

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
            option.classList.add('correct');
        } else if (option.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        } else {
            option.classList.add('disabled');
        }
    });
    nextBtn.disabled = false;
}

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

function showScore() {
    quizCompleted = true;
    if (timer) clearInterval(timer);
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
        <div class="score-display">
            <h2>Your Results</h2>
            <p><strong>Score:</strong> ${score} out of ${shuffledQuestions.length}</p>
            <p><strong>Percentage:</strong> ${percentage}%</p>
            <p><strong>Time Taken:</strong> ${timeTaken} seconds</p>
            <p><strong>Category:</strong> ${quizSettings.category}</p>
            <p><strong>Difficulty:</strong> ${quizSettings.difficulty}</p>
            <hr>
            <p>${message}</p>
        </div>
    `;
    scoreEl.style.display = 'block';
    progressBar.style.width = "100%";
    progressText.textContent = "100%";
    completedSound.play();
    saveQuizResult(score, shuffledQuestions.length, timeTaken);
}

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
                quiz_type: `${quizSettings.category}-${quizSettings.difficulty}`
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

resetBtn.addEventListener('click', () => {
    quizInterface.classList.remove('active');
    quizSetup.style.display = 'block';
    quizSettings = {
        category: null,
        difficulty: null,
        questionCount: null,
        timer: null
    };
    document.querySelectorAll('.setup-option').forEach(opt => opt.classList.remove('selected'));
    updateStartButton();
    scoreEl.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    prevBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    timerEl.style.display = 'inline-block';
});

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