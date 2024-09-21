document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.querySelector('.drop-section');
    const listSection = document.querySelector('.list-section');
    const listContainer = document.querySelector('.list');
    const fileSelector = document.querySelector('.file-selector');
    const fileSelectorInput = document.querySelector('.file-selector-input');

    fileSelector.onclick = () => fileSelectorInput.click();
    fileSelectorInput.onchange = () => {
        [...fileSelectorInput.files].forEach((file) => {
            if (typeValidation(file.type)) {
                uploadFile(file);
            }
        });
    };


    function typeValidation(type) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        return allowedTypes.includes(type);
    }

    dropArea.ondragover = (e) => {
        e.preventDefault();
        [...e.dataTransfer.items].forEach((item) => {
            if (typeValidation(item.type)) {
                dropArea.classList.add('drag-over-effect');
            }
        });
    };

    dropArea.ondragleave = () => {
        dropArea.classList.remove('drag-over-effect');
    };

    dropArea.ondrop = (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over-effect');
        if (e.dataTransfer.items) {
            [...e.dataTransfer.items].forEach((item) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (typeValidation(file.type)) {
                        uploadFile(file);
                    }
                }
            });
        } else {
            [...e.dataTransfer.files].forEach((file) => {
                if (typeValidation(file.type)) {
                    uploadFile(file);
                }
            });
        }
    };

    let totalFiles = 0;
    let completedFiles = 0;

    function uploadFile(file) {
        listSection.style.display = 'block';
        totalFiles += 1;
        let li = document.createElement('li');
        li.classList.add('file-item');
        li.innerHTML = `
          <div class="col1">
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxpZL4HuvFQ3q9IL1Uk4MeVcRO-ELItLwcZ9QW78oPLDDJEDX" alt="file icon" style="width: 50px; height: auto;">
        </div>

            <div class="col">
                <div class="file-name">
                    <div class="name">${file.name}</div>
                    </div>
                    <div class="file-progress">
                        <span></span>
                        </div>
                <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                  <div class="progress-container">
                     <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                        <span class="progress-text">0%</span>
                     </div>
                    </div>
                </div>
                <div class="col2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20">
                        <path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20">
                        <path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/>
                    </svg>
            </div>
        `;
        listContainer.prepend(li);

        let http = new XMLHttpRequest();
        let data = new FormData();
        data.append('file', file);

        http.onload = () => {
            completedFiles += 1;
            li.classList.add('complete');
            li.classList.remove('in-prog');
            updateProgressBar();
        };

        http.upload.onprogress = (e) => {
            let percent_complete = (e.loaded / e.total) * 100;
            li.querySelector('.file-name span').innerHTML = Math.round(percent_complete) + '%';
            li.querySelector('.file-progress span').style.width = percent_complete + '%';
        };

        http.open('POST', 'sender.php', true);
        http.send(data);

        li.querySelector('.cross').onclick = () => http.abort();
        http.onabort = () => {
            completedFiles -= 1;
            li.remove();
            updateProgressBar();
        };
    }

    function updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        let percent = (completedFiles / totalFiles) * 100;
        progressBar.style.width = percent + '%';
        progressText.innerHTML = Math.round(percent) + '%';
    }

    function iconSelector(type) {
        var splitType = (type.split('/')[0] === 'application') ? type.split('/')[1] : type.split('/')[0];
        return splitType + '.png';
    }
});
