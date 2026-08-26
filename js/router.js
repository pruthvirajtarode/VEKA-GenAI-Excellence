/**
 * VEKA GenAI Excellence - Router
 * Handles hash-based routing and view rendering
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.viewContainer = document.getElementById('view-container');
        
        window.addEventListener('hashchange', this.handleRoute.bind(this));
        
        // Add click listener for internal links to close sidebar on mobile
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) sidebar.classList.remove('open');
                }
            }
        });
    }

    addRoute(path, viewFunction, onLeaveFunction = null) {
        this.routes[path] = {
            render: viewFunction,
            onLeave: onLeaveFunction
        };
    }

    init(defaultRoute = '/dashboard') {
        if (!window.location.hash) {
            window.location.hash = defaultRoute;
        } else {
            this.handleRoute();
        }
    }

    handleRoute() {
        const path = window.location.hash.slice(1) || '/dashboard';
        
        // Call onLeave of current route if exists
        if (this.currentRoute && this.routes[this.currentRoute] && this.routes[this.currentRoute].onLeave) {
            this.routes[this.currentRoute].onLeave();
        }

        const routeData = this.routes[path];
        
        // Update navigation active state
        this.updateNavActiveState(path);
        
        if (routeData) {
            // Update Title
            const link = document.querySelector(`.nav-link[data-route="${path.substring(1)}"]`);
            const titleEl = document.getElementById('topbar-title');
            if (titleEl) {
                titleEl.textContent = link ? link.textContent.trim() : 'VEKA GenAI Excellence';
            }
            
            // Render View
            this.viewContainer.innerHTML = ''; // Clear container
            this.viewContainer.className = 'view-container'; // Reset classes
            
            // Call the render function which builds the DOM elements and appends them
            routeData.render(this.viewContainer);
            this.currentRoute = path;
            
            // Scroll to top
            this.viewContainer.scrollTop = 0;
            window.scrollTo(0, 0);
            
            // Re-bind common components in the new view
            if (window.app && window.app.bindCommonComponents) {
                window.app.bindCommonComponents();
            }
        } else {
            // 404
            this.render404(path);
        }
    }

    updateNavActiveState(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const routeName = path.substring(1); // remove leading slash
        const activeLink = document.querySelector(`.nav-link[data-route="${routeName}"]`);
        
        if (activeLink) {
            activeLink.classList.add('active');
            
            // Check if trainer mode is required for this link
            const isTrainerLink = activeLink.closest('.trainer-only');
            if (isTrainerLink && window.stateManager && !window.stateManager.get('trainer.trainerMode')) {
                // If it's a trainer link but trainer mode is off, redirect to dashboard
                window.location.hash = '/dashboard';
            }
        }
    }

    render404(path) {
        const titleEl = document.getElementById('topbar-title');
        if (titleEl) titleEl.textContent = 'Page Not Found';
        
        this.viewContainer.innerHTML = `
            <div class="card" style="text-align: center; padding: 4rem 2rem;">
                <h2>404 - Not Found</h2>
                <p class="text-muted mt-4 mb-8">The requested path '${path}' does not exist.</p>
                <button class="btn btn-primary" onclick="window.location.hash='/dashboard'">Return to Dashboard</button>
            </div>
        `;
    }
}

// Global instance
window.router = new Router();
