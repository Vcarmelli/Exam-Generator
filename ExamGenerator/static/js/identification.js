$(document).ready(function () {
    let quiz = document.querySelector("#quiz");
    let questionNo = document.querySelector("#questionNo");
    let questionText = document.querySelector("#questionText");
    let questionImage = document.querySelector("#questionImage");
    let userAnswer = document.querySelector("#userAnswer");
    let Submit = document.querySelector("#Submit");
    let Cancel = document.querySelector("#Cancel");
    let feedback = document.querySelector("#feedback");
    let result = document.querySelector("#result");
    let points = document.querySelector("#points");

    let index = 0;
    let correct = 0;
    let totalQuestion = IDEN.length;

    const loadData = () => {
        questionNo.innerText = (index + 1) + "/" + totalQuestion;
        questionText.innerText = IDEN[index].question;
        if (IDEN[index].image) {
            questionImage.src = IDEN[index].image;
            questionImage.style.display = "block";
        } else {
            questionImage.style.display = "none";
        }
        userAnswer.value = "";
        userAnswer.classList.remove("correct", "incorrect"); // Reset class
        feedback.innerText = "";
        feedback.classList.remove("correct-message", "incorrect-message"); // Reset feedback classes
        Submit.style.display = "inline-block";
        Cancel.innerText = "Cancel";
        let updateProgress = (percent) => {
            const progressBar = document.getElementById('progress');
            if (progressBar) {
                progressBar.style.width = percent + '%';
                progressBar.textContent = Math.round(percent) + '%';
            }
        };
        let progressPercentage = ((index + 1) / totalQuestion) * 100;
        updateProgress(progressPercentage);
    };

    loadData();

    Submit.addEventListener("click", () => {
        let answer = userAnswer.value.trim().toLowerCase();
        let correctAnswer = IDEN[index].answer.trim().toLowerCase();

        if (answer) {
            if (answer === correctAnswer) {
                feedback.innerText = "Correct!";
                feedback.classList.add("correct-message");
                userAnswer.classList.add("correct");
                correct++;
            } else {
                feedback.innerText = `Incorrect. The correct answer is: ${IDEN[index].answer}`;
                feedback.classList.add("incorrect-message");
                userAnswer.classList.add("incorrect");
            }
            Submit.style.display = "none";
            Cancel.innerText = "Next";
        } else {
            alert("Please enter an answer before submitting.");
        }
    });

    Cancel.addEventListener("click", () => {
        if (Cancel.innerText === "Next") {
            if (index < IDEN.length - 1) {
                index++;
                loadData();
            } else {
                passData(correct, totalQuestion);
            }
        } else {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.reload();
            }
        }
    });
});
