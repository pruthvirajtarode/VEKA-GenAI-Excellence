// Deck Navigation and Scaling Logic

let currentSlide = 1;
let totalSlides = 0;

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    // Initial UI setup
    updateUI();
    scalePresentation();

    // Resize event listener for responsive scaling
    window.addEventListener('resize', scalePresentation);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    // Button navigation
    document.getElementById('btn-prev').addEventListener('click', prevSlide);
    document.getElementById('btn-next').addEventListener('click', nextSlide);
});

function scalePresentation() {
    const container = document.getElementById('presentation-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // The target aspect ratio and size
    const targetWidth = 1920;
    const targetHeight = 1080;
    
    const scaleX = windowWidth / targetWidth;
    const scaleY = windowHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY); // fit within window
    
    // Center it
    const left = (windowWidth - (targetWidth * scale)) / 2;
    const top = (windowHeight - (targetHeight * scale)) / 2;
    
    container.style.transform = `scale(${scale})`;
    container.style.position = 'absolute';
    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
}

function handleKeydown(e) {
    // Ignore input if user is typing in a textarea/input (none currently, but good practice)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(slideNum) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    const targetSlide = slides[slideNum - 1];
    if (targetSlide) {
        targetSlide.classList.add('active');
        currentSlide = slideNum;
        updateUI();
        
        // Trigger event for trainer mode to update
        window.dispatchEvent(new CustomEvent('slideChanged', { detail: { slide: targetSlide } }));
    }
}

function updateUI() {
    document.getElementById('slide-counter').textContent = `${currentSlide} / ${totalSlides}`;
    
    // Update button states
    document.getElementById('btn-prev').disabled = currentSlide === 1;
    document.getElementById('btn-prev').style.opacity = currentSlide === 1 ? '0.5' : '1';
    
    document.getElementById('btn-next').disabled = currentSlide === totalSlides;
    document.getElementById('btn-next').style.opacity = currentSlide === totalSlides ? '0.5' : '1';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Activity specific functions
function showFeedback(elementId, isCorrect, detail = '') {
    const el = document.getElementById(elementId);
    el.style.display = 'block';
    if (isCorrect) {
        el.innerHTML = `<span style="color: var(--success);">✔ CORRECT</span> <p style="font-size: 1.2rem; margin-top: 10px;">${detail}</p>`;
    } else {
        el.innerHTML = `<span style="color: var(--danger);">✘ INCORRECT</span>`;
    }
}
