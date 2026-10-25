// Data Langkah Onboarding Tutorial (Hustly Tour)
const tourSteps = [
    {
        target: null, // Center screen
        title: "Halo, kenalin aku Hustly! 👋",
        desc: "Aku bakal nemenin kamu keliling HustleYouth. Yuk, kenalan sama fitur-fiturnya biar kamu ga bingung!",
        position: 'center'
    },
    {
        target: '#search-input',
        title: "Cari Jasa Disini 🔍",
        desc: "Butuh jasa desain atau koding? Tinggal ketik di sini, langsung muncul katalognya!",
        position: 'bottom'
    },
    {
        target: '#category-filters',
        title: "Filter Kategori 🏷️",
        desc: "Mau cari yang spesifik? Klik kategori ini buat nyaring hasil pencarianmu.",
        position: 'bottom'
    },
    {
        target: '#gigs-container',
        title: "Pilih Jasa & Order 🛍️",
        desc: "Klik salah satu kartu ini buat liat portofolio lengkap dan langsung chat via WhatsApp!",
        position: 'top'
    },
    {
        target: '#open-sidebar',
        title: "Jelajahi Lebih Jauh 🧭",
        desc: "Buka menu ini buat akses HustleStream (live chat) atau buka jasa kamu sendiri!",
        position: 'bottom'
    }
];

let currentStep = 0;

function initOnboardingTour() {
    // Cek apakah user udah pernah liat tutorial
    if (localStorage.getItem('hy_tour_done') === 'true') return;

    // Inject HTML Overlay (Dark background + Tooltip Container)
    const tourHTML = `
        <div id="tour-overlay" class="tour-overlay">
            <!-- The Tooltip Box with Mascot -->
            <div id="tour-tooltip" class="tour-tooltip">
                <div class="tour-mascot-img">
                    <img src="assets/img/mascot.png" alt="Hustly" onerror="this.style.display='none'">
                </div>
                <div class="tour-content">
                    <div class="tour-header">
                        <span id="tour-badge" class="tour-badge-step">1 dari 5</span>
                        <button onclick="skipTour()" class="btn-skip-tour">Skip ✕</button>
                    </div>
                    <h3 id="tour-title" class="tour-title-text">Title</h3>
                    <p id="tour-desc" class="tour-desc-text">Description</p>
                    <div class="tour-footer">
                        <div class="tour-dots" id="tour-dots"></div>
                        <button id="btn-next-tour" onclick="nextTourStep()" class="btn-tour-next">Lanjut →</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', tourHTML);
    
    // Beri sedikit delay agar DOM ready
    setTimeout(() => {
        document.getElementById('tour-overlay').classList.add('active');
        updateTourUI();
    }, 500);
}

function updateTourUI() {
    const step = tourSteps[currentStep];
    
    // Update Text
    document.getElementById('tour-title').innerText = step.title;
    document.getElementById('tour-desc').innerText = step.desc;
    document.getElementById('tour-badge').innerText = `${currentStep + 1} dari ${tourSteps.length}`;

    // Update Dots
    const dotsContainer = document.getElementById('tour-dots');
    dotsContainer.innerHTML = tourSteps.map((_, idx) => `
        <span class="tour-dot ${idx === currentStep ? 'active' : ''}"></span>
    `).join('');

    // Update Button Text
    const nextBtn = document.getElementById('btn-next-tour');
    if (currentStep === tourSteps.length - 1) {
        nextBtn.innerHTML = `Gas Coba! 🔥`;
    } else {
        nextBtn.innerHTML = `Lanjut →`;
    }

    // --- SPOTLIGHT LOGIC ---
    // Hapus highlight dari step sebelumnya
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });

    const tooltip = document.getElementById('tour-tooltip');

    if (step.target) {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
            // 1. Highlight Target Element
            targetEl.classList.add('tour-highlight');
            
            // 2. Position Tooltip
            const rect = targetEl.getBoundingClientRect();
            
            // Reset position classes
            tooltip.style.top = '';
            tooltip.style.bottom = '';
            tooltip.style.left = '';
            tooltip.style.transform = '';

            if (step.position === 'bottom') {
                tooltip.style.top = `${rect.bottom + 20}px`;
                tooltip.style.left = `${Math.max(10, Math.min(window.innerWidth - 350, rect.left))}px`;
            } else if (step.position === 'top') {
                tooltip.style.bottom = `${window.innerHeight - rect.top + 20}px`;
                tooltip.style.left = `${Math.max(10, Math.min(window.innerWidth - 350, rect.left))}px`;
            } else {
                // Default center
                tooltip.style.top = '50%';
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translate(-50%, -50%)';
            }
        }
    } else {
        // Center for Welcome Step
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }
}

function nextTourStep() {
    // Hapus highlight terakhir
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });

    if (currentStep < tourSteps.length - 1) {
        currentStep++;
        updateTourUI();
    } else {
        finishTour();
    }
}

function skipTour() {
    finishTour();
}

function finishTour() {
    localStorage.setItem('hy_tour_done', 'true');
    const overlay = document.getElementById('tour-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });
}

// Jalankan otomatis saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Delay agar halaman selesai render dulu
    setTimeout(initOnboardingTour, 1500); 
});
