document.addEventListener("DOMContentLoaded", function() {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");
    const nextButton = document.getElementById("next-button");
    let currentQuestionIndex = 0;

    nextButton.style.display = "none";
    submitButton.disabled = true; // Initially disable Submit button

    // Display the first question
    questionCards[currentQuestionIndex].style.display = "block";

    questionCards.forEach(card => {
        card.addEventListener("change", function() {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                submitButton.disabled = false;  // Enable the Submit button when an option is selected
            } else {
                submitButton.disabled = true;   // Keep Submit disabled when no option is selected
            }
        });
    });

    submitButton.addEventListener("click", function() {
        const currentCard = questionCards[currentQuestionIndex];
        const selectedOption = currentCard.querySelector("input[type='radio']:checked");

        if (!selectedOption) {
            alert("Please answer the current question before submitting.");
            return;
        }

        const correctAnswer = currentCard.querySelector(".correct-answer").textContent.split("is")[1].trim();
        const userAnswer = selectedOption.value;

        if (userAnswer === correctAnswer) {
            selectedOption.parentNode.style.border = "2px solid green";
        } else {
            selectedOption.parentNode.style.border = "2px solid red";
        }

        const correctMessage = currentCard.querySelector(".correct-answer");
        correctMessage.style.display = "inline";

        nextButton.style.display = "block";
        submitButton.disabled = true;
    });

    nextButton.addEventListener("click", function() {
        questionCards[currentQuestionIndex].style.display = "none";
        currentQuestionIndex++;

        if (currentQuestionIndex < questionCards.length) {
            questionCards[currentQuestionIndex].style.display = "block";
            submitButton.disabled = true; // Disable Submit until answer is selected
            nextButton.style.display = "none"; // Hide Next until Submit is clicked
        } else {
            alert("You have completed all questions!");
        }
    });

    cancelButton.addEventListener("click", function() {
        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                selectedOption.checked = false;
                selectedOption.parentNode.style.color = "";
            }
            card.querySelector(".correct-answer").style.display = "none";
        });

        currentQuestionIndex = 0;
        questionCards.forEach(card => card.style.display = "none");
        questionCards[currentQuestionIndex].style.display = "block";

        submitButton.disabled = true;  // Disable the Submit button initially
        nextButton.style.display = "none"; // Hide Next button
    });
});
