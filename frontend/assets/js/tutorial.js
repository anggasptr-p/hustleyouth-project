const tourSteps = [
    {
        target: null, 
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
    if (localStorage.getItem('hy_tour_done') === 'true') return;

    const tourHTML = `
        <div id="tour-overlay" class="tour-overlay"></div>
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
    `;

    document.body.insertAdjacentHTML('beforeend', tourHTML);
    
    setTimeout(() => {
        document.getElementById('tour-overlay').classList.add('active');
        document.getElementById('tour-tooltip').classList.add('active');
        updateTourUI();
    }, 500);
}

function updateTourUI() {
    const step = tourSteps[currentStep];
    
    document.getElementById('tour-title').innerText = step.title;
    document.getElementById('tour-desc').innerText = step.desc;
    document.getElementById('tour-badge').innerText = `${currentStep + 1} dari ${tourSteps.length}`;

    const dotsContainer = document.getElementById('tour-dots');
    dotsContainer.innerHTML = tourSteps.map((_, idx) => `
        <span class="tour-dot ${idx === currentStep ? 'active' : ''}"></span>
    `).join('');

    const nextBtn = document.getElementById('btn-next-tour');
    nextBtn.innerHTML = currentStep === tourSteps.length - 1 ? `Gas Coba! 🔥` : `Lanjut →`;

    // --- SPOTLIGHT LOGIC ---
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });

    const tooltip = document.getElementById('tour-tooltip');

    if (step.target) {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
            // 1. Scroll to element first (smoothly) so it's not off-screen
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 2. Wait for scroll to finish before calculating position
            setTimeout(() => {
                targetEl.classList.add('tour-highlight');
                const rect = targetEl.getBoundingClientRect();
                
                // Reset
                tooltip.style.top = '';
                tooltip.style.bottom = '';
                tooltip.style.left = '';
                tooltip.style.transform = '';

                // Calculate Horizontal (Mobile safe)
                let leftPos = Math.max(10, Math.min(window.innerWidth - (window.innerWidth < 480 ? 40 : 360), rect.left));
                // If on mobile, force it to the left margin
                if (window.innerWidth <= 480) leftPos = 20; 

                // Calculate Vertical with viewport clamping
                let topPos = 0;
                
                if (step.position === 'bottom') {
                    topPos = rect.bottom + 20;
                } else if (step.position === 'top') {
                    topPos = rect.top - 240; // Roughly the height of the tooltip
                    if (topPos < 80) topPos = rect.bottom + 20; // Fallback if it hits top edge
                }

                // CLAMPING: Prevent tooltip from going below the screen or above the screen
                const tooltipHeight = 240; // Approximate height of tooltip
                if (topPos + tooltipHeight > window.innerHeight) {
                    topPos = window.innerHeight - tooltipHeight - 20;
                }
                if (topPos < 60) topPos = 60; // Keep it below the top edge (space for mascot)

                tooltip.style.top = `${topPos}px`;
                tooltip.style.left = `${leftPos}px`;
                
            }, 400); // 400ms delay for smooth scroll to finish
        }
    } else {
        // Center for Welcome Step
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }
}

function nextTourStep() {
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

function skipTour() { finishTour(); }

function finishTour() {
    localStorage.setItem('hy_tour_done', 'true');
    const overlay = document.getElementById('tour-overlay');
    const tooltip = document.getElementById('tour-tooltip');
    
    if (overlay && tooltip) {
        overlay.classList.remove('active');
        tooltip.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            tooltip.remove();
        }, 300);
    }
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initOnboardingTour, 1500); 
});
