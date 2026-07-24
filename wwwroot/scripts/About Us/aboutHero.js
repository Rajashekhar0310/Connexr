document.addEventListener(
    "DOMContentLoaded",
    function () {


        const heroSections =
            document.querySelectorAll(
                "[data-about-hero]"
            );


        heroSections.forEach(
            function (hero) {


                /* ===============================
                   GET JSON DATA
                =============================== */


                const dataElement =
                    hero.querySelector(
                        ".about-hero-data"
                    );


                if (!dataElement) {
                    return;
                }


                let slides = [];


                try {

                    slides =
                        JSON.parse(
                            dataElement.textContent
                        );

                }
                catch (error) {

                    console.error(
                        "About Hero JSON error:",
                        error
                    );

                    return;
                }


                if (!slides.length) {
                    return;
                }



                /* ===============================
                   STATE
                =============================== */


                let activeIndex = 0;

                let isAnimating = false;



                /* ===============================
                   ELEMENTS
                =============================== */


                const currentBg =
                    hero.querySelector(
                        ".about-hero-bg-current"
                    );


                const nextBg =
                    hero.querySelector(
                        ".about-hero-bg-next"
                    );


                const activeName =
                    hero.querySelector(
                        ".about-active-name"
                    );


                const activeTitle =
                    hero.querySelector(
                        ".about-active-title"
                    );


                const activeDescription =
                    hero.querySelector(
                        ".about-active-description"
                    );


                const cardsContainer =
                    hero.querySelector(
                        ".about-hero-cards"
                    );


                const dotsContainer =
                    hero.querySelector(
                        ".about-slider-dots"
                    );



                /* ===============================
                   PRELOAD ALL IMAGES
                =============================== */


                slides.forEach(
                    function (slide) {


                        if (slide.background) {

                            const backgroundImage =
                                new Image();


                            backgroundImage.src =
                                slide.background;

                        }


                        if (slide.cardImage) {

                            const cardImage =
                                new Image();


                            cardImage.src =
                                slide.cardImage;

                        }

                    }
                );



                /* ===============================
                   INITIAL BACKGROUND
                =============================== */


                currentBg.style.backgroundImage =
                    `url("${slides[0].background}")`;



                /* ===============================
                   UPDATE CONTENT
                =============================== */


                function updateContent() {


                    const slide =
                        slides[activeIndex];


                    activeName.textContent =
                        slide.name;


                    activeTitle.textContent =
                        slide.title;


                    activeDescription.textContent =
                        slide.description;

                }



                /* ===============================
                   CREATE DOTS
                =============================== */


                function createDots() {


                    dotsContainer.innerHTML = "";


                    slides.forEach(
                        function (slide, index) {


                            const dot =
                                document.createElement(
                                    "button"
                                );


                            dot.type =
                                "button";


                            dot.className =
                                "about-slider-dot";


                            dot.setAttribute(
                                "aria-label",
                                "Open " + slide.name
                            );


                            if (
                                index === activeIndex
                            ) {

                                dot.classList.add(
                                    "active"
                                );

                            }


                            dot.addEventListener(
                                "click",
                                function () {


                                    changeSlide(
                                        index
                                    );

                                }
                            );


                            dotsContainer.appendChild(
                                dot
                            );

                        }
                    );

                }



                /* ===============================
                   UPDATE DOTS
                =============================== */


                function updateDots() {


                    const dots =
                        dotsContainer.querySelectorAll(
                            ".about-slider-dot"
                        );


                    dots.forEach(
                        function (dot, index) {


                            dot.classList.toggle(
                                "active",
                                index === activeIndex
                            );

                        }
                    );

                }



                /* ===============================
                   RENDER INACTIVE CARDS
                =============================== */


                function renderCards() {


                    cardsContainer.innerHTML = "";


                    slides.forEach(
                        function (slide, index) {


                            if (
                                index === activeIndex
                            ) {

                                return;

                            }


                            const card =
                                document.createElement(
                                    "button"
                                );


                            card.type =
                                "button";


                            card.className =
                                "about-hero-card";


                            card.setAttribute(
                                "aria-label",
                                "View " + slide.name
                            );


                            card.innerHTML = `

                                <img
                                    src="${slide.cardImage}"
                                    alt="${slide.name}"
                                >

                                <span
                                    class="about-card-line">
                                </span>

                                <span
                                    class="about-card-title">
                                    ${slide.name}
                                </span>

                            `;


                            card.addEventListener(
                                "click",
                                function () {


                                    changeSlide(
                                        index
                                    );

                                }
                            );


                            cardsContainer.appendChild(
                                card
                            );

                        }
                    );

                }



                /* ===============================
                   CHANGE SLIDE
                =============================== */


                function changeSlide(newIndex) {


                    if (
                        newIndex === activeIndex ||
                        isAnimating
                    ) {

                        return;

                    }


                    isAnimating = true;



                    /* ===========================
                       HIDE CURRENT CONTENT
                    =========================== */


                    activeName.classList.add(
                        "about-content-hidden"
                    );


                    activeTitle.classList.add(
                        "about-content-hidden"
                    );


                    activeDescription.classList.add(
                        "about-content-hidden"
                    );


                    cardsContainer.classList.add(
                        "about-cards-hidden"
                    );



                    /* ===========================
                       PREPARE NEXT IMAGE
                    =========================== */


                    nextBg.style.backgroundImage =
                        `url("${slides[newIndex].background}")`;



                    /*
                    Make sure mask is in its
                    closed position before reveal
                    */


                    nextBg.style.transition =
                        "none";


                    nextBg.classList.remove(
                        "is-visible"
                    );


                    nextBg.offsetHeight;



                    /*
                    Restore mask transition
                    */


                    nextBg.style.transition =
                        "";



                    /*
                    Force another repaint
                    */


                    nextBg.offsetHeight;



                    /* ===========================
                       START LEFT TO RIGHT REVEAL
                    =========================== */


                    nextBg.classList.add(
                        "is-visible"
                    );



                    /* ===========================
                       UPDATE TEXT + CARDS
                    =========================== */


                    setTimeout(
                        function () {


                            activeIndex =
                                newIndex;


                            updateContent();

                            renderCards();

                            updateDots();



                            activeName.classList.remove(
                                "about-content-hidden"
                            );


                            activeTitle.classList.remove(
                                "about-content-hidden"
                            );


                            activeDescription.classList.remove(
                                "about-content-hidden"
                            );


                            cardsContainer.classList.remove(
                                "about-cards-hidden"
                            );


                        },
                        400
                    );



                    /* ===========================
                       COMPLETE TRANSITION
                    =========================== */


                    setTimeout(
                        function () {


                            /*
                            Put revealed image into
                            permanent background
                            */


                            currentBg.style.backgroundImage =
                                `url("${slides[activeIndex].background}")`;



                            /*
                            IMPORTANT:

                            Disable transition before
                            resetting the mask.

                            This prevents reverse wipe.
                            */


                            nextBg.style.transition =
                                "none";


                            nextBg.classList.remove(
                                "is-visible"
                            );



                            /*
                            Force browser repaint
                            */


                            nextBg.offsetHeight;



                            /*
                            Restore CSS transition
                            for the next card click
                            */


                            nextBg.style.transition =
                                "";


                            isAnimating =
                                false;


                        },
                        1200
                    );

                }



                /* ===============================
                   INITIALIZE
                =============================== */


                updateContent();

                createDots();

                renderCards();


            }
        );


    }
);