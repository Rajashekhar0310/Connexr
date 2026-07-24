document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".hh__card");

    if (!cards.length) return;

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
       Desktop Hover
    ----------------------------- */

    if (window.matchMedia("(hover:hover)").matches) {

        cards.forEach(function (card) {

            card.addEventListener("mouseenter", function () {

                activate(card);

            });

        });

    }

    /* -----------------------------
       Mobile Click
    ----------------------------- */

    cards.forEach(function (card) {

        card.addEventListener("click", function () {

            activate(card);

        });

    });

    /* -----------------------------
       Keyboard Support
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

            const nextButton = cards[next].querySelector(".hh__cardButton");

            if (nextButton) {
                nextButton.focus();
            }

        });

    });

    /* -----------------------------
       First Card Active
    ----------------------------- */

    activate(cards[0]);

});