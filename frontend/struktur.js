/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("multi-section.js loaded!");

  const LARAVEL_URL = "http://localhost:8000";
  const searchInput = document.getElementById('searchInput');

  const sectionsConfig = [
    {
      id: 'struktur-struktur_m', // #TAG: struktur
      api: '/api/struktur',
      addBtnId: 'addstrukturBtn',
      modalId: 'strukturModal',
      closeBtnId: 'closestrukturModal',
      formId: 'strukturForm',
      editModalId: 'editstrukturModal',
      editFormId: 'editstrukturForm'
    },

    {
      id: 'direksi-direksi_m', // #TAG: direksi
      api: '/api/direksi',
      addBtnId: 'adddireksiBtn',
      modalId: 'direksiModal',
      closeBtnId: 'closedireksiModal',
      formId: 'direksiForm',
      editModalId: 'editdireksiModal',
      editFormId: 'editdireksiForm'
    },

    {
      id: 'berita-berita_m', // #TAG: BERITA
      api: '/api/berita',
      addBtnId: 'addberitaBtn',
      modalId: 'beritaModal',
      closeBtnId: 'closeberitaModal',
      formId: 'beritaForm',
      editModalId: 'editberitaModal',
      editFormId: 'editberitaForm'
    },
    {
      id: 'pengumuman-pengumuman_m', // #TAG: PENGUMUMAN
      api: '/api/pengumuman',
      addBtnId: 'addpengumumanBtn',
      modalId: 'pengumumanModal',
      closeBtnId: 'closepengumumanModal',
      formId: 'pengumumanForm',
      editModalId: 'editpengumumanModal',
      editFormId: 'editpengumumanForm'
    },
    {
      id: 'penghargaan-penghargaan_m', // #TAG: PENGHARGAAN
      api: '/api/penghargaan',
      addBtnId: 'addpenghargaanBtn',
      modalId: 'penghargaanModal',
      closeBtnId: 'closepenghargaanModal',
      formId: 'penghargaanForm',
      editModalId: 'editpenghargaanModal',
      editFormId: 'editpenghargaanForm'
    }
  ];

  sectionsConfig.forEach(config => {
    const container = document.getElementById(config.id);
    let dataItems = [];

    // --- SETUP EDIT MODAL ---
    let editModal = document.getElementById(config.editModalId);
    if (!editModal) {
      editModal = document.createElement('div');
      editModal.id = config.editModalId;
      editModal.style.cssText = `
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background-color: rgba(0,0,0,0.7); z-index:3000; overflow:auto;
      `;
      editModal.innerHTML = `
        <div style="
          background:white; max-width:520px; margin:60px auto; padding:25px 30px;
          border-radius:12px; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.2);
          font-family: 'Segoe UI', Tahoma, sans-serif;
        ">
          <button id="close-${config.editModalId}" style="
            position:absolute; top:12px; right:12px; font-size:22px; font-weight:bold;
            color:#555; background:transparent; border:none; cursor:pointer;">&times;</button>
          <h3 style="text-align:center; font-size:20px; font-weight:bold; margin-bottom:20px;">✏️ Edit</h3>
          <form id="${config.editFormId}" style="display:flex; flex-direction: column; gap:15px;">
            <textarea name="title" placeholder="Judul" required style="padding:10px; border-radius:8px; border:1px solid #ccc;"></textarea>
            <textarea name="content" placeholder="Konten" required style="padding:10px; border-radius:8px; border:1px solid #ccc; min-height:120px;"></textarea>
            <input type="file" name="img" accept="image/*">
            <button type="submit" style="
              background:#3498db; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer;">💾 Simpan Perubahan</button>
          </form>
        </div>
      `;
      document.body.appendChild(editModal);
    }

    const editForm = document.getElementById(config.editFormId);
    const editTitleInput = editForm.querySelector('[name="title"]');
    const editContentInput = editForm.querySelector('[name="content"]');
    const closeEditBtn = document.getElementById(`close-${config.editModalId}`);
    closeEditBtn.addEventListener('click', () => editModal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === editModal) editModal.style.display = 'none'; });

    // --- FETCH & RENDER CARDS ---
    function initSection() {
      fetch(`${LARAVEL_URL}${config.api}`)
        .then(res => res.json())
        .then(data => {
          dataItems = data;
          renderCards();
        })
        .catch(err => console.error(`Error fetching ${config.api}:`, err));
    }

    function renderCards() {
      container.innerHTML = '';
          
      let itemsToRender = dataItems;
      if (config.id === 'berita-berita_m' || config.id === 'pengumuman-pengumuman_m' || config.id === 'penghargaan-penghargaan_m') {
        itemsToRender = [...dataItems] 
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
          .slice(0, 3); 
      }

      itemsToRender.forEach((item, index) => {
        const isSmallCard = config.id === 'berita-berita_m' || config.id === 'pengumuman-pengumuman_m' || config.id === 'penghargaan-penghargaan_m';
        const divImgStyle = isSmallCard
          ? "width:100%; height:80px; display:flex; margin-top:10px ;justify-content:center; align-items:center; overflow:hidden; background:#f8f8f8; border-bottom:1px solid #eee;"
          : "width:100%; display:flex; justify-content:center; align-items:center; background:#f0f0f0;";

        const imgStyle = isSmallCard
          ? "width:100%; height:100%; object-fit:cover; object-position:center;"
          : "width:100%; height:auto; object-fit:contain;";

        container.innerHTML += `
          <div class="card searchable" 
              data-index="${index}" 
              data-id="${item.id}"   
              style="
            cursor:pointer; position:relative;
            margin:${isSmallCard ? '15px 0' : '0px 0'};
            border-radius:6px; overflow:hidden;
            box-shadow:${isSmallCard ? '0 1px 4px rgba(0,0,0,0.08)' : '0 4px 12px rgba(0,0,0,0.1)'};
            width:100%; background:#fff; border:1px solid #f0f0f0;
          ">
            <button class="edit-card" data-index="${index}" style="
              position:absolute; top:10px; right:100px; background:#3498db; color:white; border:none;
              padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px; z-index:10;">✏️ Edit</button>
            <button class="delete-card" data-index="${index}" style="
              position:absolute; top:10px; right:10px; background:#e74c3c; color:white; border:none;
              padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold; z-index:10;">🗑️ Hapus</button>
            <div style="${divImgStyle}">
              ${item.img ? `<img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="${imgStyle}">` : ''}
            </div>
            <div class="card-content" style="padding:${isSmallCard ? '8px 10px' : '15px'};">
              <h3 style="
                font-size:${isSmallCard ? '12px' : '18px'};
                font-weight:600; margin:0 0 4px 0;
                color:#333; line-height:1.3;">${item.title}</h3>
              <p style="
                font-size:${isSmallCard ? '10px' : '14px'};
                margin:0; color:#666; line-height:1.4;">${item.content}</p>
            </div>
              <p style="font-size: 10px; color: #777; margin: 8px 0 8px; padding: 0 10px;">
                <strong>Upload:</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}<br>
                <strong>Oleh:</strong> ${item.author || 'Admin'}
              </p>
          </div>
        `;

      });

      // --- DELETE BUTTONS ---
      container.querySelectorAll('.delete-card').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const idx = btn.dataset.index;
          const item = itemsToRender[idx];
          if (confirm(`Apakah yakin ingin menghapus ${item.title}?`)) {
            fetch(`${LARAVEL_URL}${config.api}/${item.id}`, { method: 'DELETE' })
              .then(res => {
                if (res.ok) {
                  const realIndex = dataItems.findIndex(d => d.id === item.id);
                  dataItems.splice(realIndex, 1);
                  renderCards();
                  alert(`${item.title} berhasil dihapus!`);
                } else alert(`Gagal menghapus ${item.title}`);
              }).catch(console.error);
          }
        });
      });

      // --- EDIT BUTTONS ---
      container.querySelectorAll('.edit-card').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const idx = btn.dataset.index;
          const item = itemsToRender[idx];
          editTitleInput.value = item.title;
          editContentInput.value = item.content;
          editForm.setAttribute('data-id', item.id);
          editModal.style.display = 'block';
        });
      });

      // --- SMALL CARD CONTENT LIMIT ---
      if(config.id === 'berita-berita_m' || config.id === 'pengumuman-pengumuman_m' || config.id === 'penghargaan-penghargaan_m') {
        container.querySelectorAll('.card-content p').forEach(p => {
          p.style.display = '-webkit-box';
          p.style.webkitBoxOrient = 'vertical';
          p.style.webkitLineClamp = '3';
          p.style.overflow = 'hidden';
          p.style.textOverflow = 'ellipsis';
        });
        container.querySelectorAll('.card-content h3').forEach(h3 => {
          h3.style.fontSize = '12px';
          h3.style.fontWeight = 'bold';
          h3.style.margin = '0 0 5px 0';
        });

        // ✨ Tambahan: klik card → pindah halaman sesuai + id
        container.querySelectorAll('.card').forEach(card => {
          card.addEventListener('click', e => {
            // abaikan bila klik tombol edit/hapus
            if (e.target.classList.contains('edit-card') || e.target.classList.contains('delete-card')) return;

            const id = card.dataset.id;
            let target = '/';
            if (config.id === 'berita-berita_m') target = '/berita';
            if (config.id === 'pengumuman-pengumuman_m') target = '/pengumuman';
            if (config.id === 'penghargaan-penghargaan_m') target = '/penghargaan';

            window.location.href = `${target}?id=${id}`;
          });
        });
      }
    }

    // --- ADD / MODAL ADD ---
    const addBtn = document.getElementById(config.addBtnId);
    const modal = document.getElementById(config.modalId);
    const closeBtn = document.getElementById(config.closeBtnId);
    const form = document.getElementById(config.formId);

    addBtn?.addEventListener('click', () => modal.style.display = 'block');
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

     form?.addEventListener('submit', e => {
      e.preventDefault();
      
      const img = form.querySelector('input[type="file"]').files[0];
      const title = form.querySelector('input[name="title"]').value.trim();
      const content = form.querySelector('textarea[name="content"]').value.trim();

      // Validasi title & content wajib
      if (!title || !content) return alert("Judul dan konten wajib diisi!");

      const yakin = confirm("Apakah yakin ingin menyimpan data ini?");
      if (!yakin) return; // jika tidak, keluar dari fungsi

      const fd = new FormData();
      if (img) fd.append('img', img); // opsional
      fd.append('title', title);
      fd.append('content', content);

      fetch(`${LARAVEL_URL}${config.api}`, { method:'POST', body: fd })
        .then(res => res.json())
        .then(newItem => {
          dataItems.push(newItem);
          renderCards();
          modal.style.display = 'none';
          form.reset();
        }).catch(err => { console.error(err); alert("Gagal menambahkan data."); });
    });

    // --- SUBMIT EDIT FORM ---
    editForm.addEventListener('submit', e => {
      e.preventDefault();
      const yakin = confirm("Yakin ingin menyimpan perubahan?");
      if(!yakin) return;

      const id = editForm.dataset.id;
      const fd = new FormData(editForm);
      const imgFile = editForm.querySelector('input[type="file"]').files[0];
      if (imgFile) fd.append('img', imgFile);

      fetch(`${LARAVEL_URL}${config.api}/${id}`, {
        method: 'POST',
        headers: { 'X-HTTP-Method-Override': 'PUT' },
        body: fd
      })
      .then(res => {
        if (!res.ok) throw new Error("Gagal menyimpan perubahan");
        return res.json();
      })
      .then(updated => {
        const idx = dataItems.findIndex(p => p.id == id);
        dataItems[idx] = updated;
        renderCards();
        editModal.style.display = 'none';
        alert("Perubahan berhasil disimpan!");
      })
      .catch(err => {
        console.error(err);
        alert("Gagal menyimpan perubahan, periksa backend.");
      });
    });

    initSection();
  });

  // --- SEARCH FUNCTIONALITY ---
  searchInput?.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
      const cards = section.getElementsByClassName('card');
      let hasMatch = false;
      Array.from(cards).forEach(card => {
        const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
        const content = card.querySelector('p')?.innerText.toLowerCase() || '';
        const match = title.includes(searchTerm) || content.includes(searchTerm);
        card.style.display = match || searchTerm === '' ? '' : 'none';
        if(match) hasMatch = true;
      });
      section.style.display = hasMatch || searchTerm === '' ? '' : 'none';
    });
  });

  // --- TAMBAHAN: MODAL DETAIL DIREKSI ---
  (() => {
    const container = document.getElementById('direksi-direksi_m');
    if (!container) return;

    const detailModal = document.createElement('div');
    detailModal.id = 'direksiDetailModal';
    detailModal.style.cssText = `
      display:none; position:fixed; top:0; left:0; width:100%; height:100%;
      background-color: rgba(0,0,0,0.7); z-index:3000; overflow:auto;
    `;
    detailModal.innerHTML = `
      <div style="
        background: #fff; max-width: 520px; margin: 60px auto; padding: 30px 35px;
        border-radius: 16px; position: relative; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        font-family: 'Segoe UI', Tahoma, sans-serif;
      ">
        <button id="close-direksiDetailModal" style="
          position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; border-radius: 50%;
          background-color: rgba(0,0,0,0.1); border: none; font-size: 20px; font-weight: bold;
          color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center;
          z-index: 10;
        " 
          onmouseover="this.style.backgroundColor='rgba(255,77,77,0.9)'; this.style.color='#fff'; this.style.transform='scale(1.15)';" 
          onmouseout="this.style.backgroundColor='rgba(0,0,0,0.1)'; this.style.color='#333'; this.style.transform='scale(1)';">&times;</button>

        <img id="detailImg" src="" alt="" style="
          width: 100%; max-height: 440px; object-fit: contain; margin-top: 25px; margin-bottom: 20px;
          display: block; margin-left: auto; margin-right: auto;
        ">

        <h3 id="detailTitle" style="text-align: center; font-size: 22px; font-weight: 600; margin-bottom: 18px; color: #333;"></h3>

        <p id="detailContent" style="
          font-size: 15px; 
          line-height: 1.7; 
          color: #555; 
          text-align: center;
          background-color: #f0f4f8; 
          padding: 12px 15px; 
          border-radius: 8px;
          font-weight: bold;
          border: 2px solid #3498db;   
          max-width: 360px;            /* lebar maksimal */
          margin: 0 auto;            
        "></p>
      </div>
    `;
    document.body.appendChild(detailModal);

    const closeDetail = document.getElementById('close-direksiDetailModal');
    closeDetail.addEventListener('click', () => detailModal.style.display = 'none');
    window.addEventListener('click', e => { if(e.target === detailModal) detailModal.style.display = 'none'; });

    container.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if(!card) return;
      const id = card.dataset.id;
      const item = Array.from(container.querySelectorAll('.card')).map(c => {
        return {
          id: c.dataset.id,
          title: c.querySelector('h3')?.innerText,
          content: c.querySelector('p')?.innerText,
          img: c.querySelector('img')?.src
        };
      }).find(x => x.id === id);

      if(item) {
        document.getElementById('detailTitle').innerText = item.title;
        document.getElementById('detailContent').innerText = item.content;
        document.getElementById('detailImg').src = item.img;
        detailModal.style.display = 'block';
      }
    });
  })();
});
