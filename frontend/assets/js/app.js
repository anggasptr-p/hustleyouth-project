const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api/gigs'
  : '/api/gigs';

let allGigs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchGigs();
    setupFilters();
    setupSearch();
});

// 1. Fetch Data Gigs dari API
async function fetchGigs() {
    const container = document.getElementById('gigs-container');
    if (!container) return;

    // GEN Z SKELETON LOADER
    const skeletonCard = `
        <div class="card" style="pointer-events:none; border-color:transparent;">
            <div class="card-img-wrapper" style="background:var(--glass-bg); animation: pulse 1.5s infinite;"></div>
            <div class="card-body">
                <div style="height:22px; width:85%; background:var(--glass-bg); border-radius:4px; margin-bottom:12px; animation: pulse 1.5s infinite;"></div>
                <div style="height:16px; width:50%; background:var(--glass-bg); border-radius:4px; margin-bottom:24px; animation: pulse 1.5s infinite;"></div>
                <div style="display:flex; justify-content:space-between; margin-top:auto;">
                    <div style="height:24px; width:40%; background:var(--glass-bg); border-radius:4px; animation: pulse 1.5s infinite;"></div>
                    <div style="height:32px; width:30%; background:var(--glass-bg); border-radius:6px; animation: pulse 1.5s infinite;"></div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = skeletonCard.repeat(6);

    try {
        const res = await fetch(API_URL);
        const result = await res.json();

        if (res.ok && (result.status === 'success' || Array.isArray(result.data))) {
            allGigs = result.data || [];
            renderGigs(allGigs);
        } else {
            container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:3rem;">Gagal memuat katalog jasa ler.</p>`;
        }
    } catch (err) {
        console.error('Fetch error:', err);
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:3rem;">Gagal terhubung ke server backend.</p>`;
    }
}

// 2. Render Kartu Gigs
function renderGigs(gigs) {
    const container = document.getElementById('gigs-container');
    if (!container) return;

    // GEN Z EMPTY STATE
    if (!gigs || gigs.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem 1rem; background:var(--card-bg); border:2px dashed var(--glass-border); border-radius:1rem;">
                <div style="font-size:3rem; margin-bottom:1rem; animation: bounce 2s infinite;">🔍</div>
                <h3 style="font-family:'Space Grotesk', sans-serif; font-size:1.5rem; margin-bottom:0.5rem;">Yah, belum ada yang jual jasa ini ler...</h3>
                <p style="color:var(--text-muted); font-size:0.9rem; max-width:400px; margin:0 auto 1.5rem auto;">
                    Coba cari kata kunci lain, atau jadi orang pertama yang buka jasa di kategori ini!
                </p>
                <a href="tambah-jasa.html" class="btn-auth-header" style="display:inline-flex; text-decoration:none;">Buka Jasa Sekarang 🚀</a>
            </div>
        `;
        return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80';

    container.innerHTML = gigs.map(gig => `
        <div class="card" onclick="openModal('${gig.id}')">
            <div class="card-img-wrapper">
                <img src="${gig.image_url || defaultImg}" alt="${gig.title}" onerror="this.src='${defaultImg}'">
                <span class="card-category">${gig.category}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${gig.title}</h3>
                
                <div class="trust-layer">
                    <span class="badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
                    <span class="rating">★ 4.9</span>
                </div>

                <p class="card-meta">
                    <span class="online-dot"></span> 
                    ${gig.freelancer_name} • ${gig.school}
                </p>
                <div class="card-footer">
                    <span class="card-price">Rp ${Number(gig.price).toLocaleString('id-ID')}</span>
                    <span class="btn-detail">Pesan <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Category Filter
function setupFilters() {
    const filterBtns = document.querySelectorAll('#category-filters .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.getAttribute('data-category');
            if (cat === 'all') {
                renderGigs(allGigs);
            } else {
                renderGigs(allGigs.filter(g => g.category && g.category.toLowerCase() === cat.toLowerCase()));
            }
        });
    });
}

// 4. Live Search
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allGigs.filter(g => 
            (g.title && g.title.toLowerCase().includes(query)) ||
            (g.freelancer_name && g.freelancer_name.toLowerCase().includes(query)) ||
            (g.school && g.school.toLowerCase().includes(query)) ||
            (g.category && g.category.toLowerCase().includes(query))
        );
        renderGigs(filtered);
    });
}

// 5. Pop-up Modal Detail
function openModal(id) {
    const gig = allGigs.find(g => g.id === id);
    if (!gig) return;

    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;

    const waText = encodeURIComponent(`Halo ${gig.freelancer_name}, saya lihat jasa Anda "${gig.title}" di HustleYouth dan berminat untuk order.`);
    const waLink = `https://wa.me/${gig.whatsapp}?text=${waText}`;

    content.innerHTML = `
        <div style="text-align:left; margin-bottom:1rem;">
            <span class="card-category" style="position:static; display:inline-block; margin-bottom:0.8rem; transform:rotate(-2deg);">${gig.category}</span>
            <h2 style="font-size:1.5rem; font-weight:800; line-height:1.3; font-family:'Space Grotesk', sans-serif;">${gig.title}</h2>
            
            <div class="trust-layer" style="margin-top:0.5rem;">
                <span class="badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
                <span class="rating">★ 4.9</span>
                <span style="color:var(--text-muted); font-size:0.8rem;">(12 Ulasan)</span>
            </div>

            <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.5rem;">
                oleh <b style="color:var(--text-main);">${gig.freelancer_name}</b> (${gig.school})
            </p>
        </div>

        ${gig.image_url ? `<img src="${gig.image_url}" style="width:100%; max-height:250px; object-fit:cover; border-radius:1rem; margin-bottom:1.25rem; border:1px solid var(--glass-border);">` : ''}
        
        <p style="font-size:0.95rem; line-height:1.6; color:var(--text-main); margin-bottom:1.5rem; white-space:pre-line;">${gig.description}</p>
        
        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid var(--glass-border);">
            <span class="card-price" style="font-size:1.5rem;">Rp ${Number(gig.price).toLocaleString('id-ID')}</span>
            <a href="${waLink}" target="_blank" class="btn-wa-direct" style="padding:0.75rem 1.5rem; font-size:0.95rem;">
                <i class="fa-brands fa-whatsapp fa-lg"></i> Order via WA
            </a>
        </div>
    `;

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('active'), 10);

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        };
    }
}
