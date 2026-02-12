// ============================================================
// router.js — Hash-Based Router
// Purpose: Maps URL hashes to page render functions
// Dependencies: All page modules, auth.js
// ============================================================

const Router = (() => {

    const routes = {
        'login':             () => LoginPage.render(),
        'first-time':        () => PlaceholderPage.render('first-time'),
        'ecc':               () => ECCPage.render(),
        'kernel-dashboard':  () => DashboardPage.render(),
        'scc-dashboard':     () => SCCDashboardPage.render(),
        'module-mgmt':       () => ModuleMgmtPage.render(),
        'user-profile':      () => UserProfilePage.render(),
        'role-mgmt':         () => RoleMgmtPage.render(),
        'user-role-assign':  () => UserRoleAssignPage.render(),
        'audit-logs':        () => AuditLogsPage.render(),
        // ACC placeholders
        'acc-governance':    () => PlaceholderPage.render('acc-governance'),
        'acc-workflows':     () => PlaceholderPage.render('acc-workflows'),
        'acc-analytics':     () => PlaceholderPage.render('acc-analytics'),
        'acc-deployment':    () => PlaceholderPage.render('acc-deployment'),
        // Helpdesk placeholders
        'hd-access-request': () => PlaceholderPage.render('hd-access-request'),
        'hd-ticketing':      () => PlaceholderPage.render('hd-ticketing'),
        'hd-knowledge':      () => PlaceholderPage.render('hd-knowledge'),
        'hd-copilot':        () => PlaceholderPage.render('hd-copilot'),
    };

    function navigate(route) {
        // Auth guard
        if (route !== 'login' && !Auth.isLoggedIn()) {
            window.location.hash = '#login';
            return;
        }

        window.location.hash = '#' + route;
    }

    function handleRoute() {
        const hash = window.location.hash.replace('#', '') || 'login';

        // Auth guard
        if (hash !== 'login' && hash !== 'first-time' && !Auth.isLoggedIn()) {
            navigate('login');
            return;
        }

        // If logged in and going to login, redirect to ecc
        if (hash === 'login' && Auth.isLoggedIn()) {
            navigate('ecc');
            return;
        }

        const renderFn = routes[hash];
        if (renderFn) {
            renderFn();
        } else {
            navigate('ecc');
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);

    // Initial route
    window.addEventListener('DOMContentLoaded', () => {
        handleRoute();
    });

    return { navigate };
})();
