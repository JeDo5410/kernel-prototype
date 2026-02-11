// ============================================================
// module-mgmt.js — Module Management Page
// Purpose: CRUD for SecurityDB_Solution_Module
// Dependencies: store.js, components.js
// ============================================================

const ModuleMgmtPage = (() => {

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('module-mgmt');

        const modules = Store.getAll('solutions_modules');
        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            ${Components.renderTabBar('module-mgmt')}
            <div class="page-content">
                <div class="page-header">
                    <div>
                        <h1>Module Management System</h1>
                        <p class="page-subtitle">Manage your solutions and modules</p>
                    </div>
                    <button class="btn-primary" onclick="ModuleMgmtPage.showAddModal()">
                        <i class="fas fa-plus"></i> Add New Module
                    </button>
                </div>

                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Solution Code</th>
                                <th>Solution Name</th>
                                <th>Module Code</th>
                                <th>Module Name</th>
                                <th>Description</th>
                                <th>Module Lead</th>
                                <th>Version</th>
                                <th>Documentation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${modules.map(m => `
                                <tr>
                                    <td><span class="code-badge">${m.solution_code}</span></td>
                                    <td>${m.solution_name}</td>
                                    <td><span class="code-badge module-code">${m.module_code}</span></td>
                                    <td><strong>${m.module_name}</strong></td>
                                    <td class="desc-cell">${m.description.substring(0, 40)}...</td>
                                    <td>${m.module_lead || '-'}</td>
                                    <td><span class="version-badge">${m.module_version}</span></td>
                                    <td>${m.documentation_url ? '<a href="#" class="link-btn"><i class="fas fa-external-link-alt"></i> View</a>' : '-'}</td>
                                    <td class="actions-cell">
                                        <button class="icon-btn edit" onclick="ModuleMgmtPage.showEditModal('${m.solution_module_id}')" title="Edit"><i class="fas fa-pen"></i></button>
                                        <button class="icon-btn delete" onclick="ModuleMgmtPage.deleteModule('${m.solution_module_id}')" title="Delete"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="table-footer">Showing ${modules.length} of ${modules.length} modules</div>
                </div>
            </div>
        `;
    }

    function showAddModal() {
        const solutions = [
            { code: 'ADC', name: 'Adaptive CLaaS' },
            { code: 'AIW', name: 'Agentic Intelligent Workplace' },
            { code: 'ACM', name: 'Agentic CRM & Marketer' },
            { code: 'AES', name: 'Agentic ERP & Shared Services' },
        ];

        const body = `
            <form id="module-form" class="form-grid">
                <div class="form-row">
                    <div class="form-group">
                        <label>Solution Code *</label>
                        <select id="f-sol-code" required onchange="ModuleMgmtPage.onSolutionChange(this)">
                            <option value="">Select Solution Code</option>
                            ${solutions.map(s => `<option value="${s.code}" data-name="${s.name}">${s.code}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Solution Name *</label>
                        <input type="text" id="f-sol-name" readonly placeholder="Auto-filled">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Module Code *</label>
                        <input type="text" id="f-mod-code" required placeholder="e.g., AGNT_HR">
                    </div>
                    <div class="form-group">
                        <label>Module Name *</label>
                        <input type="text" id="f-mod-name" required placeholder="e.g., Agentic HR">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Module Version *</label>
                        <input type="text" id="f-mod-version" placeholder="e.g., v1.0.0">
                    </div>
                    <div class="form-group">
                        <label>Module Lead <span class="optional">(optional)</span></label>
                        <input type="text" id="f-mod-lead" placeholder="Enter module lead name">
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Description *</label>
                    <textarea id="f-mod-desc" rows="3" required placeholder="Enter module description" maxlength="255"></textarea>
                    <span class="char-count">0/255</span>
                </div>
                <div class="form-group full-width">
                    <label>Documentation URL</label>
                    <input type="url" id="f-mod-url" placeholder="https://docs.example.com/module">
                </div>
            </form>
        `;

        const footer = `
            <button class="btn-secondary" onclick="Components.closeModal()">Cancel</button>
            <button class="btn-primary" onclick="ModuleMgmtPage.saveModule()">Add Module</button>
        `;

        Components.showModal('Add New Module', body, footer);

        // Char counter
        document.getElementById('f-mod-desc').addEventListener('input', function() {
            this.nextElementSibling.textContent = this.value.length + '/255';
        });
    }

    function showEditModal(id) {
        const m = Store.getById('solutions_modules', 'solution_module_id', id);
        if (!m) return;

        showAddModal();
        // Pre-fill fields after modal renders
        setTimeout(() => {
            document.getElementById('f-sol-code').value = m.solution_code;
            document.getElementById('f-sol-name').value = m.solution_name;
            document.getElementById('f-mod-code').value = m.module_code;
            document.getElementById('f-mod-name').value = m.module_name;
            document.getElementById('f-mod-version').value = m.module_version;
            document.getElementById('f-mod-lead').value = m.module_lead || '';
            document.getElementById('f-mod-desc').value = m.description;
            document.getElementById('f-mod-url').value = m.documentation_url || '';

            // Change modal title and button
            document.querySelector('.modal-header h3').textContent = 'Edit Module';
            const saveBtn = document.querySelector('.modal-footer .btn-primary');
            saveBtn.textContent = 'Save Changes';
            saveBtn.onclick = () => ModuleMgmtPage.updateModule(id);
        }, 50);
    }

    function onSolutionChange(select) {
        const option = select.options[select.selectedIndex];
        document.getElementById('f-sol-name').value = option.dataset.name || '';
    }

    function saveModule() {
        const solCode = document.getElementById('f-sol-code').value;
        const solName = document.getElementById('f-sol-name').value;
        const modCode = document.getElementById('f-mod-code').value.trim();
        const modName = document.getElementById('f-mod-name').value.trim();
        const modVersion = document.getElementById('f-mod-version').value.trim();

        if (!solCode || !modCode || !modName) {
            Components.showToast('Please fill in all required fields', 'error');
            return;
        }

        Store.add('solutions_modules', {
            solution_module_id: Store.generateId('SM'),
            solution_code: solCode,
            solution_name: solName,
            module_code: modCode,
            module_name: modName,
            description: document.getElementById('f-mod-desc').value,
            module_lead: document.getElementById('f-mod-lead').value,
            documentation_url: document.getElementById('f-mod-url').value,
            module_version: modVersion || 'v1.0.0',
            is_active: true
        });

        Components.closeModal();
        Components.showToast('Module added successfully');
        render();
    }

    function updateModule(id) {
        Store.update('solutions_modules', 'solution_module_id', id, {
            solution_code: document.getElementById('f-sol-code').value,
            solution_name: document.getElementById('f-sol-name').value,
            module_code: document.getElementById('f-mod-code').value.trim(),
            module_name: document.getElementById('f-mod-name').value.trim(),
            description: document.getElementById('f-mod-desc').value,
            module_lead: document.getElementById('f-mod-lead').value,
            documentation_url: document.getElementById('f-mod-url').value,
            module_version: document.getElementById('f-mod-version').value.trim(),
        });

        Components.closeModal();
        Components.showToast('Module updated successfully');
        render();
    }

    function deleteModule(id) {
        if (confirm('Are you sure you want to delete this module?')) {
            Store.remove('solutions_modules', 'solution_module_id', id);
            Components.showToast('Module deleted');
            render();
        }
    }

    return { render, showAddModal, showEditModal, onSolutionChange, saveModule, updateModule, deleteModule };
})();
