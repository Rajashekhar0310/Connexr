document.addEventListener("DOMContentLoaded", () => {

    const burger = document.getElementById("navBurger");
    const mobileNav = document.getElementById("mobileNav");
    const overlay = document.getElementById("mobileOverlay");
    const header = document.getElementById("siteHeader");

    /*=====================================
        MOBILE MENU
    =====================================*/

    function openMenu() {
        if (!burger || !mobileNav || !overlay) return;

        burger.classList.add("active");
        mobileNav.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        if (!burger || !mobileNav || !overlay) return;

        burger.classList.remove("active");
        mobileNav.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (burger && mobileNav) {
        burger.addEventListener("click", () => {
            if (mobileNav.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", closeMenu);
    }

    /*=====================================
        GLASS ON SCROLL

        Fully transparent at the very top,
        blurred glass bar once scrolling starts.
    =====================================*/

    function glassOnScroll() {
        if (!header) return;
        header.classList.toggle("glass", window.scrollY > 40);
    }

    glassOnScroll();
    window.addEventListener("scroll", glassOnScroll, { passive: true });

    /*=====================================
        ADAPT TO THE SECTION BEHIND

        The header is WHITE by default, which
        is correct over dark heroes. You only
        need to tag your LIGHT sections:

          <section data-header="dark">

        ...meaning "header text should be dark
        here". Dark sections need no tag.
    =====================================*/

    function watchSections() {
        if (!header) return;

        const sections = document.querySelectorAll("[data-header]");
        if (!sections.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    header.classList.toggle(
                        "on-light",
                        entry.target.dataset.header === "dark"
                    );
                }
            });
        }, {
            rootMargin: "-37px 0px -100% 0px",
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

    watchSections();

    /*=====================================
        MOBILE SUB MENU
    =====================================*/

    document.querySelectorAll(".mobile-toggle").forEach(toggle => {

        toggle.addEventListener("click", function (e) {
            e.preventDefault();

            const submenu = this.parentElement.nextElementSibling;
            if (!submenu) return;

            this.classList.toggle("active");

            if (submenu.classList.contains("active")) {
                submenu.classList.remove("active");
                submenu.style.maxHeight = null;
            } else {
                submenu.classList.add("active");
                submenu.style.maxHeight = submenu.scrollHeight + "px";
            }
        });

    });

    /*=====================================
        ACTIVE LINK
    =====================================*/

    const current = window.location.pathname;

    document.querySelectorAll(".main-nav a").forEach(link => {
        if (link.getAttribute("href") === current) {
            link.parentElement.classList.add("active");
        }
    });

    /*=====================================
        ESC KEY
    =====================================*/

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
    });

    /*=====================================
        CLOSE AFTER CLICK
    =====================================*/

    document.querySelectorAll(".mobile-nav a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

});