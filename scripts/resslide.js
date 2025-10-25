const resSlides = document.querySelectorAll(".research-slide");
const resPrevBtn = document.getElementById("resPrevSlide");
const resNextBtn = document.getElementById("resNextSlide");
const resToggleBtn = document.getElementById("resToggleSlide");

let resCurrent = 0;
let resPlaying = true;
let resInterval = null;

function showResSlide(index) {
  resSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function nextResSlide() {
  resCurrent = (resCurrent + 1) % resSlides.length;
  showResSlide(resCurrent);
}

function prevResSlide() {
  resCurrent = (resCurrent - 1 + resSlides.length) % resSlides.length;
  showResSlide(resCurrent);
}

function toggleResPlay() {
  resPlaying = !resPlaying;
  if (resToggleBtn) resToggleBtn.textContent = resPlaying ? '⏸' : '▶';
  if (resPlaying) startResAutoSlide();
  else clearInterval(resInterval);
}

function startResAutoSlide() {
  clearInterval(resInterval);
  resInterval = setInterval(nextResSlide, 5000);
}

if (resPrevBtn) resPrevBtn.addEventListener("click", () => {
  prevResSlide();
  if (resPlaying) toggleResPlay();
});

if (resNextBtn) resNextBtn.addEventListener("click", () => {
  nextResSlide();
  if (resPlaying) toggleResPlay();
});

if (resToggleBtn) resToggleBtn.addEventListener("click", toggleResPlay);

showResSlide(resCurrent);
startResAutoSlide();
