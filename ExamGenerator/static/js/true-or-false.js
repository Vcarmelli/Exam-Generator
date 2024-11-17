document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");
    const nextButton = document.getElementById("next-button");
    let currentQuestionIndex = 0;

    // Initially hide the Next button and Submit button
    nextButton.style.display = "none";
    submitButton.style.display = "none";

    // Show the first question
    questionCards[currentQuestionIndex].style.display = "block";

    // Show Submit button after an answer is selected
    questionCards.forEach(card => {
        card.addEventListener("change", function() {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                submitButton.style.display = "block";  // Show Submit button when an answer is selected
            } else {
                submitButton.style.display = "none"; // Hide Submit button if no answer is selected
            }
        });
    });

    // Submit button click event
    submitButton.addEventListener("click", function() {
        let allAnswered = true;

        // Loop through each question card to check if it's answered
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
        } else {
            nextButton.style.display = "block";  // Show the Next button after submitting
        }
    });

    // Next button click event to move to the next question
    nextButton.addEventListener("click", function() {
        // Hide the current question
        questionCards[currentQuestionIndex].style.display = "none";

        // Move to the next question
        currentQuestionIndex++;

        // If there are more questions, show the next one
        if (currentQuestionIndex < questionCards.length) {
            questionCards[currentQuestionIndex].style.display = "block";
            submitButton.style.display = "none"; // Hide Submit until an answer is selected for the next question
            nextButton.style.display = "none"; // Hide Next until Submit is clicked
        } else {
            // Optionally, display a message when all questions are completed
            alert("You have completed all questions!");
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

        // Reset question navigation
        currentQuestionIndex = 0;
        questionCards.forEach(card => card.style.display = "none"); // Hide all questions
        questionCards[currentQuestionIndex].style.display = "block"; // Show the first question

        submitButton.style.display = "none"; // Hide Submit button
        nextButton.style.display = "none"; // Hide Next button
    });
});
