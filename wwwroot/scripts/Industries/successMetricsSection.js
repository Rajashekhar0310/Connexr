document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".sm-section");

    if (!section) return;

    const cards = section.querySelectorAll(".sm-card");
    const heading = section.querySelector(".sm-heading");

    /*=========================================
        Initial State
    =========================================*/

    if (heading) {
        heading.style.opacity = "0";
        heading.style.transform = "translateY(40px)";
    }

    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(60px)";
        card.style.transition =
            "opacity .7s ease, transform .7s ease";
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    /*=========================================
        Reveal on Scroll
    =========================================*/

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            if (heading) {
                heading.style.transition =
                    "opacity .8s ease, transform .8s ease";

                heading.style.opacity = "1";
                heading.style.transform = "translateY(0)";
            }

            cards.forEach(card => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            });

            observer.unobserve(section);

        });

    }, {
        threshold: 0.2
    });

    observer.observe(section);

    /*=========================================
        Mouse Parallax
    =========================================*/

    section.addEventListener("mousemove", function (e) {

        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;

        cards.forEach((card, index) => {

            const speed = (index + 1) * 0.4;

            card.style.transform =
                `translate(${x * speed}px, ${y * speed}px)`;

        });

    });

    section.addEventListener("mouseleave", function () {

        cards.forEach(card => {

            card.style.transform = "translate(0,0)";

        });

    });

});