document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const continueButton = document.getElementById("continue-button");
    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");
    let questionNo = document.querySelector("#questionNo");
    let currentQuestionIndex = 0;

    questionNo.innerText = (currentQuestionIndex + 1) + "/" + questionCards.length;

    if (questionCards.length > 0) {
        questionCards[currentQuestionIndex].style.display = "block";
    }

    submitButton.addEventListener("click", function() {
        const answerInput = questionCards[currentQuestionIndex].querySelector(".user-answer");

        if (answerInput.value.trim()) {
            const correctAnswer = questionCards[currentQuestionIndex].querySelector(".correct-answer").textContent;
            const correctAnswerElement = questionCards[currentQuestionIndex].querySelector(".correct-answer");
            const userAnswer = answerInput.value.trim().toLowerCase();

            if (userAnswer === correctAnswer.toLowerCase()) {
                correctAnswerElement.innerText = "Correct!"
                correctAnswerElement.classList.add("correct-message");
                answerInput.classList.add("correct");
            } else {
                correctAnswerElement.innerText = "Incorrect! The correct answer is " + correctAnswer;
                correctAnswerElement.classList.add("incorrect-message");
                answerInput.classList.add("incorrect");
            }

            correctAnswerElement.style.display = "block"; // Show the correct answer

            if ((currentQuestionIndex + 1) == questionCards.length) {
                nextButton.style.display = "block";
            } else {
                continueButton.style.display = "block";
            }
            
            submitButton.style.display = "none";
            cancelButton.style.display = "none";

            let progressPercentage = ((currentQuestionIndex + 1) / questionCards.length) * 100;
            updateProgress(progressPercentage);

        } else {
            alert("Please enter an answer before submitting.");
        }
    });

    continueButton.addEventListener("click", function() {
        questionCards[currentQuestionIndex].style.display = "none";
        currentQuestionIndex++;

        if (currentQuestionIndex < questionCards.length) {
            questionCards[currentQuestionIndex].style.display = "block";
            continueButton.style.display = "none";
            submitButton.style.display = "block";
            cancelButton.style.display = "block";

            const answerInput = questionCards[currentQuestionIndex].querySelector(".user-answer");
            answerInput.value = "";
            answerInput.classList.remove("correct", "incorrect"); 
            questionCards[currentQuestionIndex].querySelector(".correct-answer").classList.remove("correct-message", "incorrect-message"); 
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "none"; // Hide the correct answer for the next question
        } else {
            continueButton.style.display = "none";
            submitButton.style.display = "none";
            cancelButton.style.display = "none";
            nextButton.style.display = "block";
        }
    });

    cancelButton.addEventListener("click", function() {
        questionCards.forEach(card => {
            const answerInput = card.querySelector(".user-answer");
            answerInput.value = "";
            answerInput.style.borderColor = "";
            card.querySelector(".correct-answer").style.display = "none";
        });
        continueButton.style.display = "none";
    });
});
