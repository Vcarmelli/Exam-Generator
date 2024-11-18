document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");

    let currentQuestionIndex = 0;

    nextButton.style.display = "none";
    if (questionCards.length > 0) {
        questionCards[currentQuestionIndex].style.display = "block";
    }

    submitButton.addEventListener("click", function() {
        const answerInput = questionCards[currentQuestionIndex].querySelector(".user-answer");

        if (answerInput.value.trim()) {
            const correctAnswer = questionCards[currentQuestionIndex].querySelector(".correct-answer").textContent;
            const userAnswer = answerInput.value.trim().toLowerCase();

            if (userAnswer === correctAnswer.toLowerCase()) {
                answerInput.style.borderColor = "green";
            } else {
                answerInput.style.borderColor = "red";
            }

            const correctAnswerElement = questionCards[currentQuestionIndex].querySelector(".correct-answer");
            correctAnswerElement.style.display = "inline"; // Show the correct answer

            nextButton.style.display = "block";
        } else {
            alert("Please enter an answer before submitting.");
        }
    });

    nextButton.addEventListener("click", function() {
        questionCards[currentQuestionIndex].style.display = "none";
        currentQuestionIndex++;

        if (currentQuestionIndex < questionCards.length) {
            questionCards[currentQuestionIndex].style.display = "block";
            nextButton.style.display = "none";

            const answerInput = questionCards[currentQuestionIndex].querySelector(".user-answer");
            answerInput.value = "";
            answerInput.style.borderColor = "";
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "none"; // Hide the correct answer for the next question
        } else {
            alert("You have completed all the questions!");
            
        }
    });

    cancelButton.addEventListener("click", function() {
        questionCards.forEach(card => {
            const answerInput = card.querySelector(".user-answer");
            answerInput.value = "";
            answerInput.style.borderColor = "";
            card.querySelector(".correct-answer").style.display = "none";
        });
        nextButton.style.display = "none";
    });
});
