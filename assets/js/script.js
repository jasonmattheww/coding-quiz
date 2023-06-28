// Called all of my selectors and created variables for them
var firstScoreBoard = document.querySelector("#first-scoreboard");
var timer = document.querySelector("#timer");
var startBox = document.querySelector("#start-box");
var startButton = document.querySelector("#start-button");
var questionBox = document.querySelector("#question-box");
var questionText = document.querySelector("#question-text");
var questionChoices = document.querySelector("#question-choices");
var outcome = document.querySelector("#outcome");
var outcomeText = document.querySelector("#outcome-text");
var scoreBox = document.querySelector("#score-box");
var score = document.querySelector("#score");
var initials = document.querySelector("#initials");
var toScoreboard = document.querySelector("#to-scoreboard");
var scoreboardBox = document.querySelector("#scoreboard-box");
var scorelist = document.querySelector("#scorelist");
var backToStart = document.querySelector("#back-to-start");
var clearHighScore = document.querySelector("#clear-high-score");

// These are global variables
var time;
var currentQuestion;
var intervalID;

// To hide all of my boxes
function hideBox() {
  startBox.setAttribute("hidden", true);
  questionBox.setAttribute("hidden", true);
  scoreBox.setAttribute("hidden", true);
  scoreboardBox.setAttribute("hidden", true);
}

// This hides the text if the answer is correct or wrong
function hideOutcomeText() {
  outcome.style.display = "none";
}

// Created a questions variable that has an array with my questions, answers, and correct answer
var questions = [
  {
    questionDisplay: "How many heading tags are their in HTML:",
    choices: [
      "a. 3",
      "b. 5",
      "c. 1",
      "d. 6", 
    ],
    correctAnswer: "d. 6",
  },

  {
    questionDisplay: "How do you target a id attribute in CSS:",
    choices: [
      "a. #",
      "b. .",
      "c. *",
      "d. $",
    ],   
      correctAnswer: "a. #",
  },

  {
    questionDisplay: "Which keyword is used to define the variable in JavaScript:",
    choices: [
      "a. let",
      "b. Both A & C",
      "c. var",
      "d. None of the above",
    ],
      correctAnswer: "b. Both A & C",
  },

  {
    questionDisplay: "What does HTML stand for:", 
    choices: [
      "a. Hypertext Makeup Language",
      "b. Hyper Markup Language",
      "c. Hypertext Markup Language",
      "d. Hyper Makeup Language",
    ],
      correctAnswer: "c. Hypertext Markup Language",
  },
];

startButton.addEventListener("click", startQuiz);

// Created startQuiz function
function startQuiz() {
  // Hides all boxes and also removes the questionBox hidden declaration
  hideBox();
  questionBox.removeAttribute("hidden");

  // Assigns the current question to 0 and then displays the current question
  currentQuestion = 0;
  displayQuestion();

  // The time will equal the questions length which is 4 and times it by 15 to make the time 60 seconds. Then it peforms the countdown function every 1000ms to update the time
  time = questions.length * 15;
  intervalID = setInterval(countdown, 1000);

  // This will display the time once you click startQuiz
  displayTime();
}

// Lowers the time by 1 and displays it on the screen. If the time is less than 1 second end the quiz
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

// Created the displayTime function, then textContent makes the time display on the page
function displayTime() {
  timer.textContent = time;
}

// This function displays the question and the choices for the current question
function displayQuestion() {
  var question = questions[currentQuestion];
  var choices = question.choices;

  questionText.textContent = question.questionDisplay;

  for (var i = 0; i < choices.length; i++) {
    var choice = choices[i];
    var choiceButton = document.querySelector("#choice" + i);
    choiceButton.textContent = choice;
  }
}

questionChoices.addEventListener("click", checkAnswer);

// It checks to see if the choice you chose equals to the correct answer of the current question 
function optionIsCorrect(choiceButton) {
  return choiceButton.textContent === questions[currentQuestion].correctAnswer;
}

// This will check if the answer is correct or wrong and display a message saying correct or wrong. If you get the question wrong deduct 10 seconds, also if the time is 0 seconds end the quiz.
function checkAnswer(eventObject) {
  var choiceButton = eventObject.target;
  outcome.style.display = "block";
  if (optionIsCorrect(choiceButton)) {
    outcomeText.textContent = "Correct!";
    setTimeout(hideOutcomeText, 1000);
  } else {
    outcomeText.textContent = "Wrong!";
    setTimeout(hideOutcomeText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  // Increase the current question by 1 and if we still have more questions display them otherwise endQuiz
  currentQuestion++;
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

// This will end the quiz and once it has it will clear the time and hide all of the boxes. But then we will unhide the scoreBox and display the score, which is the time
function endQuiz() {
  clearInterval(intervalID);
  hideBox();
  scoreBox.removeAttribute("hidden");
  score.textContent = time;
}

toScoreboard.addEventListener("click", storeScore);

// This function will prevent the default behavior of the form. Then if no initials are entered make an alert saying enter your initials.
function storeScore(event) {
  event.preventDefault();

  if (!initials.value) {
    alert("Please enter your initials");
    return;
  }
 
  // Stores the score and the initials inside an object
  var leaderboardItem = {
    initials: initials.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  // Hides all of the boxes, then unhide the scoreboardBox
  hideBox();
  scoreboardBox.removeAttribute("hidden");

  renderLeaderboard();
}

// This function will update the stored leaderboard in the local storage
function updateStoredLeaderboard(leaderboardItem) {
  var leaderboardArray = getLeaderboard();
  // Uses push to append multiple new values at the end of an array
  leaderboardArray.push(leaderboardItem);
  // This will convert the values into a string
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

// This will get the leaderboardArray only if it exists. Then JSON.parse it into a javascript object
function getLeaderboard() {
  var storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    var leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

// This function will display the leaderboard onto the scoreboardBox, by using a for loop to go through the storedLeaderboardArray and display it. Also it will create an li to have 1,2,3 positions with the initals and the time.
function renderLeaderboard() {
  var sortedLeaderboardArry = sortedLeaderboard();
  scorelist.innerHTML = "";
  for (var i = 0; i < sortedLeaderboardArry.length; i++) {
    var leaderboardEntry = sortedLeaderboardArry[i];
    var newListItem = document.createElement("li");
    newListItem.textContent = 
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    scorelist.append(newListItem);  
  }
}

// This function will sort the leaderboard array from highest to lowest using the numeric sort function
function sortedLeaderboard() {
  var leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }
  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
    return leaderboardArray;
}

clearHighScore.addEventListener("click", clearHighScores);

// This will clear all of the scores in the local storage and then render the leaderboard again
function clearHighScores() {
  localStorage.clear();
  renderLeaderboard();
}

backToStart.addEventListener("click", returnToStart);

// Hides all of the boxes and then unhides the startBox
function returnToStart() {
  hideBox();
  startBox.removeAttribute("hidden");
}

firstScoreBoard.addEventListener("click", showLeaderboard);

// Once you click on the firstScoreBoard it will go the the scoreboardBox and hide all of the boxes except the scoreboardBox
function showLeaderboard() {
  hideBox();
  scoreboardBox.removeAttribute("hidden");
  clearInterval(intervalID);
  
  // The time will be undefined and then display that time, meaning no time will appear on the page
  time = undefined;
  displayTime();
  
  // Then we render the leaderboard
  renderLeaderboard();
}