/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */ 

document.addEventListener('DOMContentLoaded', () => {
  console.log("doktergigi.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; 
  const searchInput = document.getElementById('searchInput');
  const container = document.getElementById('doktergigi-doktergigi_m');

  let doktergigiData = [];

  function initSection() {
    fetch(`${LARAVEL_URL}/api/doktergigi`)
      .then(res => res.json())
      .then(data => {
        doktergigiData = data;
        renderCards();
      })
      .catch(err => console.error(`Error fetching doktergigi:`, err));
  }

  function renderCards() {
    container.innerHTML = '';

    const itemsToRender = [...doktergigiData].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    itemsToRender.forEach((item) => {
      const createdTime = new Date(item.created_at).getTime();
      const now = Date.now();
      const isNew = now - createdTime < 24 * 60 * 60 * 1000; 

      container.innerHTML += `
        <div class="card searchable" data-id="${item.id}" style="
          cursor: pointer;
          position: relative;
          margin-top: 10px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.3s ease;
        ">
          ${isNew ? `<span style="
            position: absolute;
            top: 10px;
            left: 10px;
            background: #81cd8d;
            color: white;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            z-index: 10;
          ">Terbaru</span>` : ''}

          <button class="edit-card" data-id="${item.id}" style="
            position: absolute;
            top: 10px;
            right: 100px;
            background: #3498db;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            z-index: 10;
          ">✏️ Edit</button>

          <button class="delete-card" data-id="${item.id}" style="
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
          ">🗑️ Hapus</button>

          <div style="
            width: 100%;
            height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
            overflow: hidden;
          ">
           <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            background-color: #fff;
          ">

          </div>

          <div class="card-content" style="padding: 10px 12px;">
            <h3 style="font-size: 14px; margin: 5px 0;">${item.title}</h3>
            <p style="
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 12px;
              margin: 0 0 6px;
            ">
              ${item.content}
            </p>
            <p style="font-size: 10px; color: #777; margin: 0 0 8px;">
              <strong>Upload:</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}<br>
              <strong>Oleh:</strong> ${item.author || 'Admin'}
            </p>
            <button class="read-more" data-id="${item.id}" style="
              background: transparent;
              border: 1px solid #3498db;
              color: #3498db;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
            ">Selengkapnya</button>
          </div>
        </div>
      `;
    });

    container.querySelectorAll('.delete-card').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#c0392b';
        btn.style.transform = 'scale(1.05)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#e74c3c';
        btn.style.transform = 'scale(1)';
      });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = doktergigiData.find(b => b.id == id);
        if (!item) return;

        if (confirm('Apakah yakin ingin menghapus doktergigi ini?')) {
          fetch(`${LARAVEL_URL}/api/doktergigi/${item.id}`, { method: 'DELETE' })
            .then(res => {
              if (res.ok) {
                doktergigiData = doktergigiData.filter(b => b.id !== item.id);
                renderCards();
                alert('doktergigi berhasil dihapus!');
              } else {
                alert('Gagal menghapus doktergigi.');
              }
            })
            .catch(err => console.error(err));
        }
      });
    });

    container.querySelectorAll('.edit-card').forEach(btn => {
      btn.addEventListener('mouseenter', () => btn.style.background = '#2980b9');
      btn.addEventListener('mouseleave', () => btn.style.background = '#3498db');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const item = doktergigiData.find(b => b.id == id);
        if (!item) return;

        document.getElementById('editTitle').value = item.title;
        document.getElementById('editContent').value = item.content;
        document.getElementById('editdoktergigiModal').style.display = 'block';
        document.getElementById('editdoktergigiForm').setAttribute('data-id', item.id);
      });
    });
  }

  // === Modal Detail ===
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
        max-width: 1000px;
        width: 95%;
        margin: 50px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        transform: translateY(-50px);
        opacity: 0;
        transition: all 0.3s ease;
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
        padding: 25px;
      ">
        <button id="closeDetailModal" style="
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 20px;
          font-weight: bold;
          border: none;
          background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3));
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          transition: transform 0.2s ease, background 0.3s ease, box-shadow 0.3s ease;
        ">&times;</button>

        <!-- FOTO DOKTER -->
        <div style="
          width: 100%;
          max-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        ">
          <img id="detailImage" src="" alt="Gambar dokter" style="
            width: 100%;
            height: auto;
            object-fit: cover;
            display: block;
          ">
          <div style="padding: 15px; text-align: center;">
            <h2 id="detailTitle" style="
              font-size: 16px;
              color: #048a16;
              margin: 0 0 5px;">
            </h2>
            <p id="detailContent" style="
              font-size: 12px;
              line-height: 1.6;
              white-space: pre-line;
              color: #444;
              margin: 0;
            "></p>
            <br>
            <p id="detailDate" style="
              font-size: 12px;
              color: #555;
              margin: 0;
            "></p>
          </div>
        </div>

        <!-- INFORMASI DETAIL -->
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 20px;
        ">
          <div>
            <h3 style="margin: 0 0 10px; font-size: 18px; font-weight: bold;">📅 Jadwal Praktek</h3>
            <!-- Tambahan untuk Jadwal Dokter -->
          <img id="detailSchedule" src="" alt="Jadwal Dokter" style="
              width: 100%;
              max-height: 100%;
              object-fit: contain;
              margin-top: 30px;
              display: none;
              border: 1px solid #ccc;
              border-radius: 6px;
            ">
          </div>

          <div>
            <div id="detailLicense" style="font-size: 10px; line-height: 1.6; color: #444;"> <p>&copy; <span class="powered-by">RSUD Talang Ubi Powered by asunfadrianto | All rights reserved.</span></p></div>
          </div>
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


// Show detail modal by id
function showDetailModal(id) {
  const item = doktergigiData.find(b => b.id == id);
  if (!item) return;

  document.getElementById('detailTitle').innerText = item.title;
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  document.getElementById('detailDate').innerText = `Upload ${dateStr}, oleh ${item.author || 'Admin'}`;
  document.getElementById('detailImage').src = `${LARAVEL_URL}/storage/${item.img}`;
  document.getElementById('detailImage').alt = item.title;
  document.getElementById('detailContent').innerText = item.content;

  // Tambahkan jadwal dokter jika ada
  const scheduleEl = document.getElementById('detailSchedule');
  if (item.img2) {
    scheduleEl.src = `${LARAVEL_URL}/storage/${item.img2}`;
    scheduleEl.alt = `Jadwal ${item.title}`;
    scheduleEl.style.display = 'block';
  } else {
    scheduleEl.style.display = 'none';
  }

  detailModal.style.display = 'block';
  detailModal.scrollTop = 0;
}

container.addEventListener('click', (e) => {
  const id = e.target.closest('.card')?.getAttribute('data-id') || e.target.getAttribute('data-id');
  if (!id) return;

  showDetailModal(id);
});

// === Add/Edit Modal ===
const addBtn = document.getElementById('adddoktergigiBtn');
const modal = document.getElementById('doktergigiModal');
const closeBtn = document.getElementById('closedoktergigiModal');
const form = document.getElementById('doktergigiForm');

addBtn?.addEventListener('click', () => modal.style.display = 'block');
closeBtn?.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

form?.addEventListener('submit', e => {
  e.preventDefault();
  const img = document.getElementById('doktergigiImg').files[0];
  const img2 = document.getElementById('doktergigiImg2').files[0]; // Gambar tambahan
  const title = form.querySelector('input[name="title"]').value;
  const content = form.querySelector('textarea[name="content"]').value;

  if (!img) return alert("Harap pilih gambar!");
  const validImageTypes = ['image/jpeg','image/jpg','image/png','image/bmp','image/gif'];
  if (!validImageTypes.includes(img.type)) return alert("File bukan gambar valid.");

  const formData = new FormData();
  formData.append('img', img);
  if (img2) formData.append('img2', img2);
  formData.append('title', title);
  formData.append('content', content);

  fetch(`${LARAVEL_URL}/api/doktergigi`, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(newCard => {
    doktergigiData.push(newCard);
    renderCards();
    modal.style.display = 'none';
    form.reset();
  })
  .catch(err => {
    console.error(`Error adding doktergigi:`, err);
    alert(`Gagal menambahkan data, periksa koneksi backend doktergigi.`);
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
      Array.from(cards).forEach(card => { card.style.display = ''; });
      return; 
    }

    Array.from(cards).forEach(card => {
      const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
      const content = card.querySelector('p')?.innerText.toLowerCase() || '';
      const matches = title.includes(searchTerm) || content.includes(searchTerm);
      card.style.display = matches || searchTerm === '' ? '' : 'none';
      if (matches) cardMatches = true;
    });

    section.style.display = sectionTitle.includes(searchTerm) || cardMatches || searchTerm === '' ? '' : 'none';
  });
});

// === Modal Edit Baru ===
const editModal = document.createElement('div');
editModal.id = "editdoktergigiModal";
editModal.style.display = "none";
editModal.style.position = "fixed";
editModal.style.top = "0";
editModal.style.left = "0";
editModal.style.width = "100%";
editModal.style.height = "100%";
editModal.style.backgroundColor = "rgba(0,0,0,0.7)";
editModal.style.zIndex = "3000";
editModal.style.overflow = "auto";

editModal.innerHTML = `
  <div style="
    background: white;
    max-width: 520px;
    margin: 60px auto;
    padding: 25px 30px;
    border-radius: 12px;
    position: relative;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    font-family: 'Segoe UI', Tahoma, sans-serif;
  ">
    <button id="closeEditModal" style="
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 22px;
      font-weight: bold;
      color: #555;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease, color 0.2s ease;
    ">&times;</button>

    <h3 style="
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 20px;
    ">✏️ Edit Dokter anak</h3>

    <form id="editdoktergigiForm" style="display: flex; flex-direction: column; gap: 15px;">
    
      <label for="editImg" style="font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block;">
        Unggah Foto Dokter:
      </label>
      <input type="file" id="editImg" name="img" accept="image/*" style="
          font-size: 14px;
          padding: 6px 0;
        ">

      <label for="editTitle" style="font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block;">
        Nama Dokter:
      </label>
      <textarea id="editTitle" name="title" placeholder="Judul doktergigi" required style="
        padding: 10px 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        resize: none;
        min-height: 60px;
        line-height: 1.4;
      "></textarea>

      <label for="editContent" style="font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block;">
        Nama RSUD:
      </label>
      <textarea id="editContent" name="content" placeholder="Deskripsi / Konten" required style="
        padding: 12px 14px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 14px;
        resize: vertical;
        min-height: 120px;
      "></textarea>

      <label for="editImg2" style="font-size: 14px; font-weight: 600; margin-bottom: 4px; display: block;">
        Unggah Jadwal Dokter:
      </label>
      <input type="file" id="editImg2" name="Img2" accept="image/*" style="
        font-size: 14px;
        padding: 6px 0;
      ">

      <button type="submit" style="
        background: #3498db;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      ">💾 Simpan Perubahan</button>
    </form>
  </div>
`;

document.body.appendChild(editModal);

document.getElementById('closeEditModal').addEventListener('click', () => {
  editModal.style.display = "none";
});

document.getElementById('editdoktergigiForm').addEventListener('submit', e => {
  e.preventDefault();
  const yakin = confirm("Yakin mau menyimpan perubahan?");
  if (!yakin) return;

  const formEl = e.target;
  const id = formEl.getAttribute('data-id');
  const formData = new FormData(formEl);
  const imgFile = document.getElementById('editImg').files[0];
  const imgFile2 = document.getElementById('editImg2').files[0]; // Gambar tambahan
  if (imgFile) formData.append('img', imgFile);
  if (imgFile2) formData.append('img2', imgFile2);

  fetch(`${LARAVEL_URL}/api/doktergigi/${id}`, {
    method: 'POST',
    headers: { 'X-HTTP-Method-Override': 'PUT' },
    body: formData
  })
  .then(res => res.json())
  .then(updated => {
    const idx = doktergigiData.findIndex(p => p.id == id);
    doktergigiData[idx] = updated;
    renderCards();
    editModal.style.display = "none";
  })
  .catch(err => console.error("Error updating:", err));
});

initSection();

});