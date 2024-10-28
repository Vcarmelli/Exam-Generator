const target = document.querySelector("#end-of-thumbnails");
const container = document.querySelector(".thumbnail-container");
let isVisible = null;

const options = {
    root: container,
    rootMargin: "100px"
}

const callBack = async (entries) => {
    isVisible = entries[0].isIntersecting;
    console.log("isVisible:", isVisible);

    let page = 10
    const thumbnails = await fetchThumbnails(page);
    console.log("thumbnails:", thumbnails);

};

const observer = new IntersectionObserver(callBack, options);

observer.observe(target);

async function fetchThumbnails(startIndex) {
    // Fetch the next set of thumbnails
    const response = await fetch(`/selection/${startIndex}`);
    const data = await response.json();
    return data.thumbnails || [];
}








// document.addEventListener("DOMContentLoaded", function () {
//     const thumbnailContainer = document.getElementById("thumbnail-container");
//     const endOfThumbnails = document.getElementById("end-of-thumbnails");
//     let page = 1;
//     let loading = false;

//     async function fetchThumbnails(page) {
//         // Fetch the next set of thumbnails
//         const response = await fetch(`/load_thumbnails?page=${page}`);
//         const data = await response.json();
//         return data.thumbnails || [];
//     }

//     function appendThumbnails(thumbnails) {
//         // Append each new thumbnail to the container
//         thumbnails.forEach((thumbnail, index) => {
//             const thumbnailItem = document.createElement("div");
//             thumbnailItem.classList.add("thumbnail-item");

//             const img = document.createElement("img");
//             img.src = `../static/uploads/tmp/${thumbnail}`;
//             thumbnailItem.appendChild(img);

//             const pageNumber = document.createElement("p");
//             pageNumber.textContent = index + 1 + page * 10; // Adjust index based on current page
//             thumbnailItem.appendChild(pageNumber);

//             thumbnailContainer.insertBefore(thumbnailItem, endOfThumbnails);
//         });
//     }

//     function setupIntersectionObserver() {
//         const observer = new IntersectionObserver(async (entries) => {
//             if (entries[0].isIntersecting && !loading) {
//                 loading = true;
//                 page += 1;

//                 const thumbnails = await fetchThumbnails(page);

//                 if (thumbnails.length > 0) {
//                     appendThumbnails(thumbnails);
//                 } else {
//                     // Stop observing if no more thumbnails
//                     observer.unobserve(endOfThumbnails);
//                 }

//                 loading = false;
//             }
//         }, {
//             rootMargin: "100px",
//             threshold: 0.1
//         });

//         observer.observe(endOfThumbnails);
//     }

//     // Initialize the observer
//     setupIntersectionObserver();
// });