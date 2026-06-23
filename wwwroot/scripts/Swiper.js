
document.addEventListener("DOMContentLoaded", function () {

    new Swiper(".aboutCardsSwiper", {
        slidesPerView: 2,
        spaceBetween: 20,

        navigation: {
            nextEl: ".custom-next",
            prevEl: ".custom-prev"
        },

        breakpoints: {
            0: {
                slidesPerView: 1
            },
            991: {
                slidesPerView: 2
            }
        }
    });

});
