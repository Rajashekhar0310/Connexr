// console.log("Principles JS Loaded");
// console.log(document.querySelectorAll(".tab-btn").length);
// document.addEventListener("DOMContentLoaded", () => {

//     const buttons = document.querySelectorAll(".tab-btn");

//     buttons.forEach(btn => {

//         btn.addEventListener("click", function () {

//             const tab = this.dataset.tab;

//             document
//                 .querySelectorAll(".tab-btn,.tab-content,.image-slide")
//                 .forEach(el => el.classList.remove("active"));

//             document
//                 .querySelector(`.tab-btn[data-tab="${tab}"]`)
//                 .classList.add("active");

//             document
//                 .querySelector(`.tab-content[data-tab="${tab}"]`)
//                 .classList.add("active");

//             document
//                 .querySelector(`.image-slide[data-tab="${tab}"]`)
//                 .classList.add("active");

//         });

//     });

// });

// document.addEventListener("DOMContentLoaded", function () {

//     const buttons = document.querySelectorAll(".tab-btn");
//     const contents = document.querySelectorAll(".tab-content");
//     const images = document.querySelectorAll(".image-slide");

//     if (!buttons.length) return;

//     let currentTab = 0;
//     let autoPlay;

//     function activateTab(index) {

//         buttons.forEach(btn => btn.classList.remove("active"));
//         contents.forEach(content => content.classList.remove("active"));
//         images.forEach(image => image.classList.remove("active"));

//         buttons[index].classList.add("active");
//         contents[index].classList.add("active");
//         images[index].classList.add("active");

//         currentTab = index;
//     }

//     buttons.forEach((button, index) => {

//         button.addEventListener("click", () => {

//             activateTab(index);

//             clearInterval(autoPlay);
//             startAutoPlay();
//         });

//     });

//     function startAutoPlay() {

//         autoPlay = setInterval(() => {

//             currentTab++;

//             if (currentTab >= buttons.length) {
//                 currentTab = 0;
//             }

//             activateTab(currentTab);

//         }, 5000); // Change tab every 5 sec
//     }

//     activateTab(0);
//     startAutoPlay();

// });
// document.addEventListener("DOMContentLoaded", function () {

//     const buttons = document.querySelectorAll(".tab-btn");
//     const contents = document.querySelectorAll(".tab-content");
//     const images = document.querySelectorAll(".image-slide");

//     // Find tallest tab content
//     let maxHeight = 0;

//     contents.forEach(content => {
//         content.style.display = "block";
//         maxHeight = Math.max(maxHeight, content.offsetHeight);
//         content.style.display = "";
//     });

//     contents.forEach(content => {
//         content.style.minHeight = maxHeight + "px";
//     });

//     let currentTab = 0;

//     function activateTab(index) {

//         buttons.forEach(btn => btn.classList.remove("active"));
//         contents.forEach(content => content.classList.remove("active"));
//         images.forEach(image => image.classList.remove("active"));

//         buttons[index].classList.add("active");
//         contents[index].classList.add("active");
//         images[index].classList.add("active");

//         currentTab = index;
//     }

//     buttons.forEach((button, index) => {
//         button.addEventListener("click", () => {
//             activateTab(index);
//         });
//     });

//     // Auto loop every 5 sec
//     setInterval(() => {
//         currentTab++;

//         if (currentTab >= buttons.length) {
//             currentTab = 0;
//         }

//         activateTab(currentTab);

//     }, 5000);

// });

document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");
    const images = document.querySelectorAll(".image-slide");

    if (!buttons.length) return;

    let currentTab = 0;
    let autoPlay;

    function activateTab(index) {

        buttons.forEach(btn => btn.classList.remove("active"));
        contents.forEach(content => content.classList.remove("active"));
        images.forEach(image => image.classList.remove("active"));

        buttons[index].classList.add("active");
        contents[index].classList.add("active");
        images[index].classList.add("active");

        currentTab = index;
    }

    buttons.forEach((button, index) => {

        button.addEventListener("click", function () {

            activateTab(index);

            clearInterval(autoPlay);
            startAutoPlay();
        });

    });

    function startAutoPlay() {

        autoPlay = setInterval(() => {

            currentTab++;

            if (currentTab >= buttons.length) {
                currentTab = 0;
            }

            activateTab(currentTab);

        }, 5000);

    }

    activateTab(0);
    startAutoPlay();

});