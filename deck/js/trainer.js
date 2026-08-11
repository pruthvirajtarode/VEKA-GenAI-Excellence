// Trainer Mode Logic

let isTrainerMode = false;

document.addEventListener('DOMContentLoaded', () => {
    // Check URL parameters for trainer mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('trainer') === 'true') {
        toggleTrainerMode(true);
    }

    // Keyboard shortcut (Shift + T)
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && (e.key === 't' || e.key === 'T')) {
            e.preventDefault();
            toggleTrainerMode();
        }
    });

    // Listen for slide changes to update dashboard
    window.addEventListener('slideChanged', (e) => {
        if (isTrainerMode) {
            updateTrainerDashboard(e.detail.slide);
        }
    });
});

// Expose toggleTrainer globally for the close button onclick
window.toggleTrainer = toggleTrainerMode;

function toggleTrainerMode(forceState = null) {
    const overlay = document.getElementById('trainer-overlay');
    if (!overlay) return;

    if (forceState !== null) {
        isTrainerMode = forceState;
    } else {
        isTrainerMode = !isTrainerMode;
    }

    if (isTrainerMode) {
        overlay.classList.remove('trainer-hidden');
        overlay.classList.add('trainer-active');
        // Initial update for current slide
        const currentActive = document.querySelector('.slide.active');
        if (currentActive) updateTrainerDashboard(currentActive);
    } else {
        overlay.classList.remove('trainer-active');
        overlay.classList.add('trainer-hidden');
    }
}

function updateTrainerDashboard(slide) {
    const module = slide.dataset.module || 'Unknown Module';
    const obj   = slide.dataset.trainerObjective || '—';
    const say   = slide.dataset.trainerSay || '—';
    const watch = slide.dataset.trainerWatch || '';
    const rescue = slide.dataset.trainerRescue || '';
    const time  = slide.dataset.trainerTime || 'As needed';

    const tag = document.getElementById('trainer-module-tag');
    const tObj = document.getElementById('t-objective');
    const tSay = document.getElementById('t-say');
    const tTime = document.getElementById('t-time');
    const tRescue = document.getElementById('t-rescue');
    const tRescueRow = document.getElementById('t-rescue-row');

    if (tag) tag.textContent = module;
    if (tObj) tObj.textContent = obj;
    if (tSay) tSay.textContent = say;
    if (tTime) tTime.textContent = time;

    if (tRescueRow && tRescue) {
        if (watch || rescue) {
            tRescueRow.style.display = 'flex';
            let content = '';
            if (watch) content += `Watch For: ${watch}\n`;
            if (rescue) content += `Rescue: ${rescue}`;
            tRescue.textContent = content.trim();
        } else {
            tRescueRow.style.display = 'none';
        }
    }
}
