document.addEventListener("DOMContentLoaded", function () {

    const sections =
        document.querySelectorAll(".life-hero");

    if (!sections.length) return;

    if (typeof pdfjsLib === "undefined") {
        console.error("PDF.js is not loaded.");
        return;
    }


    /* PDF WORKER */

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


    sections.forEach(function (section) {

        const pdfUrl =
            section.dataset.pdfUrl;

        const container =
            section.querySelector(
                ".life-floating-images"
            );

        if (!pdfUrl || !container) {
            return;
        }


        let started = false;


        /* ==========================
           DESKTOP POSITIONS
        ========================== */

        const positions = [

            /* TOP */

            { x: 0,    y: -300 },
            { x: -140, y: -230 },
            { x: 160,  y: -230 },
            { x: -300, y: -180 },
            { x: 300,  y: -180 },


            /* UPPER MIDDLE */

            { x: -430, y: -90 },
            { x: -220, y: -100 },
            { x: 220,  y: -100 },
            { x: 430,  y: -90 },


            /* CENTER SIDES */

            { x: -520, y: 40 },
            { x: -350, y: 20 },
            { x: 350,  y: 20 },
            { x: 520,  y: 40 },


            /* LOWER MIDDLE */

            { x: -250, y: 150 },
            { x: -100, y: 170 },
            { x: 100,  y: 170 },
            { x: 250,  y: 150 },


            /* BOTTOM */

            { x: -500, y: 250 },
            { x: -300, y: 270 },
            { x: 0,    y: 260 },
            { x: 300,  y: 270 },
            { x: 500,  y: 250 }

        ];


        const sizes = [
            34,
            48,
            28,
            52,
            38,
            45,
            30,
            42,
            32,
            60,
            40,
            36,
            65,
            48,
            32,
            45,
            38,
            72,
            55,
            40,
            60,
            75
        ];


        async function extractPDFPages() {

            try {

                const pdf =
                    await pdfjsLib
                        .getDocument(pdfUrl)
                        .promise;


                /*
                   Increase this if PDF has
                   more image pages.
                */

                const maxPages =
                    Math.min(
                        pdf.numPages,
                        positions.length
                    );


                for (
                    let pageNum = 1;
                    pageNum <= maxPages;
                    pageNum++
                ) {

                    const page =
                        await pdf.getPage(pageNum);


                    /*
                       Render slightly larger than
                       final CSS display size for quality
                    */

                    const viewport =
                        page.getViewport({
                            scale: 0.3
                        });


                    const canvas =
                        document.createElement("canvas");


                    const context =
                        canvas.getContext("2d");


                    canvas.width =
                        viewport.width;

                    canvas.height =
                        viewport.height;


                    await page.render({

                        canvasContext: context,
                        viewport: viewport

                    }).promise;


                    const imageSrc =
                        canvas.toDataURL(
                            "image/webp",
                            0.82
                        );


                    createCard(
                        imageSrc,
                        pageNum - 1
                    );
                }

            }
            catch (error) {

                console.error(
                    "PDF loading error:",
                    error
                );
            }
        }


        function createCard(src, index) {

            const card =
                document.createElement("div");

            card.className =
                "life-float-item";


            card.style.width =
                sizes[
                    index % sizes.length
                ] + "px";


            const image =
                document.createElement("img");


            image.src = src;
            image.alt = "";


            card.appendChild(image);
            container.appendChild(card);


            animateCard(
                card,
                index
            );
        }


        function animateCard(card, index) {

            const position =
                positions[
                    index % positions.length
                ];


            /*
               Stagger each card,
               but avoid very long delays.
            */

            const delay =
                (index % 8) * 180;


            card.animate([

                {
                    transform:
                        "translate(-50%, -50%) scale(0)",

                    opacity: 0
                },


                {
                    transform:
                        `translate(
                            calc(-50% + ${position.x * 0.4}px),
                            calc(-50% + ${position.y * 0.4}px)
                        )
                        scale(0.4)`,

                    opacity: 0.7,

                    offset: 0.35
                },


                {
                    transform:
                        `translate(
                            calc(-50% + ${position.x}px),
                            calc(-50% + ${position.y}px)
                        )
                        scale(1)`,

                    opacity: 1
                }

            ], {

                duration: 2200,

                delay: delay,

                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",

                fill: "forwards"

            });
        }


        /* ==========================
           INTERSECTION OBSERVER
        ========================== */

        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting &&
                                !started
                            ) {

                                started = true;

                                extractPDFPages();

                                observer.unobserve(
                                    section
                                );
                            }

                        }
                    );

                },

                {
                    threshold: 0.2
                }

            );


        observer.observe(section);

    });

});