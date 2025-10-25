const cards = document.querySelectorAll('.award-card');
const pauseBtn = document.getElementById('pause-play-btn');
let currentIndex = 0;
let autoSlideInterval;
let isPaused = false;

function updateCardClasses() {
    cards.forEach((card, i) => {
        card.classList.remove('active', 'left', 'right');
    });

    cards[currentIndex].classList.add('active');

    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    const nextIndex = (currentIndex + 1) % cards.length;

    cards[prevIndex].classList.add('left');
    cards[nextIndex].classList.add('right');
}

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCardClasses();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCardClasses();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextCard, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

document.querySelector('.next-btn').addEventListener('click', () => {
    nextCard();
    if (!isPaused) {
        stopAutoSlide();
        startAutoSlide();
    }
});

document.querySelector('.prev-btn').addEventListener('click', () => {
    prevCard();
    if (!isPaused) {
        stopAutoSlide();
        startAutoSlide();
    }
});

pauseBtn.addEventListener('click', () => {
    if (isPaused) {
        startAutoSlide();
        pauseBtn.textContent = '⏸';
    } else {
        stopAutoSlide();
        pauseBtn.textContent = '▶';
    }
    isPaused = !isPaused;
});

// Initialize
updateCardClasses();
startAutoSlide();
