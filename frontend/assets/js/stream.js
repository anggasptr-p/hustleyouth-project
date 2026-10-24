// Menggunakan BASE_API dari auth.js jika ada, atau buat fallback aman
const STREAM_BASE_API = typeof BASE_API !== 'undefined' 
  ? BASE_API 
  : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api');

const STREAM_API = `${STREAM_BASE_API}/posts`;
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/wk9j9o7f/image/upload';
const CLOUDINARY_PRESET = 'hustleyouth_preset';

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});

// 1. Fetch & Render Stream Chat Bubbles
async function fetchPosts() {
    const container = document.getElementById('stream-container');
    if (!container) return;

    try {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:3rem;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat obrolan stream...</p>`;

        const url = currentFilter === 'all' ? STREAM_API : `${STREAM_API}?type=${currentFilter}`;
        const res = await fetch(url);
        const result = await res.json();

        if (res.ok && result.status === 'success') {
            renderStream(result.data || []);
        } else {
            container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:3rem;">Gagal memuat stream. Pastikan tabel database sudah terisi.</p>`;
        }
    } catch (err) {
        console.error("Gagal load stream:", err);
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:3rem;">Gagal terhubung ke server stream.</p>`;
    }
}

function renderStream(posts) {
    const container = document.getElementById('stream-container');
    if (!container) return;

    if (!posts || posts.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:3rem;">Belum ada obrolan di Stream. Kirim pesan pertamamu!</p>`;
        return;
    }

    container.innerHTML = posts.map(post => {
        const isHiring = post.post_type === 'hiring';
        const bubbleClass = isHiring ? 'hiring-bubble' : 'seeking-bubble';
        const badgeText = isHiring ? '🟢 Hiring' : '🔵 Showcase';
        const waText = encodeURIComponent(`Halo ${post.author_name}, saya tertarik dengan postingan Anda di HustleYouth Stream: "${post.content.slice(0, 30)}..."`);
        const waLink = `https://wa.me/${post.whatsapp}?text=${waText}`;

        return `
            <div class="chat-bubble ${bubbleClass}">
                <div class="chat-bubble-header">
                    <div>
                        <span class="chat-author">${post.author_name}</span>
                        <span class="chat-school">• 🏫 ${post.school}</span>
                    </div>
                    <span class="post-badge ${isHiring ? 'hiring' : 'seeking_job'}">${badgeText}</span>
                </div>
                <div class="chat-bubble-text">${post.content}</div>
                ${post.image_url ? `<img src="${post.image_url}" class="chat-bubble-img" alt="Attachment">` : ''}
                <div class="chat-bubble-footer">
                    <button onclick="likePost('${post.id}', this)" class="btn-like">
                        <i class="fa-solid fa-heart"></i> <span>${post.likes_count || 0}</span>
                    </button>
                    <a href="${waLink}" target="_blank" class="btn-wa-direct">
                        <i class="fa-brands fa-whatsapp"></i> Chat / DM WA
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// 2. Bikin Post Baru dari Bottom Input Bar
async function handleCreatePost(e) {
    e.preventDefault();
    const user = getCurrentUser();

    if (!user) {
        alert("Lo harus Login dulu ler buat ngirim pesan di Stream!");
        window.location.href = 'login.html';
        return;
    }

    const content = document.getElementById('post_content').value;
    const postTypeRadio = document.querySelector('input[name="post_type"]:checked');
    const postType = postTypeRadio ? postTypeRadio.value : 'hiring';
    const imageInput = document.getElementById('post_image_file');

    const btn = document.getElementById('btn-submit-post');
    if (btn) btn.disabled = true;

    try {
        let imageUrl = null;
        if (imageInput && imageInput.files.length > 0) {
            if (btn) btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
            const formData = new FormData();
            formData.append('file', imageInput.files[0]);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            const clRes = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
            const clData = await clRes.json();
            imageUrl = clData.secure_url;
        }

        if (btn) btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        const res = await fetch(STREAM_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                post_type: postType,
                content: content,
                image_url: imageUrl
            })
        });

        if (res.ok) {
            document.getElementById('stream-form').reset();
            const indicator = document.getElementById('file-selected-indicator');
            if (indicator) indicator.classList.add('hidden');
            fetchPosts();
        } else {
            alert("Gagal ngirim pesan ler!");
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem!");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;
        }
    }
}

// 3. Helper Functions
function previewFileSelected(input) {
    const indicator = document.getElementById('file-selected-indicator');
    if (!indicator) return;
    if (input.files.length > 0) {
        indicator.innerText = `📎 File terpilih: ${input.files[0].name}`;
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
    }
}

async function likePost(id, btn) {
    try {
        const res = await fetch(`${STREAM_API}/${id}/like`, { method: 'PATCH' });
        const data = await res.json();
        if (data.status === 'success') {
            btn.querySelector('span').innerText = data.data.likes_count;
            btn.classList.add('liked');
        }
    } catch (err) { console.error(err); }
}

function toggleTypeChip(type) {
    const chipHiring = document.getElementById('chip-hiring');
    const chipSeeking = document.getElementById('chip-seeking');
    if (!chipHiring || !chipSeeking) return;

    if (type === 'hiring') {
        chipHiring.classList.add('selected-hiring');
        chipSeeking.classList.remove('selected-seeking');
    } else {
        chipSeeking.classList.add('selected-seeking');
        chipHiring.classList.remove('selected-hiring');
    }
}

function filterStream(type, btn) {
    currentFilter = type;
    document.querySelectorAll('#stream-filters .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    fetchPosts();
}
