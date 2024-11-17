document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");
    const nextButton = document.getElementById("next-button");

    // Hide the Next button initially
    nextButton.style.display = "none";

    let currentQuestionIndex = 0;

    // Show the first question
    questionCards[currentQuestionIndex].style.display = "block";

    // Display Submit Button after answering the first question
    const showSubmitButton = () => {
        const selectedOption = questionCards[currentQuestionIndex].querySelector("input[type='radio']:checked");
        if (selectedOption) {
            submitButton.style.display = "block";  // Show Submit button when an answer is selected
        }
    }

    // Handle click on the Submit button
    submitButton.addEventListener("click", function() {
        let allAnswered = true;

        // Check answers for the current question
        const selectedOption = questionCards[currentQuestionIndex].querySelector("input[type='radio']:checked");
        if (selectedOption) {
            const correctAnswer = questionCards[currentQuestionIndex].querySelector(".correct-answer").textContent;
            const userAnswer = selectedOption.value;

            if (userAnswer === correctAnswer) {
                selectedOption.parentNode.style.color = "green"; // Correct answer in green
            } else {
                selectedOption.parentNode.style.color = "red"; // Incorrect answer in red
            }

            // Display correct answer
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "inline";
        } else {
            allAnswered = false; // Check if all questions are answered
        }

        // If all questions aren't answered, show a message
        if (!allAnswered) {
            alert("Please answer the question before submitting.");
        } else {
            nextButton.style.display = "block";  // Show the Next button after submitting
        }
    });

    // Handle click on the Next button to show the next question
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
            // You can redirect the user or display a summary at this point.
        }
    });

    // Cancel button click event to reset
    cancelButton.addEventListener("click", function() {
        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                selectedOption.checked = false; // Uncheck the selected option
                selectedOption.parentNode.style.color = ""; // Reset color to default
            }
            card.querySelector(".correct-answer").style.display = "none"; // Hide correct answers
        });
        submitButton.style.display = "none"; // Hide Submit button again
        nextButton.style.display = "none"; // Hide Next button
    });

    // Monitor the selection of radio buttons to show the Submit button
    questionCards.forEach(card => {
        card.addEventListener("change", function() {
            showSubmitButton();
        });
    });
});
