// ============================================================
// login.js — Login Page
// Purpose: Mock Entra ID SSO login screen
// Dependencies: auth.js, store.js
// ============================================================

const LoginPage = (() => {

    function render() {
        document.getElementById('app-layout').classList.add('d-none');
        const loginPage = document.getElementById('login-page');
        loginPage.classList.remove('d-none');

        const users = Auth.getEntraUsers();

        loginPage.innerHTML = `
            <div class="login-container">
                <div class="login-bg">
                    <!-- Geometric shapes -->
                    <div class="geo-shape shape-1"></div>
                    <div class="geo-shape shape-2"></div>
                    <div class="geo-shape shape-3"></div>
                    <div class="geo-shape shape-4"></div>
                    <div class="geo-shape shape-5"></div>
                    <div class="geo-shape shape-6"></div>
                    <div class="geo-shape shape-7"></div>
                    <div class="geo-shape shape-8"></div>
                </div>

                <!-- Brand top-left -->
                <div class="login-brand">
                    <span class="brand-c">C</span><span class="brand-l">L</span><span class="brand-a1">a</span><span class="brand-a2">a</span><span class="brand-s1">S</span><span class="brand-2">2</span><span class="brand-s2">S</span><span class="brand-a3">a</span><span class="brand-a4">a</span><span class="brand-s3">S</span>
                </div>

                <!-- Login Card -->
                <div class="login-card">
                    <div class="login-card-header">
                        <i class="fas fa-shield-halved login-icon"></i>
                        <h2>Sign in to CLaaS2SaaS</h2>
                        <p class="login-subtitle">Select an account to simulate Entra ID SSO</p>
                    </div>

                    <div class="login-users">
                        ${users.map(u => `
                            <button class="login-user-btn" onclick="LoginPage.handleLogin('${u.email}')">
                                <span class="login-user-avatar">${Auth.getInitials(u.name)}</span>
                                <div class="login-user-info">
                                    <span class="login-user-name">${u.name}</span>
                                    <span class="login-user-email">${u.email}</span>
                                    <span class="login-user-role">${u.role_label}</span>
                                </div>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        `).join('')}
                    </div>

                    <div class="login-footer">
                        <i class="fas fa-lock"></i> Secured by Microsoft Entra ID
                    </div>
                </div>
            </div>
        `;
    }

    function handleLogin(email) {
        const session = Auth.login(email);
        if (!session) return;

        // Check if first-time user (no roles)
        if (!session.has_roles) {
            Router.navigate('first-time');
        } else {
            Router.navigate('ecc');
        }
    }

    return { render, handleLogin };
})();
