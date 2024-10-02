$(document).ready(function () {
    let quiz = document.querySelector("#quiz");
    let questionNo = document.querySelector("#questionNo");
    let questionText = document.querySelector("#questionText");
    let questionText1 = document.querySelector("#questionText1");
    let choice_que = document.querySelectorAll(".choice_que");
    let answerNo = {
        0: document.querySelector("#answerNo1"),
        1: document.querySelector("#answerNo2"),
        2: document.querySelector("#answerNo3"),
        3: document.querySelector("#answerNo4")
    };
    let Submit = document.querySelector("#Submit");
    let Cancel = document.querySelector("#Cancel");
    let result = document.querySelector("#result");
    let points = document.querySelector("#points");

    let index = 0;
    let correct = 0;
    let UserAns = undefined;
    let UserAnsList = [];
    let totalQuestion = MCQS.length;

    const loadData = () => {
        questionNo.innerText = (index + 1) + "/" + totalQuestion;
        questionText.innerText = MCQS[index].question;
        questionText1.innerText = "Select up to one option";
        choice_que[0].innerText = MCQS[index].choice1;
        choice_que[1].innerText = MCQS[index].choice2;
        choice_que[2].innerText = MCQS[index].choice3;
        choice_que[3].innerText = MCQS[index].choice4;

        console.log("MCQS[index].choice1;", MCQS[index].choice1);

        choice_que.forEach((option, idx) => {
            option.classList.remove("active", "correct", "incorrect", "disabled");
            if (answerNo[idx]) {
                answerNo[idx].classList.remove("active", "correct", "incorrect", "disabled");
            }
        });

        Submit.style.display = "inline-block";
        Cancel.innerText = "Cancel";
        let message = document.querySelector(".feedback-message");
        if (message) {
            message.remove();  
        }

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

    choice_que.forEach((choice, choiceNo) => {
        choice.addEventListener("click", () => {
            choice_que.forEach(option => option.classList.remove("active"));
            Object.values(answerNo).forEach(answer => answer.classList.remove("active"));

            choice.classList.add("active");
            if (answerNo[choiceNo]) {
                answerNo[choiceNo].classList.add("active");
            }
            UserAns = choiceNo;

            choice_que.forEach(option => option.classList.add("disabled"));
            Object.values(answerNo).forEach(answer => answer.classList.add("disabled"));
        });
    });

    Submit.addEventListener("click", () => {
        if (UserAns !== undefined) {
            let message = document.createElement("div");
            message.classList.add("feedback-message");

            if (UserAns === MCQS[index].answer - 1) {
                choice_que[UserAns].classList.add("correct");
                if (answerNo[UserAns]) {
                    answerNo[UserAns].classList.add("correct");
                }
                correct++;
                message.innerText = "Correct!";
                message.classList.add("correct-message");
            } else { 
                choice_que[UserAns].classList.add("incorrect");
                if (answerNo[UserAns]) {
                    answerNo[UserAns].classList.add("incorrect");
                }
                choice_que[MCQS[index].answer - 1].classList.add("correct");
                if (answerNo[MCQS[index].answer - 1]) {
                    answerNo[MCQS[index].answer - 1].classList.add("correct");
                }
                message.innerText = "Check your answer!";
                message.classList.add("incorrect-message");
            }
            // save the user's answers in each question
            UserAnsList[index] = UserAns;

            questionText1.parentElement.appendChild(message);

            Submit.style.display = "none";
            Cancel.innerText = "Next";
        } else {
            alert("Please select an option before submitting.");
        }
    });

    Cancel.addEventListener("click", () => {
        if (Cancel.innerText === "Next") {
            if (index < MCQS.length - 1) {
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
