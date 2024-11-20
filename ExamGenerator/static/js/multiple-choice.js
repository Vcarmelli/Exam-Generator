document.addEventListener("DOMContentLoaded", function () {
    const questionCards = document.querySelectorAll(".question-card");
    const submitButton = document.getElementById("submit-button");
    const continueButton = document.getElementById("continue-button");
    const nextButton = document.getElementById("next-button");
    const cancelButton = document.getElementById("cancel-button");
    const finishExamButton = document.getElementById("finish-exam-button");

    let currentQuestionIndex = 0;
    let questionNo = document.querySelector("#questionNo");
    let choiceQue = questionCards[currentQuestionIndex].querySelectorAll("input[type='radio']");

    questionCards[currentQuestionIndex].style.display = "block";
    questionNo.innerText = (currentQuestionIndex + 1) + "/" + questionCards.length;

    const enableSubmitButton = () => {
        const selectedOption = questionCards[currentQuestionIndex].querySelector("input[type='radio']:checked");
        if (selectedOption) {
            submitButton.disabled = false; // Enable the Submit button
        }
    };

    questionCards.forEach(card => {
        card.addEventListener("change", enableSubmitButton);
    });

    // NOT YET WORKING FROM PREVIOUS VERSION JS 
    // choiceQue.forEach((choice, choiceNo) => {
    //     choice.addEventListener("click", () => {
    //         choiceQue.forEach(option => option.classList.remove("active"));
    //         Object.values(answerNo).forEach(answer => answer.classList.remove("active"));

    //         choice.classList.add("active");
    //         if (answerNo[choiceNo]) {
    //             answerNo[choiceNo].classList.add("active");
    //         }
    //         UserAns = choiceNo;

    //         choiceQue.forEach(option => option.classList.add("disabled"));
    //         Object.values(answerNo).forEach(answer => answer.classList.add("disabled"));
    //     });
    // });

    submitButton.addEventListener("click", function () {
        let allAnswered = true;
    
        const selectedOption = questionCards[currentQuestionIndex].querySelector("input[type='radio']:checked");
        if (selectedOption) {
            const correctAnswer = questionCards[currentQuestionIndex].querySelector(".correct-answer").textContent;
            const userAnswer = selectedOption.value;
            console.log("correctAnswer:", correctAnswer);
            console.log("userAnswer:", userAnswer);
    
            if (userAnswer === correctAnswer) {
                selectedOption.nextElementSibling.style.backgroundColor = "green"; // Highlight the label in green
                selectedOption.nextElementSibling.style.color = "white";
            } else {
                selectedOption.nextElementSibling.style.backgroundColor = "red"; // Highlight the label in red
                selectedOption.nextElementSibling.style.color = "white";
            }
    
            questionCards[currentQuestionIndex].querySelector(".correct-answer").style.display = "block";
            
            
            let progressPercentage = ((currentQuestionIndex + 1) / questionCards.length) * 100;
            updateProgress(progressPercentage);
        } else {
            allAnswered = false; // If no option is selected
        }
    
        if (!allAnswered) {
            alert("Please answer the question before submitting.");
        } else {
            if ((currentQuestionIndex + 1) == questionCards.length) {
                nextButton.style.display = "block";
            } else {
                continueButton.style.display = "block";
            }
            submitButton.style.display = "none"; // Hide the Submit button
            cancelButton.style.display = "none";
        }
    });

    continueButton.addEventListener("click", function () {
        questionCards[currentQuestionIndex].style.display = "none";

        currentQuestionIndex++;

        if (currentQuestionIndex < questionCards.length) {
            questionCards[currentQuestionIndex].style.display = "block";
            continueButton.style.display = "none";
            submitButton.style.display = "block";
            submitButton.disabled = true;
        } else {
            continueButton.style.display = "none";
            submitButton.style.display = "none";
            cancelButton.style.display = "none";
            nextButton.style.display = "block";
        }
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
        continueButton.style.display = "none";
    });
});
