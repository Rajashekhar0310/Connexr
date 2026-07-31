document.addEventListener("DOMContentLoaded", function () {

    const links = document.querySelectorAll(".blog-nav-item");
    const sections = document.querySelectorAll(".blog-content-section");

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            window.scrollTo({

                top: target.offsetTop - 120,

                behavior: "smooth"

            });

        });

    });

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                links.forEach(x=>x.classList.remove("active"));

                const active=document.querySelector(".blog-nav-item[href='#"+entry.target.id+"']");

                if(active){

                    active.classList.add("active");

                }

            }

        });

    },{

        threshold:.45

    });

    sections.forEach(section=>observer.observe(section));

});
document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".blog-content-section");

    const links = document.querySelectorAll(".toc-link");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                links.forEach(link=>{

                    link.classList.remove("active");

                    if(link.dataset.target === entry.target.id){

                        link.classList.add("active");

                    }

                });

            }

        });

    },{

        threshold:.35

    });

    sections.forEach(section=>observer.observe(section));

    links.forEach(link=>{

        link.addEventListener("click",e=>{

            e.preventDefault();

            document.getElementById(link.dataset.target).scrollIntoView({

                behavior:"smooth"

            });

        });

    });

});