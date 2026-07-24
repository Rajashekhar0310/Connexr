document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll("[data-pmv-section]");

    sections.forEach(function (section) {

        const backgroundLayer = section.querySelector(".pmv-bg-layer");

        const cards = Array.from(
            section.querySelectorAll("[data-pmv-card]")
        );

        function activateCard(clickedCard) {

            if (clickedCard.classList.contains("active")) {
                return;
            }

            const newBackground = clickedCard.dataset.background;

            // Close previous card
            cards.forEach(function (card) {
                card.classList.remove("active");
            });

            // Open clicked card immediately
            clickedCard.classList.add("active");

            // Change background immediately
            section.style.setProperty(
                "--pmv-bg",
                `url("${newBackground}")`
            );

            // Restart animation immediately
            backgroundLayer.style.transition = "none";
            backgroundLayer.style.opacity = "0";
            backgroundLayer.style.transform = "scale(1.04)";

            requestAnimationFrame(function () {

                requestAnimationFrame(function () {

                    backgroundLayer.style.transition =
                        "opacity 0.25s ease, transform 0.6s ease";

                    backgroundLayer.style.opacity = "1";
                    backgroundLayer.style.transform = "scale(1.01)";

                });

            });
        }

        cards.forEach(function (card) {

            card.addEventListener("click", function (event) {

                event.preventDefault();
                activateCard(card);

            });

        });

    });

});