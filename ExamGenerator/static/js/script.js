function passData(score, totalQuestion) {
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

$(document).ready(function() {
    $('#options-form').on('submit', function(event) {
        event.preventDefault();
        // Show the loader
        $('.loader-container').css('display', 'flex');

        const form = this;
        setTimeout(() => {
            form.submit(); 
        }, 3000);
    });
});


