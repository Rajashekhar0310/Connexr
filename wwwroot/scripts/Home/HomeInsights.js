(function () {

    "use strict";

    const grid = document.getElementById("grid");
    const nav = document.getElementById("insights-nav");

    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".card"));

    let activeFilter = "all";
    let currentColumns = -1;

    const GAP = 22;

    /*=========================================
        Column Count
    =========================================*/

    function getColumns() {

        if (window.innerWidth <= 560)
            return 1;

        if (window.innerWidth <= 860)
            return 2;

        return 3;

    }

    /*=========================================
        Replay Animation
    =========================================*/

    function replayAnimation(card) {

        card.style.animation = "none";

        void card.offsetWidth;

        card.style.animation = "";

    }

    /*=========================================
        Masonry Layout
    =========================================*/

    function layoutCards() {

        const columns = getColumns();

        currentColumns = columns;

        grid.innerHTML = "";

        const columnElements = [];
        const heights = [];

        for (let i = 0; i < columns; i++) {

            const col = document.createElement("div");

            col.className = "grid__col";

            grid.appendChild(col);

            columnElements.push(col);

            heights.push(0);

        }

        const visibleCards = cards.filter(card => {

            return activeFilter === "all"
                || card.dataset.cat === activeFilter;

        });

        if (visibleCards.length === 0) {

            const empty = document.createElement("p");

            empty.className = "grid__empty";

            empty.textContent = "No insights available.";

            grid.appendChild(empty);

            return;

        }

        visibleCards.forEach((card, index) => {

            const shortestColumn = heights.indexOf(
                Math.min(...heights)
            );

            columnElements[shortestColumn].appendChild(card);

            heights[shortestColumn] +=
                card.offsetHeight + GAP;

            card.style.animationDelay =
                (index * 0.05) + "s";

            replayAnimation(card);

        });

    }

    /*=========================================
        Filter Navigation
    =========================================*/

    if (nav) {

        nav.addEventListener("click", function (e) {

            const btn = e.target.closest("button");

            if (!btn) return;

            nav.querySelectorAll("button").forEach(button => {

                button.classList.remove("is-active");

            });

            btn.classList.add("is-active");

            activeFilter = btn.dataset.filter || "all";

            layoutCards();

        });

    }

    /*=========================================
        Responsive Relayout
    =========================================*/

    let resizeTimer;

    window.addEventListener("resize", function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {

            if (currentColumns !== getColumns()) {

                layoutCards();

            }

        }, 150);

    });

    /*=========================================
        Initial Load
    =========================================*/

    layoutCards();

})();