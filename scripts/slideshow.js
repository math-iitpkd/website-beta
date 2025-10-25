 document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".wel-box-slide");
    const playPauseBtn = document.getElementById("playPause");
    let current = 0;
    let playing = true;
    let interval;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
      current = index;
    }

    function nextSlide() {
      const next = (current + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      const prev = (current - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    function startSlideshow() {
      interval = setInterval(nextSlide, 4000);
      playPauseBtn.textContent = "⏸";
      playing = true;
    }

    function stopSlideshow() {
      clearInterval(interval);
      playPauseBtn.textContent = "▶";
      playing = false;
    }

    playPauseBtn.addEventListener("click", () => {
      if (playing) stopSlideshow();
      else startSlideshow();
    });

    document.getElementById("prevSlide").addEventListener("click", () => {
      stopSlideshow();
      prevSlide();
    });

    document.getElementById("nextSlide").addEventListener("click", () => {
      stopSlideshow();
      nextSlide();
    });

    // Init
    showSlide(current);
    startSlideshow();
  });
