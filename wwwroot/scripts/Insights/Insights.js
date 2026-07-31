// document.addEventListener("DOMContentLoaded", () => {

//     const filters = document.querySelectorAll(".insights-filter");

//     const cards = document.querySelectorAll(
//         ".featured-blog-card, .insight-side-card, .insight-grid-card"
//     );

//     const noResults = document.querySelector(".insights-no-results");

//     filters.forEach(filter => {

//         filter.addEventListener("click", () => {

//             filters.forEach(f => f.classList.remove("active"));
//             filter.classList.add("active");

//             const selected = filter.dataset.filter;

//             let visible = 0;

//             cards.forEach(card => {

//                 const category = card.dataset.category;

//                 if (selected === "all" || selected === category) {

//                     card.style.display = "";
//                     visible++;

//                 } else {

//                     card.style.display = "none";

//                 }

//             });

//             if (noResults) {
//                 noResults.classList.toggle("show", visible === 0);
//             }

//         });

//     });

// });


document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    console.log(params.get("category"));

});

document.addEventListener("DOMContentLoaded", () => {

    const filters = document.querySelectorAll(".insights-filter");

    const cards = document.querySelectorAll(
        ".featured-blog-card, .insight-side-card, .insight-grid-card"
    );

    const noResults = document.querySelector(".insights-no-results");

    /*=====================================
        FILTER FUNCTION
    =====================================*/

    function filterCards(selected) {

        let visible = 0;

        filters.forEach(filter => {

            filter.classList.remove("active");

            if (filter.dataset.filter === selected) {

                filter.classList.add("active");

            }

        });

        cards.forEach(card => {

            const category = card.dataset.category;

            if (selected === "all" || selected === category) {

                card.style.display = "";
                visible++;

            }
            else {

                card.style.display = "none";

            }

        });

        if (noResults) {

            noResults.classList.toggle("show", visible === 0);

        }

    }

    /*=====================================
        BUTTON CLICK
    =====================================*/

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            filterCards(filter.dataset.filter);

        });

    });

    /*=====================================
        URL FILTER
    =====================================*/

    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");

    if (category) {

        filterCards(category);

    }
    else {

        filterCards("all");

    }

});
