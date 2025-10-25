window.addEventListener("scroll", function () {
    const stickyHeader = document.querySelector(".sticky-header");
  
    if (window.scrollY > 50) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  });