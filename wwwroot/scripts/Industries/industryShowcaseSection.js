
console.log("Industry Showcase JS Loaded");document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".industryShowcase");

    if (!section) return;

    const items = section.querySelectorAll(".industryShowcase__item");

    if (!items.length) return;

    const mediaContainer = section.querySelector(".industryShowcase__media");

    const number = document.getElementById("industryNumber");
    const title = document.getElementById("industryTitle");

    const stat1 = document.getElementById("industryStat1");
    const stat2 = document.getElementById("industryStat2");

    const viewMore = document.getElementById("industryViewMore");

    let current = 0;
    let timer = null;

    //-------------------------------------------------------
    // Create Media
    //-------------------------------------------------------

    function createMedia(file, type) {

        const slide = document.createElement("div");
        slide.className = "industryShowcase__slide";

        if (type && type.toLowerCase() === "video") {

            const video = document.createElement("video");

            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;

            const source = document.createElement("source");
            source.src = file;
            source.type = "video/mp4";

            video.appendChild(source);

            slide.appendChild(video);

        }
        else {

            const image = document.createElement("img");

            image.src = file;
            image.alt = "";

            slide.appendChild(image);
        }

        return slide;
    }

    //-------------------------------------------------------
    // Change Industry
    //-------------------------------------------------------

    function changeIndustry(index) {

        current = index;

        items.forEach(x => x.classList.remove("active"));

        const item = items[index];

        item.classList.add("active");

        number.textContent = item.dataset.number;

        title.textContent = item.dataset.title;

        stat1.textContent = item.dataset.stat1;

        stat2.textContent = item.dataset.stat2;

        viewMore.href = item.dataset.link || "#";

        const media = item.dataset.media;

        const mediaType = item.dataset.mediatype;

        const oldSlide = mediaContainer.querySelector(".industryShowcase__slide");

        const newSlide = createMedia(media, mediaType);

        newSlide.style.opacity = "0";

        mediaContainer.insertBefore(
            newSlide,
            mediaContainer.querySelector(".industryShowcase__count")
        );

        requestAnimationFrame(() => {

            newSlide.classList.add("active");

            newSlide.style.opacity = "1";

        });

        if (oldSlide) {

            oldSlide.style.opacity = "0";

            oldSlide.classList.remove("active");

            setTimeout(() => {

                oldSlide.remove();

            }, 500);
        }
    }

    //-------------------------------------------------------
    // Click
    //-------------------------------------------------------

    items.forEach((item, index) => {

        item.addEventListener("click", function () {

            changeIndustry(index);

            restart();

        });

    });

    //-------------------------------------------------------
    // Auto Play
    //-------------------------------------------------------

    function nextIndustry() {

        current++;

        if (current >= items.length)
            current = 0;

        changeIndustry(current);
    }

    function previousIndustry() {

        current--;

        if (current < 0)
            current = items.length - 1;

        changeIndustry(current);
    }

    function start() {

        stop();

        timer = setInterval(function () {

            nextIndustry();

        }, 5000);

    }

    function stop() {

        if (timer) {

            clearInterval(timer);

            timer = null;
        }
    }

    function restart() {

        stop();

        start();
    }

    //-------------------------------------------------------
    // Pause on Hover
    //-------------------------------------------------------

    section.addEventListener("mouseenter", stop);

    section.addEventListener("mouseleave", start);

    //-------------------------------------------------------
    // Keyboard Support
    //-------------------------------------------------------

    document.addEventListener("keydown", function (e) {

        if (e.key === "ArrowDown") {

            nextIndustry();

            restart();

        }

        if (e.key === "ArrowUp") {

            previousIndustry();

            restart();

        }

    });

    //-------------------------------------------------------
    // Touch Swipe (Mobile)
    //-------------------------------------------------------

    let touchStartY = 0;

    section.addEventListener("touchstart", function (e) {

        touchStartY = e.changedTouches[0].clientY;

    });

    section.addEventListener("touchend", function (e) {

        const touchEndY = e.changedTouches[0].clientY;

        if (Math.abs(touchStartY - touchEndY) < 40)
            return;

        if (touchStartY > touchEndY) {

            nextIndustry();

        }
        else {

            previousIndustry();

        }

        restart();

    });

    //-------------------------------------------------------
    // Initial Load
    //-------------------------------------------------------

    changeIndustry(0);

    start();

});