document.addEventListener("DOMContentLoaded", () => {

    const slides = window.deliverSlides || [];
    if (!slides.length) return;

    const scrollSection = document.getElementById("caswdScrollSection");
    const imgCurrent = document.querySelector(".caswd-bg-image:not(.caswd-bg-next)");
    const imgNext    = document.querySelector(".caswd-bg-image.caswd-bg-next");
    const title       = document.querySelector(".caswd-text h2");
    const description = document.querySelector(".caswd-text p");
    const number      = document.querySelector(".caswd-number");
    const textWrap    = document.querySelector(".caswd-text");
    const prevBtn     = document.querySelector("button.caswd-prev");
    const nextBtn     = document.querySelector("button.caswd-next");
    const pagination  = document.getElementById("caswdPagination");

    if (!scrollSection || !imgCurrent || !imgNext) return;

    /* one viewport of scrolling per slide */
    scrollSection.style.height = (slides.length * 100) + "vh";

    /* preload -> never a white flash */
    slides.forEach(s => { if (s.image) { const i = new Image(); i.src = s.image; } });

    let baseIndex = -1;
    let textIndex = -1;
    let ticking = false;

    //----------------------------------------------------
    // Pagination
    //----------------------------------------------------
    if (pagination) {
        slides.forEach((slide, index) => {
            const page = document.createElement("span");
            page.className = "caswd-page";
            page.dataset.index = index;
            page.addEventListener("click", () => scrollToSlide(index));
            pagination.appendChild(page);
        });
    }

    //----------------------------------------------------
    // Highlight second line
    //----------------------------------------------------
    function formatTitle(text) {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= 2) return text;
        const half = Math.ceil(words.length / 2);
        return `${words.slice(0, half).join(" ")}<br><span>${words.slice(half).join(" ")}</span>`;
    }

    //----------------------------------------------------
    // Card content
    //----------------------------------------------------
    function setText(i) {
        if (i === textIndex) return;
        textIndex = i;

        const slide = slides[i];

        textWrap.classList.add("fade");

        setTimeout(() => {
            title.innerHTML = formatTitle(slide.title);
            description.textContent = slide.description;
            if (number) number.textContent = slide.number;
            textWrap.classList.remove("fade");
        },300);

        document.querySelectorAll(".caswd-page")
            .forEach((d, n) => d.classList.toggle("active", n === i));
    }

    //----------------------------------------------------
    // Bottom image layer
    //----------------------------------------------------
    function setBase(i) {
        if (i === baseIndex) return;
        baseIndex = i;
        imgCurrent.src = slides[i].image;
        imgCurrent.alt = slides[i].title || "";
    }

    //----------------------------------------------------
    // Scroll -> wipe
    //----------------------------------------------------
    function render() {
        const distance = scrollSection.offsetHeight - window.innerHeight;
        if (distance <= 0) return;

        let p = -scrollSection.getBoundingClientRect().top / distance;
        p = Math.max(0, Math.min(0.99999, p));

        const pos   = p * slides.length;
        const index = Math.min(slides.length - 1, Math.floor(pos));
        const frac  = pos - index;

        setBase(index);

        if (index < slides.length - 1) {

            /* ease so it feels smooth, not linear */
            const eased = frac < 0.5
                ? 2 * frac * frac
                : 1 - Math.pow(-2 * frac + 2, 2) / 2;

            const revealed = eased * 100;

            if (imgNext.getAttribute("src") !== slides[index + 1].image) {
                imgNext.src = slides[index + 1].image;
            }

            /* LEFT -> RIGHT: right inset shrinks 100% -> 0 */
            imgNext.style.clipPath = `inset(0 ${100 - revealed}% 0 0)`;

            /* card content swaps once the wipe passes halfway */
            setText(eased > 0.5 ? index + 1 : index);

        } else {
            imgNext.style.clipPath = "inset(0 100% 0 0)";
            setText(index);
        }
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => { render(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener("resize", render, { passive: true });

    //----------------------------------------------------
    // Buttons scroll to position
    //----------------------------------------------------
    function scrollToSlide(i) {
        const distance = scrollSection.offsetHeight - window.innerHeight;
        const top = scrollSection.offsetTop + distance * (i / slides.length) + 2;
        window.scrollTo({ top, behavior: "smooth" });
    }

    if (nextBtn) nextBtn.addEventListener("click", () => {
        if (textIndex < slides.length - 1) scrollToSlide(textIndex + 1);
    });

    if (prevBtn) prevBtn.addEventListener("click", () => {
        if (textIndex > 0) scrollToSlide(textIndex - 1);
    });

    //----------------------------------------------------
    // Initial
    //----------------------------------------------------
    setBase(0);
    setText(0);
    render();
});