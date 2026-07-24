document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".ecosystem-section")
        .forEach(function (section) {

            const items =
                section.querySelectorAll(".ecosystem-item");

            const mainImage =
                section.querySelector(".ecosystem-main-image");

            items.forEach(function (item) {

                const button =
                    item.querySelector(".ecosystem-item-header");

                if (!button) return;

                button.addEventListener("click", function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (item.classList.contains("active")) {
                        return;
                    }

                    items.forEach(function (otherItem) {

                        otherItem.classList.remove("active");

                        const icon =
                            otherItem.querySelector(".ecosystem-icon");

                        if (icon) {
                            icon.textContent = "+";
                        }

                    });

                    item.classList.add("active");

                    const activeIcon =
                        item.querySelector(".ecosystem-icon");

                    if (activeIcon) {
                        activeIcon.textContent = "−";
                    }

                    const newImage =
                        item.getAttribute("data-image");

                    if (mainImage && newImage) {

                        mainImage.classList.add("is-changing");

                        const preload = new Image();

                        preload.onload = function () {

                            mainImage.src = newImage;

                            mainImage.classList.remove("is-changing");
                        };

                        preload.onerror = function () {
                            mainImage.classList.remove("is-changing");
                        };

                        preload.src = newImage;
                    }
                });
            });
        });
});