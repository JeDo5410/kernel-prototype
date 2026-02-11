// ============================================================
// store.js — Mock Dataverse Database using localStorage
// Purpose: Simulates the 6 core Dataverse tables for the Kernel App
// Dependencies: None
// ============================================================

const Store = (() => {
    const STORAGE_KEY = 'c2s_kernel_db';

    // ---------- Seed Data ----------

    const SEED_DATA = {
        // Table 1: SecurityDB_Solution_Module
        solutions_modules: [
            { solution_module_id: 'SM001', solution_code: 'ADC', solution_name: 'Adaptive CLaaS', module_code: 'AGNT_HR', module_name: 'Agentic HR', description: 'Human resources management with AI-driven talent analytics', module_lead: 'John Smith', documentation_url: 'https://docs.c2s.com/agentic-hr', module_version: 'v2.3.1', is_active: true },
            { solution_module_id: 'SM002', solution_code: 'AIW', solution_name: 'Agentic Intelligent Workplace', module_code: 'AGNT_TLNT', module_name: 'Agentic Talents', description: 'Talent management and workforce intelligence platform', module_lead: 'Sarah Johnson', documentation_url: 'https://docs.c2s.com/agentic-talents', module_version: 'v1.5.0', is_active: true },
            { solution_module_id: 'SM003', solution_code: 'ACM', solution_name: 'Agentic CRM & Marketer', module_code: 'AGNT_CRCLM', module_name: 'CLaaS Curriculum', description: 'Comprehensive curriculum design and management', module_lead: 'Michael Chen', documentation_url: 'https://docs.c2s.com/claas-curriculum', module_version: 'v3.0.2', is_active: true },
            { solution_module_id: 'SM004', solution_code: 'AES', solution_name: 'Agentic ERP & Shared Services', module_code: 'AGNT_DEVL', module_name: 'CLaaS Developer', description: 'Development platform for building CLaaS2SaaS extensions', module_lead: 'Emily Rodriguez', documentation_url: 'https://docs.c2s.com/claas-developer', module_version: 'v2.1.0', is_active: true },
            { solution_module_id: 'SM005', solution_code: 'ADC', solution_name: 'Adaptive CLaaS', module_code: 'CLSM', module_name: 'CLaaS Manager', description: 'Core learning management and orchestration', module_lead: 'David Lee', documentation_url: 'https://docs.c2s.com/claas-manager', module_version: 'v4.0.1', is_active: true },
            { solution_module_id: 'SM006', solution_code: 'ADC', solution_name: 'Adaptive CLaaS', module_code: 'CLSN', module_name: 'CLaaS Mentor', description: 'AI-powered mentoring and coaching platform', module_lead: 'Lisa Wang', documentation_url: 'https://docs.c2s.com/claas-mentor', module_version: 'v1.2.0', is_active: true },
            { solution_module_id: 'SM007', solution_code: 'AIW', solution_name: 'Agentic Intelligent Workplace', module_code: 'AGNT_SOP', module_name: 'Agentic SOP', description: 'Standard operating procedure automation', module_lead: 'Tom Harris', documentation_url: 'https://docs.c2s.com/agentic-sop', module_version: 'v1.0.0', is_active: true },
            { solution_module_id: 'SM008', solution_code: 'ACM', solution_name: 'Agentic CRM & Marketer', module_code: 'AGNT_SALES', module_name: 'Agentic Sales', description: 'AI-driven sales pipeline and customer engagement', module_lead: 'Rachel Kim', documentation_url: 'https://docs.c2s.com/agentic-sales', module_version: 'v2.0.0', is_active: true },
            { solution_module_id: 'SM009', solution_code: 'AIW', solution_name: 'Agentic Intelligent Workplace', module_code: 'KNL', module_name: 'Kernel', description: 'Security kernel and centralized access control for all C2S applications', module_lead: 'Rabiul Hossain', documentation_url: 'https://docs.c2s.com/kernel', module_version: 'v1.0.0', is_active: true },
            { solution_module_id: 'SM010', solution_code: 'AES', solution_name: 'Agentic ERP & Shared Services', module_code: 'AGNT_FIN', module_name: 'Agentic Finance', description: 'Financial management and reporting automation', module_lead: 'James Park', documentation_url: 'https://docs.c2s.com/agentic-finance', module_version: 'v1.1.0', is_active: true },
            { solution_module_id: 'SM011', solution_code: 'AES', solution_name: 'Agentic ERP & Shared Services', module_code: 'AGNT_PROC', module_name: 'Agentic Procurement', description: 'Procurement and vendor management with AI', module_lead: 'Karen Wilson', documentation_url: 'https://docs.c2s.com/agentic-procurement', module_version: 'v1.0.0', is_active: true },
            { solution_module_id: 'SM012', solution_code: 'ACM', solution_name: 'Agentic CRM & Marketer', module_code: 'AGNT_MKT', module_name: 'Agentic Marketer', description: 'Marketing automation and campaign intelligence', module_lead: 'Nina Patel', documentation_url: 'https://docs.c2s.com/agentic-marketer', module_version: 'v1.3.0', is_active: true },
        ],

        // Table 2: OrganizationDB_Security_User
        security_users: [
            { user_id: 'U001', entra_email_id: 'admin@lithan.com', display_name: 'Admin User', org_role: 'Platform Director', manager_email_id: '', manager_name: '', is_active: true, jwt_access_token: '' },
            { user_id: 'U002', entra_email_id: 'alice.johnson@lithan.com', display_name: 'Alice Johnson', org_role: 'Senior Developer', manager_email_id: 'admin@lithan.com', manager_name: 'Admin User', is_active: true, jwt_access_token: '' },
            { user_id: 'U003', entra_email_id: 'bob.smith@lithan.com', display_name: 'Bob Smith', org_role: 'Project Manager', manager_email_id: 'admin@lithan.com', manager_name: 'Admin User', is_active: true, jwt_access_token: '' },
        ],

        // Table 3: SecurityDB_Security_Role_Permission
        role_permissions: [
            // ADC - AGNT_HR roles
            { sec_role_id: 'RP001', sec_role_code: 'ADMIN', sec_role_name: 'Administrator', solution_module_id: 'SM001', security_token: 'TKN_ADC_HR_ADMIN', is_system_role: true, create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: true, view_all_data_plus_admin_module: true, view_all_data_plus_admin_all: false, is_active: true },
            { sec_role_id: 'RP002', sec_role_code: 'COLLABORATOR', sec_role_name: 'Collaborator', solution_module_id: 'SM001', security_token: 'TKN_ADC_HR_COLLAB', is_system_role: true, create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: true, view_all_data_plus_admin_module: false, view_all_data_plus_admin_all: false, is_active: true },
            { sec_role_id: 'RP003', sec_role_code: 'CONTRIBUTOR', sec_role_name: 'Contributor', solution_module_id: 'SM002', security_token: 'TKN_AIW_TLNT_CONTRIB', is_system_role: true, create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: false, view_all_data_plus_admin_module: false, view_all_data_plus_admin_all: false, is_active: true },
            { sec_role_id: 'RP004', sec_role_code: 'VIEWER', sec_role_name: 'Viewer', solution_module_id: 'SM003', security_token: 'TKN_ACM_CRCLM_VIEW', is_system_role: true, create_permission: false, read_permission: true, update_permission: false, delete_permission: false, view_all_user_data: true, view_all_data_plus_admin_module: false, view_all_data_plus_admin_all: false, is_active: true },
            { sec_role_id: 'RP005', sec_role_code: 'GLOBAL_ADMIN', sec_role_name: 'Global Administrator', solution_module_id: 'SM009', security_token: 'TKN_KNL_GADMIN', is_system_role: true, create_permission: true, read_permission: true, update_permission: true, delete_permission: true, view_all_user_data: true, view_all_data_plus_admin_module: true, view_all_data_plus_admin_all: true, is_active: true },
        ],

        // Table 4: SecurityDB_Security_User_Role
        user_roles: [
            { id: 'UR001', entra_email_id: 'admin@lithan.com', solution_module_id: 'SM009', sec_role_id: 'RP005', assigned_date: '2025-01-15T09:30:00', assigned_by_user_id: 'U001', assigned_by_name: 'System', reason: 'Initial global admin setup', is_active: true, disabled_date: null },
            { id: 'UR002', entra_email_id: 'alice.johnson@lithan.com', solution_module_id: 'SM001', sec_role_id: 'RP001', assigned_date: '2025-02-10T14:20:00', assigned_by_user_id: 'U001', assigned_by_name: 'Admin User', reason: 'Module admin assignment for Agentic HR', is_active: true, disabled_date: null },
            { id: 'UR003', entra_email_id: 'bob.smith@lithan.com', solution_module_id: 'SM002', sec_role_id: 'RP003', assigned_date: '2025-03-01T10:15:00', assigned_by_user_id: 'U001', assigned_by_name: 'Admin User', reason: 'Contributor access for Agentic Talents', is_active: true, disabled_date: null },
            { id: 'UR004', entra_email_id: 'bob.smith@lithan.com', solution_module_id: 'SM003', sec_role_id: 'RP004', assigned_date: '2025-03-01T10:15:00', assigned_by_user_id: 'U001', assigned_by_name: 'Admin User', reason: 'Viewer access for CLaaS Curriculum', is_active: true, disabled_date: null },
        ],

        // Table 5: SecurityDB_Audit_Session
        audit_sessions: [
            { audit_session_id: 'AS001', entra_email_id: 'alice.johnson@lithan.com', user_id: 'alice.johnson@lithan.com', session_start_time: '2025-12-14T08:30:00', session_end_time: '2025-12-14T12:45:00', ip_address: '192.168.1.105', device_info: 'Chrome 120.0.0 / Windows 10 / Desktop', location: 'Singapore', solution_module_id: 'SM001', session_token_id: 'SESS_TKN_001', is_success: true, reason: '' },
            { audit_session_id: 'AS002', entra_email_id: 'bob.smith@lithan.com', user_id: 'bob.smith@lithan.com', session_start_time: '2025-12-14T09:15:00', session_end_time: null, ip_address: '192.168.1.142', device_info: 'Safari 17.1 / macOS 14.1 / Desktop', location: 'Singapore', solution_module_id: 'SM002', session_token_id: 'SESS_TKN_002', is_success: true, reason: '' },
            { audit_session_id: 'AS003', entra_email_id: 'alice.johnson@lithan.com', user_id: 'alice.johnson@lithan.com', session_start_time: '2025-12-14T07:00:00', session_end_time: '2025-12-14T07:02:00', ip_address: '203.45.67.89', device_info: 'Chrome 120.0.0 / Android 14 / Mobile', location: 'Manila', solution_module_id: 'SM001', session_token_id: 'SESS_TKN_003', is_success: false, reason: 'Token expired' },
            { audit_session_id: 'AS004', entra_email_id: 'admin@lithan.com', user_id: 'admin@lithan.com', session_start_time: '2025-12-13T14:20:00', session_end_time: '2025-12-13T18:30:00', ip_address: '192.168.1.98', device_info: 'Firefox 121.0 / Ubuntu 22.04 / Desktop', location: 'Singapore', solution_module_id: 'SM009', session_token_id: 'SESS_TKN_004', is_success: true, reason: '' },
        ],

        // Table 6: SecurityDB_Audit_Action_Log
        audit_actions: [
            { audit_action_id: 'AA001', audit_session_id: 'AS001', entra_email_id: 'alice.johnson@lithan.com', action_timestamp: '2025-12-14T08:35:00', solution_module_id: 'SM001', action_name: 'RoleAssignment', permission_code: 'ROLE_ASSIGN', action_status: 'Success', additional_info: 'Assigned Contributor role to Bob Smith for AGNT_TLNT' },
            { audit_action_id: 'AA002', audit_session_id: 'AS001', entra_email_id: 'alice.johnson@lithan.com', action_timestamp: '2025-12-14T09:10:00', solution_module_id: 'SM001', action_name: 'UserProfileUpdate', permission_code: 'USER_UPDATE', action_status: 'Success', additional_info: 'Updated org_role for bob.smith@lithan.com' },
            { audit_action_id: 'AA003', audit_session_id: 'AS004', entra_email_id: 'admin@lithan.com', action_timestamp: '2025-12-13T14:25:00', solution_module_id: 'SM009', action_name: 'ModuleRegistration', permission_code: 'MODULE_CREATE', action_status: 'Success', additional_info: 'Registered new module Agentic Procurement under AES' },
            { audit_action_id: 'AA004', audit_session_id: 'AS002', entra_email_id: 'bob.smith@lithan.com', action_timestamp: '2025-12-14T09:20:00', solution_module_id: 'SM002', action_name: 'CourseView', permission_code: 'COURSE_READ', action_status: 'Denied', additional_info: 'Attempted to access admin settings — insufficient permissions' },
        ],
    };

    // ---------- Core Functions ----------

    function initDB() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
        }
    }

    function getDB() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    function saveDB(db) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }

    function resetDB() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    }

    // ---------- Generic CRUD ----------

    function getAll(tableName) {
        const db = getDB();
        return db[tableName] || [];
    }

    function getById(tableName, idField, idValue) {
        const db = getDB();
        return (db[tableName] || []).find(r => r[idField] === idValue) || null;
    }

    function getWhere(tableName, filterFn) {
        const db = getDB();
        return (db[tableName] || []).filter(filterFn);
    }

    function add(tableName, record) {
        const db = getDB();
        if (!db[tableName]) db[tableName] = [];
        db[tableName].push(record);
        saveDB(db);
        return record;
    }

    function update(tableName, idField, idValue, updates) {
        const db = getDB();
        const arr = db[tableName] || [];
        const idx = arr.findIndex(r => r[idField] === idValue);
        if (idx === -1) return null;
        arr[idx] = { ...arr[idx], ...updates };
        db[tableName] = arr;
        saveDB(db);
        return arr[idx];
    }

    function remove(tableName, idField, idValue) {
        const db = getDB();
        db[tableName] = (db[tableName] || []).filter(r => r[idField] !== idValue);
        saveDB(db);
    }

    // ---------- Helper: Generate ID ----------

    function generateId(prefix) {
        return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    }

    // ---------- Convenience Accessors ----------

    function getSolutions() {
        const modules = getAll('solutions_modules');
        const solutionMap = {};
        modules.forEach(m => {
            if (!solutionMap[m.solution_code]) {
                solutionMap[m.solution_code] = {
                    code: m.solution_code,
                    name: m.solution_name,
                    modules: []
                };
            }
            solutionMap[m.solution_code].modules.push(m);
        });
        return Object.values(solutionMap);
    }

    function getUserRolesForUser(email) {
        return getWhere('user_roles', r => r.entra_email_id === email && r.is_active);
    }

    function isGlobalAdmin(email) {
        const roles = getUserRolesForUser(email);
        return roles.some(r => {
            const rp = getById('role_permissions', 'sec_role_id', r.sec_role_id);
            return rp && rp.sec_role_code === 'GLOBAL_ADMIN';
        });
    }

    function getRolePermission(secRoleId) {
        return getById('role_permissions', 'sec_role_id', secRoleId);
    }

    // ---------- Audit Logging Helpers ----------

    function logSession(sessionData) {
        const session = {
            audit_session_id: generateId('AS'),
            session_start_time: new Date().toISOString(),
            session_end_time: null,
            session_token_id: generateId('SESS_TKN'),
            ...sessionData
        };
        add('audit_sessions', session);
        return session;
    }

    function logAction(actionData) {
        const action = {
            audit_action_id: generateId('AA'),
            action_timestamp: new Date().toISOString(),
            ...actionData
        };
        add('audit_actions', action);
        return action;
    }

    // ---------- Initialize ----------
    initDB();

    // ---------- Public API ----------
    return {
        getAll, getById, getWhere, add, update, remove,
        generateId, getSolutions, getUserRolesForUser,
        isGlobalAdmin, getRolePermission,
        logSession, logAction, resetDB, getDB
    };
})();
