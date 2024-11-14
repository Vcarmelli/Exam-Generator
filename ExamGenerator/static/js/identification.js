let allQuestions = [];
let selectedQuestions = [];
let index = 0;
let correct = 0;

const loadQuestions = () => {
    $.get("/quiz", function (data) {
        allQuestions = data.all_questions || [];
        const questionList = document.querySelector("#questionList");
        questionList.innerHTML = "";  // Clear any existing content

        allQuestions.forEach((question, i) => {
            if (question.questions && question.answers) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = i;
                checkbox.id = `question_${i}`;

                const label = document.createElement("label");
                label.setAttribute("for", `question_${i}`);
                label.innerText = `Question ${i + 1}: ${question.questions}`;

                const div = document.createElement("div");
                div.classList.add("question-option");
                div.appendChild(checkbox);
                div.appendChild(label);
                questionList.appendChild(div);
            } else {
                console.error(`Question data missing for index ${i}:`, question);
            }
        });
    }).fail(() => alert("Error loading questions. Please try again."));
};

const startQuiz = (selectedIndices) => {
    selectedQuestions = selectedIndices.map(i => allQuestions[i]);
    if (selectedQuestions.length === 0) {
        alert("Please select at least one question to start the quiz.");
        return;
    }
    index = 0;
    correct = 0;
    loadQuestion();
};

const loadQuestion = () => {
    const currentQuestion = selectedQuestions[index];
    if (currentQuestion && currentQuestion.questions) {
        document.querySelector("#question-title").innerText = `Question ${index + 1} of ${selectedQuestions.length}`;
        document.querySelector("#questionText").innerText = currentQuestion.questions;
        document.querySelector("#userAnswer").value = "";  // Clear previous answer
        document.querySelector("#feedback").innerText = "";
        document.querySelector("#Submit").style.display = "inline-block";
        document.querySelector("#Cancel").innerText = "Cancel";
        document.querySelector("#feedback").classList.remove("correct", "incorrect");
    } else {
        console.error("Error: Question data missing or malformed for current index.");
        document.querySelector("#questionText").innerText = "Error loading question. Please try again.";
    }
};

const handleSubmit = () => {
    const answer = document.querySelector("#userAnswer").value.trim().toLowerCase();
    const correctAnswer = selectedQuestions[index]?.answers?.trim().toLowerCase();
    const feedback = document.querySelector("#feedback");

    if (answer && correctAnswer) {
        const isCorrect = answer === correctAnswer;
        feedback.innerText = isCorrect ? "Correct!" : "Incorrect.";
        feedback.classList.add(isCorrect ? "correct" : "incorrect");
        correct += isCorrect ? 1 : 0;

        document.querySelector("#Submit").style.display = "none";
        document.querySelector("#Cancel").innerText = "Next";
    } else if (!answer) {
        alert("Please enter an answer before submitting.");
    } else {
        console.error("Answer data missing for current question.");
    }
};

const handleCancelOrNext = () => {
    if (document.querySelector("#Cancel").innerText === "Next") {
        if (index < selectedQuestions.length - 1) {
            index++;
            loadQuestion();
        } else {
            alert(`Quiz complete! You scored ${correct}/${selectedQuestions.length}`);
            window.location.reload();
        }
    } else if (confirm("Are you sure you want to cancel?")) {
        window.location.reload();
    }
};

// Event Listeners
document.querySelector("#questionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const selectedIndices = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => parseInt(checkbox.value));
    startQuiz(selectedIndices);
});

document.querySelector("#Submit").addEventListener("click", handleSubmit);
document.querySelector("#Cancel").addEventListener("click", handleCancelOrNext);

// Initial load of questions
loadQuestions(); 