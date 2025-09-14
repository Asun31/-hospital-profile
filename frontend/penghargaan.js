// /**
//  * Created by PhpStorm.
//  * User: asun fadrianto
//  * Date: 07/09/2025
//  * Time: 10.05
//  */ 

document.addEventListener('DOMContentLoaded', () => {
  console.log("penghargaan.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; 
  const searchInput = document.getElementById('searchInput');
  const container = document.getElementById('penghargaan-penghargaan_m');

  let penghargaanData = [];
  function initSection() {
    fetch(`${LARAVEL_URL}/api/penghargaan`)
      .then(res => res.json())
      .then(data => {
        penghargaanData = data;
        renderCards();
      })
      .catch(err => console.error(`Error fetching penghargaan:`, err));
  }

  function renderCards() {
  container.innerHTML = '';

  // ✅ Urutkan penghargaan dari terbaru ke terlama (tidak dipotong)
  const itemsToRender = [...penghargaanData].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  itemsToRender.forEach((item, index) => {
    container.innerHTML += `
      <div class="card searchable" data-index="${index}" style="
        cursor: pointer;
        position: relative;
        margin-top: 10px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.2s ease, box-shadow 0.3s ease;
      ">
        <!-- Tombol Edit -->
        <button class="edit-card" data-index="${index}" style="
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

        <!-- Tombol Hapus -->
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
        ">🗑️ Hapus</button>

        <!-- Gambar -->
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
            object-fit: cover;
          ">
        </div>

        <!-- Konten Card -->
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
          <button class="read-more" data-index="${index}" style="
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

  // Hover + click Delete
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
      const idx = btn.getAttribute('data-index');
      const item = itemsToRender[idx];
      if (confirm('Apakah yakin ingin menghapus penghargaan ini?')) {
        fetch(`${LARAVEL_URL}/api/penghargaan/${item.id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              penghargaanData = penghargaanData.filter(b => b.id !== item.id);
              renderCards();
              alert('Penghargaan berhasil dihapus!');
            } else {
              alert('Gagal menghapus penghargaan.');
            }
          })
          .catch(err => console.error(err));
      }
    });
  });

  // Hover + click Edit
  container.querySelectorAll('.edit-card').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.background = '#2980b9');
    btn.addEventListener('mouseleave', () => btn.style.background = '#3498db');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = btn.getAttribute('data-index');
      const item = itemsToRender[idx];

      document.getElementById('editTitle').value = item.title;
      document.getElementById('editContent').value = item.content;
      document.getElementById('editpenghargaanModal').style.display = 'block';
      document.getElementById('editpenghargaanForm').setAttribute('data-id', item.id);
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

        <div style="
          width: 100%;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f8f8;
          overflow: hidden;
        ">
          <img id="detailImage" src="" alt="Gambar penghargaan" style="
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
    const item = penghargaanData[index];
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

  const addBtn = document.getElementById('addpenghargaanBtn');
  const modal = document.getElementById('penghargaanModal');
  const closeBtn = document.getElementById('closepenghargaanModal');
  const form = document.getElementById('penghargaanForm');

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

    fetch(`${LARAVEL_URL}/api/penghargaan`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(newCard => {
      penghargaanData.push(newCard);
      renderCards();
      modal.style.display = 'none';
      form.reset();
    })
    .catch(err => {
      console.error(`Error adding penghargaan:`, err);
      alert(`Gagal menambahkan data, periksa koneksi backend penghargaan.`);
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

  // === Modal Edit Baru ===
  const editModal = document.createElement('div');
  editModal.id = "editpenghargaanModal";
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
      <!-- Tombol Close -->
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

      <!-- Judul Modal -->
      <h3 style="
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 20px;
      ">✏️ Edit penghargaan</h3>

      <!-- Form Edit -->
      <form id="editpenghargaanForm" style="display: flex; flex-direction: column; gap: 15px;">
        
        <!-- Textarea Judul -->
        <textarea id="editTitle" name="title" placeholder="Judul penghargaan" required style="
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          resize: none;
          min-height: 60px;
          line-height: 1.4;
        "></textarea>

        <!-- Textarea Konten -->
        <textarea id="editContent" name="content" placeholder="Deskripsi / Konten" required style="
          padding: 12px 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          min-height: 120px;
        "></textarea>

        <!-- Input Gambar -->
        <input type="file" id="editImg" name="img" accept="image/*" style="
          font-size: 14px;
          padding: 6px 0;
        ">

        <!-- Tombol Simpan -->
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

  document.getElementById('editpenghargaanForm').addEventListener('submit', e => {
    e.preventDefault();
      // Konfirmasi sebelum menyimpan
      const yakin = confirm("Yakin mau menyimpan perubahan?");
      if (!yakin) return; // Jika klik "Batal", keluar dari fungsi

      const formEl = e.target;
      const id = formEl.getAttribute('data-id');
      const formData = new FormData(formEl);
      const imgFile = document.getElementById('editImg').files[0];
      if (imgFile) formData.append('img', imgFile);

      fetch(`${LARAVEL_URL}/api/penghargaan/${id}`, {
          method: 'POST',
          headers: { 'X-HTTP-Method-Override': 'PUT' },
          body: formData
      })
      .then(res => res.json())
      .then(updated => {
          const idx = penghargaanData.findIndex(p => p.id == id);
          penghargaanData[idx] = updated;
          renderCards();
          editModal.style.display = "none";
      })
      .catch(err => console.error("Error updating:", err));
  });

  initSection();
});