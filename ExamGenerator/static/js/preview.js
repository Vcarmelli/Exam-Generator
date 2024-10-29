const quesTypeBtn = document.querySelector("#ques-btn");
const target = document.querySelector("#end-of-thumbnails");
const container = document.querySelector(".thumbnail-container");
const pagesInput = document.querySelector("input[name='pages']");
let selectedPages = [];
let isVisible = null;
let page = 10; 

document.addEventListener('DOMContentLoaded', () => {
    addThumbnailListeners();
    quesTypeBtn.addEventListener("click", () => addQuestionType());
});

const addQuestionType = () => {
    const type = document.querySelector(".add-type");
    const quantity = document.querySelector(".add-quantity");
    // add input type and quantity

    const newSelect = document.createElement("select");
    newSelect.name = "ques-type";
    newSelect.classList.add("ques-type");
    newSelect.innerHTML = `
        <option value="identification">Identification</option>
        <option value="multiple_choice">Multiple Choice</option>
        <option value="true_or_false">True or False</option>
    `;
    type.appendChild(newSelect);


    const newInput = document.createElement("input");
    newInput.type = "number";
    newInput.name = "ques-num";
    newInput.classList.add("ques-num");
    newInput.placeholder = "1";
    quantity.appendChild(newInput);

    console.log("CLICKED TYPE QUES BTN")
}

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
const newThumbs = new MutationObserver(moreThumbnailListeners);
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
        console.log("thumbnails:", thumbnails);
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