document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");

    // Submit button click event
    submitButton.addEventListener("click", function() {
        let allAnswered = true;

        // Loop through each question card
        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");

            if (selectedOption) {
                // Get the correct answer text
                const correctAnswer = card.querySelector(".correct-answer").textContent.split("is")[1].trim();
                const userAnswer = selectedOption.value;

                // Check if the user's answer is correct
                if (userAnswer === correctAnswer) {
                    selectedOption.parentNode.style.color = "green"; // Correct answer in green
                } else {
                    selectedOption.parentNode.style.color = "red"; // Incorrect answer in red
                }

                // Display the correct answer message
                const correctMessage = card.querySelector(".correct-answer");
                correctMessage.style.display = "inline"; // Show the correct answer message
            } else {
                allAnswered = false; // If no answer is selected, mark as incomplete
            }
        });

        // If some questions are unanswered, alert the user
        if (!allAnswered) {
            alert("Please answer all questions before submitting.");
        }
    });

    // Cancel button click event
    cancelButton.addEventListener("click", function() {
        // Reset answers and hide correct answers
        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                selectedOption.checked = false; // Uncheck the selected radio button
                selectedOption.parentNode.style.color = ""; // Reset color to default
            }
            card.querySelector(".correct-answer").style.display = "none"; // Hide correct answers
        });
    });
});
