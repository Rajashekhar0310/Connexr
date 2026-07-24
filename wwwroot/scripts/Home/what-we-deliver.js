document.addEventListener(
    "DOMContentLoaded",
    function () {

        const sections =
            document.querySelectorAll(
                ".deliver-section"
            );


        sections.forEach(function (section) {


            const cards =
                section.querySelectorAll(
                    ".deliver-card"
                );


            /*
            ==========================================
            ACTIVATE DESKTOP CARD
            ==========================================
            */

            function activateCard(selectedCard) {

                cards.forEach(function (card) {

                    card.classList.remove(
                        "active"
                    );

                });


                selectedCard.classList.add(
                    "active"
                );

            }


            /*
            ==========================================
            MOBILE NAVIGATION FUNCTION
            ==========================================
            */

            function navigateCard(card) {

                const url =
                    card.dataset.url;


                const target =
                    card.dataset.target ||
                    "_self";


                if (!url) {

                    console.warn(
                        "No navigation URL found"
                    );

                    return;
                }


                if (target === "_blank") {

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }
                else {

                    window.location.href =
                        url;

                }

            }


            /*
            ==========================================
            CARD EVENTS
            ==========================================
            */

            cards.forEach(function (card) {


                /*
                DESKTOP HOVER
                */

                card.addEventListener(
                    "mouseenter",
                    function () {

                        if (
                            window.innerWidth > 768
                        ) {

                            activateCard(card);

                        }

                    }
                );


                /*
                CARD CLICK
                */

                card.addEventListener(
                    "click",
                    function (event) {


                        /*
                        MOBILE
                        NAVIGATE DIRECTLY
                        */

                        if (
                            window.innerWidth <= 768
                        ) {

                            event.preventDefault();

                            navigateCard(card);

                            return;

                        }


                        /*
                        DESKTOP
                        ACTIVATE CARD
                        */

                        activateCard(card);

                    }
                );

            });


            /*
            ==========================================
            PLUS / MINUS BUTTONS
            ==========================================
            */

            const toggleButtons =
                section.querySelectorAll(
                    ".deliver-toggle"
                );


            toggleButtons.forEach(
                function (button) {


                    button.addEventListener(
                        "click",
                        function (event) {


                            event.preventDefault();

                            event.stopPropagation();


                            const currentCard =
                                button.closest(
                                    ".deliver-card"
                                );


                            if (!currentCard) {
                                return;
                            }


                            /*
                            MOBILE
                            */

                            if (
                                window.innerWidth <= 768
                            ) {

                                navigateCard(
                                    currentCard
                                );

                                return;

                            }


                            /*
                            DESKTOP
                            */

                            activateCard(
                                currentCard
                            );

                        }
                    );

                }
            );


            /*
            ==========================================
            CTA LINKS
            ==========================================
            */

            const links =
                section.querySelectorAll(
                    ".deliver-link"
                );


            links.forEach(function (link) {


                link.addEventListener(
                    "click",
                    function (event) {


                        /*
                        Stop card click event,
                        normal link navigation continues
                        */

                        event.stopPropagation();

                    }
                );

            });


        });

    }
);