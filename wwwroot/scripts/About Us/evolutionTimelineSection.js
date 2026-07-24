
document.addEventListener("DOMContentLoaded", function () {

    const evolutionSections =
        document.querySelectorAll("[data-evolution-section]");


    evolutionSections.forEach(function (section) {

        const yearButtons =
            section.querySelectorAll(".year-btn");

        const prevButton =
            section.querySelector(".timeline-prev");

        const nextButton =
            section.querySelector(".timeline-next");

        const image =
            section.querySelector(".evolution-image");

        const rightContent =
            section.querySelector(".evolution-right");

        const displayYear =
            section.querySelector(".display-year");

        const percentage =
            section.querySelector(".percentage");

        const description =
            section.querySelector(".stat-description");


        if (!yearButtons.length) {
            return;
        }


        let currentIndex = 0;


        yearButtons.forEach(function (button, index) {

            if (button.classList.contains("active")) {
                currentIndex = index;
            }

        });


        function updateTimeline(index) {

            if (index < 0) {
                index = yearButtons.length - 1;
            }

            if (index >= yearButtons.length) {
                index = 0;
            }


            currentIndex = index;

            const activeButton = yearButtons[index];

            const year =
                activeButton.dataset.year || "";

            const newPercentage =
                activeButton.dataset.percentage || "";

            const newDescription =
                activeButton.dataset.description || "";

            const newImage =
                activeButton.dataset.image || "";


            /* ACTIVE YEAR */

            yearButtons.forEach(function (button) {
                button.classList.remove("active");
            });

            activeButton.classList.add("active");


            /* START ANIMATION */

            if (image) {
                image.classList.add("is-changing");
            }

            if (rightContent) {
                rightContent.classList.add("is-changing");
            }


            setTimeout(function () {

                displayYear.textContent = year;
                percentage.textContent = newPercentage;
                description.textContent = newDescription;


                if (image && newImage) {

                    const tempImage = new Image();

                    tempImage.src = newImage;

                    tempImage.onload = function () {

                        image.src = newImage;

                        requestAnimationFrame(function () {
                            image.classList.remove("is-changing");
                        });

                    };

                } else if (image) {

                    image.classList.remove("is-changing");

                }


                if (rightContent) {

                    rightContent.classList.remove("is-changing");

                }

            }, 300);


            activeButton.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });

        }


        yearButtons.forEach(function (button, index) {

            button.addEventListener("click", function () {

                updateTimeline(index);

            });

        });


        if (prevButton) {

            prevButton.addEventListener("click", function () {

                updateTimeline(currentIndex - 1);

            });

        }


        if (nextButton) {

            nextButton.addEventListener("click", function () {

                updateTimeline(currentIndex + 1);

            });

        }

    });

});
