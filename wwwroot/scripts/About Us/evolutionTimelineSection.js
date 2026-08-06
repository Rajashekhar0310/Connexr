document.addEventListener("DOMContentLoaded", function () {

    const evolutionSections =
        document.querySelectorAll("[data-evolution-section]");


    evolutionSections.forEach(function (section) {


        /* ===============================
           ELEMENTS
        =============================== */

        const yearButtons =
            section.querySelectorAll(".year-btn");

        const prevButton =
            section.querySelector(".timeline-prev");

        const nextButton =
            section.querySelector(".timeline-next");

        const image =
            section.querySelector(".evolution-image");

        const imageWrapper =
            section.querySelector(".evolution-image-wrapper");

        const rightContent =
            section.querySelector(".evolution-right");

        const displayYear =
            section.querySelector(".display-year");

        const percentage =
            section.querySelector(".percentage");

        /* NOTE: class is .stats-description, not .stat-description */
        const description =
            section.querySelector(".stats-description");


        if (!yearButtons.length) {
            return;
        }


        /* ===============================
           STATE
        =============================== */

        let currentIndex = 0;

        let isAnimating = false;

        let autoplayTimer = null;

        let countTimer = null;

        const AUTOPLAY_DELAY = 4000;

        const prefersReducedMotion =
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;


        yearButtons.forEach(function (button, index) {
            if (button.classList.contains("active")) {
                currentIndex = index;
            }
        });


        /* ===============================
           COUNT UP

           Handles "45%", "2.5x", "120+"
           by animating the number and
           keeping whatever wraps it.
        =============================== */

        function countUp(el, rawValue) {

            if (countTimer) {
                cancelAnimationFrame(countTimer);
                countTimer = null;
            }

            if (!el) return;

            const match = String(rawValue).match(/([^\d.-]*)([\d.]+)(.*)/);

            if (!match || prefersReducedMotion) {
                el.textContent = rawValue;
                return;
            }

            const prefix = match[1];
            const target = parseFloat(match[2]);
            const suffix = match[3];

            const decimals =
                (match[2].split(".")[1] || "").length;

            const duration = 900;
            const start = performance.now();

            function tick(now) {

                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);

                /* ease out cubic */
                const eased = 1 - Math.pow(1 - progress, 3);

                const value = (target * eased).toFixed(decimals);

                el.textContent = prefix + value + suffix;

                if (progress < 1) {
                    countTimer = requestAnimationFrame(tick);
                } else {
                    el.textContent = rawValue;
                    countTimer = null;
                }
            }

            countTimer = requestAnimationFrame(tick);
        }


        /* ===============================
           UPDATE TIMELINE
        =============================== */

        function updateTimeline(index, direction) {

            if (isAnimating) return;

            if (index < 0) {
                index = yearButtons.length - 1;
            }

            if (index >= yearButtons.length) {
                index = 0;
            }

            if (index === currentIndex) return;

            isAnimating = true;

            currentIndex = index;

            const activeButton = yearButtons[index];

            const year = activeButton.dataset.year || "";
            const newPercentage = activeButton.dataset.percentage || "";
            const newDescription = activeButton.dataset.description || "";
            const newImage = activeButton.dataset.image || "";


            /* ACTIVE YEAR */

            yearButtons.forEach(function (button) {
                button.classList.remove("active");
            });

            activeButton.classList.add("active");


            /* DIRECTION drives the slide of the image */

            if (imageWrapper) {
                imageWrapper.classList.remove("from-left", "from-right");
                imageWrapper.classList.add(
                    direction === -1 ? "from-left" : "from-right"
                );
            }


            /* START ANIMATION */

            if (image) {
                image.classList.add("is-changing");
            }

            if (rightContent) {
                rightContent.classList.add("is-changing");
            }


            setTimeout(function () {

                if (displayYear) displayYear.textContent = year;
                if (description) description.textContent = newDescription;

                countUp(percentage, newPercentage);


                if (image && newImage) {

                    const tempImage = new Image();

                    tempImage.src = newImage;

                    tempImage.onload = function () {

                        image.src = newImage;

                        requestAnimationFrame(function () {
                            image.classList.remove("is-changing");
                        });
                    };

                    tempImage.onerror = function () {
                        image.classList.remove("is-changing");
                    };

                } else if (image) {

                    image.classList.remove("is-changing");
                }


                if (rightContent) {
                    rightContent.classList.remove("is-changing");
                }


                setTimeout(function () {
                    isAnimating = false;
                }, 400);

            }, 300);


            activeButton.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                inline: "center",
                block: "nearest"
            });
        }


        /* ===============================
           AUTOPLAY
        =============================== */

        function startAutoplay() {

            if (prefersReducedMotion || yearButtons.length < 2) {
                return;
            }

            stopAutoplay();

            section.classList.add("is-playing");

            autoplayTimer = setInterval(function () {
                updateTimeline(currentIndex + 1, 1);
            }, AUTOPLAY_DELAY);
        }


        function stopAutoplay() {

            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }

            section.classList.remove("is-playing");
        }


        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }


        /* ===============================
           EVENTS
        =============================== */

        yearButtons.forEach(function (button, index) {

            button.addEventListener("click", function () {

                const direction = index > currentIndex ? 1 : -1;

                updateTimeline(index, direction);

                restartAutoplay();
            });
        });


        if (prevButton) {
            prevButton.addEventListener("click", function () {
                updateTimeline(currentIndex - 1, -1);
                restartAutoplay();
            });
        }


        if (nextButton) {
            nextButton.addEventListener("click", function () {
                updateTimeline(currentIndex + 1, 1);
                restartAutoplay();
            });
        }


        /* pause while the pointer is over the section */

        section.addEventListener("mouseenter", stopAutoplay);
        section.addEventListener("mouseleave", startAutoplay);


        /* pause when the tab is hidden */

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });


        /* ===============================
           ONLY PLAY WHEN IN VIEW
        =============================== */

        if ("IntersectionObserver" in window && !prefersReducedMotion) {

            /*
            Only now do we allow the CSS to hide
            the columns. If this script never runs,
            the section stays visible instead of
            going blank.
            */
            section.classList.add("reveal-ready");

            const observer = new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        section.classList.add("is-revealed");
                        startAutoplay();
                    } else {
                        stopAutoplay();
                    }
                });

            }, { threshold: 0.25 });

            observer.observe(section);

        } else {
            section.classList.add("is-revealed");
            startAutoplay();
        }

    });

});