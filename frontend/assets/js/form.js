// Otomatis pake http://localhost:5000 pas dev lokal, atau relatif pas di Vercel
const BASE_API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

const API_URL = `${BASE_API}/gigs`;
const AUTH_API = `${BASE_API}/auth`;
const STREAM_API = `${BASE_API}/posts`;
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/wk9j9o7f/image/upload';
const CLOUDINARY_PRESET = 'hustleyouth_preset';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    autoFillProfile();
    
    const form = document.getElementById('gig-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// 1. Validasi Nomor WA
function validateForm() {
    const wa = document.getElementById('whatsapp').value.trim();
    
    const isPrefixValid = wa.startsWith('08') || wa.startsWith('62');
    const isLengthValid = wa.length >= 10;

    if (!isPrefixValid) {
        alert("Nomor WhatsApp harus diawali dengan 08 atau 62!");
        return false;
    }
    if (!isLengthValid) {
        alert("Nomor WhatsApp minimal 10 digit!");
        return false;
    }
    return true;
}

// 2. Helper Upload Gambar ke Cloudinary
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Gagal mengunggah foto ke Cloudinary.');
    }

    const data = await response.json();
    return data.secure_url; // Mengembalikan URL publik gambar
}

// 3. Handle Submit Form
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;

    const fileInput = document.getElementById('image_file');
    let imageUrl = null;

    try {
        // Step 1: Upload gambar ke Cloudinary jika user memilih file
        if (fileInput && fileInput.files.length > 0) {
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah gambar...`;
            imageUrl = await uploadToCloudinary(fileInput.files[0]);
        }

        // Step 2: Kirim data lengkap ke Backend Express & Neon DB
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan data...`;
        
        const payload = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            freelancer_name: document.getElementById('freelancer_name').value,
            school: document.getElementById('school').value,
            price: parseInt(document.getElementById('price').value),
            whatsapp: document.getElementById('whatsapp').value,
            description: document.getElementById('description').value,
            image_url: imageUrl
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert("Mantap ler! Jasa + Gambar berhasil dipublish!");
            window.location.href = 'index.html';
        } else {
            alert("Gagal: " + (result.message || "Terjadi kesalahan sistem."));
        }

    } catch (error) {
        console.error("Error submit:", error);
        alert("Gagal memproses data: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// 4. Theme Toggle Logic
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    const icon = themeBtn.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme, icon);

    themeBtn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon(next, icon);
    });
}

function updateIcon(theme, icon) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// 5. Sidebar Logic
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const openBtn = document.getElementById('open-sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    const toggle = (open) => {
        if(open) { sidebar.classList.add('active'); overlay.classList.add('active'); }
        else { sidebar.classList.remove('active'); overlay.classList.remove('active'); }
    };

    if (openBtn) openBtn.addEventListener('click', () => toggle(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
    if (overlay) overlay.addEventListener('click', () => toggle(false));
}

// Fitur Autofill dari LocalStorage User
function autoFillProfile() {
    const user = getCurrentUser();
    if (!user) return;

    const nameInput = document.getElementById('freelancer_name');
    const schoolInput = document.getElementById('school');
    const waInput = document.getElementById('whatsapp');

    // Cuma isi kalo kolomnya masih kosong
    if (nameInput && user.name) nameInput.value = user.name;
    if (schoolInput && user.school) schoolInput.value = user.school;
    if (waInput && user.whatsapp) waInput.value = user.whatsapp;

    // Kasih notif tipis-tipis
    const formHeader = document.querySelector('.form-header');
    if (formHeader) {
        const infoBadge = document.createElement('div');
        infoBadge.style.cssText = 'background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.8rem; margin-top: 0.5rem; display: inline-block;';
        infoBadge.innerHTML = `✨ Data terisi otomatis dari profil <b>${user.name}</b> (Bisa diedit manual)`;
        formHeader.appendChild(infoBadge);
    }
}
