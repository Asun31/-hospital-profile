document.addEventListener('DOMContentLoaded', () => {
  console.log("berita.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; // URL backend Laravel
  const searchInput = document.getElementById('searchInput');
  const container = document.getElementById('berita-berita_m');

  let beritaData = [];
  function initSection() {
    fetch(`${LARAVEL_URL}/api/berita`)
      .then(res => res.json())
      .then(data => {
        beritaData = data;
        renderCards();
      })
      .catch(err => console.error(`Error fetching berita:`, err));
  }

  // Render kartu berita ke container
  function renderCards() {
    container.innerHTML = '';
    beritaData.forEach((item, index) => {
      container.innerHTML += `
        <div class="card searchable" data-index="${index}">
          <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}">
          <div class="card-content">
            <h3>${item.title}</h3>
            <p>${item.content.substring(0, 100)}...</p>
             <p style="font-size: 12px; color: #777; margin-bottom: 10px; margin-top: 10px;">
              <strong>Upload pada tanggal</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}<br> 
              <strong>oleh</strong> ${item.author || 'Admin'}
            </p>
            <button class="read-more" data-index="${index}">Selengkapnya</button>
          </div>
        </div>
      `;
    });
  }

  // Modal detail berita (buat sekali)
  let detailModal = document.getElementById('detailModal');
  if (!detailModal) {
    detailModal = document.createElement('div');
    detailModal.id = 'detailModal';
    detailModal.style.position = 'fixed';
    detailModal.style.top = '0';
    detailModal.style.left = '0';
    detailModal.style.width = '100vw';
    detailModal.style.height = '100vh';
    detailModal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    detailModal.style.display = 'none';
    detailModal.style.zIndex = '3000';
    detailModal.style.overflowY = 'auto';
    detailModal.style.padding = '30px 15px';
    detailModal.style.boxSizing = 'border-box';
    detailModal.style.fontFamily = 'Arial, sans-serif';

    detailModal.innerHTML = `
      <div style="
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      ">
        <button id="closeDetailModal" style="
          float: right;
          font-size: 28px;
          font-weight: bold;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 10px 15px;
        ">&times;</button>
        <img id="detailImage" src="" alt="Gambar Berita" style="
          width: 100%;
          height: auto;
          display: block;
        ">
        <div style="padding: 20px;">
          <h2 id="detailTitle" style="margin-top: 0; margin-bottom: 10px;"></h2>
          <p id="detailDate" style="font-size: 14px; color: #007bff; margin-top: 0; margin-bottom: 20px; font-weight: bold;"></p>
          <p id="detailContent" style="font-size: 16px; line-height: 1.5; white-space: pre-line; color: #333;"></p>
        </div>
      </div>
    `;

    document.body.appendChild(detailModal);

    // Close modal event
    document.getElementById('closeDetailModal').addEventListener('click', () => {
      detailModal.style.display = 'none';
    });

    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.style.display = 'none';
    });
  }

  // Fungsi tampilkan modal detail berita
  function showDetailModal(index) {
    const item = beritaData[index];
    if (!item) return;

    document.getElementById('detailTitle').innerText = item.title;
    const dateStr = item.created_at
      ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    document.getElementById('detailDate').innerText = `Upload pada tanggal ${dateStr}, oleh ${item.author || 'Admin'}`;
    document.getElementById('detailImage').src = `${LARAVEL_URL}/storage/${item.img}`;
    document.getElementById('detailImage').alt = item.title;
    document.getElementById('detailContent').innerText = item.content;

    detailModal.style.display = 'block';
    detailModal.scrollTop = 0;
  }

  // Event delegation untuk tombol Selengkapnya
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more')) {
      const idx = e.target.getAttribute('data-index');
      showDetailModal(idx);
    }
  });

  // === Bagian modal buka/tutup modal add baru (kode kamu sebelumnya) ===
  const addBtn = document.getElementById('addberitaBtn');
  const modal = document.getElementById('beritaModal');
  const closeBtn = document.getElementById('closeberitaModal');
  const form = document.getElementById('beritaForm');

  addBtn?.addEventListener('click', () => modal.style.display = 'block');
  closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const img = form.querySelector('input[type="file"]').files[0];
    const title = form.querySelector('input[name="title"]').value;
    const content = form.querySelector('textarea[name="content"]').value;

    if (!img) return alert("Harap pilih gambar!");

    const validImageTypes = ['image/jpeg','image/jpg','image/png','image/bmp','image/gif'];
    if (!validImageTypes.includes(img.type)) return alert("File bukan gambar valid.");

    const formData = new FormData();
    formData.append('img', img);
    formData.append('title', title);
    formData.append('content', content);

    fetch(`${LARAVEL_URL}/api/berita`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(newCard => {
      beritaData.push(newCard);
      renderCards();
      modal.style.display = 'none';
      form.reset();
    })
    .catch(err => {
      console.error(`Error adding berita:`, err);
      alert(`Gagal menambahkan data, periksa koneksi backend berita.`);
    });
  });

  // ==== Pencarian Global ====
  searchInput?.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const sections = document.querySelectorAll('main section');

    sections.forEach(section => {
      const sectionTitle = section.querySelector('h2.section-title')?.innerText.toLowerCase() || '';
      const cards = section.getElementsByClassName('card');
      let cardMatches = false;

      if (sectionTitle.includes(searchTerm) && searchTerm !== '') {
        section.style.display = '';
        Array.from(cards).forEach(card => {
          card.style.display = '';
        });
        return; 
      }

      Array.from(cards).forEach(card => {
        const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
        const content = card.querySelector('p')?.innerText.toLowerCase() || '';
        const matches = title.includes(searchTerm) || content.includes(searchTerm);

        card.style.display = matches || searchTerm === '' ? '' : 'none';
        if (matches) cardMatches = true;
      });

      if (sectionTitle.includes(searchTerm) || cardMatches || searchTerm === '') {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    });
  });

  // Inisialisasi
  initSection();
});