document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");

    submitButton.addEventListener("click", function() {
        let allAnswered = true;

        questionCards.forEach(card => {
            const answerInput = card.querySelector(".user-answer");
            if (answerInput.value.trim()) {
                const correctAnswer = card.querySelector(".correct-answer").textContent;
                const userAnswer = answerInput.value.trim().toLowerCase();

                if (userAnswer === correctAnswer.toLowerCase()) {
                    answerInput.style.borderColor = "green"; // Correct answer in green
                } else {
                    answerInput.style.borderColor = "red"; // Incorrect answer in red
                }

                card.querySelector(".correct-answer").style.display = "inline";
            } else {
                allAnswered = false; 
            }
        });

        if (!allAnswered) {
            alert("Please answer all questions before submitting.");
        }
    });

    cancelButton.addEventListener("click", function() {
        questionCards.forEach(card => {
            const answerInput = card.querySelector(".user-answer");
            answerInput.value = ""; // Clear the input field
            answerInput.style.borderColor = ""; // Reset border color to default
            card.querySelector(".correct-answer").style.display = "none"; // Hide correct answers
        });
    });
});
