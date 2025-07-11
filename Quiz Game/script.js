const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
    correct: "Paris",
    explanation: "Paris is the capital and the most populated city in France."
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Earth", "Mars", "Jupiter"],
    correct: "Mars",
    explanation: "Mars is called the red planet because of its redish appearence caused by the iron-oxide (rust) on its surface."
  },
  {
    question: "Who wrote 'Harry Potter'?",
    options: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Rick Riordan"],
    correct: "J.K. Rowling",
    explanation: "J.K. Rowling is the british autor who wrote the Harry Potter series."
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: "4",
    explanation: "Basic math: 2 + 2 = 4. not 5 not 6 but 4."
  },
  {
    question: "Which ocean is the largest?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correct: "Pacific",
    explanation: "The pacific ocean covers more of the earth then all of the landmasses combined."
  }
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let questionsShuffled = [];
let currentQuestion = 0;
let score = 0;
let timerEl = document.getElementById('timer');
let timeLeft = 5;
let timerInterval;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const retryBtn = document.getElementById('retryBtn');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const explanationEl = document.getElementById('explanation');

function loadQuestion() {
  feedbackEl.textContent = '';
  explanationEl.textContent = '';
  nextBtn.disabled = true;
  document.body.style.backgroundColor = '#222';

  // Load question
  const q = questionsShuffled[currentQuestion];
  questionEl.textContent = `Q${currentQuestion + 1}: ${q.question}`;
  optionsEl.innerHTML = '';

  const shuffledOptions = shuffleArray([...q.options]);

  // Load options
  shuffledOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => {
      clearInterval(timerInterval); // stop timer if answered early
      selectAnswer(btn, q.correct);
    };
    optionsEl.appendChild(btn);
  });

  // Start/reset timer
  timeLeft = 5;
  timerEl.textContent = `Time left: ${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      handleTimeout(q.correct);
    }
  }, 1000);
}

function selectAnswer(button, correctAnswer) {
  const isCorrect = button.textContent === correctAnswer;
  const q = questionsShuffled[currentQuestion];

  // Disable all options immediately
  Array.from(optionsEl.children).forEach(btn => btn.disabled = true);

    if (isCorrect) {
      button.classList.add('correct');
      button.style.backgroundColor = '#28a745';
      feedbackEl.textContent = "Correct!";
      explanationEl.textContent = q.explanation;
      score++;
      correctSound.play();
    } else {
      button.classList.add('wrong');
      button.style.backgroundColor = '#dc3545';
      feedbackEl.textContent = `Wrong! Correct answer: ${correctAnswer}`;
      explanationEl.textContent = q.explanation;
      wrongSound.play();

    // Highlight the correct button
    Array.from(optionsEl.children).forEach(btn => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add('correct');
      }
    });
  }

  nextBtn.disabled = false;
}

function handleTimeout(correctAnswer) {
  const q = questionsShuffled[currentQuestion];

  feedbackEl.textContent = `Time's up! Correct answer: ${correctAnswer}`;
  explanationEl.textContent = q.explanation;
  document.body.style.backgroundColor = '#dc3545';

  Array.from(optionsEl.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.style.backgroundColor = "#28a745";
    }
  });

  wrongSound.play();
  nextBtn.disabled = false;
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
};

function showResults() {
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = '';
  feedbackEl.innerHTML = `Your score: <strong>${score} / ${questions.length}</strong>`;
  nextBtn.style.display = 'none';

  timerEl.style.display = 'none';
  explanationEl.style.display ='none';

  if (score <= 2) {
    retryBtn.style.display = 'inline-block';
  }
}

function retryQuiz() {
  currentQuestion = 0;
  score = 0;
  retryBtn.style.display = 'none';
  nextBtn.style.display = 'inline-block';
  timerEl.style.display = 'inline-block';
  explanationEl.style.display = 'inline-block';
  questionsShuffled = shuffleArray([...questions]);
  loadQuestion();
}

questionsShuffled = shuffleArray([...questions]);
loadQuestion();
retryBtn.addEventListener('click', retryQuiz);




