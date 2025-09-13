// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */ 

document.addEventListener('DOMContentLoaded', () => {
  console.log("berita.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; 
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

  function renderCards() {
    container.innerHTML = '';
    beritaData.forEach((item, index) => {
      container.innerHTML += `
        <div class="card searchable" data-index="${index}" style="cursor: pointer; position: relative; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Tombol Hapus di atas -->
          <button class="delete-card" data-index="${index}" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            z-index: 10;
          ">Hapus</button>

          <!-- Gambar -->
          <div style="
            width: 100%;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
          ">
            <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              display: block;
            ">
          </div>

          <!-- Konten Card -->
          <div class="card-content" style="padding: 15px;">
            <h3>${item.title}</h3>
            <p>${item.content.substring(0, 100)}...</p>
            <p style="font-size: 10px; color: #777; margin-bottom: 10px; margin-top: 10px;">
              <strong>Upload pada tanggal</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'},<br> 
              <strong>oleh</strong> ${item.author || 'Admin'}
            </p>
            <button class="read-more" data-index="${index}">Selengkapnya</button>
          </div>
        </div>
      `;
    });

    container.querySelectorAll('.delete-card').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#c0392b';
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#e74c3c';
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      });
    });

    container.querySelectorAll('.delete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = btn.getAttribute('data-index');
        const item = beritaData[idx];
        if (confirm('Apakah yakin ingin menghapus berita ini?')) {
          fetch(`${LARAVEL_URL}/api/berita/${item.id}`, { method: 'DELETE' })
            .then(res => {
              if (res.ok) {
                beritaData.splice(idx, 1);
                renderCards();
                alert('Berita berhasil dihapus!');
              } else {
                alert('Gagal menghapus berita.');
              }
            })
            .catch(err => console.error(err));
        }
      });
    });
  }

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
      <div id="detailModalContent" style="
        position: relative;
        max-width: 900px;
        width: 90%;
        margin: 50px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        transform: translateY(-50px);
        opacity: 0;
        transition: all 0.3s ease;
      ">
        <button id="closeDetailModal" style="
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 12px;
          font-weight: bold;
          border: none;
          background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3));
          color: white;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          transition: transform 0.2s ease, background 0.3s ease, box-shadow 0.3s ease;
        ">&times;</button>

        <div style="
          width: 100%;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f8f8;
          overflow: hidden;
        ">
          <img id="detailImage" src="" alt="Gambar Berita" style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
            transition: transform 0.3s ease;
          ">
        </div>

        <div style="
          padding: 25px 30px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
          <h2 id="detailTitle" style="
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 16px;
            color: #048a16;
          "></h2>
          <p id="detailDate" style="
            font-size: 10px;
            color: #007bff;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          "></p>
          <p id="detailContent" style="
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-line;
            color: #444;
            text-align: justify;
          "></p>
        </div>
      </div>
    `;

    document.body.appendChild(detailModal);

    setTimeout(() => {
      const modalContent = document.getElementById('detailModalContent');
      modalContent.style.transform = 'translateY(0)';
      modalContent.style.opacity = '1';
    }, 10);

    const closeBtnDetail = document.getElementById('closeDetailModal');
    closeBtnDetail.addEventListener('click', () => {
      detailModal.style.display = 'none';
    });
    closeBtnDetail.addEventListener('mouseenter', () => {
      closeBtnDetail.style.transform = 'scale(1.2)';
      closeBtnDetail.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5))';
      closeBtnDetail.style.boxShadow = '0 6px 18px rgba(0,0,0,0.6)';
    });
    closeBtnDetail.addEventListener('mouseleave', () => {
      closeBtnDetail.style.transform = 'scale(1)';
      closeBtnDetail.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))';
      closeBtnDetail.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
    });

    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.style.display = 'none';
    });
  }

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

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more')) {
      const idx = e.target.getAttribute('data-index');
      showDetailModal(idx);
    }
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more')) {
      const idx = e.target.getAttribute('data-index');
      showDetailModal(idx);
    }

    const card = e.target.closest('.card');
    if (card && !e.target.classList.contains('read-more')) {
      const idx = card.getAttribute('data-index');
      showDetailModal(idx);
    }
  });

  
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