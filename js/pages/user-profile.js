// ============================================================
// user-profile.js — User Profile Enrichment Page
// Purpose: CRUD for OrganizationDB_Security_User
// Dependencies: store.js, components.js
// ============================================================

const UserProfilePage = (() => {
    let searchQuery = '';

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('user-profile');

        let users = Store.getAll('security_users');
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            users = users.filter(u =>
                u.display_name.toLowerCase().includes(q) ||
                u.entra_email_id.toLowerCase().includes(q) ||
                u.org_role.toLowerCase().includes(q) ||
                (u.manager_name || '').toLowerCase().includes(q)
            );
        }

        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            ${Components.renderTabBar('user-profile')}
            <div class="page-content">
                <div class="page-header">
                    <div>
                        <h1>User Profile Enrichment</h1>
                        <p class="page-subtitle">Manage user profiles and access control</p>
                    </div>
                    <button class="btn-primary" onclick="UserProfilePage.showAddModal()">
                        <i class="fas fa-plus"></i> Add New User
                    </button>
                </div>

                <div class="data-table-wrapper">
                    <div class="table-toolbar">
                        <div class="table-title">User Listing</div>
                        <span class="table-count">${users.length} users found</span>
                    </div>
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search by name, email, role, manager, or Entra ID..." value="${searchQuery}" oninput="UserProfilePage.handleSearch(this.value)">
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Entra Email Id</th>
                                <th>Display Name</th>
                                <th>Organizational Role</th>
                                <th>Manager</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(u => `
                                <tr>
                                    <td class="email-cell">${u.entra_email_id}</td>
                                    <td><strong>${u.display_name}</strong></td>
                                    <td>${u.org_role}</td>
                                    <td>${u.manager_name || '-'}</td>
                                    <td><span class="status-badge ${u.is_active ? 'active' : 'inactive'}">${u.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td class="actions-cell">
                                        <button class="icon-btn edit" onclick="UserProfilePage.showEditModal('${u.user_id}')" title="Edit"><i class="fas fa-pen"></i></button>
                                        <button class="icon-btn delete" onclick="UserProfilePage.deleteUser('${u.user_id}')" title="Delete"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="table-footer">Showing ${users.length} of ${Store.getAll('security_users').length} total users</div>
                </div>
            </div>
        `;
    }

    function handleSearch(value) {
        searchQuery = value;
        // Re-render only the table body for efficiency
        render();
    }

    function showAddModal(prefill = null) {
        const orgRoles = ['Senior Developer', 'Project Manager', 'UX Designer', 'DevOps Engineer', 'Platform Director', 'Product Manager', 'QA Analyst', 'Business Analyst', 'AI Engineer', 'Technology Associate'];

        const u = prefill || {};
        const isEdit = !!prefill;

        const body = `
            <form id="user-form" class="form-grid">
                <div class="form-row">
                    <div class="form-group">
                        <label>Entra Email ID *</label>
                        <input type="email" id="f-email" required placeholder="john.doe@lithan.com" value="${u.entra_email_id || ''}" ${isEdit ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label>Display Name *</label>
                        <input type="text" id="f-display-name" required placeholder="John Doe" value="${u.display_name || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Organizational Role *</label>
                        <select id="f-org-role" required>
                            <option value="">Select Organizational Role</option>
                            ${orgRoles.map(r => `<option value="${r}" ${u.org_role === r ? 'selected' : ''}>${r}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Manager</label>
                        <input type="text" id="f-manager" placeholder="Manager Name" value="${u.manager_name || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Account Status *</label>
                        <select id="f-status">
                            <option value="true" ${u.is_active !== false ? 'selected' : ''}>Active</option>
                            <option value="false" ${u.is_active === false ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn-secondary" onclick="Components.closeModal()">Cancel</button>
            <button class="btn-primary" onclick="UserProfilePage.${isEdit ? `updateUser('${u.user_id}')` : 'saveUser()'}">${isEdit ? 'Save Changes' : 'Add User'}</button>
        `;

        Components.showModal(isEdit ? 'Edit User Profile' : 'Add New User', body, footer);
    }

    function showEditModal(id) {
        const user = Store.getById('security_users', 'user_id', id);
        if (user) showAddModal(user);
    }

    function saveUser() {
        const email = document.getElementById('f-email').value.trim();
        const name = document.getElementById('f-display-name').value.trim();
        const role = document.getElementById('f-org-role').value;

        if (!email || !name || !role) {
            Components.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Check duplicate email
        const existing = Store.getById('security_users', 'entra_email_id', email);
        if (existing) {
            Components.showToast('A user with this email already exists', 'error');
            return;
        }

        Store.add('security_users', {
            user_id: Store.generateId('U'),
            entra_email_id: email,
            display_name: name,
            org_role: role,
            manager_email_id: '',
            manager_name: document.getElementById('f-manager').value,
            is_active: document.getElementById('f-status').value === 'true',
            jwt_access_token: ''
        });

        Components.closeModal();
        Components.showToast('User added successfully');
        render();
    }

    function updateUser(id) {
        Store.update('security_users', 'user_id', id, {
            display_name: document.getElementById('f-display-name').value.trim(),
            org_role: document.getElementById('f-org-role').value,
            manager_name: document.getElementById('f-manager').value,
            is_active: document.getElementById('f-status').value === 'true',
        });

        Components.closeModal();
        Components.showToast('User updated successfully');
        render();
    }

    function deleteUser(id) {
        if (confirm('Are you sure you want to delete this user?')) {
            Store.remove('security_users', 'user_id', id);
            Components.showToast('User deleted');
            render();
        }
    }

    return { render, handleSearch, showAddModal, showEditModal, saveUser, updateUser, deleteUser };
})();
