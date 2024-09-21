$(document).ready(function () {
    let quiz = document.querySelector("#quiz");
    let questionNo = document.querySelector("#questionNo");
    let questionText = document.querySelector("#questionText");
    let questionImage = document.querySelector("#questionImage");
    let answerInputs = [
        document.querySelector("#answer1"),
        document.querySelector("#answer2"),
        document.querySelector("#answer3"),
        document.querySelector("#answer4")
    ];
    let Submit = document.querySelector("#Submit");
    let Cancel = document.querySelector("#Cancel");
    let feedback = document.querySelector("#feedback");
    let result = document.querySelector("#result");
    let points = document.querySelector("#points");

    let index = 0;
    let correct = 0;

    const loadData = () => {
        questionNo.innerText = (index + 1) + "/5";
        questionText.innerText = ENU[index].question;
        answerInputs.forEach(input => {
            input.value = "";
            input.classList.remove("correct", "incorrect");
        });
        feedback.innerText = "";
        feedback.classList.remove("correct-message", "incorrect-message");

        Submit.style.display = "inline-block";
        Cancel.innerText = "Cancel";

        let updateProgress = (percent) => {
            const progressBar = document.getElementById('progress');
            if (progressBar) {
                progressBar.style.width = percent + '%';
                progressBar.textContent = Math.round(percent) + '%';
            }
        };
        let progressPercentage = ((index + 1) / ENU.length) * 100;
        updateProgress(progressPercentage);
    };

    loadData();

    Submit.addEventListener("click", () => {
        let userAnswers = answerInputs.map(input => input.value.trim().toLowerCase());
        let correctAnswers = [
            ENU[index].answer1.trim().toLowerCase(),
            ENU[index].answer2.trim().toLowerCase(),
            ENU[index].answer3 ? ENU[index].answer3.trim().toLowerCase() : null,
            ENU[index].answer4 ? ENU[index].answer4.trim().toLowerCase() : null
        ].filter(answer => answer); 

        let isCorrect = userAnswers.some(userAnswer => correctAnswers.includes(userAnswer));

        if (isCorrect) {
            feedback.innerText = "Correct!";
            feedback.classList.add("correct-message");
            answerInputs.forEach(input => {
                if (correctAnswers.includes(input.value.trim().toLowerCase())) {
                    input.classList.add("correct");
                } else {
                    input.classList.add("incorrect");
                }
            });
            correct++;
        } else {
            feedback.innerText = `Incorrect. Possible correct answers are: ${correctAnswers.join(', ')}`;
            feedback.classList.add("incorrect-message");
            answerInputs.forEach(input => {
                input.classList.add("incorrect");
            });
        }
        Submit.style.display = "none";
        Cancel.innerText = "Next";
    });

    Cancel.addEventListener("click", () => {
        if (Cancel.innerText === "Next") {
            if (index < ENU.length - 1) {
                index++;
                loadData();
            } else {
                quiz.style.display = "none";
                result.style.display = "block";
                points.innerText = correct;
            }
        } else {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.reload();
            }
        }
    });
});
