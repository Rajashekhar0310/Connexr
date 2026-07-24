document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".mj-section");

    if (!section) return;

    const nodes = Array.from(document.querySelectorAll(".mj-node"));

    const stepEl = document.getElementById("journeyStep");
    const titleEl = document.getElementById("journeyTitle");
    const descEl = document.getElementById("journeyDescription");

    const content = document.querySelector(".mj-content");
    const climber = document.querySelector(".mj-climber");
    const right = document.querySelector(".mj-right");

    if (!nodes.length) return;

    let activeIndex = 0;
    let autoplay;

    /*=========================================
        UPDATE CONTENT
    =========================================*/

    function updateContent(node) {

        content.classList.add("fade");

        setTimeout(function () {

            stepEl.textContent = node.dataset.step;
            titleEl.textContent = node.dataset.title;
            descEl.textContent = node.dataset.description;

            content.classList.remove("fade");

        }, 220);

    }

    /*=========================================
        MOVE CLIMBER
    =========================================*/

    function moveClimber(node) {

        const circle = node.querySelector(".circle");

        if (!circle || !climber) return;

        const parentRect = right.getBoundingClientRect();
        const circleRect = circle.getBoundingClientRect();

        const left =
            circleRect.left -
            parentRect.left +
            (circleRect.width / 2) -
            (climber.offsetWidth / 2);

        const top =
            circleRect.top -
            parentRect.top +
            (circleRect.height / 2) -
            (climber.offsetHeight / 2);

        climber.style.left = left + "px";
        climber.style.top = top + "px";

    }

    /*=========================================
        ACTIVE NODE
    =========================================*/

    function setActive(index) {

        activeIndex = index;

        nodes.forEach(function (node) {

            node.classList.remove("active");

        });

        const activeNode = nodes[index];

        activeNode.classList.add("active");

        updateContent(activeNode);

        moveClimber(activeNode);

    }

    /*=========================================
        CLICK EVENTS
    =========================================*/

    nodes.forEach(function (node, index) {

        node.addEventListener("click", function () {

            stopAutoplay();

            setActive(index);

            startAutoplay();

        });

    });

    /*=========================================
        AUTOPLAY
    =========================================*/

    function startAutoplay() {

        autoplay = setInterval(function () {

            activeIndex++;

            if (activeIndex >= nodes.length)
                activeIndex = 0;

            setActive(activeIndex);

        }, 3500);

    }

    function stopAutoplay() {

        clearInterval(autoplay);

    }

    /*=========================================
        HOVER PAUSE
    =========================================*/

    right.addEventListener("mouseenter", stopAutoplay);

    right.addEventListener("mouseleave", startAutoplay);

    /*=========================================
        KEYBOARD
    =========================================*/

    document.addEventListener("keydown", function (e) {

        if (e.key === "ArrowRight") {

            stopAutoplay();

            activeIndex++;

            if (activeIndex >= nodes.length)
                activeIndex = 0;

            setActive(activeIndex);

            startAutoplay();

        }

        if (e.key === "ArrowLeft") {

            stopAutoplay();

            activeIndex--;

            if (activeIndex < 0)
                activeIndex = nodes.length - 1;

            setActive(activeIndex);

            startAutoplay();

        }

    });

    /*=========================================
        REVEAL
    =========================================*/

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (!entry.isIntersecting)
                return;

            section.classList.add("mj-visible");

            observer.disconnect();

        });

    }, {

        threshold: 0.25

    });

    observer.observe(section);

    /*=========================================
        PARALLAX
    =========================================*/

    section.addEventListener("mousemove", function (e) {

        const x = (e.clientX / window.innerWidth - 0.5) * 18;
        const y = (e.clientY / window.innerHeight - 0.5) * 18;

        const mountain = document.querySelector(".mj-mountain");
        const route = document.querySelector(".mj-route");

        if (mountain) {

            mountain.style.transform =
                `translateX(calc(-50% + ${x * .20}px)) translateY(${y * .20}px)`;

        }

        if (route) {

            route.style.transform =
                `translateX(calc(-50% + ${x * .35}px)) translateY(${y * .35}px)`;

        }

    });

    section.addEventListener("mouseleave", function () {

        const mountain = document.querySelector(".mj-mountain");
        const route = document.querySelector(".mj-route");

        if (mountain)
            mountain.style.transform = "translateX(-50%)";

        if (route)
            route.style.transform = "translateX(-50%)";

    });

    /*=========================================
        INITIALIZE
    =========================================*/

    setActive(0);

    startAutoplay();

});