// ============================================================
// role-mgmt.js — Security Role Management Page
// Purpose: CRUD for SecurityDB_Security_Role_Permission
// Dependencies: store.js, components.js
// ============================================================

const RoleMgmtPage = (() => {

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('role-mgmt');

        const roles = Store.getAll('role_permissions');
        const modules = Store.getAll('solutions_modules');

        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            ${Components.renderTabBar('role-mgmt')}
            <div class="page-content">
                <div class="page-header">
                    <div>
                        <h1>Security Role Management</h1>
                        <p class="page-subtitle">Manage security roles for solutions and modules</p>
                    </div>
                    <button class="btn-primary" onclick="RoleMgmtPage.showAddModal()">
                        <i class="fas fa-plus"></i> Add New Role
                    </button>
                </div>

                <div class="data-table-wrapper">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search roles by name, code, solution, or module...">
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Solution</th>
                                <th>Module</th>
                                <th>Role Code</th>
                                <th>Role Name</th>
                                <th>Role Type</th>
                                <th>Permissions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${roles.map(r => {
                                const mod = modules.find(m => m.solution_module_id === r.solution_module_id);
                                const solCode = mod ? mod.solution_code : '—';
                                const solName = mod ? mod.solution_name : '';
                                const modCode = mod ? mod.module_code : '—';
                                const modName = mod ? mod.module_name : '';
                                return `
                                    <tr>
                                        <td>${solCode}<br><small class="text-muted">${solName}</small></td>
                                        <td>${modCode}<br><small class="text-muted">${modName}</small></td>
                                        <td><span class="role-badge role-${r.sec_role_code.toLowerCase()}">${r.sec_role_code}</span></td>
                                        <td>${r.sec_role_name}</td>
                                        <td><span class="type-badge ${r.is_system_role ? 'system' : 'custom'}">${r.is_system_role ? 'System' : 'Custom'}</span></td>
                                        <td><button class="btn-manage" onclick="RoleMgmtPage.showPermissionsModal('${r.sec_role_id}')"><i class="fas fa-cog"></i> Manage</button></td>
                                        <td class="actions-cell">
                                            <button class="icon-btn edit" onclick="RoleMgmtPage.showEditModal('${r.sec_role_id}')" title="Edit"><i class="fas fa-pen"></i></button>
                                            <button class="icon-btn delete" onclick="RoleMgmtPage.deleteRole('${r.sec_role_id}')" title="Delete"><i class="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <div class="table-footer">Showing ${roles.length} of ${roles.length} security roles</div>
                </div>
            </div>
        `;
    }

    function showAddModal(prefill = null) {
        const modules = Store.getAll('solutions_modules');
        const solutions = Store.getSolutions();
        const roleCodes = ['ADMIN', 'COLLABORATOR', 'CONTRIBUTOR', 'VIEWER', 'GLOBAL_ADMIN'];
        const r = prefill || {};
        const isEdit = !!prefill;

        const body = `
            <form id="role-form" class="form-grid">
                <div class="form-row">
                    <div class="form-group">
                        <label>Solution *</label>
                        <select id="f-solution" required onchange="RoleMgmtPage.onSolutionFilterChange(this)">
                            <option value="">Select Solution</option>
                            ${solutions.map(s => `<option value="${s.code}" ${r._sol_code === s.code ? 'selected' : ''}>${s.code} - ${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Module *</label>
                        <select id="f-module" required>
                            <option value="">Select Module</option>
                            ${isEdit ? modules.filter(m => m.solution_module_id === r.solution_module_id).map(m => `<option value="${m.solution_module_id}" selected>${m.module_code} - ${m.module_name}</option>`).join('') : ''}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Role Code *</label>
                        <select id="f-role-code" required>
                            <option value="">Select Role Code</option>
                            ${roleCodes.map(c => `<option value="${c}" ${r.sec_role_code === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Role Name *</label>
                        <input type="text" id="f-role-name" required placeholder="e.g., Administrator" value="${r.sec_role_name || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Role Type *</label>
                        <select id="f-role-type">
                            <option value="false" ${r.is_system_role === false ? 'selected' : ''}>Custom Role</option>
                            <option value="true" ${r.is_system_role === true ? 'selected' : ''}>System Role</option>
                        </select>
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn-secondary" onclick="Components.closeModal()">Cancel</button>
            <button class="btn-primary" onclick="RoleMgmtPage.${isEdit ? `updateRole('${r.sec_role_id}')` : 'saveRole()'}">
                ${isEdit ? 'Save Changes' : 'Add Role'}
            </button>
        `;

        Components.showModal(isEdit ? 'Edit Security Role' : 'Add New Security Role', body, footer);
    }

    function showEditModal(id) {
        const role = Store.getById('role_permissions', 'sec_role_id', id);
        if (!role) return;
        const mod = Store.getById('solutions_modules', 'solution_module_id', role.solution_module_id);
        role._sol_code = mod ? mod.solution_code : '';
        showAddModal(role);
    }

    function onSolutionFilterChange(select) {
        const code = select.value;
        const modules = Store.getAll('solutions_modules').filter(m => m.solution_code === code);
        const modSelect = document.getElementById('f-module');
        modSelect.innerHTML = '<option value="">Select Module</option>' +
            modules.map(m => `<option value="${m.solution_module_id}">${m.module_code} - ${m.module_name}</option>`).join('');
    }

    function saveRole() {
        const modId = document.getElementById('f-module').value;
        const roleCode = document.getElementById('f-role-code').value;
        const roleName = document.getElementById('f-role-name').value.trim();

        if (!modId || !roleCode || !roleName) {
            Components.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Default permission flags based on role code
        const perms = getDefaultPerms(roleCode);

        Store.add('role_permissions', {
            sec_role_id: Store.generateId('RP'),
            sec_role_code: roleCode,
            sec_role_name: roleName,
            solution_module_id: modId,
            security_token: 'TKN_' + Store.generateId(''),
            is_system_role: document.getElementById('f-role-type').value === 'true',
            is_active: true,
            ...perms
        });

        Components.closeModal();
        Components.showToast('Role created successfully');
        render();
    }

    function updateRole(id) {
        Store.update('role_permissions', 'sec_role_id', id, {
            solution_module_id: document.getElementById('f-module').value,
            sec_role_code: document.getElementById('f-role-code').value,
            sec_role_name: document.getElementById('f-role-name').value.trim(),
            is_system_role: document.getElementById('f-role-type').value === 'true',
        });

        Components.closeModal();
        Components.showToast('Role updated successfully');
        render();
    }

    function deleteRole(id) {
        if (confirm('Are you sure you want to delete this role?')) {
            Store.remove('role_permissions', 'sec_role_id', id);
            Components.showToast('Role deleted');
            render();
        }
    }

    function getDefaultPerms(code) {
        const map = {
            'VIEWER': { create_permission: false, read_permission: true, update_permission: false, delete_permission: false, view_all_user_data: true, view_all_data_plus_admin_module: false, view_all_data_plus_admin_all: false },
            'CONTRIBUTOR': { create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: false, view_all_data_plus_admin_module: false, view_all_data_plus_admin_all: false },
            'COLLABORATOR': { create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: true, view_all_data_plus_admin_module: false, view_all_data_plus_admin_all: false },
            'ADMIN': { create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: true, view_all_data_plus_admin_module: true, view_all_data_plus_admin_all: false },
            'GLOBAL_ADMIN': { create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: true, view_all_data_plus_admin_module: true, view_all_data_plus_admin_all: true },
        };
        return map[code] || map['VIEWER'];
    }

    // ---------- Permissions Modal ----------
    function showPermissionsModal(roleId) {
        const role = Store.getById('role_permissions', 'sec_role_id', roleId);
        if (!role) return;
        const mod = Store.getById('solutions_modules', 'solution_module_id', role.solution_module_id);

        const check = (val) => val ? '<i class="fas fa-check perm-yes"></i>' : '<i class="fas fa-times perm-no"></i>';

        const body = `
            <div class="permissions-detail">
                <div class="perm-info">
                    <strong>Role Code:</strong> ${role.sec_role_code} &nbsp;|&nbsp;
                    <strong>Module:</strong> ${mod ? mod.module_code + ' - ' + mod.module_name : 'N/A'}
                </div>
                <table class="data-table perm-table">
                    <thead>
                        <tr>
                            <th>Solution/Module</th>
                            <th>Role</th>
                            <th>C</th>
                            <th>R</th>
                            <th>U</th>
                            <th>D</th>
                            <th>All User</th>
                            <th>Module Admin</th>
                            <th>All Admin</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${mod ? mod.solution_code + '<br>' + mod.module_code : '—'}</td>
                            <td>${role.sec_role_name}<br><small>${role.sec_role_code}</small></td>
                            <td>${check(role.create_permission)}</td>
                            <td>${check(role.read_permission)}</td>
                            <td>${check(role.update_permission)}</td>
                            <td>${check(role.delete_permission)}</td>
                            <td>${check(role.view_all_user_data)}</td>
                            <td>${check(role.view_all_data_plus_admin_module)}</td>
                            <td>${check(role.view_all_data_plus_admin_all)}</td>
                            <td><span class="status-badge ${role.is_active ? 'active' : 'inactive'}">${role.is_active ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        Components.showModal(`Manage Permissions for: ${role.sec_role_name}`, body, '', { size: 'modal-lg' });
    }

    return { render, showAddModal, showEditModal, onSolutionFilterChange, saveRole, updateRole, deleteRole, showPermissionsModal };
})();
