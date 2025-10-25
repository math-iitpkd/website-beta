const pubSlider = document.querySelector('.research-publication-slider');
const pubList = pubSlider.querySelector('ul');

// Clone the list only if it won't scroll
function ensureScrollableList() {
  while (pubSlider.scrollHeight <= pubSlider.clientHeight && pubList.children.length > 0) {
    const clone = pubList.cloneNode(true);
    pubSlider.appendChild(clone);
  }
}

// Setup infinite scroll
let scrollAmount = 0;
function autoScrollPublications() {
  if (!pubSlider) return;
  scrollAmount += 1;
  pubSlider.scrollTop = scrollAmount;

  if (scrollAmount >= pubSlider.scrollHeight / 2) {
    scrollAmount = 0;
  }
}

// Initialize
ensureScrollableList();
let pubInterval = setInterval(autoScrollPublications, 50);

// Pause/resume on hover
pubSlider.addEventListener('mouseenter', () => clearInterval(pubInterval));
pubSlider.addEventListener('mouseleave', () => {
  pubInterval = setInterval(autoScrollPublications, 50);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    root: pubSlider,
    threshold: 0.1
  }
);

// Observe all list items
function observePublications() {
  const items = pubSlider.querySelectorAll('li');
  items.forEach(item => observer.observe(item));
}
