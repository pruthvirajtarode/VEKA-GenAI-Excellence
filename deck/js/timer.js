// Timer Logic for OPL Copilot Training Deck

let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

function showTimer() {
  document.getElementById('timer-container').classList.remove('timer-hidden');
}

function hideTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 0;
  updateTimerDisplay();
  document.getElementById('timer-container').classList.add('timer-hidden');
}

function setTimer(minutes) {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = minutes * 60;
  const btn = document.getElementById('btn-play');
  if (btn) btn.textContent = '▶';
  updateTimerDisplay();
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    const btn = document.getElementById('btn-play');
    if (btn) btn.textContent = '▶';
  } else {
    if (timerSeconds <= 0) return;
    timerRunning = true;
    const btn = document.getElementById('btn-play');
    if (btn) btn.textContent = '⏸';
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        const btn = document.getElementById('btn-play');
        if (btn) btn.textContent = '▶';
        const display = document.getElementById('timer-display');
        if (display) {
          display.textContent = "TIME'S UP";
          display.classList.add('timer-urgent');
          setTimeout(() => {
            display.textContent = '00:00';
            display.classList.remove('timer-urgent');
          }, 5000);
        }
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  const btn = document.getElementById('btn-play');
  if (btn) btn.textContent = '▶';
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;
  const m = Math.floor(Math.abs(timerSeconds) / 60);
  const s = Math.abs(timerSeconds) % 60;
  display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  display.classList.remove('timer-urgent');
  if (timerSeconds > 0 && timerSeconds <= 60 && timerRunning) {
    display.classList.add('timer-urgent');
  }
}

// Expose globally
window.setTimer = setTimer;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.showTimer = showTimer;
window.hideTimer = hideTimer;
