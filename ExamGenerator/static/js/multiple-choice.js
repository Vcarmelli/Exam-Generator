document.addEventListener("DOMContentLoaded", function () {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const cancelButton = document.getElementById("cancel-button");
    const nextButton = document.getElementById("next-button");
    const finishExamButton = document.getElementById("finish-exam-button");

    let currentQuestionIndex = 0;

    nextButton.style.display = "none";

    questionCards[currentQuestionIndex].style.display = "block";

    const enableSubmitButton = () => {
        const selectedOption = questionCards[currentQuestionIndex].querySelector("input[type='radio']:checked");
        if (selectedOption) {
            submitButton.disabled = false; // Enable the Submit button
        }
    };

    questionCards.forEach(card => {
        card.addEventListener("change", enableSubmitButton);
    });

    submitButton.addEventListener("click", function () {
        let allAnswered = true;
    
        const selectedOption = questionCards[currentQuestionIndex].querySelector("input[type='radio']:checked");
        if (selectedOption) {
            const correctAnswer = questionCards[currentQuestionIndex].querySelector(".correct-answer").textContent;
            const userAnswer = selectedOption.value;
    
            if (userAnswer === correctAnswer) {
                selectedOption.nextElementSibling.style.backgroundColor = "green"; // Highlight the label in green
                selectedOption.nextElementSibling.style.color = "white";
            } else {
                selectedOption.nextElementSibling.style.backgroundColor = "red"; // Highlight the label in red
                selectedOption.nextElementSibling.style.color = "white";
            }
    
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "inline";
        } else {
            allAnswered = false; // If no option is selected
        }
    
        if (!allAnswered) {
            alert("Please answer the question before submitting.");
        } else {
            nextButton.style.display = "block"; // Show the Next button after submitting
            submitButton.style.display = "none"; // Hide the Submit button
        }
    });

    nextButton.addEventListener("click", function () {
        questionCards[currentQuestionIndex].style.display = "none";

        currentQuestionIndex++;

        if (currentQuestionIndex < questionCards.length) {
            questionCards[currentQuestionIndex].style.display = "block";
            nextButton.style.display = "none";
            submitButton.style.display = "inline-block";
            submitButton.disabled = true;
        } else {
            nextButton.style.display = "none"; // Hide Next button
            finishExamButton.style.display = "inline-block"; // Show Finish Exam button
        }
    });

    finishExamButton.addEventListener("click", function () {
        // Handle the completion of the exam (e.g., submit, show result, etc.)
        alert("Congratulations! You've finished the exam!");
        // You can redirect or show a summary here.
    });

    cancelButton.addEventListener("click", function () {
        questionCards.forEach(card => {
            const selectedOption = card.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                selectedOption.checked = false; 
                selectedOption.parentNode.style.color = ""; 
            }
            card.querySelector(".correct-answer").style.display = "none"; 
        });

        questionCards.forEach(card => (card.style.display = "none"));
        currentQuestionIndex = 0;
        questionCards[currentQuestionIndex].style.display = "block";

        submitButton.style.display = "inline-block";
        submitButton.disabled = true;
        nextButton.style.display = "none";
    });
});
