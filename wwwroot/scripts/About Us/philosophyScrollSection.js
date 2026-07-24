document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       CHECK GSAP
    ========================================= */

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        console.error(
            "GSAP or ScrollTrigger is not loaded."
        );

        return;
    }


    gsap.registerPlugin(ScrollTrigger);


    /* =========================================
       GET ALL PHILOSOPHY SECTIONS
    ========================================= */

    const sections =
        document.querySelectorAll(
            ".philosophy-section"
        );


    sections.forEach(function (section) {


        /* =====================================
           WORDS
        ===================================== */

        const words =
            gsap.utils.toArray(
                section.querySelectorAll(
                    ".philosophy-heading .word"
                )
            );


        /* =====================================
           INLINE MEDIA
        ===================================== */

        const inlineImages =
            gsap.utils.toArray(
                section.querySelectorAll(
                    ".inline-image"
                )
            );


        /* =====================================
           WORD COLOR SCROLL
        ===================================== */

        ScrollTrigger.create({

            trigger: section,

            start: "top top",

            end: "bottom bottom",

            scrub: true,


            onUpdate: function (self) {

                const progress =
                    self.progress;


                const activeCount =
                    Math.floor(
                        progress * words.length
                    );


                words.forEach(
                    function (word, index) {

                        word.classList.toggle(
                            "active",
                            index <= activeCount
                        );

                    }
                );

            }

        });


        /* =====================================
           INLINE IMAGE / VIDEO REVEAL
        ===================================== */

        inlineImages.forEach(
            function (item, index) {

                gsap.to(item, {

                    opacity: 1,

                    y: 0,

                    scale: 1,

                    ease: "power2.out",


                    scrollTrigger: {

                        trigger: section,

                        start:
                            "top+=" +
                            (300 + index * 250) +
                            " center",

                        end:
                            "top+=" +
                            (500 + index * 250) +
                            " center",

                        scrub: 1

                    }

                });

            }
        );

    });


    /* =========================================
       REFRESH AFTER PAGE LOAD
    ========================================= */

    window.addEventListener(
        "load",
        function () {

            ScrollTrigger.refresh();

        }
    );

});