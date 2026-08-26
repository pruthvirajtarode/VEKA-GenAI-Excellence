/**
 * VEKA GenAI Excellence - State Management
 * Handles localStorage persistence and application state
 */

const STORAGE_KEY = 'veka_genai_state';

// Default initial state
const defaultState = {
    user: {
        name: 'Participant',
        department: '',
    },
    progress: {
        overall: 0,
        module1: 0,
        module2: 0,
        module3: 0,
        module4: 0,
        completedExercises: []
    },
    badges: [],
    prompts: {
        favorites: [],
        savedPrompts: [],
        customTemplates: []
    },
    workflows: {
        savedWorkflows: [],
        capstone: null
    },
    productivityData: {
        entries: [],
        totalTimeSaved: 0
    },
    plan30Day: {
        habit: '',
        templateShare: '',
        teachPerson: '',
        successMetric: ''
    },
    trainer: {
        trainerMode: false,
        leaderboard: [],
        recentActivity: []
    },
    settings: {
        reducedMotion: false,
        theme: 'dark'
    }
};

class StateManager {
    constructor() {
        this.state = this.loadState();
        this.listeners = [];
    }

    loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                // Merge saved state with default state to handle schema changes gracefully
                const parsed = JSON.parse(saved);
                return this.deepMerge({}, defaultState, parsed);
            }
        } catch (e) {
            console.error('Error loading state from localStorage:', e);
        }
        return JSON.parse(JSON.stringify(defaultState));
    }

    saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            this.notifyListeners();
        } catch (e) {
            console.error('Error saving state to localStorage:', e);
        }
    }

    // Helper for deep merging state objects
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.deepMerge(target, ...sources);
    }

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    // Update specific parts of state
    update(path, value) {
        const keys = path.split('.');
        let current = this.state;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        
        // Recalculate overall progress if module progress changes
        if (path.startsWith('progress.module')) {
            this.recalculateOverallProgress();
        }
        
        this.saveState();
    }

    get(path) {
        const keys = path.split('.');
        let current = this.state;
        
        for (let i = 0; i < keys.length; i++) {
            if (current === undefined || current === null) return undefined;
            current = current[keys[i]];
        }
        return current;
    }

    toggleTheme() {
        if (!this.state.settings) this.state.settings = {};
        this.state.settings.theme = this.state.settings.theme === 'light' ? 'dark' : 'light';
        this.saveState();
        return this.state.settings.theme;
    }

    recalculateOverallProgress() {
        const { module1, module2, module3, module4 } = this.state.progress;
        this.state.progress.overall = Math.round((module1 + module2 + module3 + module4) / 4);
    }

    // specific helper methods
    markExerciseComplete(exerciseId) {
        if (!this.state.progress.completedExercises.includes(exerciseId)) {
            this.state.progress.completedExercises.push(exerciseId);
            this.saveState();
            return true;
        }
        return false;
    }
    
    isExerciseComplete(exerciseId) {
        return this.state.progress.completedExercises.includes(exerciseId);
    }

    awardBadge(badgeId, badgeName) {
        if (!this.state.badges.some(b => b.id === badgeId)) {
            this.state.badges.push({ id: badgeId, name: badgeName, date: new Date().toISOString() });
            this.saveState();
            
            // Show toast notification using global app function if available
            if (window.app && window.app.showToast) {
                window.app.showToast(`Badge Unlocked: ${badgeName} 🏅`, 'success');
            }
            return true;
        }
        return false;
    }

    toggleFavoritePrompt(promptId) {
        const index = this.state.prompts.favorites.indexOf(promptId);
        let added = false;
        if (index > -1) {
            this.state.prompts.favorites.splice(index, 1);
        } else {
            this.state.prompts.favorites.push(promptId);
            added = true;
        }
        this.saveState();
        return added;
    }

    toggleTrainerMode() {
        this.state.trainer.trainerMode = !this.state.trainer.trainerMode;
        this.saveState();
        return this.state.trainer.trainerMode;
    }

    resetProgress() {
        this.state = JSON.parse(JSON.stringify(defaultState));
        this.saveState();
    }

    exportData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "veka_training_progress.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Global instance
window.stateManager = new StateManager();
