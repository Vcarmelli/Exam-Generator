const updateProgress = (percent) => {
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        progressBar.style.width = percent + '%';
        progressBar.textContent = Math.round(percent) + '%';
    }
};

const passData = (score, totalQuestion) => {
    const data = {
        'score': score, 
        'totalQuestion': totalQuestion
    }
    
    fetch( `${window.origin}/quiz-complete/responses`, {
        method: 'POST',
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: new Headers({
            'content-type': 'application/json'
        })
    })
    .then( response => {
        if (response.redirected) {
            window.location.href = response.url;  // Redirect to the quiz-complete page
        }
    })
    .catch( error => console.error("Error:", error));
}

const showLoader = function(event) {
    event.preventDefault();
    // Show the loader
    $('.loader-container').css('display', 'flex');

    const form = this;
    setTimeout(() => {
        form.submit(); 
    }, 3000);
}

const editAnswers = function() {
    const parent = $(this).closest('.edit-question'); 
    const answerSection = parent.find('.answers-section').first(); // Default answer section
    const modifySection = parent.find('.answers-section.modify'); // Editable answer section

    // Toggle visibility
    answerSection.toggle();
    modifySection.toggle();
}

const deleteQuestion = function() {
    const questionContainer = $(this).closest('.edit-question'); 

    // Toggle visibility
    questionContainer.toggle(); // Temporarily Hide Question 
}


$(document).ready(function() {
    $('#options-form').on('submit', showLoader);
    $('#upload-form').on('submit', showLoader);
    
    $('.answers-section.modify').css('display', 'none');
    $('.edit-btn').click(editAnswers);
    $('.delete-btn').click(deleteQuestion);
});


