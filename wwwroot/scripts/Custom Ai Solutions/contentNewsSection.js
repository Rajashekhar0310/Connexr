document.addEventListener("DOMContentLoaded", function () {

    const section = document.querySelector(".cns-section");

    if (!section) return;

    const tabButtons = section.querySelectorAll(".cns-tab-btn");
    const tabContents = section.querySelectorAll(".cns-tab-content");

    if (!tabButtons.length || !tabContents.length) return;

    tabButtons.forEach(button => {

        button.addEventListener("click", function () {

            const targetId = this.getAttribute("data-tab");

            // Remove active classes
            tabButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            tabContents.forEach(content => {
                content.classList.remove("active");
            });

            // Activate selected tab
            this.classList.add("active");

            const activeContent = section.querySelector("#" + targetId);

            if (activeContent) {
                activeContent.classList.add("active");
            }

        });

    });

});