// ============================================================
// scc-dashboard.js — Security Control Centre Dashboard
// Purpose: Analytics overview for SCC — users, roles, sessions, audit
// Dependencies: components.js, store.js, auth.js
// ============================================================

const SCCDashboardPage = (() => {

    function render() {
        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar('scc-dashboard');

        const users        = Store.getAll('security_users');
        const roles        = Store.getAll('role_permissions');
        const userRoles    = Store.getAll('user_roles');
        const sessions     = Store.getAll('audit_sessions');
        const actions      = Store.getAll('audit_actions');

        const activeUsers     = users.filter(u => u.is_active).length;
        const activeAssign    = userRoles.filter(r => r.is_active).length;
        const successSessions = sessions.filter(s => s.is_success).length;
        const failedSessions  = sessions.filter(s => !s.is_success).length;
        const deniedActions   = actions.filter(a => a.action_status === 'Denied').length;
        const successActions  = actions.filter(a => a.action_status === 'Success').length;

        const sessionRate = sessions.length
            ? Math.round((successSessions / sessions.length) * 100)
            : 100;

        const complianceScore = Math.max(0,
            Math.round(100 - (deniedActions / Math.max(actions.length, 1)) * 40 - (failedSessions / Math.max(sessions.length, 1)) * 30)
        );

        // Role-type distribution (for bar chart)
        const roleTypes = {};
        roles.forEach(r => {
            roleTypes[r.sec_role_name] = (roleTypes[r.sec_role_name] || 0) + 1;
        });
        const maxRoleCount = Math.max(...Object.values(roleTypes), 1);

        // Recent audit actions (latest 5)
        const recentActions = [...actions]
            .sort((a, b) => new Date(b.action_timestamp) - new Date(a.action_timestamp))
            .slice(0, 5);

        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            <div class="page-content">
                <div class="scc-dash">

                    <!-- Header -->
                    <div class="scc-dash-header">
                        <div>
                            <h1 class="scc-dash-title"><i class="fas fa-shield-halved"></i> SCC Dashboard</h1>
                            <p class="scc-dash-subtitle">Security analytics overview — users, roles, sessions &amp; audit activity</p>
                        </div>
                        <div class="scc-dash-score-wrap">
                            <div class="scc-compliance-ring" style="--score:${complianceScore}">
                                <svg viewBox="0 0 80 80">
                                    <circle class="ring-bg" cx="40" cy="40" r="32"/>
                                    <circle class="ring-fill" cx="40" cy="40" r="32"
                                        stroke-dasharray="${Math.round(complianceScore * 2.01)} 201"
                                        stroke="${complianceScore >= 80 ? 'var(--avocado)' : complianceScore >= 60 ? 'var(--sunray)' : 'var(--violet-red)'}"/>
                                </svg>
                                <div class="ring-label">
                                    <span class="ring-num">${complianceScore}</span>
                                    <span class="ring-text">Compliance</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- KPI Cards -->
                    <div class="scc-kpi-row">
                        <div class="scc-kpi-card">
                            <div class="kpi-icon kpi-blue"><i class="fas fa-users"></i></div>
                            <div class="kpi-body">
                                <div class="kpi-num">${activeUsers}</div>
                                <div class="kpi-label">Active Users</div>
                                <div class="kpi-sub">${users.length} total registered</div>
                            </div>
                        </div>
                        <div class="scc-kpi-card">
                            <div class="kpi-icon kpi-gold"><i class="fas fa-user-shield"></i></div>
                            <div class="kpi-body">
                                <div class="kpi-num">${activeAssign}</div>
                                <div class="kpi-label">Role Assignments</div>
                                <div class="kpi-sub">${roles.length} roles defined</div>
                            </div>
                        </div>
                        <div class="scc-kpi-card">
                            <div class="kpi-icon kpi-green"><i class="fas fa-circle-check"></i></div>
                            <div class="kpi-body">
                                <div class="kpi-num">${successSessions}</div>
                                <div class="kpi-label">Successful Sessions</div>
                                <div class="kpi-sub">${sessionRate}% success rate</div>
                            </div>
                        </div>
                        <div class="scc-kpi-card">
                            <div class="kpi-icon kpi-red"><i class="fas fa-triangle-exclamation"></i></div>
                            <div class="kpi-body">
                                <div class="kpi-num">${failedSessions + deniedActions}</div>
                                <div class="kpi-label">Anomalies Detected</div>
                                <div class="kpi-sub">${failedSessions} failed logins · ${deniedActions} denied actions</div>
                            </div>
                        </div>
                    </div>

                    <!-- Mid row: Role Distribution + Access Metrics -->
                    <div class="scc-mid-row">

                        <!-- Role Distribution -->
                        <div class="scc-panel scc-panel-roles">
                            <div class="panel-header">
                                <i class="fas fa-user-lock"></i> Role Distribution
                            </div>
                            <div class="role-bars">
                                ${Object.entries(roleTypes).map(([name, count]) => `
                                    <div class="role-bar-row">
                                        <div class="role-bar-label">${name}</div>
                                        <div class="role-bar-track">
                                            <div class="role-bar-fill" style="width:${Math.round((count / maxRoleCount) * 100)}%"></div>
                                        </div>
                                        <div class="role-bar-count">${count}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Access Metrics -->
                        <div class="scc-panel scc-panel-metrics">
                            <div class="panel-header">
                                <i class="fas fa-chart-line"></i> Access Metrics
                            </div>
                            <div class="access-metrics">
                                <div class="metric-row">
                                    <div class="metric-info">
                                        <span class="metric-name">Session Success Rate</span>
                                        <span class="metric-val">${sessionRate}%</span>
                                    </div>
                                    <div class="metric-bar-track">
                                        <div class="metric-bar-fill metric-green" style="width:${sessionRate}%"></div>
                                    </div>
                                </div>
                                <div class="metric-row">
                                    <div class="metric-info">
                                        <span class="metric-name">Action Success Rate</span>
                                        <span class="metric-val">${actions.length ? Math.round((successActions / actions.length) * 100) : 100}%</span>
                                    </div>
                                    <div class="metric-bar-track">
                                        <div class="metric-bar-fill metric-blue" style="width:${actions.length ? Math.round((successActions / actions.length) * 100) : 100}%"></div>
                                    </div>
                                </div>
                                <div class="metric-row">
                                    <div class="metric-info">
                                        <span class="metric-name">Users with Roles</span>
                                        <span class="metric-val">${users.length ? Math.round(([...new Set(userRoles.map(r => r.entra_email_id))].length / users.length) * 100) : 0}%</span>
                                    </div>
                                    <div class="metric-bar-track">
                                        <div class="metric-bar-fill metric-gold" style="width:${users.length ? Math.round(([...new Set(userRoles.map(r => r.entra_email_id))].length / users.length) * 100) : 0}%"></div>
                                    </div>
                                </div>
                                <div class="metric-row">
                                    <div class="metric-info">
                                        <span class="metric-name">Active Modules Coverage</span>
                                        <span class="metric-val">${Math.round(([...new Set(userRoles.map(r => r.solution_module_id))].length / Math.max(Store.getAll('solutions_modules').length, 1)) * 100)}%</span>
                                    </div>
                                    <div class="metric-bar-track">
                                        <div class="metric-bar-fill metric-violet" style="width:${Math.round(([...new Set(userRoles.map(r => r.solution_module_id))].length / Math.max(Store.getAll('solutions_modules').length, 1)) * 100)}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Recent Audit Activity -->
                    <div class="scc-panel scc-panel-full">
                        <div class="panel-header">
                            <i class="fas fa-file-shield"></i> Recent Audit Activity
                            <button class="panel-link-btn" onclick="Router.navigate('audit-logs')">View All <i class="fas fa-arrow-right"></i></button>
                        </div>
                        <table class="scc-audit-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentActions.map(a => `
                                    <tr>
                                        <td class="audit-ts">${formatTs(a.action_timestamp)}</td>
                                        <td class="audit-user">${a.entra_email_id}</td>
                                        <td>${a.action_name}</td>
                                        <td><span class="audit-badge audit-${a.action_status.toLowerCase()}">${a.action_status}</span></td>
                                        <td class="audit-detail">${a.additional_info}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        `;
    }

    function formatTs(ts) {
        if (!ts) return '—';
        const d = new Date(ts);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }

    return { render };
})();
