// Mock Data (Simulasi API backend)
const mockData = [
    { id: 1, title: "Desain Logo Minimalis", category: "Design", freelancer_name: "Budi Santoso", school: "SMK Telkom", price: 50000, whatsapp: "081234567890", description: "Saya membuat desain logo minimalis modern dengan 3x revisi.", image_url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&q=80" },
    { id: 2, title: "Editing Video Tiktok/Reels", category: "Video", freelancer_name: "Siti Aminah", school: "SMA Negeri 1", price: 75000, whatsapp: "628987654321", description: "Editing video pendek dengan transisi keren dan subtitle otomatis.", image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
    { id: 3, title: "Landing Page HTML/Tailwind", category: "Code", freelancer_name: "Andi Wijaya", school: "Universitas Bina", price: 150000, whatsapp: "081122334455", description: "Jasa pembuatan landing page responsif.", image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80" },
    { id: 4, title: "Penulisan Artikel SEO", category: "Writing", freelancer_name: "Rina Putri", school: "SMAN 5", price: 30000, whatsapp: "085566778899", description: "Artikel 500 kata, riset keyword, dan ramah SEO.", image_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80" }
];

window.allGigs = [];

// 1. DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    fetchGigs();
    setupModalEvents();
});

// 2. Fetch Gigs
async function fetchGigs() {
    try {
        // Simulasi Fetch API (Karena backend localhost:5000 tidak berjalan)
        // const response = await fetch('http://localhost:5000/api/gigs');
        // const data = await response.json();
        
        const data = mockData; 
        window.allGigs = data;
        
        renderGigs(window.allGigs);
        setupSearchAndFilter();
    } catch (error) {
        console.error("Gagal load data", error);
    }
}

// 3. Render Gigs
function renderGigs(dataList) {
    const container = document.getElementById('gigs-container');
    container.innerHTML = '';

    if (dataList.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <p>Jasa tidak ditemukan.</p>
        </div>`;
        return;
    }

    dataList.forEach(gig => {
        const imgUrl = gig.image_url || 'https://via.placeholder.com/400x200/1a0b2e/8b5cf6?text=No+Image';
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(gig.id);

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${imgUrl}" alt="${gig.title}">
                <span class="card-category">${gig.category}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${gig.title}</h3>
                <p class="card-meta"><i class="fa-solid fa-user"></i> ${gig.freelancer_name} • ${gig.school}</p>
                <div class="card-footer">
                    <span class="card-price">Rp ${gig.price.toLocaleString('id-ID')}</span>
                    <span class="btn-detail">Detail</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 4. Search & Filter
function setupSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let activeCategory = 'all';

    function applyFilter() {
        const keyword = searchInput.value.toLowerCase();
        const filtered = window.allGigs.filter(gig => {
            const matchSearch = gig.title.toLowerCase().includes(keyword) || 
                                gig.freelancer_name.toLowerCase().includes(keyword) ||
                                gig.school.toLowerCase().includes(keyword);
            const matchCategory = activeCategory === 'all' || gig.category === activeCategory;
            return matchSearch && matchCategory;
        });
        renderGigs(filtered);
    }

    searchInput.addEventListener('input', applyFilter);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.getAttribute('data-category');
            applyFilter();
        });
    });
}

// 5. Modal Logic
function openModal(gigId) {
    const gig = window.allGigs.find(g => g.id === gigId);
    if (!gig) return;

    const modalContent = document.getElementById('modal-content');
    const overlay = document.getElementById('modal-overlay');
    
    // Format WA Link otomatis
    const waText = encodeURIComponent(`Halo ${gig.freelancer_name}, saya tertarik dengan jasa Anda "${gig.title}" di HustleYouth.`);
    const waLink = `https://wa.me/${gig.whatsapp}?text=${waText}`;
    const imgUrl = gig.image_url || 'https://via.placeholder.com/600x300/1a0b2e/8b5cf6?text=No+Image';

    modalContent.innerHTML = `
        <img src="${imgUrl}" style="width:100%; height:180px; object-fit:cover; border-radius:0.5rem; margin-bottom:1rem;">
        <span style="background:rgba(139,92,246,0.2); color:var(--primary); padding:0.25rem 0.75rem; border-radius:999px; font-size:0.75rem;">${gig.category}</span>
        <h2 style="margin:0.5rem 0;">${gig.title}</h2>
        <p style="color:var(--primary); font-weight:bold; font-size:1.2rem; margin-bottom:1rem;">Rp ${gig.price.toLocaleString('id-ID')}</p>
        <p style="color:var(--text-muted); margin-bottom:0.5rem;"><i class="fa-solid fa-user"></i> ${gig.freelancer_name} (${gig.school})</p>
        <p style="margin-bottom:1.5rem; line-height:1.5;">${gig.description}</p>
        
        <!-- ID order-wa-btn sesuai PRD -->
        <a href="${waLink}" target="_blank" id="order-wa-btn" style="display:block; width:100%; text-align:center; background:#16a34a; color:white; font-weight:bold; padding:0.875rem; border-radius:0.5rem;">
            <i class="fa-brands fa-whatsapp"></i> Order via WhatsApp
        </a>
    `;

    overlay.classList.remove('hidden');
    // Timeout kecil agar transisi CSS berjalan
    setTimeout(() => overlay.classList.add('active'), 10); 
}

function setupModalEvents() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal');

    const closeModal = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

// 6. Theme Toggle Logic
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

// 7. Sidebar Logic
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
