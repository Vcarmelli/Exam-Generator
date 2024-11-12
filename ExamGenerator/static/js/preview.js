const optionsForm = document.getElementById("options-form");
const quesTypeBtn = document.querySelector("#ques-btn");
const target = document.querySelector("#end-of-thumbnails");
const container = document.querySelector(".thumbnail-container");
const pagesInput = document.querySelector("input[name='pages']");
let selectedPages = [];
let isVisible = null;
let page = 10; 
let questionCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    addThumbnailListeners();
    quesTypeBtn.addEventListener("click", addQuestionType);
    //optionsForm.addEventListener("submit", submitForm);
});

function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/selection', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Extracted text:', data.text);  // Log or handle the extracted text
        window.location.href = `/download?ques_type=${data.questions[0].type}`;
    })
    .catch(error => {
        console.error('Error:', error); 
    });
}

// async function fetchExtractedText() {
//     // Fetch the next set of thumbnails
//     const response = await fetch(`/selection`);
//     const data = await response.json();
//     return data.IDK || [];
// }

function addQuestionType() {
    const type = document.querySelector(".options-type");
    questionCount++;

    const newQuesType = document.createElement("div");
    newQuesType.classList.add("type-inputs");
    newQuesType.innerHTML = `
        <select name="ques-type">
            <option value="identification">Identification</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_or_false">True or False</option>
        </select>
        <input type="number" name="ques-num" placeholder="1">
        <button type="button" class="btn btn-secondary del-ques-btn" id="del-ques-btn-${questionCount}">
            <i class="fa-solid fa-minus"></i>
        </button>
    `;
    type.appendChild(newQuesType);

    const delQuesBtn = newQuesType.querySelector(`#del-ques-btn-${questionCount}`);
    delQuesBtn.addEventListener("click", () => {
        newQuesType.remove();
    });
};

// FUNCTION FOR SELECTING PAGES
function addThumbnailListeners() {
    const thumbnailItems = document.querySelectorAll(".thumbnail-item");
    
    thumbnailItems.forEach((item, index) => {
        const pageNumber = index + 1; // Page numbers start at 1
        item.addEventListener("click", () => togglePageSelection(pageNumber, item));
    });
}


// params for MutationObserver
const config = { childList: true };

const newThumbnailListeners = (mutationList, moreThumbs) => {
    for (const mutation of mutationList) {
        for (const addedNode of mutation.addedNodes) {
            const pageNumber = parseInt(addedNode.querySelector("p").textContent); 
            addedNode.addEventListener("click", () => togglePageSelection(pageNumber, addedNode));
        }
    }
};
// INITIALIZE OBSERVERS FOR THUMBNAIL LISTENERS
const newThumbs = new MutationObserver(newThumbnailListeners);
newThumbs.observe(container, config);


function togglePageSelection(pageNumber, item) {
    if (selectedPages.includes(pageNumber)) {
        selectedPages = selectedPages.filter(page => page !== pageNumber); // Remove if already selected
        item.classList.remove("selected"); 
    } else {
        selectedPages.push(pageNumber); // Add if not selected
        item.classList.add("selected"); 
    }
    pagesInput.value = formatPageNumbers(selectedPages);
}

function formatPageNumbers(pages) {
    const uniquePages = [...new Set(pages)].sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < uniquePages.length; i++) {
        const start = uniquePages[i];
        while (i < uniquePages.length - 1 && uniquePages[i + 1] === uniquePages[i] + 1) {
            i++;
        }
        const end = uniquePages[i];
        result.push(start === end ? `${start}` : `${start}-${end}`);
    }

    return result.join(", ");
}





// FUNCTIONS FOR LOADING THUMBNAIL
async function fetchThumbnails(startIndex) {
    // Fetch the next set of thumbnails
    const response = await fetch(`/selection/${startIndex}`);
    const data = await response.json();
    return data.thumbnails || [];
}

function appendThumbnails(thumbnails, page) {
    // Append each new thumbnail to the container
    thumbnails.forEach((thumbnail, index) => {
        const thumbnailItem = document.createElement("div");
        thumbnailItem.classList.add("thumbnail-item");

        const img = document.createElement("img");
        img.src = `../static/uploads/tmp/${thumbnail}`;
        thumbnailItem.appendChild(img);

        const pageNumber = document.createElement("p");
        pageNumber.textContent = page + (index + 1) ;
        thumbnailItem.appendChild(pageNumber);

        container.insertBefore(thumbnailItem, target);
    });
}


// params for IntersectionObserver
const options = {
    root: container,
    rootMargin: "100px"
}

const loadThumbnails = async (entries) => {
    isVisible = entries[0].isIntersecting;

    if (isVisible) {
        const thumbnails = await fetchThumbnails(page);
        if (thumbnails.length > 0) {
            appendThumbnails(thumbnails, page);
            page += 10;
        } else {
            // Stop observing if no more thumbnails and hide loader
            target.style.display = 'none';
            observer.unobserve(target);
        }
    }
};

// INITIALIZE END-OF-THUMBNAIL OBSERVER
const observer = new IntersectionObserver(loadThumbnails, options);
observer.observe(target);