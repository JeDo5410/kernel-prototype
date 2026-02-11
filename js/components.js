// ============================================================
// components.js — Reusable UI Components
// Purpose: Renders navbar, sidebar, modals, toasts
// Dependencies: auth.js, store.js
// ============================================================

const Components = (() => {

    // ---------- Top Navbar ----------
    function renderNavbar(context) {
        // context: 'ecc' | 'kernel'
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
                    <div class="nav-brand" onclick="Router.navigate('ecc')">
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

    // ---------- Left Sidebar (Kernel App) ----------
    function renderSidebar(activeItem) {
        const sidebar = document.getElementById('left-sidebar');
        sidebar.classList.remove('d-none');
        sidebar.className = 'left-sidebar';

        const navItems = [
            {
                id: 'scc', label: 'Security Control Centre', icon: 'fa-shield-halved',
                children: [
                    { id: 'module-mgmt', label: 'Module Management', icon: 'fa-cubes' },
                    { id: 'user-profile', label: 'User Profile Enrichment', icon: 'fa-user-pen' },
                    { id: 'role-mgmt', label: 'Security Role Management', icon: 'fa-user-lock' },
                    { id: 'user-role-assign', label: 'User Role Assignment', icon: 'fa-users-gear' },
                    { id: 'audit-logs', label: 'Audit Logs', icon: 'fa-file-shield' },
                ]
            },
            {
                id: 'acc', label: 'Admin Control Centre', icon: 'fa-gears',
                children: [
                    { id: 'acc-governance', label: 'Governance & Compliance', icon: 'fa-scale-balanced' },
                    { id: 'acc-workflows', label: 'Workflow Automation', icon: 'fa-diagram-project' },
                    { id: 'acc-analytics', label: 'Analytics & KPIs', icon: 'fa-chart-line' },
                    { id: 'acc-deployment', label: 'Deployment & Release', icon: 'fa-rocket' },
                ]
            },
            {
                id: 'helpdesk', label: 'Helpdesk', icon: 'fa-headset',
                children: [
                    { id: 'hd-access-request', label: 'Access Requests', icon: 'fa-key' },
                    { id: 'hd-ticketing', label: 'Issue Ticketing', icon: 'fa-ticket' },
                    { id: 'hd-knowledge', label: 'Knowledge Base', icon: 'fa-book' },
                    { id: 'hd-copilot', label: 'AI Assistant', icon: 'fa-robot' },
                ]
            }
        ];

        // Determine which parent is expanded
        let activeParent = '';
        navItems.forEach(parent => {
            if (parent.id === activeItem) activeParent = parent.id;
            parent.children.forEach(child => {
                if (child.id === activeItem) activeParent = parent.id;
            });
        });

        let html = `
            <div class="sidebar-header">
                <button class="sidebar-home-btn" onclick="Router.navigate('kernel-dashboard')">
                    <i class="fas fa-house"></i> <span>Kernel Home</span>
                </button>
            </div>
            <nav class="sidebar-nav">
        `;

        navItems.forEach(parent => {
            const isExpanded = activeParent === parent.id;
            const isParentActive = parent.id === activeItem;

            html += `
                <div class="nav-group ${isExpanded ? 'expanded' : ''}">
                    <button class="nav-parent ${isParentActive ? 'active' : ''}" onclick="Components.toggleNavGroup(this, '${parent.id}')">
                        <i class="fas ${parent.icon}"></i>
                        <span>${parent.label}</span>
                        <i class="fas fa-chevron-right nav-arrow"></i>
                    </button>
                    <div class="nav-children" style="${isExpanded ? '' : 'display:none'}">
            `;

            parent.children.forEach(child => {
                const isChildActive = child.id === activeItem;
                html += `
                    <button class="nav-child ${isChildActive ? 'active' : ''}" onclick="Router.navigate('${child.id}')">
                        <i class="fas ${child.icon}"></i>
                        <span>${child.label}</span>
                    </button>
                `;
            });

            html += `</div></div>`;
        });

        html += `</nav>`;
        sidebar.innerHTML = html;
    }

    function hideSidebar() {
        const sidebar = document.getElementById('left-sidebar');
        sidebar.classList.add('d-none');
        sidebar.className = 'left-sidebar d-none';
    }

    function toggleNavGroup(btn, parentId) {
        const group = btn.closest('.nav-group');
        const children = group.querySelector('.nav-children');
        const isExpanded = group.classList.contains('expanded');

        if (isExpanded) {
            group.classList.remove('expanded');
            children.style.display = 'none';
        } else {
            group.classList.add('expanded');
            children.style.display = 'block';
        }
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('left-sidebar');
        sidebar.classList.toggle('collapsed');
    }

    function toggleUserMenu() {
        const dd = document.getElementById('user-dropdown');
        dd.classList.toggle('d-none');

        // Close on outside click
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
        const size = options.size || ''; // 'modal-lg', 'modal-xl'
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

    // ---------- Tab Bar (for SCC feature pages) ----------
    function renderTabBar(activeTab) {
        const tabs = [
            { id: 'module-mgmt', label: 'Module Management', icon: 'fa-cubes' },
            { id: 'user-profile', label: 'User Profile Enrichment', icon: 'fa-user-pen' },
            { id: 'role-mgmt', label: 'Security Role Management', icon: 'fa-user-lock' },
            { id: 'user-role-assign', label: 'User Role Assignment', icon: 'fa-users-gear' },
            { id: 'audit-logs', label: 'Audit Logs', icon: 'fa-file-shield' },
        ];

        return `
            <div class="tab-bar">
                ${tabs.map(t => `
                    <button class="tab-btn ${t.id === activeTab ? 'active' : ''}" onclick="Router.navigate('${t.id}')">
                        <i class="fas ${t.icon}"></i> ${t.label}
                    </button>
                `).join('')}
            </div>
        `;
    }

    return {
        renderNavbar, renderSidebar, hideSidebar,
        toggleNavGroup, toggleSidebar, toggleUserMenu,
        handleLogout, showModal, closeModal, showToast, renderTabBar
    };
})();
