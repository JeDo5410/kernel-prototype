// ============================================================
// user-role-assign.js — Security User Role Assignment Page
// Purpose: CRUD for SecurityDB_Security_User_Role
// Dependencies: store.js, components.js
// ============================================================

const UserRoleAssignPage = (() => {
    let activeFilter = 'all';

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('user-role-assign');

        let assignments = Store.getAll('user_roles');
        if (activeFilter === 'active') assignments = assignments.filter(a => a.is_active);
        if (activeFilter === 'inactive') assignments = assignments.filter(a => !a.is_active);

        const modules = Store.getAll('solutions_modules');
        const roles = Store.getAll('role_permissions');
        const currentUser = Auth.getCurrentUser();

        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            ${Components.renderTabBar('user-role-assign')}
            <div class="page-content">
                <div class="page-header">
                    <div>
                        <h1>Security User Role Assignment</h1>
                        <p class="page-subtitle">Assign security roles to users for specific solutions and modules</p>
                    </div>
                    <button class="btn-primary" onclick="UserRoleAssignPage.showAssignModal()">
                        <i class="fas fa-plus"></i> Assign Role to User
                    </button>
                </div>

                <div class="data-table-wrapper">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search by user, role, solution, module, reason, or assigned by...">
                    </div>

                    <div class="filter-tabs">
                        <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="UserRoleAssignPage.setFilter('all')"><i class="fas fa-list"></i> All Assignments</button>
                        <button class="filter-btn ${activeFilter === 'active' ? 'active' : ''}" onclick="UserRoleAssignPage.setFilter('active')"><i class="fas fa-circle-check"></i> Active</button>
                        <button class="filter-btn ${activeFilter === 'inactive' ? 'active' : ''}" onclick="UserRoleAssignPage.setFilter('inactive')"><i class="fas fa-circle-xmark"></i> Inactive</button>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Actions</th>
                                <th>User</th>
                                <th>Solution/Module</th>
                                <th>Role</th>
                                <th>Assigned Date</th>
                                <th>Disable Date</th>
                                <th>Assigned By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${assignments.map(a => {
                                const mod = modules.find(m => m.solution_module_id === a.solution_module_id);
                                const role = roles.find(r => r.sec_role_id === a.sec_role_id);
                                const user = Store.getById('security_users', 'entra_email_id', a.entra_email_id);
                                return `
                                    <tr>
                                        <td class="actions-cell">
                                            <button class="icon-btn edit" onclick="UserRoleAssignPage.showEditModal('${a.id}')" title="Edit"><i class="fas fa-pen"></i></button>
                                            <button class="icon-btn delete" onclick="UserRoleAssignPage.deleteAssignment('${a.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                                        </td>
                                        <td>
                                            <strong>${user ? user.display_name : a.entra_email_id}</strong><br>
                                            <small class="text-muted">${a.entra_email_id}</small>
                                        </td>
                                        <td>
                                            ${mod ? mod.solution_code : '—'}<br>
                                            <small class="text-muted">${mod ? mod.module_code : ''}</small>
                                        </td>
                                        <td>
                                            <span class="role-badge role-${role ? role.sec_role_code.toLowerCase() : ''}">${role ? role.sec_role_code : '—'}</span><br>
                                            <small>${role ? role.sec_role_name : ''}</small>
                                        </td>
                                        <td><i class="fas fa-calendar"></i> ${formatDate(a.assigned_date)}</td>
                                        <td>${a.disabled_date ? '<span class="text-danger"><i class="fas fa-calendar"></i> ' + formatDate(a.disabled_date) + '</span>' : '—'}</td>
                                        <td>${a.assigned_by_name || '—'}</td>
                                        <td><span class="status-badge ${a.is_active ? 'active' : 'inactive'}">${a.is_active ? 'Active' : 'Inactive'}</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <div class="table-footer">Showing ${assignments.length} of ${Store.getAll('user_roles').length} user role assignments</div>
                </div>
            </div>
        `;
    }

    function setFilter(f) {
        activeFilter = f;
        render();
    }

    function showAssignModal(prefill = null) {
        const users = Store.getAll('security_users');
        const solutions = Store.getSolutions();
        const currentUser = Auth.getCurrentUser();
        const a = prefill || {};
        const isEdit = !!prefill;

        const now = new Date();
        const nowStr = now.toISOString().slice(0, 16).replace('T', ' ');

        const body = `
            <form id="assign-form" class="form-grid">
                <div class="form-group full-width">
                    <label>User *</label>
                    <select id="f-assign-user" required ${isEdit ? 'disabled' : ''}>
                        <option value="">Select User</option>
                        ${users.map(u => `<option value="${u.entra_email_id}" ${a.entra_email_id === u.entra_email_id ? 'selected' : ''}>${u.display_name} (${u.entra_email_id})</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Solution *</label>
                        <select id="f-assign-solution" required onchange="UserRoleAssignPage.onSolChange(this)">
                            <option value="">Select Solution</option>
                            ${solutions.map(s => `<option value="${s.code}">${s.code} - ${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Module *</label>
                        <select id="f-assign-module" required onchange="UserRoleAssignPage.onModChange(this)">
                            <option value="">Select Module</option>
                        </select>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Security Role *</label>
                    <select id="f-assign-role" required>
                        <option value="">Select Role</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Assignment Date *</label>
                        <input type="text" id="f-assign-date" value="${isEdit ? formatDate(a.assigned_date) : nowStr}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Assigned By</label>
                        <input type="text" id="f-assign-by" value="${currentUser.name}" readonly>
                        <small class="text-muted">${currentUser.email}</small>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status *</label>
                        <select id="f-assign-status">
                            <option value="true" ${a.is_active !== false ? 'selected' : ''}>Active</option>
                            <option value="false" ${a.is_active === false ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Reason for Assignment *</label>
                    <textarea id="f-assign-reason" rows="3" placeholder="Explain why this role is being assigned to this user..." maxlength="255">${a.reason || ''}</textarea>
                    <small class="char-count">0/255 characters</small>
                </div>
                <div class="form-group full-width">
                    <label>Disable Date</label>
                    <input type="datetime-local" id="f-assign-disable" value="${a.disabled_date || ''}">
                    <small class="text-muted">Optional: Specify a future date when this role assignment should be disabled</small>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn-secondary" onclick="Components.closeModal()">Cancel</button>
            <button class="btn-primary" onclick="UserRoleAssignPage.${isEdit ? `updateAssignment('${a.id}')` : 'saveAssignment()'}">
                ${isEdit ? 'Save Changes' : 'Assign Role'}
            </button>
        `;

        Components.showModal(isEdit ? 'Edit Role Assignment' : 'Assign Role to User', body, footer);
    }

    function showEditModal(id) {
        const assignment = Store.getById('user_roles', 'id', id);
        if (assignment) showAssignModal(assignment);
    }

    function onSolChange(select) {
        const code = select.value;
        const modules = Store.getAll('solutions_modules').filter(m => m.solution_code === code);
        const modSelect = document.getElementById('f-assign-module');
        modSelect.innerHTML = '<option value="">Select Module</option>' +
            modules.map(m => `<option value="${m.solution_module_id}">${m.module_code} - ${m.module_name}</option>`).join('');
        document.getElementById('f-assign-role').innerHTML = '<option value="">Select Role</option>';
    }

    function onModChange(select) {
        const modId = select.value;
        const roles = Store.getAll('role_permissions').filter(r => r.solution_module_id === modId && r.is_active);
        const roleSelect = document.getElementById('f-assign-role');
        roleSelect.innerHTML = '<option value="">Select Role</option>' +
            roles.map(r => `<option value="${r.sec_role_id}">${r.sec_role_code} - ${r.sec_role_name}</option>`).join('');
    }

    function saveAssignment() {
        const email = document.getElementById('f-assign-user').value;
        const modId = document.getElementById('f-assign-module').value;
        const roleId = document.getElementById('f-assign-role').value;
        const reason = document.getElementById('f-assign-reason').value.trim();
        const currentUser = Auth.getCurrentUser();

        if (!email || !modId || !roleId || !reason) {
            Components.showToast('Please fill in all required fields', 'error');
            return;
        }

        Store.add('user_roles', {
            id: Store.generateId('UR'),
            entra_email_id: email,
            solution_module_id: modId,
            sec_role_id: roleId,
            assigned_date: new Date().toISOString(),
            assigned_by_user_id: currentUser.email,
            assigned_by_name: currentUser.name,
            reason: reason,
            is_active: document.getElementById('f-assign-status').value === 'true',
            disabled_date: document.getElementById('f-assign-disable').value || null
        });

        // Log the action
        Store.logAction({
            audit_session_id: '',
            entra_email_id: currentUser.email,
            solution_module_id: modId,
            action_name: 'RoleAssignment',
            permission_code: 'ROLE_ASSIGN',
            action_status: 'Success',
            additional_info: `Assigned role ${roleId} to ${email}`
        });

        Components.closeModal();
        Components.showToast('Role assigned successfully');
        render();
    }

    function updateAssignment(id) {
        Store.update('user_roles', 'id', id, {
            is_active: document.getElementById('f-assign-status').value === 'true',
            reason: document.getElementById('f-assign-reason').value.trim(),
            disabled_date: document.getElementById('f-assign-disable').value || null
        });

        Components.closeModal();
        Components.showToast('Assignment updated');
        render();
    }

    function deleteAssignment(id) {
        if (confirm('Are you sure you want to delete this assignment?')) {
            Store.remove('user_roles', 'id', id);
            Components.showToast('Assignment deleted');
            render();
        }
    }

    function formatDate(isoStr) {
        if (!isoStr) return '—';
        const d = new Date(isoStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' +
               d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return { render, setFilter, showAssignModal, showEditModal, onSolChange, onModChange, saveAssignment, updateAssignment, deleteAssignment };
})();
