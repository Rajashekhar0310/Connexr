
// gsap.registerPlugin(ScrollTrigger);

// gsap.set(".video-wrapper", {
//     scale: 0.75
// });

// gsap.timeline({
//     scrollTrigger:{
//         trigger: ".tech-section",
//         start: "top top",
//         end: "+=1500",
//         scrub: true,
//         pin: true,
       
//     }
// })
// .to(".video-wrapper",{
//     scale:1,
//     width:"100vw",
//      height:"100vh",
//     y:45,
//     borderRadius:0,
//     ease:"none"
// });
// // gsap.timeline({
// //     scrollTrigger:{
// //         trigger: ".tech-section",
// //         start: "top+=100 top", // leave space for header
// //         end: "+=1500",
// //         scrub: true,
// //         pin: true,
// //         pinSpacing: true
// //     }
// // })
// // .to(".video-wrapper",{
// //     scale:1,
// //     width:"100vw",
// //     height:"100vh",
// //     borderRadius:0,
// //     ease:"none"
// // });

// const slides = document.querySelectorAll(".slide");
// const progressBars = document.querySelectorAll(".progress-fill");
// const progressSegments = document.querySelectorAll(".progress-segment");
// const bannerVideo = document.getElementById("bannerVideo");

// let current = 0;
// const duration = 5000;
// let interval;

// function showSlide(index){

//     slides.forEach(slide=>{
//         slide.classList.remove("active");
//     });

//     slides[index].classList.add("active");

//     const videoUrl =
//         slides[index].getAttribute("data-video");

//     if(videoUrl){
//         bannerVideo.src = videoUrl;
//         bannerVideo.load();
//         bannerVideo.play();
//     }

//     progressBars.forEach((bar,i)=>{

//         bar.style.transition = "none";

//         if(i < index){
//             bar.style.width = "100%";
//         }
//         else{
//             bar.style.width = "0%";
//         }

//     });

//     setTimeout(()=>{

//         progressBars[index].style.transition =
//             `width ${duration}ms linear`;

//         progressBars[index].style.width = "100%";

//     },50);

//     current = index;
// }

// function startSlider(){

//     clearInterval(interval);

//     interval = setInterval(()=>{

//         current++;

//         if(current >= slides.length){
//             current = 0;
//         }

//         showSlide(current);

//     },duration);
// }

// progressSegments.forEach(segment=>{

//     segment.addEventListener("click",()=>{

//         const index =
//             parseInt(segment.dataset.index);

//         showSlide(index);

//         startSlider();
//     });

// });

// showSlide(0);
// startSlider();




/**
 * GSAP Video Scroll Animation (Fixed)
 * 
 * Features:
 * - Video scales up as user scrolls
 * - Once fullscreen, video STAYS fullscreen (no scroll-back)
 * - On page refresh, video resets to small size
 * - Slider functionality continues to work
 */

gsap.registerPlugin(ScrollTrigger);

// Initial state: video starts small
gsap.set(".video-wrapper", {
    scale: 0.75,
    position: "relative",
    zIndex: 1
});

let videoAnimationComplete = false;
let scrollTriggerInstance = null;

// ── MAIN VIDEO SCROLL ANIMATION ──
scrollTriggerInstance = gsap.timeline({
    scrollTrigger: {
        trigger: ".tech-section",
        start: "top top",
        end: "+=1500",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
            // If animation is complete and user scrolls back, don't allow reverse
            if (videoAnimationComplete && self.getDirection() === -1) {
                // Lock scroll at this position
                self.progress = 1;
            }
        },
        onComplete: () => {
            videoAnimationComplete = true;
        }
    }
})
.to(".video-wrapper", {
    scale: 1,
    width: "100vw",
    height: "100vh",
    y: 45,
    borderRadius: 0,
    ease: "none"
}, 0)
.set(".video-wrapper", {
    // Once fullscreen, make it stay
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999
}, ">"); // Execute after animation completes

// ── VIDEO SLIDER FUNCTIONALITY ──
const slides = document.querySelectorAll(".slide");
const progressBars = document.querySelectorAll(".progress-fill");
const progressSegments = document.querySelectorAll(".progress-segment");
const bannerVideo = document.getElementById("bannerVideo");

let current = 0;
const duration = 5000;
let interval;

function showSlide(index) {
    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    // Add active class to current slide
    slides[index].classList.add("active");

    // Load and play video
    const videoUrl = slides[index].getAttribute("data-video");
    
    if (videoUrl) {
        bannerVideo.src = videoUrl;
        bannerVideo.load();
        bannerVideo.play();
    }

    // Update progress bars
    progressBars.forEach((bar, i) => {
        bar.style.transition = "none";

        if (i < index) {
            bar.style.width = "100%";
        } else {
            bar.style.width = "0%";
        }
    });

    // Animate progress bar for current slide
    setTimeout(() => {
        progressBars[index].style.transition = `width ${duration}ms linear`;
        progressBars[index].style.width = "100%";
    }, 50);

    current = index;
}

function startSlider() {
    clearInterval(interval);

    interval = setInterval(() => {
        current++;

        if (current >= slides.length) {
            current = 0;
        }

        showSlide(current);
    }, duration);
}

// ── CLICK HANDLERS FOR PROGRESS SEGMENTS ──
progressSegments.forEach(segment => {
    segment.addEventListener("click", () => {
        const index = parseInt(segment.dataset.index);
        showSlide(index);
        startSlider();
    });
});

// ── INITIALIZE ──
showSlide(0);
startSlider();

// ── ON PAGE REFRESH: RESET VIDEO STATE ──
window.addEventListener("load", () => {
    videoAnimationComplete = false;
    
    // Reset video wrapper to initial state
    gsap.set(".video-wrapper", {
        scale: 0.75,
        position: "relative",
        width: "auto",
        height: "auto",
        y: 0,
        borderRadius: "12px",
        zIndex: 1
    });
});

// ── OPTIONAL: LOCK SCROLL AFTER VIDEO FULLSCREEN ──
// Uncomment if you want to prevent scrolling once video is fullscreen

/*
let isVideoFullscreen = false;

window.addEventListener("wheel", (e) => {
    if (isVideoFullscreen) {
        e.preventDefault();
    }
}, { passive: false });

// Set flag when animation completes
gsap.timeline({
    scrollTrigger: {
        trigger: ".tech-section",
        start: "top top",
        end: "+=1500",
        scrub: true,
        onComplete: () => {
            isVideoFullscreen = true;
        }
    }
});
*/
