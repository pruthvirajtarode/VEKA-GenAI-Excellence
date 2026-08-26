/**
 * VEKA GenAI Excellence - Main Application
 */

class App {
    constructor() {
        this.init();
    }

    init() {
        // Initialize Sidebar
        this.initSidebar();
        
        // Subscribe to state changes to update UI
        window.stateManager.subscribe(this.updateUIFromState.bind(this));
        
        // Initial UI update
        this.updateUIFromState(window.stateManager.state);

        // Register Routes
        this.registerRoutes();

        // Keyboard shortcuts
        this.initKeyboardShortcuts();

        // Start Router
        window.router.init();
        
        // Remove loading overlay immediately
        this.hideLoadingOverlay();
    }
    
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        const appEl = document.getElementById('app');
        if (overlay && appEl) {
            overlay.style.opacity = '0';
            appEl.style.display = 'flex';
            setTimeout(() => {
                if (overlay.parentNode) overlay.remove();
            }, 500);
        }
    }

    initSidebar() {
        const toggleBtn = document.getElementById('toggle-sidebar');
        const mobileToggleBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        if (mobileToggleBtn && sidebar) {
            mobileToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    }

    updateUIFromState(state) {
        // Update Progress Bar in Sidebar
        const progressFill = document.getElementById('nav-progress-fill');
        const progressText = document.getElementById('nav-overall-progress');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${state.progress.overall}%`;
            progressText.textContent = `${state.progress.overall}%`;
        }

        // Toggle Trainer Elements
        const trainerElements = document.querySelectorAll('.trainer-only');
        const trainerBadge = document.getElementById('trainer-badge');
        
        if (state.trainer.trainerMode) {
            trainerElements.forEach(el => el.classList.remove('hidden'));
            if (trainerBadge) trainerBadge.classList.remove('hidden');
        } else {
            trainerElements.forEach(el => el.classList.add('hidden'));
            if (trainerBadge) trainerBadge.classList.add('hidden');
        }
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Shift + T for trainer mode toggle
            if (e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                const isTrainer = window.stateManager.toggleTrainerMode();
                this.showToast(`Trainer Mode ${isTrainer ? 'Enabled' : 'Disabled'}`, isTrainer ? 'warning' : 'info');
                
                // If disabled while on a trainer route, redirect
                if (!isTrainer && window.location.hash.includes('/trainer') || window.location.hash.includes('/timer') || window.location.hash.includes('/leaderboard')) {
                    window.location.hash = '/dashboard';
                }
            }
        });
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Add color stripe based on type
        if (type === 'success') toast.style.borderLeftColor = 'var(--success)';
        if (type === 'warning') toast.style.borderLeftColor = 'var(--warning)';
        if (type === 'error') toast.style.borderLeftColor = 'var(--danger)';

        toast.innerHTML = `<div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${message}</span>
        </div>`;

        container.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    bindCommonComponents() {
        // Re-bind interactions for standard UI components that might exist in the newly rendered view
    }

    registerRoutes() {
        const router = window.router;

        router.addRoute('/dashboard', this.views.renderDashboard.bind(this));
        router.addRoute('/progress', this.views.renderProgress.bind(this));
        router.addRoute('/module1', this.views.renderModule1.bind(this));
        router.addRoute('/module2', this.views.renderModule2.bind(this));
        router.addRoute('/module3', this.views.renderModule3.bind(this));
        router.addRoute('/module4', this.views.renderModule4.bind(this));
        
        router.addRoute('/prompt-library', this.views.renderPromptLibrary.bind(this));
        router.addRoute('/prompt-builder', this.views.renderPromptBuilder.bind(this));
        router.addRoute('/prompt-rescue', this.views.renderPromptRescue.bind(this));
        router.addRoute('/data-lab', this.views.renderDataLab.bind(this));
        router.addRoute('/synthetic-data', this.views.renderSyntheticData.bind(this));
        router.addRoute('/workflow-lab', this.views.renderWorkflowLab.bind(this));
        router.addRoute('/productivity', this.views.renderProductivity.bind(this));
        router.addRoute('/case-studies', this.views.renderCaseStudies.bind(this));
        router.addRoute('/resources', this.views.renderResources.bind(this));

        // Trainer routes
        router.addRoute('/trainer', this.views.renderTrainer.bind(this));
        router.addRoute('/timer', this.views.renderTimer.bind(this));
        router.addRoute('/leaderboard', this.views.renderLeaderboard.bind(this));
        router.addRoute('/demo', this.views.renderDemo.bind(this));
    }

    // --- VIEWS ---

    views = {
        renderDashboard: (container) => {
            const state = window.stateManager.state;
            
            container.innerHTML = `
                <div class="card mb-6" style="background: linear-gradient(135deg, rgba(228,0,43,0.1) 0%, rgba(31,31,31,0.8) 100%); position: relative; overflow: hidden;">
                    <div style="position: absolute; right: -50px; top: -50px; opacity: 0.05; font-size: 20rem; pointer-events: none;">V</div>
                    <div style="position: relative; z-index: 1;">
                        <h1 style="font-size: 2.5rem; letter-spacing: -0.02em;">VEKA GenAI Excellence</h1>
                        <p class="text-secondary mb-6" style="font-size: 1.1rem; letter-spacing: 0.1em; text-transform: uppercase;">Learn AI. Apply AI. Build better workflows.</p>
                        
                        <div class="flex items-center gap-4 mb-4" style="max-width: 400px;">
                            <div class="progress-bar-bg" style="flex-grow: 1; height: 10px;">
                                <div class="progress-bar-fill" style="width: ${state.progress.overall}%;"></div>
                            </div>
                            <span style="font-weight: 700; font-size: 1.2rem;">${state.progress.overall}%</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-4">Workshop Sessions</h3>
                        <div class="flex flex-col gap-2">
                            <a href="#/module1" class="btn btn-secondary justify-between w-full">
                                <span>1. Prompting & Communication</span>
                                <span class="text-muted">${state.progress.module1}%</span>
                            </a>
                            <a href="#/module2" class="btn btn-secondary justify-between w-full">
                                <span>2. AI for Finance & Ops</span>
                                <span class="text-muted">${state.progress.module2}%</span>
                            </a>
                            <a href="#/module3" class="btn btn-secondary justify-between w-full">
                                <span>3. Sales, HR & Safe AI</span>
                                <span class="text-muted">${state.progress.module3}%</span>
                            </a>
                            <a href="#/module4" class="btn btn-secondary justify-between w-full">
                                <span>4. From Prompt to Asset (Capstone)</span>
                                <span class="text-muted">${state.progress.module4}%</span>
                            </a>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="mb-4">My Assets</h3>
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-center p-3 border rounded">
                                <span class="text-muted">Saved Prompts</span>
                                <span class="text-accent" style="font-weight: 700;">${state.prompts.savedPrompts.length}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 border rounded">
                                <span class="text-muted">Templates Built</span>
                                <span class="text-accent" style="font-weight: 700;">${state.prompts.customTemplates.length}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 border rounded">
                                <span class="text-muted">Capstone Status</span>
                                <span class="${state.workflows.capstone ? 'text-success' : 'text-muted'}" style="font-weight: 700;">
                                    ${state.workflows.capstone ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            <div class="flex justify-between items-center p-3 border rounded">
                                <span class="text-muted">Badges Earned</span>
                                <span class="text-accent" style="font-weight: 700;">${state.badges.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        renderProgress: (container) => {
            container.innerHTML = `
                <div class="card text-center" style="padding: 4rem 2rem;">
                    <h2>My Progress</h2>
                    <p class="text-muted mt-4">Module under construction.</p>
                </div>
            `;
        },

        renderModule1: (container) => {
            const state = window.stateManager.state;
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Session 1 — Prompting & Communication</h2>
                    <p class="text-muted mt-2">Stop asking the AI a question. Start giving it a briefing.</p>
                </div>

                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-4">The C·T·P·F Framework</h3>
                        <p class="text-muted mb-4">A good prompt requires direction, not just a question.</p>
                        
                        <div class="flex flex-col gap-2 mb-4">
                            <div class="p-3 border rounded"><strong class="text-accent">C</strong>ontext - What is the background?</div>
                            <div class="p-3 border rounded"><strong class="text-accent">T</strong>one - How should it sound?</div>
                            <div class="p-3 border rounded"><strong class="text-accent">P</strong>ersona - Who is speaking?</div>
                            <div class="p-3 border rounded"><strong class="text-accent">F</strong>ormat - How should it be structured?</div>
                        </div>
                        
                        <a href="#/prompt-builder" class="btn btn-primary w-full">Practice in Prompt Builder ➔</a>
                    </div>

                    <div class="card">
                        <h3 class="mb-4">Module 1 Checkpoint</h3>
                        <div class="flex flex-col gap-2 mb-4">
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m1-chk1" ${window.stateManager.isExerciseComplete('m1-chk1') ? 'checked disabled' : ''}>
                                <span>Can you provide clear Context?</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m1-chk2" ${window.stateManager.isExerciseComplete('m1-chk2') ? 'checked disabled' : ''}>
                                <span>Can you specify Tone and Persona?</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m1-chk3" ${window.stateManager.isExerciseComplete('m1-chk3') ? 'checked disabled' : ''}>
                                <span>Can you dictate Output Format?</span>
                            </label>
                        </div>
                        <button id="btn-complete-m1" class="btn ${state.progress.module1 === 100 ? 'btn-secondary' : 'btn-primary'} w-full" ${state.progress.module1 === 100 ? 'disabled' : ''}>
                            ${state.progress.module1 === 100 ? 'Completed' : 'Mark Module Complete'}
                        </button>
                    </div>
                </div>
            `;
            
            // Logic
            ['m1-chk1', 'm1-chk2', 'm1-chk3'].forEach(id => {
                const chk = document.getElementById(id);
                if (chk && !chk.disabled) {
                    chk.addEventListener('change', (e) => {
                        if (e.target.checked) {
                            window.stateManager.markExerciseComplete(id);
                            e.target.disabled = true;
                            if (window.app) window.app.showToast('Checkpoint saved');
                        }
                    });
                }
            });
            
            const btnComplete = document.getElementById('btn-complete-m1');
            if (btnComplete && !btnComplete.disabled) {
                btnComplete.addEventListener('click', () => {
                    window.stateManager.update('progress.module1', 100);
                    window.stateManager.awardBadge('badge_prompting', 'Prompt Builder');
                    btnComplete.textContent = 'Completed';
                    btnComplete.disabled = true;
                    btnComplete.className = 'btn btn-secondary w-full';
                    if (window.app) window.app.showToast('Module 1 Completed! 🎉', 'success');
                });
            }
        },

        renderModule2: (container) => {
            const state = window.stateManager.state;
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Session 2 — AI for Finance & Operations</h2>
                    <p class="text-muted mt-2">Data analysis, pattern spotting, and workflow automation.</p>
                </div>

                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-4">Data Analysis Workflow</h3>
                        <div class="flex flex-col gap-2 mb-4">
                            <div class="p-3 border rounded text-center">What happened?</div>
                            <div style="text-align: center; color: var(--text-muted);">↓</div>
                            <div class="p-3 border rounded text-center">Why might it have happened?</div>
                            <div style="text-align: center; color: var(--text-muted);">↓</div>
                            <div class="p-3 border rounded text-center">What should I investigate?</div>
                            <div style="text-align: center; color: var(--text-muted);">↓</div>
                            <div class="p-3 border rounded text-center" style="border-color: var(--accent); font-weight: bold;">Human Decision</div>
                        </div>
                        <a href="#/data-lab" class="btn btn-primary w-full">Open VEKA Data Lab ➔</a>
                    </div>
                    
                    <div class="card">
                        <h3 class="mb-4">Module 2 Checkpoint</h3>
                        <div class="flex flex-col gap-2 mb-4">
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m2-chk1" ${window.stateManager.isExerciseComplete('m2-chk1') ? 'checked disabled' : ''}>
                                <span>I can upload structured data (CSV/Excel).</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m2-chk2" ${window.stateManager.isExerciseComplete('m2-chk2') ? 'checked disabled' : ''}>
                                <span>I can ask AI to find discrepancies.</span>
                            </label>
                        </div>
                        <button id="btn-complete-m2" class="btn ${state.progress.module2 === 100 ? 'btn-secondary' : 'btn-primary'} w-full" ${state.progress.module2 === 100 ? 'disabled' : ''}>
                            ${state.progress.module2 === 100 ? 'Completed' : 'Mark Module Complete'}
                        </button>
                    </div>
                </div>
            `;
            
            // Logic
            ['m2-chk1', 'm2-chk2'].forEach(id => {
                const chk = document.getElementById(id);
                if (chk && !chk.disabled) {
                    chk.addEventListener('change', (e) => {
                        if (e.target.checked) {
                            window.stateManager.markExerciseComplete(id);
                            e.target.disabled = true;
                            if (window.app) window.app.showToast('Checkpoint saved');
                        }
                    });
                }
            });
            
            const btnComplete = document.getElementById('btn-complete-m2');
            if (btnComplete && !btnComplete.disabled) {
                btnComplete.addEventListener('click', () => {
                    window.stateManager.update('progress.module2', 100);
                    window.stateManager.awardBadge('badge_data', 'Data Detective');
                    btnComplete.textContent = 'Completed';
                    btnComplete.disabled = true;
                    btnComplete.className = 'btn btn-secondary w-full';
                    if (window.app) window.app.showToast('Module 2 Completed! 🎉', 'success');
                });
            }
        },

        renderModule3: (container) => {
            const state = window.stateManager.state;
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Session 3 — Sales, HR & Safe AI</h2>
                    <p class="text-muted mt-2">High-stakes writing and enterprise safety principles.</p>
                </div>

                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-4">The Safety Principles</h3>
                        <ul style="padding-left: 1.5rem; color: var(--text-muted);" class="mb-4">
                            <li class="mb-2"><strong class="text-main">Synthetic Data Only:</strong> No real VEKA financials, salary data, or customer lists in public tools.</li>
                            <li class="mb-2"><strong class="text-main">Human Sign-off:</strong> AI is an assistant. The human verifies, decides, and signs off.</li>
                            <li class="mb-2"><strong class="text-main">Never Invent:</strong> Use [confirm] or [assumption]. Cite the source row.</li>
                        </ul>
                        <a href="#/prompt-rescue" class="btn btn-primary w-full">Open Rescue Kit ➔</a>
                    </div>
                    
                    <div class="card">
                        <h3 class="mb-4">Module 3 Checkpoint</h3>
                        <div class="flex flex-col gap-2 mb-4">
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m3-chk1" ${window.stateManager.isExerciseComplete('m3-chk1') ? 'checked disabled' : ''}>
                                <span>I understand the synthetic data rule.</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer p-2 hover-bg rounded">
                                <input type="checkbox" id="m3-chk2" ${window.stateManager.isExerciseComplete('m3-chk2') ? 'checked disabled' : ''}>
                                <span>I know how to challenge AI hallucinations.</span>
                            </label>
                        </div>
                        <button id="btn-complete-m3" class="btn ${state.progress.module3 === 100 ? 'btn-secondary' : 'btn-primary'} w-full" ${state.progress.module3 === 100 ? 'disabled' : ''}>
                            ${state.progress.module3 === 100 ? 'Completed' : 'Mark Module Complete'}
                        </button>
                    </div>
                </div>
            `;
            
            // Logic
            ['m3-chk1', 'm3-chk2'].forEach(id => {
                const chk = document.getElementById(id);
                if (chk && !chk.disabled) {
                    chk.addEventListener('change', (e) => {
                        if (e.target.checked) {
                            window.stateManager.markExerciseComplete(id);
                            e.target.disabled = true;
                            if (window.app) window.app.showToast('Checkpoint saved');
                        }
                    });
                }
            });
            
            const btnComplete = document.getElementById('btn-complete-m3');
            if (btnComplete && !btnComplete.disabled) {
                btnComplete.addEventListener('click', () => {
                    window.stateManager.update('progress.module3', 100);
                    window.stateManager.awardBadge('badge_safety', 'Safety Guardian');
                    btnComplete.textContent = 'Completed';
                    btnComplete.disabled = true;
                    btnComplete.className = 'btn btn-secondary w-full';
                    if (window.app) window.app.showToast('Module 3 Completed! 🎉', 'success');
                });
            }
        },

        renderModule4: (container) => {
            const state = window.stateManager.state;
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Session 4 — From Prompt to Asset</h2>
                    <p class="text-muted mt-2">Build your Capstone AI Workflow Blueprint.</p>
                </div>

                <div class="card mb-6" style="border-color: var(--accent);">
                    <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <div>
                            <h3 style="font-size: 1.5rem;" class="text-accent">Build Your VEKA AI Assistant</h3>
                            <p class="text-muted">Turn a real workflow bottleneck into an AI asset.</p>
                        </div>
                        <a href="#/workflow-lab" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">Start Capstone Project ➔</a>
                    </div>
                </div>
                
                <div class="card">
                    <h3 class="mb-4">Module 4 Checkpoint</h3>
                    <button id="btn-complete-m4" class="btn ${state.progress.module4 === 100 ? 'btn-secondary' : 'btn-primary'} w-full" ${state.progress.module4 === 100 ? 'disabled' : ''}>
                        ${state.progress.module4 === 100 ? 'Completed' : 'Mark Module Complete'}
                    </button>
                </div>
            `;
            
            const btnComplete = document.getElementById('btn-complete-m4');
            if (btnComplete && !btnComplete.disabled) {
                btnComplete.addEventListener('click', () => {
                    window.stateManager.update('progress.module4', 100);
                    window.stateManager.awardBadge('badge_capstone', 'Capstone Builder');
                    btnComplete.textContent = 'Completed';
                    btnComplete.disabled = true;
                    btnComplete.className = 'btn btn-secondary w-full';
                    if (window.app) window.app.showToast('Module 4 Completed! 🎉', 'success');
                });
            }
        },

        renderPromptLibrary: (container) => {
            const prompts = window.promptEngine.promptLibrary;
            
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">VEKA Prompt Library</h2>
                    <p class="text-muted mt-2">50 pre-tested enterprise templates for VEKA.</p>
                </div>
                
                <div class="flex gap-4 mb-6 flex-wrap">
                    <input type="text" id="search-prompts" class="btn btn-secondary flex-grow" style="text-align: left; background: var(--primary-light); cursor: text;" placeholder="Search prompts...">
                    <select id="filter-prompts" class="btn btn-secondary">
                        <option value="all">All Categories</option>
                        ${[...new Set(prompts.map(p => p.category))].map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </div>

                <div class="dashboard-grid" id="prompt-grid">
                    ${prompts.map(p => `
                        <div class="card flex flex-col justify-between" data-category="${p.category}">
                            <div>
                                <div class="text-xs text-accent font-bold mb-2 uppercase" style="letter-spacing: 0.1em;">${p.category}</div>
                                <h3 class="mb-2">${p.title}</h3>
                                <pre class="text-muted text-sm mb-4" style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); white-space: pre-wrap;">${p.content}</pre>
                            </div>
                            <div class="flex gap-2 mt-4">
                                <button class="btn btn-secondary btn-small w-full" onclick="navigator.clipboard.writeText('${p.content.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'); window.app.showToast('Copied to clipboard!', 'success');">Copy</button>
                                <button class="btn btn-secondary btn-small" onclick="window.stateManager.toggleFavoritePrompt('${p.id}'); this.innerHTML = window.stateManager.state.prompts.favorites.includes('${p.id}') ? '★' : '☆';">
                                    ${window.stateManager.state.prompts.favorites.includes(p.id) ? '★' : '☆'}
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Basic filtering
            const filterEl = document.getElementById('filter-prompts');
            const searchEl = document.getElementById('search-prompts');
            const cards = document.querySelectorAll('#prompt-grid .card');
            
            const applyFilters = () => {
                const category = filterEl.value;
                const search = searchEl.value.toLowerCase();
                
                cards.forEach(card => {
                    const matchesCategory = category === 'all' || card.getAttribute('data-category') === category;
                    const matchesSearch = card.textContent.toLowerCase().includes(search);
                    card.style.display = matchesCategory && matchesSearch ? 'flex' : 'none';
                });
            };
            
            if (filterEl) filterEl.addEventListener('change', applyFilters);
            if (searchEl) searchEl.addEventListener('input', applyFilters);
        },

        renderPromptBuilder: (container) => {
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Prompt Builder</h2>
                    <p class="text-muted mt-2">Construct a prompt using the C·T·P·F Framework.</p>
                </div>
                
                <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="card flex flex-col gap-4">
                        <div>
                            <label class="text-muted text-sm mb-1 block">Persona (Who are you?)</label>
                            <input type="text" id="pb-persona" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light); cursor: text;" placeholder="e.g. A senior VEKA sales director...">
                        </div>
                        <div>
                            <label class="text-muted text-sm mb-1 block">Context (What is the background?)</label>
                            <textarea id="pb-context" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light); cursor: text; min-height: 80px; resize: vertical;" placeholder="e.g. A customer is complaining about lead times..."></textarea>
                        </div>
                        <div>
                            <label class="text-muted text-sm mb-1 block">Task (What should AI do?)</label>
                            <textarea id="pb-task" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light); cursor: text; min-height: 80px; resize: vertical;" placeholder="e.g. Draft an email explaining our quality standards..."></textarea>
                        </div>
                        <div>
                            <label class="text-muted text-sm mb-1 block">Tone (How should it sound?)</label>
                            <input type="text" id="pb-tone" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light); cursor: text;" placeholder="e.g. Professional, firm, empathetic...">
                        </div>
                        <div>
                            <label class="text-muted text-sm mb-1 block">Format (How should it be structured?)</label>
                            <input type="text" id="pb-format" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light); cursor: text;" placeholder="e.g. Short email with bullet points...">
                        </div>
                    </div>
                    
                    <div class="card flex flex-col">
                        <h3 class="mb-4">Live Preview</h3>
                        <pre id="pb-preview" class="flex-grow p-4 border rounded" style="background: var(--primary-light); white-space: pre-wrap; color: var(--text-muted);">Your prompt will appear here...</pre>
                        
                        <div class="flex gap-4 mt-4">
                            <button id="pb-copy" class="btn btn-primary w-full">Copy Prompt</button>
                            <button id="pb-clear" class="btn btn-secondary">Clear</button>
                        </div>
                    </div>
                </div>
            `;
            
            const inputs = ['pb-persona', 'pb-context', 'pb-task', 'pb-tone', 'pb-format'].map(id => document.getElementById(id));
            const preview = document.getElementById('pb-preview');
            
            const updatePreview = () => {
                const [persona, context, task, tone, format] = inputs.map(i => i.value.trim());
                
                let result = '';
                if (persona) result += `You are ${persona}.\n\n`;
                if (context) result += `Context:\n${context}\n\n`;
                if (task) result += `Task:\n${task}\n\n`;
                if (tone) result += `Tone:\n${tone}\n\n`;
                if (format) result += `Format:\n${format}`;
                
                if (result.trim() === '') {
                    preview.textContent = 'Your prompt will appear here...';
                    preview.style.color = 'var(--text-muted)';
                } else {
                    preview.textContent = result.trim();
                    preview.style.color = 'var(--text-main)';
                }
            };
            
            inputs.forEach(input => input.addEventListener('input', updatePreview));
            
            document.getElementById('pb-copy').addEventListener('click', () => {
                if (preview.textContent && preview.textContent !== 'Your prompt will appear here...') {
                    navigator.clipboard.writeText(preview.textContent);
                    if (window.app) window.app.showToast('Prompt copied to clipboard!', 'success');
                }
            });
            
            document.getElementById('pb-clear').addEventListener('click', () => {
                inputs.forEach(i => i.value = '');
                updatePreview();
            });
        },

        renderPromptRescue: (container) => {
            const lines = window.promptEngine.rescueKit;
            
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Prompt Rescue Kit</h2>
                    <p class="text-muted mt-2">When AI gives you bad output, don't rewrite it yourself. Fix the prompt.</p>
                </div>
                
                <div class="dashboard-grid">
                    ${lines.map(line => `
                        <div class="card flex justify-between items-center gap-4 hover-bg">
                            <span style="font-weight: 500; font-size: 1.1rem;">"${line}"</span>
                            <button class="btn btn-secondary btn-small" onclick="navigator.clipboard.writeText('${line.replace(/'/g, "\\'")}'); window.app.showToast('Copied to clipboard!', 'success');">Copy</button>
                        </div>
                    `).join('')}
                </div>
            `;
        },
        
        renderDataLab: (container) => {
            const datasets = window.dataEngine.registry;
            const dsKeys = Object.keys(datasets);
            
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">VEKA Data Lab</h2>
                    <p class="text-muted mt-2">Visualize and analyze synthetic training datasets.</p>
                    <div class="mt-4 inline-block p-2 text-sm text-warning" style="background: var(--warning-bg); border-radius: var(--radius-sm); border: 1px solid var(--warning);">
                        ⚠️ SYNTHETIC TRAINING DATA — NOT REAL VEKA RECORDS
                    </div>
                </div>
                
                <div class="dashboard-grid">
                    ${dsKeys.map(key => `
                        <div class="card flex flex-col justify-between">
                            <div>
                                <h3 class="mb-2" style="text-transform: capitalize;">${key.replace(/-/g, ' ')}</h3>
                                <div class="text-xs text-muted mb-4">Format: ${datasets[key].type.toUpperCase()} | Source: VEKA Training Pack</div>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-primary w-full" onclick="window.app.showToast('Dataset view coming soon.', 'info')">Preview Data ➔</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        renderSyntheticData: (container) => {
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">VEKA Synthetic Data Studio</h2>
                    <p class="text-muted mt-2">Generate synthetic datasets for specific VEKA functions.</p>
                </div>
                
                <div class="dashboard-grid" style="grid-template-columns: 1fr 2fr;">
                    <div class="card">
                        <h3 class="mb-4">Generator Settings</h3>
                        <div class="flex flex-col gap-4">
                            <div>
                                <label class="text-muted text-sm mb-1 block">Training Function</label>
                                <select class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);">
                                    <option>Finance</option>
                                    <option>Accounts</option>
                                    <option>Procurement</option>
                                    <option>Operations</option>
                                    <option>Production</option>
                                    <option>Maintenance</option>
                                    <option>Sales</option>
                                    <option>HR</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-muted text-sm mb-1 block">Number of Rows</label>
                                <input type="number" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);" value="100">
                            </div>
                            <div>
                                <label class="text-muted text-sm mb-1 block">Include Anomalies</label>
                                <select class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);">
                                    <option>Yes (For Analysis Training)</option>
                                    <option>No (Clean Data)</option>
                                </select>
                            </div>
                            <button class="btn btn-primary w-full mt-4" onclick="window.app.showToast('Generating synthetic dataset...', 'success')">Generate Dataset</button>
                        </div>
                    </div>
                    
                    <div class="card flex flex-col items-center justify-center" style="border: 2px dashed var(--border-color); background: rgba(0,0,0,0.2);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🔬</div>
                        <h3 class="text-muted">No Data Generated Yet</h3>
                        <p class="text-muted mt-2 text-center max-w-md">Select your parameters and click generate to create a safe, synthetic training dataset.</p>
                    </div>
                </div>
            `;
        },

        renderWorkflowLab: (container) => {
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">AI Workflow Lab</h2>
                    <p class="text-muted mt-2">Design multi-step AI automation processes.</p>
                </div>
                
                <div class="card text-center" style="padding: 4rem 2rem;">
                    <div class="flex flex-col items-center gap-4">
                        <div class="p-4 border rounded w-full max-w-sm">INPUT</div>
                        <div class="text-muted">↓</div>
                        <div class="p-4 border rounded w-full max-w-sm" style="border-color: var(--accent);">AI ANALYSIS</div>
                        <div class="text-muted">↓</div>
                        <div class="p-4 border rounded w-full max-w-sm">HUMAN REVIEW</div>
                        <div class="text-muted">↓</div>
                        <div class="p-4 border rounded w-full max-w-sm">OUTPUT</div>
                    </div>
                    <button class="btn btn-primary mt-8">Create New Workflow</button>
                </div>
            `;
        },

        renderProductivity: (container) => {
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">AI Productivity Tracker</h2>
                    <p class="text-muted mt-2">Measure the impact of your AI workflows.</p>
                </div>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-4">Log a Task</h3>
                        <div class="flex flex-col gap-4">
                            <input type="text" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);" placeholder="Task Name (e.g. Weekly Report)">
                            <div class="flex gap-4">
                                <div class="w-full">
                                    <label class="text-muted text-sm mb-1 block">Time Before (mins)</label>
                                    <input type="number" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);" placeholder="60">
                                </div>
                                <div class="w-full">
                                    <label class="text-muted text-sm mb-1 block">Time After (mins)</label>
                                    <input type="number" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);" placeholder="15">
                                </div>
                            </div>
                            <button class="btn btn-primary w-full" onclick="window.app.showToast('Productivity logged!', 'success')">Log Savings</button>
                        </div>
                    </div>
                    
                    <div class="card flex flex-col items-center justify-center">
                        <div class="text-muted text-sm uppercase tracking-wider mb-2">Total Estimated Time Saved</div>
                        <div class="text-accent" style="font-size: 4rem; font-weight: 800; line-height: 1;">0</div>
                        <div class="text-muted mt-2">Minutes this month</div>
                    </div>
                </div>
            `;
        },

        renderCaseStudies: (container) => {
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">VEKA Case Studies</h2>
                    <p class="text-muted mt-2">Real-world AI application examples from the training.</p>
                </div>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-2">Vendor Negotiation</h3>
                        <p class="text-muted text-sm mb-4">Using AI to analyze supplier delays and draft a firm negotiation strategy.</p>
                        <button class="btn btn-secondary w-full" onclick="window.app.showToast('Opening case study...', 'info')">View Study</button>
                    </div>
                    <div class="card">
                        <h3 class="mb-2">Shift Handover</h3>
                        <p class="text-muted text-sm mb-4">Converting messy end-of-shift notes into a structured, actionable SOP.</p>
                        <button class="btn btn-secondary w-full" onclick="window.app.showToast('Opening case study...', 'info')">View Study</button>
                    </div>
                    <div class="card">
                        <h3 class="mb-2">Sales Personalization</h3>
                        <p class="text-muted text-sm mb-4">Drafting a quotation cover note tailored to a specific buyer persona.</p>
                        <button class="btn btn-secondary w-full" onclick="window.app.showToast('Opening case study...', 'info')">View Study</button>
                    </div>
                </div>
            `;
        },

        renderResources: (container) => {
            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">Resource Center</h2>
                    <p class="text-muted mt-2">All your workshop materials in one place.</p>
                </div>
                
                <div class="dashboard-grid">
                    <a href="workbook/index.html" target="_blank" class="card hover-bg" style="display: block;">
                        <h3 class="mb-2">Participant Workbook</h3>
                        <p class="text-muted text-sm">Your digital companion for the 8-hour workshop.</p>
                    </a>
                    <a href="deck/index.html" target="_blank" class="card hover-bg" style="display: block;">
                        <h3 class="mb-2">Interactive Training Deck</h3>
                        <p class="text-muted text-sm">The main presentation system.</p>
                    </a>
                    <a href="prompt-library/VEKA_GenAI_Prompt_Library_50.pdf" target="_blank" class="card hover-bg" style="display: block;">
                        <h3 class="mb-2">Prompt Library PDF</h3>
                        <p class="text-muted text-sm">The original 50-prompt VEKA library document.</p>
                    </a>
                    <a href="trainer/guide.html" target="_blank" class="card hover-bg" style="display: block;">
                        <h3 class="mb-2">Trainer Guide</h3>
                        <p class="text-muted text-sm">Printable reference for facilitators.</p>
                    </a>
                    <a href="trainer/VEKA_GenAI_Trainer_Script.pdf" target="_blank" class="card hover-bg" style="display: block;">
                        <h3 class="mb-2">Trainer Script PDF</h3>
                        <p class="text-muted text-sm">The comprehensive minute-by-minute facilitator script.</p>
                    </a>
                </div>
            `;
        },

        renderTrainer: (container) => {
            container.innerHTML = '<div class="mb-6"><h2 class="page-title">Trainer Dashboard</h2></div><div class="card"><p>Module under construction.</p></div>';
        },

        renderTimer: (container) => {
            container.innerHTML = '<div class="mb-6"><h2 class="page-title">Workshop Timer</h2></div><div class="card"><p>Module under construction.</p></div>';
        },

        renderLeaderboard: (container) => {
            container.innerHTML = '<div class="mb-6"><h2 class="page-title">Leaderboard</h2></div><div class="card"><p>Module under construction.</p></div>';
        },

        renderDemo: (container) => {
            container.innerHTML = '<div class="mb-6"><h2 class="page-title">Executive Demo</h2></div><div class="card"><p>Module under construction.</p></div>';
        }
    }
}

// Add global styles for toasts animation
const style = document.createElement('style');
style.textContent = `
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);

// Init on DOM Load
const initApp = () => {
    try {
        if (!window.app) window.app = new App();
    } catch (e) {
        console.error("Initialization error:", e);
        // Force hide overlay on error so user isn't stuck
        const overlay = document.getElementById('loading-overlay');
        const appEl = document.getElementById('app');
        if (overlay) overlay.style.display = 'none';
        if (appEl) {
            appEl.style.display = 'flex';
            appEl.innerHTML = `<div style="padding: 2rem; color: red;"><h3>Application Error</h3><p>${e.message}</p></div>`;
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.addEventListener('error', (e) => {
    console.error("Global error:", e.message);
});
