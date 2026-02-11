// ============================================================
// ecc.js — Enterprise Control Center Landing Page
// Purpose: Shows solutions nav + module cards grid
// Dependencies: store.js, auth.js, components.js
// ============================================================

const ECCPage = (() => {
    let activeFilter = 'all';

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.hideSidebar();
        Components.renderNavbar('ecc');

        const solutions = Store.getSolutions();
        const allModules = Store.getAll('solutions_modules');
        const filtered = activeFilter === 'all'
            ? allModules
            : allModules.filter(m => m.solution_code === activeFilter);

        const center = document.getElementById('center-stage');
        center.className = 'center-stage ecc-page';

        center.innerHTML = `
            <div class="ecc-layout">
                <!-- Left solution filter nav -->
                <div class="ecc-sidebar">
                    <button class="ecc-filter-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="ECCPage.filter('all')">
                        <i class="fas fa-house"></i> Home
                    </button>
                    ${solutions.map(s => `
                        <button class="ecc-filter-btn ${activeFilter === s.code ? 'active' : ''}" onclick="ECCPage.filter('${s.code}')">
                            <i class="fas fa-folder"></i> ${s.name}
                        </button>
                    `).join('')}
                </div>

                <!-- Main content area -->
                <div class="ecc-main">
                    <div class="ecc-header">
                        <h1>Welcome to Security Control Centre</h1>
                        <p>Centralized role-based management for <strong>CLaaS<span class="gold">2</span>SaaS</strong></p>
                    </div>

                    <div class="ecc-search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search modules..." oninput="ECCPage.search(this.value)">
                        <span class="ecc-user-badge"><i class="fas fa-user"></i> ${Auth.getCurrentUser().role_label}</span>
                    </div>

                    <div class="ecc-modules-grid" id="ecc-modules-grid">
                        ${renderModuleCards(filtered)}
                    </div>
                </div>
            </div>
        `;
    }

    function renderModuleCards(modules) {
        return modules.map(m => {
            const isKernel = m.module_code === 'KNL';
            return `
                <div class="ecc-module-card ${isKernel ? 'kernel-card' : ''}" onclick="${isKernel ? "Router.navigate('kernel-dashboard')" : 'void(0)'}">
                    <div class="module-card-logo">
                        <span class="brand-c">C</span><span class="brand-l">L</span><span class="brand-a1">a</span><span class="brand-a2">a</span><span class="brand-s1">S</span><span class="brand-2">2</span><span class="brand-s2">S</span><span class="brand-a3">a</span><span class="brand-a4">a</span><span class="brand-s3">S</span>
                    </div>
                    <div class="module-card-name">${m.module_name}</div>
                    ${isKernel ? '<span class="module-card-badge">Open</span>' : '<span class="module-card-badge locked"><i class="fas fa-lock"></i></span>'}
                </div>
            `;
        }).join('');
    }

    function filter(code) {
        activeFilter = code;
        render();
    }

    function search(query) {
        const allModules = Store.getAll('solutions_modules');
        const q = query.toLowerCase();
        const filtered = allModules.filter(m =>
            m.module_name.toLowerCase().includes(q) ||
            m.solution_name.toLowerCase().includes(q) ||
            m.module_code.toLowerCase().includes(q)
        );
        document.getElementById('ecc-modules-grid').innerHTML = renderModuleCards(filtered);
    }

    return { render, filter, search };
})();
