document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector(".site-header");

    if (!header) return;

    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {

        const currentScroll =
            window.pageYOffset || document.documentElement.scrollTop;

        // Always show at top
        if (currentScroll <= 50) {
            header.classList.remove("hidden");
            header.classList.add("visible");
            lastScrollTop = currentScroll;
            return;
        }

        // Scrolling down → hide
        if (currentScroll > lastScrollTop) {
            header.classList.add("hidden");
            header.classList.remove("visible");
        }
        // Scrolling up → show
        else {
            header.classList.remove("hidden");
            header.classList.add("visible");
        }

        lastScrollTop = currentScroll;
    });
});