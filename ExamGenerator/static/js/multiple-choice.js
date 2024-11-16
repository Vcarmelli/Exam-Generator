document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");

    submitButton.addEventListener("click", function() {
        let allAnswered = true;

        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                const correctAnswer = card.querySelector(".correct-answer").textContent;
                const userAnswer = selectedOption.value;

                if (userAnswer === correctAnswer) {
                    selectedOption.parentNode.style.color = "green"; // Correct answer in green
                } else {
                    selectedOption.parentNode.style.color = "red"; // Incorrect answer in red
                }

                const correctMessage = card.querySelector(".correct-answer");
                card.querySelector(".correct-answer").style.display = "inline";
            } else {
                allAnswered = false; // Check if all questions are answered
            }
        });

        if (!allAnswered) {
            alert("Please answer all questions before submitting.");
        }
    });

    // Cancel button click event
    cancelButton.addEventListener("click", function() {
        // Clear all selected answers and hide correct answers
        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                selectedOption.checked = false; // Uncheck the selected option
                selectedOption.parentNode.style.color = ""; // Reset color to default
            }
            card.querySelector(".correct-answer").style.display = "none"; // Hide correct answers
        });
    });
});
