document.addEventListener("DOMContentLoaded", function () {

    const section = document.getElementById("businessImpact");

    if (!section) return;

    const box = document.getElementById("box3d");
    const progressFill = document.getElementById("progressFill");
    const cardCounter = document.getElementById("cardCounter");

    const sideButtons = [...document.querySelectorAll(".side-line")];

    const totalCards = sideButtons.length;

    if (totalCards === 0) return;

    let currentCard = 0;
    let isAnimating = false;

    let touchStartY = 0;
    let wheelAccumulator = 0;
    let wheelResetTimer = null;

    const animationDuration = 1000;

    /*==============================
        UPDATE UI
    ==============================*/

    function updateUI() {

        const width = ((currentCard + 1) / totalCards) * 100;

        progressFill.style.width = width + "%";

        sideButtons.forEach((button, index) => {

            button.classList.toggle("active", index === currentCard);

        });

        cardCounter.innerHTML =
            (currentCard + 1) +
            " / " +
            totalCards;

    }

    /*==============================
        ROTATE BOX
    ==============================*/

    function rotateBox() {

        const angle = currentCard * 90;

        box.style.transform =
            `translateY(-50%) rotateX(${angle}deg)`;

        updateUI();

    }

    /*==============================
        GO TO CARD
    ==============================*/

    function goToCard(index) {

        if (isAnimating) return;

        if (index < 0) return;

        if (index >= totalCards) return;

        if (index === currentCard) return;

        isAnimating = true;

        currentCard = index;

        rotateBox();

        setTimeout(function () {

            isAnimating = false;

        }, animationDuration);

    }

    /*==============================
        NEXT
    ==============================*/

    function nextCard() {

        if (currentCard >= totalCards - 1)
            return;

        goToCard(currentCard + 1);

    }

    /*==============================
        PREVIOUS
    ==============================*/

    function previousCard() {

        if (currentCard <= 0)
            return;

        goToCard(currentCard - 1);

    }

    /*==============================
        CLICK EVENTS
    ==============================*/

    sideButtons.forEach(button => {

        button.addEventListener("click", function () {

            const index =
                parseInt(button.dataset.index);

            goToCard(index);

        });

    });

    /*==============================
        WHEEL
    ==============================*/

    section.addEventListener("wheel", function (event) {

        const down = event.deltaY > 0;
        const up = event.deltaY < 0;

        if (down && currentCard < totalCards - 1)
            event.preventDefault();

        if (up && currentCard > 0)
            event.preventDefault();

        if (isAnimating)
            return;

        wheelAccumulator += event.deltaY;

        clearTimeout(wheelResetTimer);

        wheelResetTimer = setTimeout(function () {

            wheelAccumulator = 0;

        }, 160);

        const threshold = 35;

        if (wheelAccumulator > threshold) {

            wheelAccumulator = 0;

            nextCard();

        }

        else if (wheelAccumulator < -threshold) {

            wheelAccumulator = 0;

            previousCard();

        }

    }, {
        passive: false
    });

    /*==============================
        TOUCH START
    ==============================*/

    section.addEventListener("touchstart", function (event) {

        touchStartY =
            event.touches[0].clientY;

    }, {
        passive: true
    });

    /*==============================
        TOUCH END
    ==============================*/

    section.addEventListener("touchend", function (event) {

        const touchEndY =
            event.changedTouches[0].clientY;

        const distance =
            touchStartY - touchEndY;

        if (Math.abs(distance) < 50)
            return;

        if (distance > 0)
            nextCard();
        else
            previousCard();

    }, {
        passive: true
    });

    /*==============================
        KEYBOARD
    ==============================*/

    window.addEventListener("keydown", function (event) {

        switch (event.key) {

            case "ArrowDown":
            case "PageDown":

                nextCard();
                break;

            case "ArrowUp":
            case "PageUp":

                previousCard();
                break;

        }

    });

    /*==============================
        INITIALIZE
    ==============================*/

    updateUI();

});