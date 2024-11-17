document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");

    let currentQuestionIndex = 0;

    // Initially hide the Next button
    nextButton.style.display = "none";

    // Show the first question card
    questionCards[currentQuestionIndex].style.display = "block";

    // Handle the Submit button click
    submitButton.addEventListener("click", function() {
        const answerInput = questionCards[currentQuestionIndex].querySelector(".user-answer");

        // Check if the answer is provided
        if (answerInput.value.trim()) {
            const correctAnswer = questionCards[currentQuestionIndex].querySelector(".correct-answer").textContent;
            const userAnswer = answerInput.value.trim().toLowerCase();

            // Change border color based on the answer correctness
            if (userAnswer === correctAnswer.toLowerCase()) {
                answerInput.style.borderColor = "green"; // Correct answer
            } else {
                answerInput.style.borderColor = "red"; // Incorrect answer
            }

            // Show the correct answer
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "inline";

            // Show the Next button after submitting the answer
            nextButton.style.display = "block";
        } else {
            alert("Please enter an answer before submitting.");
        }
    });

    // Handle the Next button click
    nextButton.addEventListener("click", function() {
        // Hide the current question
        questionCards[currentQuestionIndex].style.display = "none";

        // Move to the next question if available
        currentQuestionIndex++;

        if (currentQuestionIndex < questionCards.length) {
            // Show the next question
            questionCards[currentQuestionIndex].style.display = "block";

            // Hide the Next button until Submit is clicked again
            nextButton.style.display = "none";

            // Reset the input field and border color for the next question
            const answerInput = questionCards[currentQuestionIndex].querySelector(".user-answer");
            answerInput.value = "";
            answerInput.style.borderColor = "";

            // Hide the correct answer
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "none";
        } else {
            alert("You have completed all the questions!");
            // Optionally, you can redirect the user to a different page after all questions are completed.
        }
    });

    // Handle Cancel button click event to reset everything
    cancelButton.addEventListener("click", function() {
        questionCards.forEach(card => {
            const answerInput = card.querySelector(".user-answer");
            answerInput.value = ""; // Clear the input field
            answerInput.style.borderColor = ""; // Reset border color
            card.querySelector(".correct-answer").style.display = "none"; // Hide the correct answer
        });
        nextButton.style.display = "none"; // Hide the Next button
    });
});
