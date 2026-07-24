document.addEventListener("DOMContentLoaded", function () {

    const slider = document.getElementById("eaaiSlider");
    const prev = document.getElementById("eaaiPrev");
    const next = document.getElementById("eaaiNext");

    if (!slider) return;

    // Clone cards
    const originalCards = [...slider.children];

    originalCards.forEach(card => {
        slider.appendChild(card.cloneNode(true));
    });

    let current = 0;
    let paused = false;

    function getCardWidth() {
        const style = getComputedStyle(slider);
        const gap = parseFloat(style.columnGap || style.gap || 0);

        return slider.children[0].offsetWidth + gap;
    }

    let cardWidth = getCardWidth();

    function animate() {

        if (!paused) {

            current += 0.5;

            const totalWidth = cardWidth * originalCards.length;

            if (current >= totalWidth) {
                current -= totalWidth;
            }

            slider.style.transform =
                `translate3d(-${current}px,0,0)`;

        }

        requestAnimationFrame(animate);

    }

    animate();

    slider.addEventListener("mouseenter", () => paused = true);
    slider.addEventListener("mouseleave", () => paused = false);

    next.onclick = () => {

        paused = true;

        current += cardWidth;

        const totalWidth = cardWidth * originalCards.length;

        if (current >= totalWidth)
            current -= totalWidth;

        slider.style.transform =
            `translate3d(-${current}px,0,0)`;

        setTimeout(() => paused = false, 300);

    };

    prev.onclick = () => {

        paused = true;

        current -= cardWidth;

        const totalWidth = cardWidth * originalCards.length;

        if (current < 0)
            current += totalWidth;

        slider.style.transform =
            `translate3d(-${current}px,0,0)`;

        setTimeout(() => paused = false, 300);

    };

    window.addEventListener("resize", () => {
        cardWidth = getCardWidth();
    });

});