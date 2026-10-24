// Data Langkah Onboarding Tutorial
const tourSteps = [
    {
        title: "⚡ Selamat Datang di HustleYouth!",
        desc: "Platform freelance & micro-gig khusus anak muda dan pelajar. Tempat lo pamerin keahlian, dapet cuan, atau nyari talent sejawat buat bantuin tugas & project lo.",
        badge: "1 dari 4"
    },
    {
        title: "🔍 Eksplorasi Katalog Jasa",
        desc: "Lo bisa cari berbagai keahlian mulai dari Design, Video Editing, Code, sampe Writing. Klik card buat liat detail portofolio dan langsung hubungi via WhatsApp!",
        badge: "2 dari 4"
    },
    {
        title: "➕ Buka Jasa Sendiri",
        desc: "Punya skill? Tawarkan jasamu disini! Data profil lo bakal otomatis terisi, dan foto portofolio langsung tersimpan aman berkat integrasi Cloudinary.",
        badge: "3 dari 4"
    },
    {
        title: "📡 Killer Feature: HustleStream Room",
        desc: "Fitur paling high-end kita! Tempat nongkrong & ngobrol komunitas secara live. Lo bisa posting '🟢 Butuh Talent' atau '🔵 Showcase Karya' pake bubble chat interaktif!",
        badge: "4 dari 4"
    }
];

let currentStep = 0;

function initOnboardingTour() {
    // Cek apakah user udah pernah liat tutorial
    if (localStorage.getItem('hy_tour_done') === 'true') return;

    // Inject HTML Overlay Modal ke Body
    const tourHTML = `
        <div id="tour-overlay" class="modal-overlay active">
            <div class="modal-content tour-modal-card">
                <div class="tour-header">
                    <span id="tour-badge" class="tour-badge-step">1 dari 4</span>
                    <button onclick="skipTour()" class="btn-skip-tour">Skip ✕</button>
                </div>
                
                <div class="tour-body">
                    <h2 id="tour-title" class="tour-title-text">Title</h2>
                    <p id="tour-desc" class="tour-desc-text">Description</p>
                </div>

                <div class="tour-footer">
                    <div class="tour-dots" id="tour-dots"></div>
                    <button id="btn-next-tour" onclick="nextTourStep()" class="btn-submit" style="width: auto; padding: 0.6rem 1.5rem; margin: 0;">
                        Lanjut →
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', tourHTML);
    updateTourUI();
}

function updateTourUI() {
    const step = tourSteps[currentStep];
    document.getElementById('tour-title').innerText = step.title;
    document.getElementById('tour-desc').innerText = step.desc;
    document.getElementById('tour-badge').innerText = step.badge;

    // Render Dots Indicator
    const dotsContainer = document.getElementById('tour-dots');
    dotsContainer.innerHTML = tourSteps.map((_, idx) => `
        <span class="tour-dot ${idx === currentStep ? 'active' : ''}"></span>
    `).join('');

    const nextBtn = document.getElementById('btn-next-tour');
    if (currentStep === tourSteps.length - 1) {
        nextBtn.innerHTML = `Gas Coba! 🔥`;
    } else {
        nextBtn.innerHTML = `Lanjut →`;
    }
}

function nextTourStep() {
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
}

// Jalankan otomatis saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initOnboardingTour, 600); // Delay dikit biar pas animasi masuk
});
