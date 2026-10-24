// Otomatis pake http://localhost:5000 pas dev lokal, atau relatif pas di Vercel
const BASE_API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : '/api';

const API_URL = `${BASE_API}/gigs`;
const AUTH_API = `${BASE_API}/auth`;
const STREAM_API = `${BASE_API}/posts`;
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/wk9j9o7f/image/upload';
const CLOUDINARY_PRESET = 'hustleyouth_preset';

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});

// 1. Fetch & Render Stream Chat Bubbles
async function fetchPosts() {
    try {
        const url = currentFilter === 'all' ? STREAM_API : `${STREAM_API}?type=${currentFilter}`;
        const res = await fetch(url);
        const result = await res.json();

        if (result.status === 'success') {
            renderStream(result.data);
        }
    } catch (err) {
        console.error("Gagal load stream:", err);
    }
}

function renderStream(posts) {
    const container = document.getElementById('stream-container');
    if (!container) return;

    if (posts.length === 0) {
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
                        <i class="fa-solid fa-heart"></i> <span>${post.likes_count}</span>
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
    const postType = document.querySelector('input[name="post_type"]:checked').value;
    const imageInput = document.getElementById('post_image_file');

    const btn = document.getElementById('btn-submit-post');
    btn.disabled = true;

    try {
        let imageUrl = null;
        if (imageInput && imageInput.files.length > 0) {
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
            const formData = new FormData();
            formData.append('file', imageInput.files[0]);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            const clRes = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
            const clData = await clRes.json();
            imageUrl = clData.secure_url;
        }

        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
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
            document.getElementById('file-selected-indicator').classList.add('hidden');
            fetchPosts();
        } else {
            alert("Gagal ngirim pesan ler!");
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem!");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;
    }
}

// 3. Helper Functions
function previewFileSelected(input) {
    const indicator = document.getElementById('file-selected-indicator');
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
    btn.classList.add('active');
    fetchPosts();
}
