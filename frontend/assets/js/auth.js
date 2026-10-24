// Otomatis pake http://localhost:5000 pas dev lokal, atau relatif pas di Vercel
const BASE_API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

const AUTH_API = `${BASE_API}/auth`;

// Helper: Cek apakah user udah login
function getCurrentUser() {
    const userStr = localStorage.getItem('hy_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Helper: Logout user
function logoutUser() {
    localStorage.removeItem('hy_token');
    localStorage.removeItem('hy_user');
    window.location.reload();
}

// 1. REGISTER HANDLER
async function handleRegister(event) {
    event.preventDefault();
    const payload = {
        name: document.getElementById('reg_name').value,
        school: document.getElementById('reg_school').value,
        whatsapp: document.getElementById('reg_whatsapp').value,
        email: document.getElementById('reg_email').value,
        password: document.getElementById('reg_password').value
    };

    try {
        const res = await fetch(`${AUTH_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.status === 'success') {
            localStorage.setItem('hy_token', data.token);
            localStorage.setItem('hy_user', JSON.stringify(data.user));
            alert('Registrasi sukses bro! Selamat datang di HustleYouth 🔥');
            window.location.href = 'index.html';
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (err) {
        alert('Gagal konek ke server backend!');
    }
}

// 2. LOGIN HANDLER
async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        email: document.getElementById('login_email').value,
        password: document.getElementById('login_password').value
    };

    try {
        const res = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.status === 'success') {
            localStorage.setItem('hy_token', data.token);
            localStorage.setItem('hy_user', JSON.stringify(data.user));
            alert(`Login sukses! Halo ${data.user.name} 👋`);
            window.location.href = 'index.html';
        } else {
            alert('Gagal: ' + data.message);
        }
    } catch (err) {
        alert('Gagal konek ke server backend!');
    }
}

// Render User Status di Header
function renderNavUser() {
    const container = document.getElementById('nav-user-container');
    if (!container) return;

    const user = getCurrentUser();
    if (user) {
        container.innerHTML = `
            <div class="user-nav-badge">
                <span>👤 ${user.name}</span>
                <button onclick="logoutUser()" class="icon-btn" title="Logout" style="width:28px; height:28px; font-size:0.75rem;">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <a href="login.html" class="btn-auth-header"><i class="fa-solid fa-user"></i> Login</a>
        `;
    }
}

// --- AUTO THEME & SIDEBAR GLOBAL HANDLER ---
function initGlobalUI() {
    // 1. Restore & Sync Theme Preference
    const savedTheme = localStorage.getItem('hy_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        if (icon) icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

        themeBtn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', nextTheme);
            document.body.setAttribute('data-theme', nextTheme);
            localStorage.setItem('hy_theme', nextTheme);

            if (icon) icon.className = nextTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        };
    }

    // 2. Sidebar Toggle Handler
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const openBtn = document.getElementById('open-sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    const toggle = (open) => {
        if (!sidebar || !overlay) return;
        if (open) { sidebar.classList.add('active'); overlay.classList.add('active'); }
        else { sidebar.classList.remove('active'); overlay.classList.remove('active'); }
    };

    if (openBtn) openBtn.onclick = () => toggle(true);
    if (closeBtn) closeBtn.onclick = () => toggle(false);
    if (overlay) overlay.onclick = () => toggle(false);

    // 3. Render Nav User
    renderNavUser();
}

document.addEventListener('DOMContentLoaded', initGlobalUI);
