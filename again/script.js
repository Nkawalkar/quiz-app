const questions = [
    {
        question: "Question 1?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 0 // Index of correct option
    },
    {
        question: "Question 2?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 1
    },
    {
        question: "Question 3?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 2
    },
    {
        question: "Question 4?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 3
    },
    {
        question: "Question 5?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: 2
    }
];

let currentQuestion = 0;
let score = localStorage.getItem('quizScore') ? parseInt(localStorage.getItem('quizScore')) : 0;
let timeLeft = 10; // Time in seconds per question
let timerInterval;
let timerStarted = false;
let quizSubmitted = localStorage.getItem('quizSubmitted') === 'true';

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    if (quizSubmitted) {
        showSubmissionMessage();
        return;
    }

    const questionElement = document.getElementById('question');
    const optionsForm = document.getElementById('options-form');
    const currentQues = questions[currentQuestion];

    questionElement.textContent = currentQues.question;
    optionsForm.innerHTML = '';

    shuffle(currentQues.options); // Shuffle options

    currentQues.options.forEach((option, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option';
        input.value = index;
        input.id = 'option' + index;

        const label = document.createElement('label');
        label.htmlFor = 'option' + index;
        label.textContent = option;

        const li = document.createElement('li');
        li.appendChild(input);
        li.appendChild(label);

        optionsForm.appendChild(li);
    });

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const userAnswer = parseInt(selectedOption.value);
        if (userAnswer === questions[currentQuestion].answer) {
            score++;
        }
    }
}

function startTimer() {
    clearInterval(timerInterval);
    document.getElementById('time-left').textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timerInterval);
            nextQuestion();
        } else {
            document.getElementById('time-left').textContent = timeLeft;
        }
    }, 1000);
}

function nextQuestion() {
    checkAnswer();
    currentQuestion++;
    if (currentQuestion < questions.length) {
        timeLeft = 10; // Reset timer for the next question
        displayQuestion();
    } else {
        clearInterval(timerInterval);
        submitQuiz();
    }
}

function submitQuiz() {
    localStorage.setItem('quizSubmitted', 'true');
    localStorage.setItem('quizScore', score.toString());
    quizSubmitted = true;
    showSubmissionMessage();
}

function showSubmissionMessage() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('submission-message').style.display = 'block';
    document.getElementById('score').textContent = score;
}

// Display first question when the page loads
displayQuestion();
