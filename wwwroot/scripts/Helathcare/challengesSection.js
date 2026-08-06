document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll("[data-hh-hero]");

    if (!sections.length) return;


    sections.forEach(function (section) {

        const row = section.querySelector(".hh__cards");
        const cards = section.querySelectorAll(".hh__card");

        if (!cards.length || !row) return;


        /* -----------------------------
           ACTIVATE
        ----------------------------- */

        function activate(card) {

            cards.forEach(function (item) {

                item.classList.remove("is-active");

                const button = item.querySelector(".hh__cardButton");

                if (button) {
                    button.setAttribute("aria-expanded", "false");
                }
            });

            card.classList.add("is-active");

            const activeButton = card.querySelector(".hh__cardButton");

            if (activeButton) {
                activeButton.setAttribute("aria-expanded", "true");
            }
        }


        /* -----------------------------
           MEASURE THE TALLEST CARD

           Opens each card with transitions
           off, records its height, then
           reserves that much space on the
           row. The section height then
           stays fixed no matter which card
           is open.
        ----------------------------- */

        function measure() {

            /* stacked layout sizes itself, no reservation needed */
            if (window.innerWidth <= 991) {
                row.style.minHeight = "";
                return;
            }

            const previouslyActive =
                section.querySelector(".hh__card.is-active");

            row.classList.add("is-measuring");

            let tallest = 0;

            cards.forEach(function (card) {

    const wasActive = card.classList.contains("is-active");

    card.classList.add("is-active");

    const inner = card.querySelector(".hh__cardInner");
    const contentBox = card.querySelector(".hh__cardContent");

    let height = card.offsetHeight;

    if (inner && contentBox) {
        const styles = window.getComputedStyle(contentBox);
        const padding =
            parseFloat(styles.paddingTop) +
            parseFloat(styles.paddingBottom);

        const natural = inner.scrollHeight + padding;

        if (natural > height) {
            height = natural;
        }
    }

    if (height > tallest) {
        tallest = height;
    }

    if (!wasActive) {
        card.classList.remove("is-active");
    }
});

            row.classList.remove("is-measuring");

            if (previouslyActive) {
                activate(previouslyActive);
            }

            if (tallest) {
                tallest = tallest + 38;
    row.style.height = tallest + "px";
    row.style.minHeight = tallest + "px";
}
        }


        /* -----------------------------
           DESKTOP HOVER
        ----------------------------- */

        if (window.matchMedia("(hover:hover)").matches) {

            cards.forEach(function (card) {

                card.addEventListener("mouseenter", function () {
                    activate(card);
                });
            });
        }


        /* -----------------------------
           CLICK
        ----------------------------- */

        cards.forEach(function (card) {

            card.addEventListener("click", function () {
                activate(card);
            });
        });


        /* -----------------------------
           KEYBOARD
        ----------------------------- */

        cards.forEach(function (card, index) {

            const button = card.querySelector(".hh__cardButton");

            if (!button) return;

            button.addEventListener("keydown", function (e) {

                let next = index;

                switch (e.key) {

                    case "ArrowRight":
                    case "ArrowDown":
                        next = (index + 1) % cards.length;
                        break;

                    case "ArrowLeft":
                    case "ArrowUp":
                        next = (index - 1 + cards.length) % cards.length;
                        break;

                    case "Home":
                        next = 0;
                        break;

                    case "End":
                        next = cards.length - 1;
                        break;

                    default:
                        return;
                }

                e.preventDefault();

                activate(cards[next]);

                const nextButton =
                    cards[next].querySelector(".hh__cardButton");

                if (nextButton) {
                    nextButton.focus();
                }
            });
        });


        /* -----------------------------
           FIRST CARD ACTIVE
        ----------------------------- */

        activate(cards[0]);


        /* -----------------------------
           MEASURE AFTER FONTS AND
           IMAGES SETTLE, AND ON RESIZE
        ----------------------------- */

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(measure);
        } else {
            measure();
        }

        window.addEventListener("load", measure);


        let resizeTimer = null;

        window.addEventListener("resize", function () {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function () {
                row.style.height = "";
                row.style.minHeight = "";
                measure();
            }, 200);
        });

    });

});