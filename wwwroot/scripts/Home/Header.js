// document.addEventListener("DOMContentLoaded", () => {

//     const header = document.querySelector(".site-header");

//     if (!header) return;

//     let lastScrollTop = 0;

//     window.addEventListener("scroll", () => {

//         const currentScroll =
//             window.pageYOffset || document.documentElement.scrollTop;

//         // Always show at top
//         if (currentScroll <= 50) {
//             header.classList.remove("hidden");
//             header.classList.add("visible");
//             lastScrollTop = currentScroll;
//             return;
//         }

//         // Scrolling down → hide
//         if (currentScroll > lastScrollTop) {
//             header.classList.add("hidden");
//             header.classList.remove("visible");
//         }
//         // Scrolling up → show
//         else {
//             header.classList.remove("hidden");
//             header.classList.add("visible");
//         }

//         lastScrollTop = currentScroll;
//     });
// });
document.addEventListener("DOMContentLoaded", () => {

    const burger = document.getElementById("navBurger");
    const mobileNav = document.getElementById("mobileNav");
    const overlay = document.getElementById("mobileOverlay");
    const header = document.getElementById("siteHeader");

    /*=====================================
        MOBILE MENU
    =====================================*/

    function openMenu() {

        burger.classList.add("active");
        mobileNav.classList.add("active");
        overlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    function closeMenu() {

        burger.classList.remove("active");
        mobileNav.classList.remove("active");
        overlay.classList.remove("active");

        document.body.style.overflow = "";

    }

    burger.addEventListener("click", () => {

        if (mobileNav.classList.contains("active")) {

            closeMenu();

        } else {

            openMenu();

        }

    });

    overlay.addEventListener("click", closeMenu);

    /*=====================================
        MOBILE SUB MENU
    =====================================*/

    const toggles = document.querySelectorAll(".mobile-toggle");

    toggles.forEach(toggle => {

        toggle.addEventListener("click", function (e) {

            e.preventDefault();

            const submenu = this.parentElement.nextElementSibling;

            this.classList.toggle("active");

            if (submenu.classList.contains("active")) {

                submenu.classList.remove("active");

                submenu.style.maxHeight = null;

            }
            else {

                submenu.classList.add("active");

                submenu.style.maxHeight = submenu.scrollHeight + "px";

            }

        });

    });

    /*=====================================
        STICKY HEADER
    =====================================*/

    function stickyHeader() {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        }
        else {

            header.classList.remove("scrolled");

        }

    }

    stickyHeader();

    window.addEventListener("scroll", stickyHeader);

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

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            closeMenu();

        }

    });

    /*=====================================
        CLOSE AFTER CLICK
    =====================================*/

    document.querySelectorAll(".mobile-nav a").forEach(link => {

        link.addEventListener("click", function () {

            closeMenu();

        });

    });

});