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
        this.initTopbar();
        
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

    initTopbar() {
        const searchBtn = document.getElementById('global-search-btn');
        const settingsBtn = document.getElementById('settings-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.showSearchModal();
            });
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }
    }

    showSearchModal() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: flex-start; justify-content: center; z-index: 1000; padding-top: 10vh;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                <div class="card" style="width: 90%; max-width: 600px; background: var(--bg-main); border: 1px solid var(--accent); box-shadow: var(--shadow-glow-accent);">
                    <div class="flex items-center gap-4">
                        <span style="font-size: 1.5rem;">🔍</span>
                        <input type="text" class="w-full" style="background: transparent; border: none; color: var(--text-main); font-size: 1.25rem; outline: none; padding: 0.5rem 0;" placeholder="Search prompts, modules, case studies..." autofocus>
                        <button class="icon-btn" onclick="document.getElementById('modal-container').classList.add('hidden')">✕</button>
                    </div>
                    <div class="mt-4 border-t border-border pt-4 text-muted text-sm">
                        Start typing to search across the VEKA GenAI Excellence platform.
                    </div>
                </div>
            </div>
        `;
        modalContainer.classList.remove('hidden');
        
        // Focus the input
        setTimeout(() => {
            const input = modalContainer.querySelector('input');
            if (input) input.focus();
        }, 100);
    }

    showSettingsModal() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                <div class="card" style="width: 90%; max-width: 500px; background: var(--bg-main);">
                    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border">
                        <h2 class="text-xl">Settings</h2>
                        <button class="icon-btn" onclick="document.getElementById('modal-container').classList.add('hidden')">✕</button>
                    </div>
                    
                    <div class="flex flex-col gap-6">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="mb-1">Trainer Mode</h3>
                                <p class="text-muted text-sm">Enable advanced facilitator controls</p>
                            </div>
                            <button class="btn btn-secondary" onclick="window.stateManager.toggleTrainerMode(); document.getElementById('modal-container').classList.add('hidden');">Toggle</button>
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="mb-1">Theme</h3>
                                <p class="text-muted text-sm">Switch between light and dark mode</p>
                            </div>
                            <button class="btn btn-secondary" id="theme-toggle-btn" onclick="const newTheme = window.stateManager.toggleTheme(); window.app.updateUIFromState(window.stateManager.state); this.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';">Toggle Theme</button>
                        </div>

                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="mb-1">Account</h3>
                                <p class="text-muted text-sm">Manage your profile and data</p>
                            </div>
                            <button class="btn btn-secondary" onclick="window.app.showToast('Account management coming soon', 'info')">Manage</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalContainer.classList.remove('hidden');
    }

    generateSyntheticData() {
        const btn = document.getElementById('synth-btn');
        const preview = document.getElementById('synth-preview');
        const func = document.getElementById('synth-func').value;
        const rows = document.getElementById('synth-rows').value;
        const anomalies = document.getElementById('synth-anomalies').value.includes('Yes');

        if (!btn || !preview) return;

        btn.textContent = 'Generating...';
        btn.disabled = true;
        this.showToast('Generating synthetic dataset...', 'success');

        preview.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <div class="loader mb-4"></div>
                <p>Synthesizing ${rows} records for ${func}...</p>
            </div>
        `;
        preview.style.border = "1px solid var(--border-color)";
        preview.style.background = "var(--bg-card)";

        setTimeout(() => {
            let headers = [];
            let data = [];
            
            if (func === 'Finance' || func === 'Accounts') {
                headers = ['Invoice ID', 'Vendor', 'Amount', 'Date', 'Status'];
                for (let i = 0; i < 5; i++) {
                    let amount = (Math.random() * 10000).toFixed(2);
                    let status = Math.random() > 0.8 ? 'Pending' : 'Paid';
                    if (anomalies && i === 2) {
                        amount = "999999.99"; // Anomaly
                        status = "REJECTED";
                    }
                    data.push([`INV-${1000 + i}`, `Vendor ${String.fromCharCode(65+i)}`, `$${amount}`, `2024-0${Math.floor(Math.random()*9)+1}-15`, status]);
                }
            } else if (func === 'Production' || func === 'Operations') {
                headers = ['Batch ID', 'Machine', 'Yield (%)', 'Defect Rate', 'QA Status'];
                for (let i = 0; i < 5; i++) {
                    let y = (80 + Math.random() * 19).toFixed(1);
                    let d = (Math.random() * 5).toFixed(2);
                    let qa = y > 85 ? 'Passed' : 'Review';
                    if (anomalies && i === 1) {
                        y = "15.0"; // Anomaly
                        d = "85.00";
                        qa = "FAILED";
                    }
                    data.push([`BCH-${8000 + i}`, `Extruder ${i+1}`, `${y}%`, `${d}%`, qa]);
                }
            } else {
                headers = ['Record ID', 'Category', 'Value 1', 'Value 2', 'Status'];
                for (let i = 0; i < 5; i++) {
                    data.push([`REC-${i}`, `Cat-${i}`, Math.floor(Math.random()*100), Math.floor(Math.random()*100), 'Active']);
                }
            }

            this.lastSyntheticData = { headers, data, func };
            
            let tableRows = data.map(row => `<tr>${row.map(cell => `<td class="p-3 border-b border-border">${cell}</td>`).join('')}</tr>`).join('');
            let tableHTML = `
                <div class="w-full h-full flex flex-col p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg text-accent">${func} Training Dataset</h3>
                        <div class="flex gap-2">
                            <span class="btn btn-secondary text-xs py-1" style="pointer-events:none;">${rows} Rows</span>
                            <span class="btn btn-secondary text-xs py-1" style="pointer-events:none;">${anomalies ? 'Anomalies: Yes' : 'Clean Data'}</span>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left" style="border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--primary-light);">
                                    ${headers.map(h => `<th class="p-3 border-b border-border font-semibold">${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                        <p class="text-center text-muted text-sm mt-4 italic">Showing preview of 5 records.</p>
                    </div>
                    <div class="mt-auto pt-6 flex justify-end">
                        <button class="btn btn-primary" onclick="window.app.downloadSyntheticCSV()">Download CSV</button>
                    </div>
                </div>
            `;
            
            preview.innerHTML = tableHTML;
            btn.textContent = 'Generate Dataset';
            btn.disabled = false;
        }, 1500);
    }

    downloadSyntheticCSV() {
        if (!this.lastSyntheticData) {
            this.showToast('No data available to download.', 'error');
            return;
        }
        
        const { headers, data, func } = this.lastSyntheticData;
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add headers
        csvContent += headers.join(",") + "\n";
        
        // Add data
        data.forEach(row => {
            // Basic escaping for CSV
            const escapedRow = row.map(cell => {
                const cellStr = String(cell);
                return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
            });
            csvContent += escapedRow.join(",") + "\n";
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `VEKA_${func}_Synthetic_Dataset.csv`);
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
        this.showToast('Dataset downloaded as CSV', 'success');
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
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('open');
                } else {
                    sidebar.classList.toggle('collapsed');
                }
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
        
        // Apply Theme
        if (state.settings && state.settings.theme) {
            document.documentElement.setAttribute('data-theme', state.settings.theme);
            const themeBtn = document.getElementById('theme-toggle-btn');
            if (themeBtn) {
                themeBtn.textContent = state.settings.theme === 'light' ? 'Dark Mode' : 'Light Mode';
            }
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

    caseStudies = {
        'vendor': {
            title: 'Vendor Negotiation',
            description: 'Using AI to analyze supplier delays and draft a firm negotiation strategy.',
            context: 'A key raw material supplier (PVC resins) has been consistently missing delivery deadlines by 3-5 days over the last month, causing cascading delays in our production schedule. They blame logistical issues but have not offered a discount or concrete solution.',
            prompt: `You are a strict but professional procurement manager at VEKA.\nContext: Our main PVC supplier has been 3-5 days late on 4 consecutive deliveries this month, causing production delays.\nTask: Write a firm email to their account manager. State the impact of their delays, demand a formal corrective action plan within 48 hours, and request a 5% discount on the next invoice as compensation for the disruption.\nTone: Firm, assertive, professional.\nFormat: Short email with clear bullet points for demands.`,
            before: `Hi Supplier,\nYour last few deliveries have been late. This is causing problems for our production team. Please let us know when this will be fixed. We really need the materials on time.\nThanks.`,
            after: `Subject: Urgent: Unacceptable Delivery Delays & Required Corrective Action\n\nDear [Supplier Name],\n\nI am writing to address a critical issue regarding your recent performance. Over the past month, your last four deliveries of PVC resins have been delayed by 3 to 5 days. These consistent failures are causing significant disruptions to our production schedule and impacting our commitments to our own customers.\n\nWe value our partnership, but this level of unreliability is unacceptable. Therefore, we require the following actions immediately:\n\n*   **Corrective Action Plan:** Please provide a formal, detailed plan within 48 hours explaining how you will resolve these logistical issues and guarantee on-time deliveries moving forward.\n*   **Compensation:** Due to the financial impact these delays have had on our operations, we request a 5% discount on our upcoming invoice.\n\nWe need to see immediate improvement to continue this relationship. I look forward to your prompt response and action plan by [Date/Time].\n\nSincerely,\n[Your Name]\nProcurement Manager, VEKA`
        },
        'shift': {
            title: 'Shift Handover',
            description: 'Converting messy end-of-shift notes into a structured, actionable SOP.',
            context: 'The night shift maintenance technician leaves a rushed, unformatted log of what happened during their shift, making it difficult for the morning shift to understand priority tasks.',
            prompt: `You are an operations manager.\nContext: The night shift technician left the following raw notes: "ext-3 started making grinding noise around 3am. i greased the main bearing. it helped a bit but still loud. temp on zone 2 on ext-1 drifting by 5 degrees, tweaked pid but needs watching. someone left the forklift uncharged again."\nTask: Convert these raw notes into a clean, prioritized shift handover report.\nFormat: Use headers for 'Critical Issues', 'To Monitor', and 'General Notes'.`,
            before: `ext-3 started making grinding noise around 3am. i greased the main bearing. it helped a bit but still loud. temp on zone 2 on ext-1 drifting by 5 degrees, tweaked pid but needs watching. someone left the forklift uncharged again.`,
            after: `### Shift Handover Report (Night Shift -> Morning Shift)\n\n#### 🔴 Critical Issues (Action Required)\n*   **Machine EXT-3:** Grinding noise reported from the main bearing at 3:00 AM.\n    *   *Action Taken:* Greased the bearing, which provided temporary relief.\n    *   *Next Steps:* Immediate inspection required by the morning maintenance team; noise persists.\n\n#### 🟡 To Monitor\n*   **Machine EXT-1 (Zone 2):** Temperature is drifting by approximately 5 degrees.\n    *   *Action Taken:* PID settings were adjusted.\n    *   *Next Steps:* Monitor temperature stability closely throughout the morning shift.\n\n#### ⚪ General Notes\n*   **Equipment:** The forklift was left uncharged at the end of the shift. Please ensure operators are reminded of charging protocols.`
        },
        'sales': {
            title: 'Sales Personalization',
            description: 'Drafting a quotation cover note tailored to a specific buyer persona.',
            context: 'A sales rep needs to send a quotation for a large window profile order to a procurement director who is known to be highly focused on long-term ROI and energy efficiency, rather than just the lowest upfront cost.',
            prompt: `You are a senior VEKA sales director.\nContext: We are sending a quotation to Sarah, a Procurement Director for a major developer. Sarah is highly focused on long-term ROI, energy efficiency, and sustainability. Our quote is slightly more expensive upfront than competitors.\nTask: Write a personalized cover email for the attached quotation. Emphasize how our profiles offer superior thermal insulation (saving energy costs) and durability (reducing replacement costs), making them the smartest long-term financial choice.\nTone: Confident, consultative, value-driven.\nFormat: 3 short paragraphs.`,
            before: `Hi Sarah,\nPlease find attached our quotation for the window profiles. Let us know if you have any questions or want to proceed.\nThanks,\nSales Team`,
            after: `Subject: VEKA Quotation: Maximizing Long-Term ROI for [Project Name]\n\nDear Sarah,\n\nPlease find attached our detailed quotation for your upcoming development project. While reviewing the numbers, I want to highlight that our proposal is designed specifically with your focus on long-term financial performance and sustainability in mind.\n\nAlthough our initial investment may differ slightly from standard alternatives, VEKA profiles deliver superior thermal insulation. This industry-leading energy efficiency translates directly into significantly lower operational heating and cooling costs for the building's lifespan, rapidly offsetting the initial purchase price.\n\nFurthermore, our profiles are engineered for exceptional durability, drastically reducing future maintenance and replacement expenses. I would welcome the opportunity to walk you through the ROI calculations next week to demonstrate why this is the most cost-effective choice for your portfolio over the long term.\n\nBest regards,\n\n[Your Name]\nSenior Sales Director, VEKA`
        }
    };

    showCaseStudy(id) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;
        
        const study = this.caseStudies[id];
        if (!study) return;

        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                <div class="card" style="width: 95%; max-width: 1200px; max-height: 90vh; display: flex; flex-direction: column; background: var(--bg-main);">
                    <div class="flex justify-between items-center mb-4 pb-4 border-b border-border">
                        <div>
                            <h2 class="text-2xl mb-1">${study.title}</h2>
                            <p class="text-muted">${study.description}</p>
                        </div>
                        <button class="icon-btn" onclick="document.getElementById('modal-container').classList.add('hidden')">✕</button>
                    </div>
                    
                    <div class="flex-grow" style="overflow-y: auto;">
                        <div class="mb-6">
                            <h3 class="text-lg mb-2 text-accent">Scenario Context</h3>
                            <p style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">${study.context}</p>
                        </div>
                        
                        <div class="mb-6">
                            <h3 class="text-lg mb-2 text-accent">The AI Prompt (C·T·P·F Framework)</h3>
                            <pre style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(59, 130, 246, 0.3); white-space: pre-wrap; font-family: var(--font-body); color: var(--text-secondary);">${study.prompt}</pre>
                        </div>

                        <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <h3 class="text-lg mb-2 text-muted">❌ Before AI (The Draft)</h3>
                                <pre style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); white-space: pre-wrap; font-family: var(--font-body); color: var(--text-muted); min-height: 250px;">${study.before}</pre>
                            </div>
                            <div>
                                <h3 class="text-lg mb-2 text-success flex items-center gap-2"><img src="assets/images/ai_avatar.png" alt="AI Avatar" style="width: 24px; height: 24px; border-radius: 50%;"> After AI (The Result)</h3>
                                <pre style="background: rgba(16, 185, 129, 0.05); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid rgba(16, 185, 129, 0.2); white-space: pre-wrap; font-family: var(--font-body); color: var(--text-main); min-height: 250px;">${study.after}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modalContainer.classList.remove('hidden');
    }

    async showDatasetPreview(id) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        // Show loading state in modal
        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div class="card p-6 flex flex-col items-center">
                    <div class="loader mb-4"></div>
                    <p>Loading dataset...</p>
                </div>
            </div>
        `;
        modalContainer.classList.remove('hidden');

        try {
            const dataset = await window.dataEngine.loadDataset(id);
            
            let contentHTML = '';
            
            if (dataset.metadata.type === 'csv' && dataset.data.headers) {
                // Render Table
                const headers = dataset.data.headers;
                const rows = dataset.data.rows;
                
                contentHTML = `
                    <div style="overflow-x: auto; max-height: 60vh; overflow-y: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                            <thead style="position: sticky; top: 0; background: var(--bg-main); z-index: 10;">
                                <tr>
                                    ${headers.map(h => `<th style="padding: 0.75rem; border-bottom: 2px solid var(--border-color);">${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${rows.slice(0, 100).map(row => `
                                    <tr style="border-bottom: 1px solid var(--border-color); hover:background: var(--primary-light);">
                                        ${headers.map(h => `<td style="padding: 0.5rem 0.75rem;">${row[h] || ''}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        ${rows.length > 100 ? `<div class="p-2 text-center text-muted text-sm border-t border-border">Showing first 100 rows of ${rows.length} total.</div>` : ''}
                    </div>
                `;
            } else if (dataset.metadata.type === 'json') {
                contentHTML = `
                    <div style="max-height: 60vh; overflow-y: auto; background: var(--primary-light); padding: 1rem; border-radius: var(--radius-sm);">
                        <pre style="white-space: pre-wrap; font-size: 0.85rem; color: var(--text-secondary);">${JSON.stringify(dataset.data, null, 2)}</pre>
                    </div>
                `;
            } else {
                contentHTML = `
                    <div style="max-height: 60vh; overflow-y: auto; background: var(--primary-light); padding: 1rem; border-radius: var(--radius-sm);">
                        <pre style="white-space: pre-wrap; font-size: 0.85rem; color: var(--text-secondary);">${dataset.raw}</pre>
                    </div>
                `;
            }

            modalContainer.innerHTML = `
                <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                    <div class="card" style="width: 90%; max-width: 1000px; display: flex; flex-direction: column; background: var(--bg-main);">
                        <div class="flex justify-between items-center mb-4 pb-4 border-b border-border">
                            <h2 class="text-xl" style="text-transform: capitalize;">${id.replace(/-/g, ' ')} <span class="text-sm text-muted">(${dataset.metadata.type.toUpperCase()})</span></h2>
                            <button class="icon-btn" onclick="document.getElementById('modal-container').classList.add('hidden')">✕</button>
                        </div>
                        <div class="flex-grow">
                            ${contentHTML}
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            modalContainer.innerHTML = `
                <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                    <div class="card p-6 flex flex-col items-center">
                        <div style="color: var(--danger); font-size: 2rem; margin-bottom: 1rem;">❌</div>
                        <h3 class="mb-2">Failed to load dataset</h3>
                        <p class="text-muted mb-4">${e.message}</p>
                        <button class="btn btn-secondary" onclick="document.getElementById('modal-container').classList.add('hidden')">Close</button>
                    </div>
                </div>
            `;
        }
    }

    showQRModal() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;
        
        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                <div class="card flex flex-col items-center justify-center p-8" style="background: var(--bg-main); max-width: 400px; width: 90%; border-radius: 12px; position: relative;">
                    <button class="icon-btn" style="position: absolute; top: 15px; right: 15px; font-size: 1.5rem;" onclick="document.getElementById('modal-container').classList.add('hidden')">✕</button>
                    <h2 class="text-xl mb-4 text-center" style="color: var(--text-main);">Scan to Open on Device</h2>
                    <div style="background: white; padding: 1rem; border-radius: 12px;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://veka-gen-ai-excellence.vercel.app/" alt="QR Code" style="width: 100%; height: auto; max-width: 300px;">
                    </div>
                    <p class="mt-4 text-muted text-center" style="font-size: 0.9rem;">veka-gen-ai-excellence.vercel.app</p>
                </div>
            </div>
        `;
        modalContainer.classList.remove('hidden');
    }

    showWorkflowModal() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        modalContainer.innerHTML = `
            <div class="modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;" onclick="if(event.target === this) document.getElementById('modal-container').classList.add('hidden')">
                <div class="card flex flex-col" style="background: var(--bg-main); max-width: 600px; width: 90%; max-height: 90vh; border-radius: 12px; position: relative; overflow-y: auto;">
                    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border">
                        <h2 class="text-xl">Create New Workflow</h2>
                        <button class="icon-btn text-xl" onclick="document.getElementById('modal-container').classList.add('hidden')">✕</button>
                    </div>
                    
                    <form id="workflow-form" onsubmit="event.preventDefault(); window.app.saveWorkflow();">
                        <div class="mb-4">
                            <label class="block text-sm text-muted mb-1">Workflow Name</label>
                            <input type="text" id="wf-name" class="btn btn-secondary w-full text-left bg-surface" placeholder="e.g. Vendor Delay Analysis" required style="text-align: left; background: var(--bg-card); color: var(--text-main);">
                        </div>
                        
                        <div class="mb-4 p-4 border border-border rounded bg-[rgba(255,255,255,0.02)]">
                            <label class="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">1. Input</label>
                            <p class="text-xs text-muted mb-2">What data triggers this workflow?</p>
                            <textarea id="wf-input" class="w-full bg-surface border border-border rounded p-2 text-sm" rows="2" placeholder="e.g. An email from a supplier announcing a delay" required></textarea>
                        </div>
                        
                        <div class="mb-4 p-4 border border-accent rounded bg-[rgba(59,130,246,0.05)]">
                            <label class="block text-sm font-bold text-accent mb-2 uppercase tracking-wider">2. AI Analysis</label>
                            <p class="text-xs text-muted mb-2">What should the AI do with the input?</p>
                            <textarea id="wf-analysis" class="w-full bg-surface border border-border rounded p-2 text-sm" rows="3" placeholder="e.g. Extract the revised delivery date, check against contract penalties, and draft a response." required></textarea>
                        </div>
                        
                        <div class="mb-4 p-4 border border-border rounded bg-[rgba(255,255,255,0.02)]">
                            <label class="block text-sm font-bold text-muted mb-2 uppercase tracking-wider">3. Human Review</label>
                            <p class="text-xs text-muted mb-2">What must a human verify before output?</p>
                            <textarea id="wf-review" class="w-full bg-surface border border-border rounded p-2 text-sm" rows="2" placeholder="e.g. Verify the tone is professional and no threats were hallucinated." required></textarea>
                        </div>
                        
                        <div class="mb-6 p-4 border border-success rounded bg-[rgba(16,185,129,0.05)]">
                            <label class="block text-sm font-bold text-success mb-2 uppercase tracking-wider">4. Output</label>
                            <p class="text-xs text-muted mb-2">What is the final result?</p>
                            <textarea id="wf-output" class="w-full bg-surface border border-border rounded p-2 text-sm" rows="2" placeholder="e.g. A drafted email ready to send." required></textarea>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4 border-t border-border">
                            <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal-container').classList.add('hidden')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Workflow</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        modalContainer.classList.remove('hidden');
    }

    saveWorkflow() {
        const name = document.getElementById('wf-name').value;
        const input = document.getElementById('wf-input').value;
        const analysis = document.getElementById('wf-analysis').value;
        const review = document.getElementById('wf-review').value;
        const output = document.getElementById('wf-output').value;

        if (!name || !input || !analysis || !review || !output) {
            this.showToast('Please fill out all workflow fields.', 'danger');
            return;
        }

        const newWorkflow = {
            id: 'wf-' + Date.now(),
            name, input, analysis, review, output,
            createdAt: new Date().toISOString()
        };

        const state = window.stateManager.state;
        if (!state.workflows) state.workflows = { savedWorkflows: [] };
        if (!state.workflows.savedWorkflows) state.workflows.savedWorkflows = [];
        
        state.workflows.savedWorkflows.push(newWorkflow);
        window.stateManager.saveState();

        document.getElementById('modal-container').classList.add('hidden');
        this.showToast('Workflow saved successfully!', 'success');
        
        // Re-render if currently on workflow lab
        if (window.router.currentRoute === '/workflow-lab') {
            window.router.handleRoute();
        }
    }

    deleteWorkflow(id) {
        if (!confirm('Are you sure you want to delete this workflow?')) return;
        
        const state = window.stateManager.state;
        if (state.workflows && state.workflows.savedWorkflows) {
            state.workflows.savedWorkflows = state.workflows.savedWorkflows.filter(wf => wf.id !== id);
            window.stateManager.saveState();
            
            this.showToast('Workflow deleted.', 'info');
            
            // Re-render if currently on workflow lab
            if (window.router.currentRoute === '/workflow-lab') {
                window.router.handleRoute();
            }
        }
    }

    logProductivity() {
        const nameEl = document.getElementById('prod-task-name');
        const beforeEl = document.getElementById('prod-time-before');
        const afterEl = document.getElementById('prod-time-after');
        
        if (!nameEl || !beforeEl || !afterEl) return;
        
        const name = nameEl.value.trim();
        const before = parseInt(beforeEl.value, 10);
        const after = parseInt(afterEl.value, 10);
        
        if (!name || isNaN(before) || isNaN(after)) {
            this.showToast('Please enter a task name and valid numbers for time.', 'danger');
            return;
        }
        
        if (before <= after) {
            this.showToast('Time before should be greater than time after!', 'danger');
            return;
        }
        
        const timeSaved = before - after;
        
        const state = window.stateManager.state;
        if (!state.productivityData) state.productivityData = { entries: [], totalTimeSaved: 0 };
        if (!state.productivityData.entries) state.productivityData.entries = [];
        
        state.productivityData.entries.push({
            name,
            before,
            after,
            saved: timeSaved,
            date: new Date().toISOString()
        });
        
        state.productivityData.totalTimeSaved += timeSaved;
        window.stateManager.saveState();
        
        this.showToast(`Saved ${timeSaved} minutes!`, 'success');
        
        // Re-render
        if (window.router.currentRoute === '/productivity') {
            window.router.handleRoute();
        }
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
                <div class="card mb-6" style="background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(31,31,31,0.9) 100%), url('assets/images/hero_banner.png'); background-size: cover; background-position: center; position: relative; overflow: hidden; border: 1px solid var(--border-color);">
                    <div style="position: absolute; right: -50px; top: -50px; opacity: 0.05; font-size: 20rem; pointer-events: none; color: white;">V</div>
                    <div style="position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h1 class="hero-title" style="font-size: 2.5rem; letter-spacing: -0.02em; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">VEKA GenAI Excellence</h1>
                            <p class="mb-6" style="color: #cbd5e1; font-size: 1.1rem; letter-spacing: 0.1em; text-transform: uppercase; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">Learn AI. Apply AI. Build better workflows.</p>
                            
                            <div class="flex items-center gap-4 mb-4" style="max-width: 400px;">
                                <div class="progress-bar-bg" style="flex-grow: 1; height: 10px;">
                                    <div class="progress-bar-fill" style="width: ${state.progress.overall}%;"></div>
                                </div>
                                <span style="font-weight: 700; font-size: 1.2rem;">${state.progress.overall}%</span>
                            </div>
                        </div>
                        
                        <!-- QR Code Section -->
                        <div class="text-center hide-on-mobile" style="display: flex; flex-direction: column; align-items: center; margin-right: 1rem; margin-bottom: 1rem;">
                            <p style="color: white; font-size: 0.75rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Scan to open on phone</p>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://veka-gen-ai-excellence.vercel.app/" 
                                 alt="QR Code" 
                                 style="width: 80px; height: 80px; border-radius: 8px; border: 2px solid white; cursor: pointer; transition: transform 0.2s;"
                                 onclick="if(window.app) window.app.showQRModal()"
                                 onmouseover="this.style.transform='scale(1.05)'"
                                 onmouseout="this.style.transform='scale(1)'"
                                 title="Click to zoom"
                            >
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

                <!-- Analytics Section -->
                <div class="dashboard-grid mt-6">
                    <div class="card">
                        <h3 class="mb-4">Estimated Productivity Gain</h3>
                        <div style="position: relative; height:250px; width:100%">
                            <canvas id="productivityChart"></canvas>
                        </div>
                    </div>
                    <div class="card">
                        <h3 class="mb-4">Skill Progression</h3>
                        <div style="position: relative; height:250px; width:100%">
                            <canvas id="skillsChart"></canvas>
                        </div>
                    </div>
                </div>
            `;

            // Initialize Charts after DOM update
            setTimeout(() => {
                if (!window.Chart) return;
                
                const style = getComputedStyle(document.body);
                const textColor = style.getPropertyValue('--text-main').trim() || '#FFFFFF';
                const accentColor = style.getPropertyValue('--accent').trim() || '#E4002B';
                const gridColor = style.getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.1)';
                
                Chart.defaults.color = textColor;
                Chart.defaults.font.family = "'Inter', sans-serif";

                const ctxProd = document.getElementById('productivityChart');
                if (ctxProd && !window.prodChartInstance) {
                    window.prodChartInstance = new Chart(ctxProd, {
                        type: 'line',
                        data: {
                            labels: ['Module 1', 'Module 2', 'Module 3', 'Module 4'],
                            datasets: [{
                                label: 'Hours Saved / Week',
                                data: [1.5, 3.2, 5.8, 10.5],
                                borderColor: accentColor,
                                backgroundColor: 'rgba(228, 0, 43, 0.2)',
                                fill: true,
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { grid: { color: gridColor }, beginAtZero: true },
                                x: { grid: { color: gridColor } }
                            },
                            plugins: {
                                legend: { display: false }
                            }
                        }
                    });
                }

                const ctxSkills = document.getElementById('skillsChart');
                if (ctxSkills && !window.skillsChartInstance) {
                    window.skillsChartInstance = new Chart(ctxSkills, {
                        type: 'radar',
                        data: {
                            labels: ['Prompting', 'Data Analytics', 'Safe AI', 'Workflows', 'Strategy'],
                            datasets: [{
                                label: 'Current Level',
                                data: [80, 65, 90, 75, 85],
                                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                borderColor: '#10B981',
                                pointBackgroundColor: '#10B981',
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    angleLines: { color: gridColor },
                                    grid: { color: gridColor },
                                    pointLabels: { color: textColor },
                                    ticks: { display: false, max: 100, min: 0 }
                                }
                            },
                            plugins: {
                                legend: { display: false }
                            }
                        }
                    });
                }
            }, 100);
        },

        renderProgress: (container) => {
            const state = window.stateManager.state;
            
            const renderModuleProgress = (moduleName, progress, title) => `
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold">${title}</span>
                        <span class="text-sm font-bold ${progress === 100 ? 'text-success' : 'text-accent'}">${progress}%</span>
                    </div>
                    <div class="progress-bar-bg w-full" style="height: 8px;">
                        <div class="progress-bar-fill" style="width: ${progress}%; height: 100%; ${progress === 100 ? 'background: #10B981;' : ''}"></div>
                    </div>
                </div>
            `;
            
            const renderBadges = () => {
                if (!state.badges || state.badges.length === 0) {
                    return `<p class="text-muted text-sm italic">No badges earned yet. Complete modules to earn badges!</p>`;
                }
                return `
                    <div class="flex flex-wrap gap-4 mt-4">
                        ${state.badges.map(b => `
                            <div class="flex flex-col items-center justify-center p-4 bg-surface rounded-lg w-28 text-center" style="border: 1px solid var(--border-color);">
                                <span class="text-3xl mb-2">🏅</span>
                                <span class="text-xs font-semibold leading-tight">${b.name}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            };

            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">My Progress</h2>
                    <p class="text-muted mt-2">Track your learning journey and achievements.</p>
                </div>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-6 pb-3" style="border-bottom: 1px solid var(--border-color);">Course Completion</h3>
                        
                        <div class="mb-8">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-lg font-bold">Overall Progress</span>
                                <span class="text-xl font-bold text-accent">${state.progress.overall}%</span>
                            </div>
                            <div class="progress-bar-bg w-full" style="height: 12px;">
                                <div class="progress-bar-fill" style="width: ${state.progress.overall}%; height: 100%;"></div>
                            </div>
                        </div>
                        
                        <div class="mt-8 pt-6" style="border-top: 1px solid var(--border-color);">
                            <h4 class="mb-4 text-sm uppercase text-muted font-bold" style="letter-spacing: 0.05em;">Module Breakdown</h4>
                            ${renderModuleProgress('module1', state.progress.module1, 'Session 1: Prompting')}
                            ${renderModuleProgress('module2', state.progress.module2, 'Session 2: Data & Ops')}
                            ${renderModuleProgress('module3', state.progress.module3, 'Session 3: Safe AI')}
                            ${renderModuleProgress('module4', state.progress.module4, 'Session 4: Capstone')}
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3 class="mb-6 pb-3 flex items-center justify-between" style="border-bottom: 1px solid var(--border-color);">
                            <span>My Badges</span>
                            <span class="badge" style="background: rgba(245, 166, 35, 0.1); color: #F5A623; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">${state.badges.length} Earned</span>
                        </h3>
                        ${renderBadges()}
                        
                        <div class="mt-8 pt-6" style="border-top: 1px solid var(--border-color);">
                            <h4 class="mb-4 text-sm uppercase text-muted font-bold" style="letter-spacing: 0.05em;">Recent Activity</h4>
                            <ul class="text-sm space-y-3" style="list-style: none; padding: 0;">
                                ${state.progress.completedExercises.length === 0 ? 
                                    '<li class="text-muted italic">No activity yet.</li>' : 
                                    state.progress.completedExercises.slice(-5).reverse().map(ex => `
                                        <li class="flex items-center gap-3">
                                            <span style="color: #10B981;">✓</span>
                                            <span>Completed Checkpoint: <span style="font-family: monospace; color: var(--accent-color); padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">${ex}</span></span>
                                        </li>
                                    `).join('')}
                            </ul>
                        </div>
                    </div>
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
                </div>
                
                <div class="dashboard-grid">
                    ${dsKeys.map(key => `
                        <div class="card flex flex-col justify-between">
                            <div>
                                <h3 class="mb-2" style="text-transform: capitalize;">${key.replace(/-/g, ' ')}</h3>
                                <div class="text-xs text-muted mb-4">Format: ${datasets[key].type.toUpperCase()} | Source: VEKA Training Pack</div>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-primary w-full" onclick="window.app.showDatasetPreview('${key}')">Preview Data ➔</button>
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
                                <select id="synth-func" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);">
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
                                <input id="synth-rows" type="number" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);" value="100">
                            </div>
                            <div>
                                <label class="text-muted text-sm mb-1 block">Include Anomalies</label>
                                <select id="synth-anomalies" class="btn btn-secondary w-full" style="text-align: left; background: var(--primary-light);">
                                    <option>Yes (For Analysis Training)</option>
                                    <option>No (Clean Data)</option>
                                </select>
                            </div>
                            <button id="synth-btn" class="btn btn-primary w-full mt-4" onclick="window.app.generateSyntheticData()">Generate Dataset</button>
                        </div>
                    </div>
                    
                    <div id="synth-preview" class="card flex flex-col items-center justify-center" style="border: 2px dashed var(--border-color); background: rgba(0,0,0,0.2);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🔬</div>
                        <h3 class="text-muted">No Data Generated Yet</h3>
                        <p class="text-muted mt-2 text-center max-w-md">Select your parameters and click generate to create a safe, synthetic training dataset.</p>
                    </div>
                </div>
            `;
        },

        renderWorkflowLab: (container) => {
            const state = window.stateManager.state;
            const workflows = (state.workflows && state.workflows.savedWorkflows) ? state.workflows.savedWorkflows : [];

            let contentHTML = '';

            if (workflows.length === 0) {
                contentHTML = `
                    <div class="card text-center" style="padding: 4rem 2rem;">
                        <div class="flex flex-col items-center gap-4 opacity-50 mb-8 pointer-events-none">
                            <div class="p-3 border rounded w-full max-w-xs text-sm">INPUT</div>
                            <div class="text-muted">↓</div>
                            <div class="p-3 border rounded w-full max-w-xs text-sm" style="border-color: var(--accent);">AI ANALYSIS</div>
                            <div class="text-muted">↓</div>
                            <div class="p-3 border rounded w-full max-w-xs text-sm">HUMAN REVIEW</div>
                            <div class="text-muted">↓</div>
                            <div class="p-3 border rounded w-full max-w-xs text-sm">OUTPUT</div>
                        </div>
                        <h3 class="mb-2">No Workflows Yet</h3>
                        <p class="text-muted mb-6">Design your first multi-step AI automation process.</p>
                        <button class="btn btn-primary" onclick="if(window.app) window.app.showWorkflowModal()">Create New Workflow</button>
                    </div>
                `;
            } else {
                contentHTML = `
                    <div class="flex justify-between items-center mb-6">
                        <p class="text-muted">You have ${workflows.length} saved workflow${workflows.length === 1 ? '' : 's'}.</p>
                        <button class="btn btn-primary" onclick="if(window.app) window.app.showWorkflowModal()">+ New Workflow</button>
                    </div>
                    <div class="dashboard-grid">
                        ${workflows.map(wf => `
                            <div class="card relative flex flex-col h-full">
                                <button class="icon-btn text-danger absolute" style="top: 15px; right: 15px; background: rgba(228,0,43,0.1); border-radius: 4px; padding: 4px;" onclick="if(window.app) window.app.deleteWorkflow('${wf.id}')" title="Delete Workflow">🗑️</button>
                                <h3 class="mb-4 text-lg border-b border-border pb-3 pr-6">${wf.name}</h3>
                                
                                <div class="flex-grow flex flex-col gap-2 text-sm mt-2">
                                    <div class="p-3 border border-border rounded bg-surface transition-colors" title="${wf.input}">
                                        <span class="text-xs text-muted uppercase block mb-1 font-bold">1. Input</span>
                                        <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${wf.input}</div>
                                    </div>
                                    <div class="text-center text-muted leading-none">↓</div>
                                    
                                    <div class="p-3 border border-accent rounded transition-colors" style="background: rgba(59,130,246,0.05);" title="${wf.analysis}">
                                        <span class="text-xs text-accent uppercase block mb-1 font-bold">2. AI Analysis</span>
                                        <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${wf.analysis}</div>
                                    </div>
                                    <div class="text-center text-muted leading-none">↓</div>
                                    
                                    <div class="p-3 border border-border rounded bg-surface transition-colors" title="${wf.review}">
                                        <span class="text-xs text-muted uppercase block mb-1 font-bold">3. Human Review</span>
                                        <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${wf.review}</div>
                                    </div>
                                    <div class="text-center text-muted leading-none">↓</div>
                                    
                                    <div class="p-3 border border-success rounded transition-colors" style="background: rgba(16,185,129,0.05);" title="${wf.output}">
                                        <span class="text-xs text-success uppercase block mb-1 font-bold">4. Output</span>
                                        <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${wf.output}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">AI Workflow Lab</h2>
                    <p class="text-muted mt-2">Design multi-step AI automation processes.</p>
                </div>
                ${contentHTML}
            `;
        },

        renderProductivity: (container) => {
            const state = window.stateManager.state;
            const data = state.productivityData || { entries: [], totalTimeSaved: 0 };
            const total = data.totalTimeSaved || 0;
            
            let recentEntriesHTML = '';
            if (data.entries && data.entries.length > 0) {
                recentEntriesHTML = `
                    <div class="mt-8 pt-6 border-t border-border w-full">
                        <h4 class="mb-4 text-sm uppercase text-muted font-bold tracking-wider">Recent Logs</h4>
                        <div class="flex flex-col gap-2">
                            ${data.entries.slice(-3).reverse().map(entry => `
                                <div class="flex justify-between items-center p-3 bg-surface border border-border rounded">
                                    <span class="font-medium">${entry.name}</span>
                                    <span class="text-success font-bold">+${entry.saved} min</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="mb-6">
                    <h2 class="page-title">AI Productivity Tracker</h2>
                    <p class="text-muted mt-2">Measure the impact of your AI workflows.</p>
                </div>
                
                <div class="dashboard-grid">
                    <div class="card">
                        <h3 class="mb-4 border-b border-border pb-2">Log a Task</h3>
                        <div class="flex flex-col gap-4">
                            <input type="text" id="prod-task-name" class="btn btn-secondary w-full text-left bg-surface border-border text-main" placeholder="Task Name (e.g. Weekly Report)">
                            <div class="flex gap-4">
                                <div class="w-full">
                                    <label class="text-muted text-sm mb-1 block">Time Before (mins)</label>
                                    <input type="number" id="prod-time-before" class="btn btn-secondary w-full text-left bg-surface border-border text-main" placeholder="60">
                                </div>
                                <div class="w-full">
                                    <label class="text-muted text-sm mb-1 block">Time After (mins)</label>
                                    <input type="number" id="prod-time-after" class="btn btn-secondary w-full text-left bg-surface border-border text-main" placeholder="15">
                                </div>
                            </div>
                            <button class="btn btn-primary w-full mt-2" onclick="if(window.app) window.app.logProductivity()">Log Savings</button>
                        </div>
                    </div>
                    
                    <div class="card flex flex-col items-center justify-center relative overflow-hidden">
                        <div class="absolute" style="top: -20px; right: -20px; font-size: 10rem; opacity: 0.03; pointer-events: none;">⏱️</div>
                        <div class="text-muted text-sm uppercase tracking-wider mb-4 font-bold border-b border-border pb-2 w-full text-center">Total Estimated Time Saved</div>
                        <div class="text-accent flex items-baseline gap-2 mt-4">
                            <span style="font-size: 5rem; font-weight: 800; line-height: 1;">${total}</span>
                        </div>
                        <div class="text-muted mt-2 font-medium">Minutes this month</div>
                        
                        ${recentEntriesHTML}
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
                        <button class="btn btn-secondary w-full" onclick="window.app.showCaseStudy('vendor')">View Study</button>
                    </div>
                    <div class="card">
                        <h3 class="mb-2">Shift Handover</h3>
                        <p class="text-muted text-sm mb-4">Converting messy end-of-shift notes into a structured, actionable SOP.</p>
                        <button class="btn btn-secondary w-full" onclick="window.app.showCaseStudy('shift')">View Study</button>
                    </div>
                    <div class="card">
                        <h3 class="mb-2">Sales Personalization</h3>
                        <p class="text-muted text-sm mb-4">Drafting a quotation cover note tailored to a specific buyer persona.</p>
                        <button class="btn btn-secondary w-full" onclick="window.app.showCaseStudy('sales')">View Study</button>
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
        if (!(window.app instanceof App)) window.app = new App();
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
