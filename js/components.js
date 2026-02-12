// ============================================================
// components.js — Reusable UI Components
// CHANGES: Dynamic sidebar (only shows links for active module),
//          removed renderTabBar (top feature tabs eliminated)
// Dependencies: auth.js, store.js
// ============================================================

const Components = (() => {

    // Define which nav items belong to each module
    const MODULE_NAV = {
        scc: {
            label: 'Security Control Centre',
            icon: 'fa-shield-halved',
            items: [
                { id: 'module-mgmt', label: 'Module Management', icon: 'fa-cubes' },
                { id: 'user-profile', label: 'User Profile Enrichment', icon: 'fa-user-pen' },
                { id: 'role-mgmt', label: 'Security Role Management', icon: 'fa-user-lock' },
                { id: 'user-role-assign', label: 'User Role Assignment', icon: 'fa-users-gear' },
                { id: 'audit-logs', label: 'Audit Logs', icon: 'fa-file-shield' },
            ]
        },
        acc: {
            label: 'Admin Control Centre',
            icon: 'fa-gears',
            items: [
                { id: 'acc-governance', label: 'Governance & Compliance', icon: 'fa-scale-balanced' },
                { id: 'acc-workflows', label: 'Workflow Automation', icon: 'fa-diagram-project' },
                { id: 'acc-analytics', label: 'Analytics & KPIs', icon: 'fa-chart-line' },
                { id: 'acc-deployment', label: 'Deployment & Release', icon: 'fa-rocket' },
            ]
        },
        helpdesk: {
            label: 'Helpdesk',
            icon: 'fa-headset',
            items: [
                { id: 'hd-access-request', label: 'Access Requests', icon: 'fa-key' },
                { id: 'hd-ticketing', label: 'Issue Ticketing', icon: 'fa-ticket' },
                { id: 'hd-knowledge', label: 'Knowledge Base', icon: 'fa-book' },
                { id: 'hd-copilot', label: 'AI Assistant', icon: 'fa-robot' },
            ]
        }
    };

    // ---------- Determine which module a page belongs to ----------
    function getModuleForPage(pageId) {
        for (const [modKey, mod] of Object.entries(MODULE_NAV)) {
            if (mod.items.some(item => item.id === pageId)) return modKey;
        }
        return null; // kernel-dashboard or unknown
    }

    // ---------- Top Navbar ----------
    function renderNavbar(context) {
        const user = Auth.getCurrentUser();
        const initials = Auth.getInitials(user.name);
        const navEl = document.getElementById('top-navbar');
        navEl.className = 'top-nav';

        if (context === 'ecc') {
            navEl.innerHTML = `
                <div class="nav-left">
                    <div class="nav-brand" onclick="Router.navigate('ecc')">
                        <span class="brand-c">C</span><span class="brand-l">L</span><span class="brand-a1">a</span><span class="brand-a2">a</span><span class="brand-s1">S</span><span class="brand-2">2</span><span class="brand-s2">S</span><span class="brand-a3">a</span><span class="brand-a4">a</span><span class="brand-s3">S</span>
                    </div>
                </div>
                <div class="nav-center">
                    <span class="nav-title">Enterprise Control Center</span>
                </div>
                <div class="nav-right">
                    <button class="nav-icon-btn" title="Notifications"><i class="fas fa-bell"></i><span class="badge-dot">3</span></button>
                    <div class="nav-user" onclick="Components.toggleUserMenu()">
                        <span class="user-avatar">${initials}</span>
                        <div class="user-info">
                            <span class="user-name">${user.name}</span>
                            <span class="user-role">${user.role_label}</span>
                        </div>
                    </div>
                    <div id="user-dropdown" class="user-dropdown d-none">
                        <button onclick="Components.handleLogout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
                        <button onclick="Store.resetDB(); location.reload();"><i class="fas fa-database"></i> Reset Data</button>
                    </div>
                </div>
            `;
        } else if (context === 'kernel') {
            navEl.innerHTML = `
                <div class="nav-left">
                    <button class="nav-icon-btn sidebar-toggle" onclick="Components.toggleSidebar()"><i class="fas fa-bars"></i></button>
                    <div class="nav-brand" onclick="Router.navigate('kernel-dashboard')">
                        <span class="brand-c">C</span><span class="brand-l">L</span><span class="brand-a1">a</span><span class="brand-a2">a</span><span class="brand-s1">S</span><span class="brand-2">2</span><span class="brand-s2">S</span><span class="brand-a3">a</span><span class="brand-a4">a</span><span class="brand-s3">S</span>
                    </div>
                    <span class="nav-separator">|</span>
                    <span class="nav-module-name">Kernel Command & Control</span>
                </div>
                <div class="nav-right">
                    <button class="nav-btn-back" onclick="Router.navigate('ecc')" title="Back to ECC"><i class="fas fa-th-large"></i> ECC</button>
                    <button class="nav-icon-btn" title="Notifications"><i class="fas fa-bell"></i><span class="badge-dot">3</span></button>
                    <div class="nav-user" onclick="Components.toggleUserMenu()">
                        <span class="user-avatar">${initials}</span>
                        <div class="user-info">
                            <span class="user-name">${user.name}</span>
                            <span class="user-role">${user.role_label}</span>
                        </div>
                    </div>
                    <div id="user-dropdown" class="user-dropdown d-none">
                        <button onclick="Components.handleLogout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
                        <button onclick="Store.resetDB(); location.reload();"><i class="fas fa-database"></i> Reset Data</button>
                    </div>
                </div>
            `;
        }
    }

    // ---------- Left Sidebar (Dynamic — shows links for active module only) ----------
    function renderSidebar(activeItem) {
        const sidebar = document.getElementById('left-sidebar');
        sidebar.classList.remove('d-none');
        sidebar.className = 'left-sidebar';

        const activeModule = getModuleForPage(activeItem);

        // If on kernel-dashboard, show the 3 module entry points
        if (!activeModule || activeItem === 'kernel-dashboard') {
            sidebar.innerHTML = `
                <div class="sidebar-header">
                    <div class="sidebar-module-title"><i class="fas fa-cube"></i> Kernel App</div>
                    <button class="sidebar-home-btn" onclick="Router.navigate('kernel-dashboard')">
                        <i class="fas fa-house"></i> <span>Dashboard</span>
                    </button>
                </div>
                <nav class="sidebar-nav">
                    ${Object.entries(MODULE_NAV).map(([key, mod]) => `
                        <button class="nav-item-link" onclick="Router.navigate('${mod.items[0].id}')">
                            <i class="fas ${mod.icon}"></i> <span>${mod.label}</span>
                        </button>
                    `).join('')}
                </nav>
            `;
            return;
        }

        // Show only the active module's links
        const mod = MODULE_NAV[activeModule];

        sidebar.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-module-title"><i class="fas ${mod.icon}"></i> ${mod.label}</div>
            </div>
            <nav class="sidebar-nav">
                ${mod.items.map(item => `
                    <button class="nav-item-link ${item.id === activeItem ? 'active' : ''}" onclick="Router.navigate('${item.id}')">
                        <i class="fas ${item.icon}"></i> <span>${item.label}</span>
                    </button>
                `).join('')}
            </nav>
            <button class="sidebar-back-btn" onclick="Router.navigate('kernel-dashboard')">
                <i class="fas fa-arrow-left"></i> <span>Back to Kernel Home</span>
            </button>
        `;
    }

    function hideSidebar() {
        const sidebar = document.getElementById('left-sidebar');
        sidebar.classList.add('d-none');
        sidebar.className = 'left-sidebar d-none';
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('left-sidebar');
        sidebar.classList.toggle('collapsed');
    }

    function toggleUserMenu() {
        const dd = document.getElementById('user-dropdown');
        dd.classList.toggle('d-none');
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!e.target.closest('.nav-user') && !e.target.closest('.user-dropdown')) {
                    dd.classList.add('d-none');
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 10);
    }

    function handleLogout() {
        Auth.logout();
        Router.navigate('login');
    }

    // ---------- Modal ----------
    function showModal(title, bodyHtml, footerHtml, options = {}) {
        const size = options.size || '';
        const container = document.getElementById('modal-container');
        container.innerHTML = `
            <div class="modal-overlay" onclick="Components.closeModal()">
                <div class="modal-box ${size}" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="Components.closeModal()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">${bodyHtml}</div>
                    ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
                </div>
            </div>
        `;
    }

    function closeModal() {
        document.getElementById('modal-container').innerHTML = '';
    }

    // ---------- Toast ----------
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-msg toast-${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ---------- Tab Bar — REMOVED ----------
    // renderTabBar no longer needed since features use sidebar navigation only
    function renderTabBar() { return ''; }

    return {
        renderNavbar, renderSidebar, hideSidebar,
        toggleSidebar, toggleUserMenu,
        handleLogout, showModal, closeModal, showToast, renderTabBar
    };
})();
