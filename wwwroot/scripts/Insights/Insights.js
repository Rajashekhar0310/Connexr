document.addEventListener("DOMContentLoaded", () => {

    const filters = document.querySelectorAll(".insights-filter");

    const cards = document.querySelectorAll(
        ".featured-blog-card, .insight-side-card, .insight-grid-card"
    );

    const noResults = document.querySelector(".insights-no-results");

    filters.forEach(filter => {

        filter.addEventListener("click", () => {

            filters.forEach(f => f.classList.remove("active"));
            filter.classList.add("active");

            const selected = filter.dataset.filter;

            let visible = 0;

            cards.forEach(card => {

                const category = card.dataset.category;

                if (selected === "all" || selected === category) {

                    card.style.display = "";
                    visible++;

                } else {

                    card.style.display = "none";

                }

            });

            if (noResults) {
                noResults.classList.toggle("show", visible === 0);
            }

        });

    });

});