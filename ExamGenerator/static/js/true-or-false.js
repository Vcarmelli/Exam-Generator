$(document).ready(function () {
    let quiz = document.querySelector("#quiz");
    let questionNo = document.querySelector("#questionNo");
    let questionText = document.querySelector("#questionText");
    let questionText1 = document.querySelector("#questionText1");
    let choice_que = document.querySelectorAll(".choice_que");
    let Submit = document.querySelector("#Submit");
    let Cancel = document.querySelector("#Cancel");
    let result = document.querySelector("#result");
    let points = document.querySelector("#points");

    let index = 0;
    let correct = 0;
    let UserAns = undefined;
    let UserAnsList = [];
    let totalQuestion = TOF.length;

    const loadData = () => {
        questionNo.innerText = (index + 1) + "/" + totalQuestion;
        questionText.innerText = TOF[index].question;
        choice_que[0].innerText = TOF[index].choice1;
        choice_que[1].innerText = TOF[index].choice2;

        // Clear previous states
        choice_que.forEach((option) => {
            option.classList.remove("active", "correct", "incorrect", "disabled");
        });

        // Reset buttons and feedback message
        Submit.style.display = "inline-block";
        Cancel.innerText = "Cancel";
        let message = document.querySelector(".feedback-message");
        if (message) {
            message.remove();  // Clear previous feedback message
        }
        
        let progressPercentage = ((index + 1) / totalQuestion) * 100;
        updateProgress(progressPercentage);
    };

    loadData();

    choice_que.forEach((choice, choiceNo) => {
        choice.addEventListener("click", () => {
            // Deselect all options
            choice_que.forEach(option => option.classList.remove("active"));

            // Select the clicked option
            choice.classList.add("active");
            UserAns = choiceNo;

            // Disable further selections
            choice_que.forEach(option => option.classList.add("disabled"));
        });
    });

    Submit.addEventListener("click", () => {
        if (UserAns !== undefined) {
            // Create a feedback message element
            let message = document.createElement("div");
            message.classList.add("feedback-message");

            if (UserAns === TOF[index].answer - 1) {  // Correct answer
                choice_que[UserAns].classList.add("correct");
                correct++;
                message.innerText = "Correct!";
                message.classList.add("correct-message");
            } else {  // Incorrect answer
                choice_que[UserAns].classList.add("incorrect");
                // Show the correct answer
                choice_que[TOF[index].answer - 1].classList.add("correct");
                message.innerText = "Check your answer!";
                message.classList.add("incorrect-message");
            }
            // save the user's answers in each question
            UserAnsList[index] = UserAns;

            // Append the feedback message after the question text
            questionText1.parentElement.appendChild(message);

            // Disable further submissions and show the Next button
            Submit.style.display = "none";
            Cancel.innerText = "Next";
        } else {
            alert("Please select an option before submitting.");
        }
    });

    Cancel.addEventListener("click", () => {
        if (Cancel.innerText === "Next") {
            if (index < TOF.length - 1) {
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