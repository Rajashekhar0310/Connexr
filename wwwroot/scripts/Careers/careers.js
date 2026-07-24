document.addEventListener("DOMContentLoaded", function () {

    var list     = document.getElementById("jobList");
    var location = document.getElementById("jobLocation");
    var search   = document.getElementById("jobSearch");
    var empty    = document.getElementById("jobEmpty");

    if (!list) return;

    var jobs = Array.prototype.slice.call(list.querySelectorAll(".job"));

    /* ---------- accordion ---------- */

    function toggle(job, head) {

        var isOpen = job.classList.contains("active");

        jobs.forEach(function (other) {
            other.classList.remove("active");
            var h = other.querySelector(".job__head");
            if (h) h.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
            job.classList.add("active");
            head.setAttribute("aria-expanded", "true");
        }
    }

    jobs.forEach(function (job) {

        var head = job.querySelector(".job__head");
        if (!head) return;

        head.addEventListener("click", function (e) {
            if (e.target.closest(".job__btn")) return;
            toggle(job, head);
        });

        head.addEventListener("keydown", function (e) {
            if (e.target.closest(".job__btn")) return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(job, head);
            }
        });
    });

    /* ---------- filtering ---------- */

    function normalise(text) {
        return (text || "").toLowerCase().trim();
    }

    function applyFilters() {

        var loc = location ? location.value : "";
        var term = search ? normalise(search.value) : "";

        var visible = 0;

        jobs.forEach(function (job) {

            var jobLoc = job.getAttribute("data-location") || "";

            var matchesLoc = !loc || jobLoc === loc;

            var haystack = normalise(job.textContent);
            var matchesTerm = !term || haystack.indexOf(term) !== -1;

            var show = matchesLoc && matchesTerm;

            job.classList.toggle("is-hidden", !show);

            if (!show) {
                job.classList.remove("active");
                var h = job.querySelector(".job__head");
                if (h) h.setAttribute("aria-expanded", "false");
            }

            if (show) visible++;
        });

        if (empty) empty.classList.toggle("show", visible === 0);
    }

    if (location) location.addEventListener("change", applyFilters);

    if (search) {
        var timer;
        search.addEventListener("input", function () {
            clearTimeout(timer);
            timer = setTimeout(applyFilters, 180);
        });
    }

    applyFilters();
});