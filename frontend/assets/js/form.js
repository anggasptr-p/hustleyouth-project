document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    
    const form = document.getElementById('gig-form');
    form.addEventListener('submit', handleFormSubmit);
});

// 1. Validasi Nomor WA
function validateForm() {
    const wa = document.getElementById('whatsapp').value.trim();
    
    // Syarat: diawali 08 atau 62
    const isPrefixValid = wa.startsWith('08') || wa.startsWith('62');
    // Syarat: minimal 10 digit
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

// 2. Handle Submit Form
async function handleFormSubmit(event) {
    event.preventDefault(); // Sesuai PRD
    
    if (!validateForm()) return;

    // Ambil data dan jadikan JSON object (Sesuai PRD)
    const payload = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        freelancer_name: document.getElementById('freelancer_name').value,
        school: document.getElementById('school').value,
        price: parseInt(document.getElementById('price').value),
        whatsapp: document.getElementById('whatsapp').value,
        description: document.getElementById('description').value,
        image_url: document.getElementById('image_url').value || null
    };

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;

    try {
        // Simulasi Fetch request
        /* 
        await fetch('http://localhost:5000/api/gigs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        */
        
        // Simulasi network delay
        await new Promise(r => setTimeout(r, 1000));
        console.log("JSON Object siap dikirim:", payload);
        
        alert("Jasa berhasil dipublikasikan!");
        
        // Redirect ke halaman utama
        window.location.href = 'index.html';

    } catch (error) {
        alert("Terjadi kesalahan sistem.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// 3. Theme Toggle Logic
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
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
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// 4. Sidebar Logic
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const openBtn = document.getElementById('open-sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    const toggle = (open) => {
        if(open) { sidebar.classList.add('active'); overlay.classList.add('active'); }
        else { sidebar.classList.remove('active'); overlay.classList.remove('active'); }
    };

    openBtn.addEventListener('click', () => toggle(true));
    closeBtn.addEventListener('click', () => toggle(false));
    overlay.addEventListener('click', () => toggle(false));
}
