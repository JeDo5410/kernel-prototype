// ============================================================
// audit-logs.js — Audit Log Viewer Page
// Purpose: View SecurityDB_Audit_Session and SecurityDB_Audit_Action_Log
// Dependencies: store.js, components.js
// ============================================================

const AuditLogsPage = (() => {
    let activeTab = 'sessions'; // 'sessions' | 'actions'
    let sessionFilter = 'all'; // 'all', 'success', 'failed', 'active'

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('audit-logs');

        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            ${Components.renderTabBar('audit-logs')}
            <div class="page-content">
                <div class="page-header">
                    <div>
                        <h1>Audit Log Viewer</h1>
                        <p class="page-subtitle">Monitor user sessions, login attempts, and system actions</p>
                    </div>
                </div>

                <div class="audit-tabs">
                    <button class="audit-tab ${activeTab === 'sessions' ? 'active' : ''}" onclick="AuditLogsPage.setTab('sessions')">
                        <i class="fas fa-clock"></i> Session Logs
                    </button>
                    <button class="audit-tab ${activeTab === 'actions' ? 'active' : ''}" onclick="AuditLogsPage.setTab('actions')">
                        <i class="fas fa-bolt"></i> Action Logs
                    </button>
                </div>

                <div id="audit-content">
                    ${activeTab === 'sessions' ? renderSessionLogs() : renderActionLogs()}
                </div>
            </div>
        `;
    }

    function renderSessionLogs() {
        let sessions = Store.getAll('audit_sessions');

        if (sessionFilter === 'success') sessions = sessions.filter(s => s.is_success);
        if (sessionFilter === 'failed') sessions = sessions.filter(s => !s.is_success);
        if (sessionFilter === 'active') sessions = sessions.filter(s => !s.session_end_time);

        const modules = Store.getAll('solutions_modules');

        return `
            <div class="data-table-wrapper">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search by user, email, IP address, device, module, or session token...">
                </div>

                <div class="filter-tabs">
                    <button class="filter-btn ${sessionFilter === 'all' ? 'active' : ''}" onclick="AuditLogsPage.setSessionFilter('all')">All Sessions</button>
                    <button class="filter-btn ${sessionFilter === 'success' ? 'active' : ''}" onclick="AuditLogsPage.setSessionFilter('success')">Successful Logins</button>
                    <button class="filter-btn ${sessionFilter === 'failed' ? 'active' : ''}" onclick="AuditLogsPage.setSessionFilter('failed')">Failed Logins</button>
                    <button class="filter-btn ${sessionFilter === 'active' ? 'active' : ''}" onclick="AuditLogsPage.setSessionFilter('active')">Active Sessions</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Module</th>
                            <th>Session Start</th>
                            <th>Duration</th>
                            <th>IP Address</th>
                            <th>Device</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sessions.map(s => {
                            const mod = modules.find(m => m.solution_module_id === s.solution_module_id);
                            const user = Store.getById('security_users', 'entra_email_id', s.entra_email_id);
                            const duration = getDuration(s.session_start_time, s.session_end_time);
                            return `
                                <tr>
                                    <td>
                                        <strong>${user ? user.display_name : s.user_id}</strong><br>
                                        <small class="text-muted">${s.entra_email_id}</small>
                                    </td>
                                    <td>
                                        ${mod ? mod.solution_code : '—'}<br>
                                        <small class="text-muted">${mod ? mod.module_code : ''}</small>
                                    </td>
                                    <td><i class="fas fa-calendar"></i> ${formatDate(s.session_start_time)}</td>
                                    <td>${duration}</td>
                                    <td><i class="fas fa-network-wired"></i> ${s.ip_address || '—'}</td>
                                    <td><i class="fas fa-desktop"></i> ${s.device_info ? s.device_info.substring(0, 35) + '...' : '—'}</td>
                                    <td><span class="status-badge ${s.is_success ? 'active' : 'failed'}">${s.is_success ? 'Success' : 'Failed'}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="table-footer">Showing ${sessions.length} of ${Store.getAll('audit_sessions').length} session logs</div>
            </div>
        `;
    }

    function renderActionLogs() {
        const actions = Store.getAll('audit_actions');
        const modules = Store.getAll('solutions_modules');

        return `
            <div class="data-table-wrapper">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search by user, action, permission code, or status...">
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Permission Code</th>
                            <th>Module</th>
                            <th>Timestamp</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${actions.map(a => {
                            const mod = modules.find(m => m.solution_module_id === a.solution_module_id);
                            const user = Store.getById('security_users', 'entra_email_id', a.entra_email_id);
                            return `
                                <tr>
                                    <td>
                                        <strong>${user ? user.display_name : a.entra_email_id}</strong><br>
                                        <small class="text-muted">${a.entra_email_id}</small>
                                    </td>
                                    <td><strong>${a.action_name}</strong></td>
                                    <td><code>${a.permission_code || '—'}</code></td>
                                    <td>${mod ? mod.solution_code + ' / ' + mod.module_code : '—'}</td>
                                    <td><i class="fas fa-clock"></i> ${formatDate(a.action_timestamp)}</td>
                                    <td><span class="status-badge ${a.action_status === 'Success' ? 'active' : a.action_status === 'Denied' ? 'failed' : 'inactive'}">${a.action_status}</span></td>
                                    <td class="desc-cell">${a.additional_info ? a.additional_info.substring(0, 50) + '...' : '—'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="table-footer">Showing ${actions.length} of ${actions.length} action logs</div>
            </div>
        `;
    }

    function setTab(tab) {
        activeTab = tab;
        render();
    }

    function setSessionFilter(f) {
        sessionFilter = f;
        render();
    }

    function getDuration(start, end) {
        if (!end) return '<span class="status-badge active">Active</span>';
        const diff = new Date(end) - new Date(start);
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return mins + 'm';
        const hrs = Math.floor(mins / 60);
        const rem = mins % 60;
        return hrs + 'h ' + rem + 'm';
    }

    function formatDate(isoStr) {
        if (!isoStr) return '—';
        const d = new Date(isoStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' +
               d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    return { render, setTab, setSessionFilter };
})();
