document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {

            buttons.forEach(b => b.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            this.classList.add("active");

            const target = this.getAttribute("data-tab");
            document.getElementById(target)?.classList.add("active");
        });
    });

});