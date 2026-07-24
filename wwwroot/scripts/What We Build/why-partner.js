document.addEventListener("DOMContentLoaded", function () {

    var sections = document.querySelectorAll(".wp-section");
    if (!sections.length) return;

    sections.forEach(function (section) {

        var items = section.querySelectorAll(".wp-item");

        items.forEach(function (item) {

            var head = item.querySelector(".wp-item__head");
            if (!head) return;

            head.addEventListener("click", function () {

                var isOpen = item.classList.contains("active");

                items.forEach(function (other) {
                    other.classList.remove("active");
                    var h = other.querySelector(".wp-item__head");
                    if (h) h.setAttribute("aria-expanded", "false");
                });

                if (!isOpen) {
                    item.classList.add("active");
                    head.setAttribute("aria-expanded", "true");
                }
            });
        });
    });
});