const configContainer = document.querySelector(".config-container");
const quizConatiner = document.querySelector(".quiz-container");
const answerList = document.querySelector(".answer-options");
const nextQuest = document.querySelector(".next-quest-btn");
const questStatus = document.querySelector(".question-status");
const resultContainer = document.querySelector(".result-container");

const quizTime = 15;
let currentTime = quizTime;
let timer = null;
let quizCategory = "programming";
let numberofQuest = 5;
let currentQuest = null;
const questIndexHistry = [];
let correctAnsCount = 0;

// Display The Quiz result and hide the quiz container
const showQuizResult = () => {
  quizConatiner.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `You answered <b>${correctAnsCount}</b> out 0f <b>${numberofQuest}</b> question correctly. Great Effort !`;
  document.querySelector(".result-message").innerHTML = resultText;
};

const resetTimer = () => {
  clearInterval(timer);
  currentTime = quizTime;
  document.querySelector(".time-duration").textContent = currentTime;
};

const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    document.querySelector(".time-duration").textContent = currentTime;
    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuest.style.visibility = "visible";
      quizConatiner.querySelector(".quiz-timer").style.background = "#c31402";

      // Disable click events on all options
      answerList
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};

// Fetch random question from the category
const getRandomQuestion = () => {
  const categoryQuest =
    questions.find((lad) => lad.category === quizCategory).questions || [];

  // Check if all questions have been answered
  if (
    questIndexHistry.length >= Math.min(categoryQuest.length, numberofQuest)
  ) {
    return showQuizResult();
  }

  // Filter out the questions that have been answered
  const availableQuest = categoryQuest.filter(
    (_, index) => !questIndexHistry.includes(index)
  );

  const randomQuest =
    categoryQuest[Math.floor(Math.random() * categoryQuest.length)];
  questIndexHistry.push(categoryQuest.indexOf(randomQuest));
  return randomQuest;
};

const highlightCorrectAnswer = () => {
  const correctOption =
    answerList.querySelectorAll(".answer-option")[currentQuest.correctAnswer];
  correctOption.classList.add("correct");
  const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Handle The User Answer Selection
const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuest.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");

  !isCorrect ? highlightCorrectAnswer() : correctAnsCount++;

  // Insert icon Based on Correctness
  const iconHTML = `<span class="material-symbols-rounded">${
    isCorrect ? "check_circle" : "cancel"
  }</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  // Disable click events on all options
  answerList
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));

  nextQuest.style.visibility = "visible";
};

// Render the question to the DOM
const renderQuest = () => {
  currentQuest = getRandomQuestion();
  if (!currentQuest) {
    return;
  }
  resetTimer();
  startTimer();
  // Clear the previous question
  nextQuest.style.visibility = "hidden";
  quizConatiner.querySelector(".quiz-timer").style.background = "#32313c";

  answerList.innerHTML = "";
  document.querySelector(".quiz-question").innerHTML = currentQuest.question;
  questStatus.innerHTML = `<b>${questIndexHistry.length}</b>
          of <b>${numberofQuest}</b>
          Questions`;
  // Create option <li> elements , append them , and click event listener
  currentQuest.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerList.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

// Start the quiz and render the random question
const startQuiz = () => {
  configContainer.style.display = "none";
  quizConatiner.style.display = "block";

  // Get the selected category and number of questions
  quizCategory = configContainer
    .querySelector(".category-option.active")
    .textContent.toLowerCase();
  numberofQuest = parseInt(
    configContainer.querySelector(".question-option.active").textContent
  );
  renderQuest();
};

// Hightlight the selected option on click - category or no of questions
document
  .querySelectorAll(".category-option, .question-option")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });

// Reset the quiz
const resetQuiz = () => {
  resetTimer();
  questIndexHistry.length = 0;
  correctAnsCount = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";
};
nextQuest.addEventListener("click", renderQuest);
document.querySelector(".try-again").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);
