// ============================================================
// auth.js — Authentication & Session Management
// Purpose: Manages login state, current user, and mock SSO flow
// Dependencies: store.js
// ============================================================

const Auth = (() => {
    const SESSION_KEY = 'c2s_current_user';

    // Mock users available for login (simulating Entra ID directory)
    const MOCK_ENTRA_USERS = [
        { email: 'admin@lithan.com', name: 'Admin User', role_label: 'Global Administrator' },
        { email: 'alice.johnson@lithan.com', name: 'Alice Johnson', role_label: 'Module Admin (ADC)' },
        { email: 'bob.smith@lithan.com', name: 'Bob Smith', role_label: 'Contributor / Viewer' },
        { email: 'newuser@lithan.com', name: 'John Doe', role_label: 'No Role Assigned' },
    ];

    function login(email) {
        const entraUser = MOCK_ENTRA_USERS.find(u => u.email === email);
        if (!entraUser) return null;

        // Check if user exists in SecurityDB
        const dbUser = Store.getById('security_users', 'entra_email_id', email);
        const isFirstTime = !dbUser;
        const isGlobalAdmin = Store.isGlobalAdmin(email);
        const userRoles = Store.getUserRolesForUser(email);

        const session = {
            email: email,
            name: entraUser.name,
            role_label: entraUser.role_label,
            is_first_time: isFirstTime,
            is_global_admin: isGlobalAdmin,
            has_roles: userRoles.length > 0,
            user_roles: userRoles,
            login_time: new Date().toISOString()
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));

        // Log the session in audit
        Store.logSession({
            entra_email_id: email,
            user_id: email,
            ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
            device_info: navigator.userAgent.substring(0, 80),
            location: 'Singapore',
            solution_module_id: 'SM009',
            is_success: true,
            reason: ''
        });

        return session;
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
    }

    function getCurrentUser() {
        const data = localStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    }

    function isLoggedIn() {
        return !!getCurrentUser();
    }

    function getEntraUsers() {
        return MOCK_ENTRA_USERS;
    }

    function getInitials(name) {
        return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
    }

    return { login, logout, getCurrentUser, isLoggedIn, getEntraUsers, getInitials };
})();
