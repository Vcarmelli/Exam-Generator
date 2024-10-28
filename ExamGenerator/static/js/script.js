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

const editAnswers = () => {
    $('.answers-section').css('display', 'none');
    $('#modify-answers').css('display', 'flex');
}

const addQuestionType = () => {
    // add input type and quantity
    console.log("CLICKED TYPE QUES BTN")
}


$(document).ready(function() {
    $('#edit-ans-btn').click(editAnswers);
    $('#ques-btn').click(addQuestionType);


    $('#options-form').on('submit', function(event) {
        event.preventDefault();
        // Show the loader
        $('.loader-container').css('display', 'flex');

        const form = this;
        setTimeout(() => {
            form.submit(); 
        }, 3000);
    });

    $('#upload-form').on('submit', function(event) {
        event.preventDefault();
        // Show the loader
        $('.loader-container').css('display', 'flex');

        const form = this;
        setTimeout(() => {
            form.submit(); 
        }, 3000);
    });
});


