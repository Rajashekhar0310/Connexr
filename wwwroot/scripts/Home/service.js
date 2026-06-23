gsap.registerPlugin(ScrollTrigger);

class ServicesScrollAnimation {

    constructor() {

        this.el = document.querySelector(
            '[data-component="services-cta"]'
        );

        this.services =
            document.querySelectorAll(".service");

        if (!this.el || !this.services.length) return;

        this.init();
    }

    init() {

        this.setupInitialState();

        ScrollTrigger.create({
            trigger: this.el,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,

            onUpdate: (self) => {
                this.updateServices(self.progress);
            }
        });
    }

    setupInitialState() {

        this.services.forEach((service, index) => {

            const media =
                service.querySelector(".media");

            const content =
                service.querySelector(".g-row");

            if (media) {

                media.style.clipPath =
                    index === 0
                        ? "inset(0% 0 0 0)"
                        : "inset(100% 0 0 0)";
            }

            if (content) {

                gsap.set(content, {
                    opacity: index === 0 ? 1 : 0,
                    y: index === 0 ? 0 : 40
                });
            }
        });
    }

    updateServices(progress) {

        const total =
            this.services.length;

        const segment =
            1 / total;

        this.services.forEach((service, index) => {

            const media =
                service.querySelector(".media");

            const content =
                service.querySelector(".g-row");

            const start =
                index * segment;

            let local =
                (progress - start) / segment;

            local = gsap.utils.clamp(
                0,
                1,
                local
            );

            // IMAGE REVEAL
            if (media) {

                if (index === 0) {

                    media.style.clipPath =
                        "inset(0% 0 0 0)";

                } else {

                    media.style.clipPath =
                        `inset(${100 - local * 100}% 0 0 0)`;
                }
            }

            // CONTENT
           // CONTENT
if (content) {

    let contentOpacity = 0;

    if (progress >= start && progress <= start + segment) {
        contentOpacity = 1;
    }

    gsap.set(content,{
        opacity: contentOpacity,
        y: contentOpacity ? 0 : 40
    });
}
        });

        // PROGRESS BAR
        const progressBar =
            document.querySelector(".progress");

        if (progressBar) {

     progressBar.style.width =
    `${progress * 100}%`;
        }

        // NUMBER
        const active =
            Math.min(
                total - 1,
                Math.floor(progress * total)
            );

        const label =
            document.querySelector(".main-label");

        if (label) {

            label.textContent =
                String(active + 1).padStart(
                    2,
                    "0"
                );
        }
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        new ServicesScrollAnimation();
    }
);