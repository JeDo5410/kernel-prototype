// ============================================================
// dashboard.js — Kernel App Dashboard
// Purpose: Landing page for Kernel App with 3 sub-module cards
// Dependencies: components.js, auth.js
// ============================================================

const DashboardPage = (() => {

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('kernel-dashboard');

        const center = document.getElementById('center-stage');
        center.className = 'center-stage kernel-dashboard';

        center.innerHTML = `
            <div class="dashboard-content">
                <h1 class="dashboard-title">Kernel Apps</h1>
                <p class="dashboard-desc">Centralized management platform for security, administration, and support operations. Select a module below to access specialized controls and monitoring.</p>

                <div class="dashboard-cards">
                    <div class="dashboard-card scc-card" onclick="Router.navigate('scc-dashboard')">
                        <div class="card-accent scc-accent"></div>
                        <div class="card-icon"><i class="fas fa-shield-halved"></i></div>
                        <h2>Security Control Centre</h2>
                        <p>Multi-tenant security monitoring, threat detection, and compliance management</p>
                    </div>

                    <div class="dashboard-card acc-card" onclick="Router.navigate('acc-governance')">
                        <div class="card-accent acc-accent"></div>
                        <div class="card-icon"><i class="fas fa-gears"></i></div>
                        <h2>Admin Control Centre</h2>
                        <p>System administration, API integrations, user management, and configuration</p>
                    </div>

                    <div class="dashboard-card hd-card" onclick="Router.navigate('hd-access-request')">
                        <div class="card-accent hd-accent"></div>
                        <div class="card-icon"><i class="fas fa-headset"></i></div>
                        <h2>Helpdesk</h2>
                        <p>Ticket management, knowledge base, user guides, and support resources</p>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-number">${Store.getAll('security_users').length}</div>
                        <div class="stat-label">Registered Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Store.getAll('solutions_modules').length}</div>
                        <div class="stat-label">Modules</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Store.getAll('role_permissions').length}</div>
                        <div class="stat-label">Active Roles</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Store.getAll('user_roles').filter(r => r.is_active).length}</div>
                        <div class="stat-label">Role Assignments</div>
                    </div>
                </div>
            </div>
        `;
    }

    return { render };
})();
