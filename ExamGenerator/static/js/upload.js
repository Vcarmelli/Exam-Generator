document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.querySelector('.drop-section');
    const listSection = document.querySelector('.list-section');
    const listContainer = document.querySelector('.list');
    const fileSelector = document.querySelector('.file-selector');
    const fileSelectorInput = document.querySelector('.file-selector-input');
    const message = document.querySelector('.validation-message');
    const Upload = document.querySelector('#upload');

    fileSelector.onclick = () => fileSelectorInput.click();
    fileSelectorInput.onchange = () => handleFiles(fileSelectorInput.files);
    //Upload.onclick = () => submitFile();

    // Drag-and-drop events
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over-effect');
    });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over-effect'));
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over-effect');
        fileSelectorInput.files = e.dataTransfer.files;
        handleFiles(fileSelectorInput.files);
    });

    function handleFiles(files) {
        [...files].forEach((file) => {
            if (typeValidation(file.type)) {
                console.log("file in handle file:", file);
                uploadFile(file);
            } else {
                showMessage("Invalid file type.");
            }
        });
    }

    function typeValidation(type) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        return allowedTypes.includes(type);
    }

    function showMessage(text) {
        message.innerText = text;
        setTimeout(() => {
            message.innerText = "";
        }, 3000);
    }


    let totalFiles = 0;
    let completedFiles = 0;

    function uploadFile(file) {
        listSection.style.display = 'block';
        totalFiles += 1;
    

        //<input type="hidden" name="file_name" value="${file.name}">
        // Create list item for displaying the file
        let li = document.createElement('li');
        li.classList.add('file-item');
        li.innerHTML = `
            <div>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxpZL4HuvFQ3q9IL1Uk4MeVcRO-ELItLwcZ9QW78oPLDDJEDX" alt="file icon" style="width: 50px; height: auto;">
            </div>
            <div class="col">
                <div class="file-name">
                    
                    <span class="name">${file.name}</span>
                    <span class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <div class="file-progress">
                    <span></span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                    <span class="progress-text">0%</span>
                </div>
            </div>
        `;
        listContainer.prepend(li);
        Upload.innerText = "Submit";
    }

    function submitFile() {

        // const data = new FormData();
        // [...files].forEach((file) => {
        //     data.append('input_file', file);  // The key here should match the backend expectation
        // });
        // console.log("FormData content:", data.get('input_file')); 
    
        // Create FormData and append file
        const form = document.getElementById('upload-form');
        const data = new FormData(form);

        console.log("Preparing to send the following FormData:");
        for (let [key, value] of data.entries()) {
            console.log(`${key}: ${value.name || value}`); // Log each key-value pair
        }

        // Using fetch with progress tracking
        fetch('/upload/file', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert(result.error);
                li.remove();
            } else {
                completedFiles += 1;
                li.classList.add('complete');
                li.querySelector('.progress-text').innerHTML = '100%';
                li.querySelector('.progress-bar').style.width = '100%';
                updateProgressBar();
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            alert("Failed to upload the file.");
            li.remove();
        });

        // let http = new XMLHttpRequest();
        // let data = new FormData();
        // data.append('file', file);

        // http.onload = () => {
        //     completedFiles += 1;
        //     li.classList.add('complete');
        //     li.classList.remove('in-prog');
        //     updateProgressBar();
        // };

        // http.upload.onprogress = (e) => {
        //     let percent_complete = (e.loaded / e.total) * 100;
        //     li.querySelector('.file-name span').innerHTML = Math.round(percent_complete) + '%';
        //     li.querySelector('.file-progress span').style.width = percent_complete + '%';
        // };

        // http.open('POST', '/upload/file', true);
        // http.send();

        // li.querySelector('.cross').onclick = () => http.abort();
        // http.onabort = () => {
        //     completedFiles -= 1;
        //     li.remove();
        //     updateProgressBar();
        // };
    }
    
    function updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        let percent = (completedFiles / totalFiles) * 100;
        progressBar.style.width = percent + '%';
        progressText.innerHTML = Math.round(percent) + '%';
    }
    
});