document.addEventListener("DOMContentLoaded", function () {

    const latestThinkingSections =
        document.querySelectorAll("[data-latest-thinking]");


    latestThinkingSections.forEach(function (section) {

        const cards =
            section.querySelectorAll(".latest-thinking-card");

        const filterButtons =
            section.querySelectorAll(".latest-thinking-filter");

        const grid =
            section.querySelector(".latest-thinking-grid");

        const noResults =
            section.querySelector(".latest-thinking-no-results");


        if (!grid || cards.length === 0) {
            return;
        }



        /* ==================================================
           ACTIVATE CARD
        ================================================== */

        function activateCard(selectedCard) {

            cards.forEach(function (card) {

                card.classList.remove("active");

            });


            if (selectedCard) {

                selectedCard.classList.add("active");

            }

        }



        /* ==================================================
           CARD HOVER
        ================================================== */

        cards.forEach(function (card) {

            card.addEventListener(
                "mouseenter",
                function () {

                    if (
                        card.classList.contains(
                            "latest-thinking-hidden"
                        )
                    ) {
                        return;
                    }


                    activateCard(card);

                }
            );

        });



        /* ==================================================
           FILTER BUTTON CLICK
        ================================================== */

        filterButtons.forEach(function (filterButton) {

            filterButton.addEventListener(
                "click",
                function () {


                    const selectedFilter =
                        filterButton.dataset.filter;



                    /* ======================================
                       ACTIVE FILTER BUTTON
                    ====================================== */

                    filterButtons.forEach(function (button) {

                        button.classList.remove("active");

                    });


                    filterButton.classList.add("active");



                    /* ======================================
                       REMOVE ACTIVE CARD
                    ====================================== */

                    cards.forEach(function (card) {

                        card.classList.remove("active");

                    });



                    /* ======================================
                       ALL TAB
                    ====================================== */

                    if (selectedFilter === "all") {


                        grid.classList.remove(
                            "latest-thinking-filter-layout"
                        );


                        cards.forEach(function (card) {

                            card.classList.remove(
                                "latest-thinking-hidden"
                            );

                        });


                        if (noResults) {

                            noResults.classList.remove("show");

                        }


                        activateCard(cards[0]);


                        return;
                    }



                    /* ======================================
                       CATEGORY FILTER
                    ====================================== */

                    grid.classList.add(
                        "latest-thinking-filter-layout"
                    );


                    let firstVisibleCard = null;

                    let visibleCount = 0;



                    cards.forEach(function (card) {


                        const cardCategory =
                            card.dataset.category;


                        if (cardCategory === selectedFilter) {


                            card.classList.remove(
                                "latest-thinking-hidden"
                            );


                            visibleCount++;


                            if (!firstVisibleCard) {

                                firstVisibleCard = card;

                            }

                        }
                        else {


                            card.classList.add(
                                "latest-thinking-hidden"
                            );

                        }

                    });



                    /* ======================================
                       FIRST VISIBLE CARD ACTIVE
                    ====================================== */

                    if (firstVisibleCard) {

                        activateCard(firstVisibleCard);

                    }



                    /* ======================================
                       NO RESULTS
                    ====================================== */

                    if (noResults) {


                        if (visibleCount === 0) {

                            noResults.classList.add("show");

                        }
                        else {

                            noResults.classList.remove("show");

                        }

                    }

                }
            );

        });

    });

});