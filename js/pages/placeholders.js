// ============================================================
// placeholders.js — Placeholder Pages for ACC, Helpdesk, First-Time User
// Purpose: Placeholder UI for features not yet built
// Dependencies: components.js
// ============================================================

const PlaceholderPage = (() => {

    const pageConfig = {
        'first-time': {
            icon: 'fa-user-plus',
            title: 'Welcome!',
            subtitle: 'Your Entra ID is not provisioned yet. Please contact Admin or click on Copilot Agent for Role Assignment.',
            buttons: [
                { label: 'Copilot Agent', icon: 'fa-robot', action: "Components.showToast('Copilot Agent coming soon', 'info')" },
                { label: 'Cancel', icon: '', action: "Auth.logout(); Router.navigate('login')", secondary: true },
            ],
            context: 'none'
        },
        'acc-governance': {
            icon: 'fa-scale-balanced',
            title: 'Governance & Compliance',
            subtitle: 'Access recertification, SoD compliance engine, governance reporting, and exception handling.',
            features: ['Access Recertification', 'SoD Compliance Engine', 'Governance Reporting', 'Exception Handling', 'Rule-Based Auto Role Assignment', 'Compliance Calendar'],
            context: 'kernel'
        },
        'acc-workflows': {
            icon: 'fa-diagram-project',
            title: 'Workflow Automation',
            subtitle: 'User provisioning automator, audit analytics automation, and RBAC interactive analyst.',
            features: ['User Provisioning Automator', 'Audit Action Analytics Automation', 'RBAC Interactive Analyst'],
            context: 'kernel'
        },
        'acc-analytics': {
            icon: 'fa-chart-line',
            title: 'Analytics & KPIs',
            subtitle: 'Security KPI tracking, risk register integration, and performance monitoring.',
            features: ['Security KPI Definition', 'Risk Register Integration', 'Provisioning Accuracy Metrics', 'Login Success Rate'],
            context: 'kernel'
        },
        'acc-deployment': {
            icon: 'fa-rocket',
            title: 'Deployment & Release',
            subtitle: 'Application deployment governance, testing coverage, and UI policy enforcement.',
            features: ['Security Deployment Governance', 'RBAC Functional Test Coverage', 'Standardised UI Policy', 'Mockup Approval Control'],
            context: 'kernel'
        },
        'hd-access-request': {
            icon: 'fa-key',
            title: 'Access Requests',
            subtitle: 'Self-service access request portal for users to request roles on solutions and modules.',
            features: ['Self-Service Access Request', 'Module Admin Notification Routing', 'Request Status Tracking'],
            context: 'kernel'
        },
        'hd-ticketing': {
            icon: 'fa-ticket',
            title: 'Issue Ticketing',
            subtitle: 'Log and track access-related issues with resolution workflow.',
            features: ['Access Issue Ticketing', 'Resolution Tracking', 'Escalation Management'],
            context: 'kernel'
        },
        'hd-knowledge': {
            icon: 'fa-book',
            title: 'Knowledge Base',
            subtitle: 'User guides, FAQs, and support documentation for CLaaS2SaaS platform.',
            features: ['User Guides', 'FAQ Library', 'Video Tutorials', 'Release Notes'],
            context: 'kernel'
        },
        'hd-copilot': {
            icon: 'fa-robot',
            title: 'AI Assistant',
            subtitle: 'AI-powered support agent for RBAC queries and access troubleshooting.',
            features: ['RBAC Support Insight Agent', 'Access Request Assistant', 'Natural Language Queries'],
            context: 'kernel'
        },
    };

    function render(pageId) {
        const config = pageConfig[pageId];
        if (!config) return;

        // Special case: first-time user
        if (pageId === 'first-time') {
            renderFirstTime(config);
            return;
        }

        document.getElementById('login-page').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        Components.renderNavbar('kernel');
        Components.renderSidebar(pageId);

        const center = document.getElementById('center-stage');
        center.className = 'center-stage feature-page';

        center.innerHTML = `
            <div class="page-content">
                <div class="placeholder-page">
                    <div class="placeholder-icon"><i class="fas ${config.icon}"></i></div>
                    <h1>${config.title}</h1>
                    <p class="placeholder-subtitle">${config.subtitle}</p>

                    ${config.features ? `
                        <div class="placeholder-features">
                            <h3>Planned Features</h3>
                            <div class="feature-cards">
                                ${config.features.map(f => `
                                    <div class="feature-card-mini">
                                        <i class="fas fa-circle-check"></i>
                                        <span>${f}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="placeholder-badge">
                        <i class="fas fa-wrench"></i> Coming in a future release
                    </div>
                </div>
            </div>
        `;
    }

    function renderFirstTime(config) {
        document.getElementById('app-layout').classList.add('d-none');
        const loginPage = document.getElementById('login-page');
        loginPage.classList.remove('d-none');

        const user = Auth.getCurrentUser();

        loginPage.innerHTML = `
            <div class="login-container">
                <div class="login-bg">
                    <div class="geo-shape shape-1"></div>
                    <div class="geo-shape shape-2"></div>
                    <div class="geo-shape shape-3"></div>
                    <div class="geo-shape shape-4"></div>
                    <div class="geo-shape shape-5"></div>
                    <div class="geo-shape shape-6"></div>
                </div>
                <div class="login-brand">
                    <span class="brand-c">C</span><span class="brand-l">L</span><span class="brand-a1">a</span><span class="brand-a2">a</span><span class="brand-s1">S</span><span class="brand-2">2</span><span class="brand-s2">S</span><span class="brand-a3">a</span><span class="brand-a4">a</span><span class="brand-s3">S</span>
                </div>
                <div class="login-card first-time-card">
                    <h2>Welcome, ${user ? user.name : 'User'}</h2>
                    <p>${config.subtitle}</p>
                    <div class="first-time-buttons">
                        ${config.buttons.map(b => `
                            <button class="${b.secondary ? 'btn-secondary' : 'btn-primary'}" onclick="${b.action}">
                                ${b.icon ? `<i class="fas ${b.icon}"></i>` : ''} ${b.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    return { render };
})();
