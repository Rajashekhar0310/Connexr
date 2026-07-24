// document.addEventListener("DOMContentLoaded", function () {

//     const processDataEl = document.getElementById("processData");

//     if (!processDataEl) return;

//     const data = JSON.parse(processDataEl.textContent);

//     if (!data || !data.length) return;

//     const section = document.getElementById("process");

//     const images = Array.from(document.querySelectorAll(".photo img"));

//     const stepNumbers = Array.from(document.querySelectorAll("#steps span"));

//     const title = document.getElementById("title");
//     const description = document.getElementById("desc");
//     const bigNumber = document.getElementById("bigNum");
//     const progressCircle = document.getElementById("progress");
//     const processIcon = document.getElementById("processIcon");

//     const prev = document.getElementById("prev");
//     const next = document.getElementById("next");

//     let activeStep = 0;

//     const progressStops = [0, 25, 50, 75, 100];

//     function updateProgress(index) {

//         if (progressCircle) {
//             progressCircle.style.strokeDashoffset = 100 - progressStops[index];
//         }

//     }

//     function setStep(index) {

//         index = Math.max(0, Math.min(data.length - 1, index));

//         if (index === activeStep) {
//             updateProgress(index);
//             return;
//         }

//         if (images[activeStep]) {
//             images[activeStep].classList.remove("active");
//         }

//         if (stepNumbers[activeStep]) {
//             stepNumbers[activeStep].classList.remove("active");
//         }

//         activeStep = index;

//         if (images[activeStep]) {
//             images[activeStep].classList.add("active");
//         }

//         if (stepNumbers[activeStep]) {
//             stepNumbers[activeStep].classList.add("active");
//         }

//         if (bigNumber) {
//             bigNumber.textContent = String(activeStep + 1).padStart(2, "0");
//         }

//         if (title) {
//             title.textContent = data[activeStep].title || "";
//         }

//         if (description) {
//             description.innerHTML = `
//                 <p>${data[activeStep].description1 || ""}</p>
//                 <p>${data[activeStep].description2 || ""}</p>
//             `;
//         }

//         if (processIcon && data[activeStep].icon) {
//             processIcon.src = data[activeStep].icon;
//         }

//         updateProgress(activeStep);

//     }

//     function handleScroll() {

//         if (window.innerWidth < 769) return;

//         const rect = section.getBoundingClientRect();

//         const scrollDistance =
//             section.offsetHeight - window.innerHeight;

//         const progress = Math.max(
//             0,
//             Math.min(
//                 1,
//                 -rect.top / scrollDistance
//             )
//         );

//         const step = Math.min(
//             data.length - 1,
//             Math.floor(progress * data.length)
//         );

//         setStep(step);

//     }

//     function scrollToStep(index) {

//         if (window.innerWidth < 769) return;

//         const sectionTop = section.offsetTop;

//         const scrollDistance =
//             section.offsetHeight - window.innerHeight;

//         const target =
//             sectionTop +
//             scrollDistance *
//             (index / (data.length - 1));

//         window.scrollTo({
//             top: target,
//             behavior: "smooth"
//         });

//     }

//     if (next) {
//         next.addEventListener("click", function () {

//             const index = Math.min(
//                 data.length - 1,
//                 activeStep + 1
//             );

//             setStep(index);

//             scrollToStep(index);

//         });
//     }

//     if (prev) {
//         prev.addEventListener("click", function () {

//             const index = Math.max(
//                 0,
//                 activeStep - 1
//             );

//             setStep(index);

//             scrollToStep(index);

//         });
//     }

//     window.addEventListener("scroll", handleScroll, {
//         passive: true
//     });

//     updateProgress(0);

// });
document.addEventListener("DOMContentLoaded", function () {

    const processDataEl = document.getElementById("processData");

    if (!processDataEl) return;

    const data = JSON.parse(processDataEl.textContent);

    if (!data || !data.length) return;

    const section = document.getElementById("process");

    const images = Array.from(document.querySelectorAll(".photo img"));

    const stepNumbers = Array.from(document.querySelectorAll("#steps span"));

    const title = document.getElementById("title");
    const description = document.getElementById("desc");
    const bigNumber = document.getElementById("bigNum");
    const connect = document.getElementById("connect");
    const dots = Array.from(document.querySelectorAll(".path .dot"));
    const processIcon = document.getElementById("processIcon");

    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    let activeStep = 0;

    const progressStops = [0, 23.94, 34.75, 75.56, 100];
    const dotStops = [100, 23.94, 34.75, 75.56, 85.5];

    function updateProgress(index) {

        if (connect) {
            connect.style.strokeDashoffset = 100 - progressStops[index];
        }

    }

    function setStep(index) {

        index = Math.max(0, Math.min(data.length - 1, index));

        if (index === activeStep) {
            updateProgress(index);
            return;
        }

        if (images[activeStep]) {
            images[activeStep].classList.remove("active");
        }

        if (stepNumbers[activeStep]) {
            stepNumbers[activeStep].classList.remove("active");
        }

        activeStep = index;

        if (images[activeStep]) {
            images[activeStep].classList.add("active");
        }

        if (stepNumbers[activeStep]) {
            stepNumbers[activeStep].classList.add("active");
        }

        dots.forEach(function (dot, i) {
            dot.classList.toggle("on", progressStops[activeStep] >= dotStops[i]);
        });

        if (bigNumber) {
            bigNumber.textContent = String(activeStep + 1).padStart(2, "0");
        }

        if (title) {
            title.textContent = data[activeStep].title || "";
        }

        if (description) {
            description.innerHTML = `
                <p>${data[activeStep].description1 || ""}</p>
                <p>${data[activeStep].description2 || ""}</p>
            `;
        }

        if (processIcon && data[activeStep].icon) {
            processIcon.src = data[activeStep].icon;
        }

        updateProgress(activeStep);

    }

    function handleScroll() {

        if (window.innerWidth < 769) return;

        const rect = section.getBoundingClientRect();

        const scrollDistance =
            section.offsetHeight - window.innerHeight;

        const progress = Math.max(
            0,
            Math.min(
                1,
                -rect.top / scrollDistance
            )
        );

        const step = Math.min(
            data.length - 1,
            Math.floor(progress * data.length)
        );

        setStep(step);

    }

    function scrollToStep(index) {

        if (window.innerWidth < 769) return;

        const sectionTop = section.offsetTop;

        const scrollDistance =
            section.offsetHeight - window.innerHeight;

        const target =
            sectionTop +
            scrollDistance *
            (index / (data.length - 1));

        window.scrollTo({
            top: target,
            behavior: "smooth"
        });

    }

    if (next) {
        next.addEventListener("click", function () {

            const index = Math.min(
                data.length - 1,
                activeStep + 1
            );

            setStep(index);

            scrollToStep(index);

        });
    }

    if (prev) {
        prev.addEventListener("click", function () {

            const index = Math.max(
                0,
                activeStep - 1
            );

            setStep(index);

            scrollToStep(index);

        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    updateProgress(0);

});