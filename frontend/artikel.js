/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("artikel.js loaded!");

  const LARAVEL_URL = "http://localhost:8000";

  // =================== DOM Elements ===================
  const searchInput = document.getElementById('searchInput');

  // Artikel
  const artikelContainer = document.getElementById('artikel-artikel_m');
  const addArtikelBtn = document.getElementById('addartikelBtn');
  const artikelModal = document.getElementById('artikelModal');
  const closeArtikelModal = document.getElementById('closeartikelModal');
  const artikelForm = document.getElementById('artikelForm');

  // Edit artikel modal
  const editModal = document.createElement('div');
  editModal.id = "editartikelModal";
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
    <div style="background:white; max-width:520px; margin:60px auto; padding:25px 30px; border-radius:12px; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.2); font-family:'Segoe UI', Tahoma, sans-serif;">
      <button id="closeEditModal" style="position:absolute; top:12px; right:12px; font-size:22px; font-weight:bold; color:#555; background:transparent; border:none; cursor:pointer;">&times;</button>
      <h3 style="text-align:center; font-size:20px; font-weight:bold; color:#2c3e50; margin-bottom:20px;">✏️ Edit Artikel</h3>
      <form id="editartikelForm" style="display:flex; flex-direction:column; gap:15px;">
        <textarea id="editTitle" name="title" placeholder="Judul artikel" required style="padding:10px 12px; border:1px solid #ccc; border-radius:8px; font-size:15px; font-weight:600; resize:none; min-height:60px; line-height:1.4;"></textarea>
        <textarea id="editContent" name="content" placeholder="Deskripsi / Konten" required style="padding:12px 14px; border:1px solid #ccc; border-radius:8px; font-size:14px; resize:vertical; min-height:120px;"></textarea>
        <input type="file" id="editImg" name="img" accept="image/*">
        <button type="submit" style="background:#3498db;color:white;border:none;padding:12px;border-radius:8px;font-weight:bold;font-size:15px;cursor:pointer;">💾 Simpan Perubahan</button>
      </form>
    </div>
  `;
  document.body.appendChild(editModal);
  document.getElementById('closeEditModal').addEventListener('click', () => editModal.style.display = 'none');

  // Detail Modal
  let detailModal = document.getElementById('detailModal');
  if (!detailModal) {
    detailModal = document.createElement('div');
    detailModal.id = 'detailModal';
    detailModal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);display:none;z-index:3000;overflow-y:auto;padding:30px 15px;box-sizing:border-box;font-family:Arial,sans-serif';
    detailModal.innerHTML = `
      <div id="detailModalContent" style="position: relative; max-width: 900px; width: 90%; margin: 50px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.25); transform:translateY(-50px); opacity:0; transition: all 0.3s ease;">
        <button id="closeDetailModal" style="position:absolute;top:15px;right:15px;font-size:20px;font-weight:bold;border:none;background:linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3));color:white;border-radius:50%;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>
        <div style="width:100%;height:400px;display:flex;justify-content:center;align-items:center;background:#f8f8f8;overflow:hidden;">
          <img id="detailImage" src="" alt="Gambar artikel" style="max-width:100%;max-height:100%;object-fit:contain;display:block;">
        </div>
        <div style="padding:25px 30px;">
          <h2 id="detailTitle" style="margin-top:0;margin-bottom:15px;font-size:16px;color:#048a16;"></h2>
          <p id="detailDate" style="font-size:10px;color:#007bff;margin-top:0;margin-bottom:20px;font-weight:600;"></p>
          <p id="detailContent" style="font-size:14px;line-height:1.6;white-space:pre-line;color:#444;text-align:justify;"></p>
        </div>
      </div>
    `;
    document.body.appendChild(detailModal);
    setTimeout(() => {
      document.getElementById('detailModalContent').style.transform = 'translateY(0)';
      document.getElementById('detailModalContent').style.opacity = '1';
    }, 10);
    document.getElementById('closeDetailModal').addEventListener('click', () => detailModal.style.display = 'none');
    detailModal.addEventListener('click', e => { if (e.target === detailModal) detailModal.style.display = 'none'; });
  }

  // =================== Data ===================
  let artikelData = [];
  let sosmedData = [];

  // =================== INIT ===================
  initArtikel();
  initSosmed();

  // =================== Artikel Functions ===================
  function initArtikel() {
    fetch(`${LARAVEL_URL}/api/artikel`)
      .then(res => res.json())
      .then(data => {
        artikelData = data;
        renderArtikel();
      })
      .catch(err => console.error('Error fetching artikel:', err));
  }

  function renderArtikel() {
    if (!artikelContainer) return;
    artikelContainer.innerHTML = '';

    const items = [...artikelData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    items.forEach(item => {
      const isNew = Date.now() - new Date(item.created_at).getTime() < 24 * 60 * 60 * 1000;

      const card = document.createElement('div');
      card.className = 'card searchable';
      card.dataset.id = item.id;
      card.style.cssText = 'cursor:pointer; position:relative; margin-top:10px; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s ease, box-shadow 0.3s ease;';

      card.innerHTML = `
        ${isNew ? `<span style="position:absolute; top:10px; left:10px; background:#81cd8d; color:white; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; z-index:10;">Terbaru</span>` : ''}
        <button class="edit-card" data-id="${item.id}" style="position:absolute; top:10px; right:100px; background:#3498db; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">✏️ Edit</button>
        <button class="delete-card" data-id="${item.id}" style="position:absolute; top:10px; right:10px; background:#e74c3c; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">🗑️ Hapus</button>
        <div style="width:100%; height:120px; display:flex; justify-content:center; align-items:center; background-color:#f0f0f0; overflow:hidden;">
          <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="card-content" style="padding:10px 12px;">
          <h3 style="font-size:14px; margin:5px 0;">${item.title}</h3>
          <p style="display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden; text-overflow:ellipsis; font-size:12px; margin:0 0 6px;">${item.content}</p>
          <p style="font-size:10px; color:#777; margin:0 0 8px; white-space:pre-line;">
            <strong>Upload:</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}<br>
            <strong>Oleh:</strong> ${item.author || 'Admin'}
          </p>
          <button class="read-more" data-id="${item.id}" style="background:transparent; border:1px solid #3498db; color:#3498db; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">Selengkapnya</button>
        </div>
      `;

      artikelContainer.appendChild(card);
    });

    // Delegasi klik
    artikelContainer.onclick = e => {
      const card = e.target.closest('.card');
      if (!card) return;
      const id = card.dataset.id;

      if (e.target.closest('.edit-card')) return openEditArtikel(id);
      if (e.target.closest('.delete-card')) return deleteArtikel(id);
      if (e.target.closest('.read-more')) return showDetailArtikel(id);

      showDetailArtikel(id);
    };
  }

  function openEditArtikel(id) {
    const item = artikelData.find(a => a.id == id);
    if (!item) return;

    const editForm = document.getElementById('editartikelForm');
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editContent').value = item.content;
    editForm.setAttribute('data-id', id);
    editModal.style.display = 'block';
  }

  document.getElementById('editartikelForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const id = form.getAttribute('data-id');
    const formData = new FormData(form);
    const imgFile = document.getElementById('editImg').files[0];
    if (imgFile) formData.append('img', imgFile);

    fetch(`${LARAVEL_URL}/api/artikel/${id}`, { method: 'POST', headers: { 'X-HTTP-Method-Override': 'PUT' }, body: formData })
      .then(res => res.json())
      .then(updated => {
        const idx = artikelData.findIndex(a => a.id == id);
        artikelData[idx] = updated;
        renderArtikel();
        editModal.style.display = 'none';
      }).catch(err => console.error(err));
  });

  function deleteArtikel(id) {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    fetch(`${LARAVEL_URL}/api/artikel/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          artikelData = artikelData.filter(a => a.id != id);
          renderArtikel();
        }
      }).catch(err => console.error(err));
  }

  function showDetailArtikel(id) {
    const item = artikelData.find(a => a.id == id);
    if (!item) return;
    document.getElementById('detailTitle').innerText = item.title;
    document.getElementById('detailDate').innerText = `Upload pada tanggal ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}, oleh ${item.author || 'Admin'}`;
    document.getElementById('detailContent').innerText = item.content;
    document.getElementById('detailImage').src = `${LARAVEL_URL}/storage/${item.img}`;
    detailModal.style.display = 'block';
  }

  addArtikelBtn?.addEventListener('click', () => artikelModal.style.display = 'block');
  closeArtikelModal?.addEventListener('click', () => artikelModal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === artikelModal) artikelModal.style.display = 'none'; });

  artikelForm?.addEventListener('submit', e => {
    e.preventDefault();
    const img = artikelForm.querySelector('input[type="file"]').files[0];
    const title = artikelForm.querySelector('input[name="title"]').value;
    const content = artikelForm.querySelector('textarea[name="content"]').value;
    if (!img) return alert("Harap pilih gambar!");
    const validImageTypes = ['image/jpeg','image/jpg','image/png','image/bmp','image/gif'];
    if (!validImageTypes.includes(img.type)) return alert("File bukan gambar valid.");
    const formData = new FormData();
    formData.append('img', img);
    formData.append('title', title);
    formData.append('content', content);
    fetch(`${LARAVEL_URL}/api/artikel`, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(newCard => {
        artikelData.push(newCard);
        renderArtikel();
        artikelModal.style.display = 'none';
        artikelForm.reset();
      }).catch(err => console.error(err));
  });

  // =================== Search ===================
  searchInput?.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card.searchable');
    cards.forEach(card => {
      const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
      const content = card.querySelector('p')?.innerText.toLowerCase() || '';
      card.style.display = title.includes(term) || content.includes(term) ? '' : 'none';
    });
  });

  // =================== Sosmed Functions ===================
    const sosmedContainer = document.getElementById('sosmed-sosmed_m');
    const addsosmedBtn = document.getElementById('addsosmedBtn');
    const sosmedModal = document.getElementById('sosmedModal');
    const closesosmedModal = document.getElementById('closesosmedModal');
    let sosmedFormEl = document.getElementById('sosmedForm');

    function initSosmed() {
      fetch(`${LARAVEL_URL}/api/sosmed`)
        .then(res => res.json())
        .then(data => {
          sosmedData = data;
          renderSosmed();
        }).catch(err => console.error(err));
    }

    function renderSosmed() {
      if (!sosmedContainer) return;
      sosmedContainer.innerHTML = '';

      sosmedData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card searchable';
        card.dataset.id = item.id;
        card.style.cssText = 'margin-top:10px;padding:10px;border:1px solid #ccc;border-radius:8px; display:flex; flex-direction:column;';

        let ytHTML = '';
        let otherContent = '';

        const lines = item.content.split(/\n+/);
        lines.forEach(line => {
          line = line.trim();
          if (!line) return;

          const ytMatch = line.match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
          const instaMatch = line.includes('lightwidget.com') || line.includes('instagram.com');

          if (ytMatch) {
            const videoId = ytMatch[2];
            ytHTML += `
              <div class="youtube-iframe-wrapper" style="width:32%; padding-bottom:25%; position:relative; margin:2px;">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen
                style="position:absolute; width:100%; height:100%; top:0; left:0;"></iframe>
              </div>
            `;
          } else if (instaMatch) {
            // Instagram / widget iframe tampil full dulu
            otherContent += `
              <div class="instagram-wrapper" style="width:100%; position:relative; margin-bottom:5px;">
                ${line}
              </div>
            `;
          } else {
            otherContent += `<div style="margin-bottom:5px;">${line}</div>`;
          }
        });

        // ===== Pilih class sosmed-iframe =====
        let iframeClass = 'sosmed-iframe';
        if (ytHTML) iframeClass += ' youtube-card'; // khusus YouTube

        // Gabungkan YouTube & konten lain
        let contentHTML = '';
        if (ytHTML) contentHTML += `<div class="youtube-container" style="display:flex; flex-wrap:wrap;">${ytHTML}</div>`;
        contentHTML += otherContent;

        // Card dengan scroll vertikal jika tinggi melebihi max-height
        card.innerHTML = `
          <h3 style="font-size:14px; margin:5px 0;">${item.title}</h3>
          <div class="${iframeClass}" style="width:100%; max-height:500px; overflow-y:auto; position:relative;">
            ${contentHTML}
          </div>
          <div style="margin-top:10px;">
            <button class="edit-sosmed" data-id="${item.id}" style="margin-right:5px;">✏️ Edit</button>
            <button class="delete-sosmed" data-id="${item.id}">🗑️ Hapus</button>
          </div>
        `;

        sosmedContainer.appendChild(card);

        // Proses script Instagram / embeds lain jika ada
        const scripts = card.querySelectorAll('script');
        if (scripts.length && window.instgrm) window.instgrm.Embeds.process();
      });

      // ===== Event Listener Edit/Delete =====
      sosmedContainer.querySelectorAll('.delete-sosmed').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (!confirm("Yakin ingin menghapus sosmed ini?")) return;
          fetch(`${LARAVEL_URL}/api/sosmed/${id}`, { method: 'DELETE' })
            .then(() => {
              sosmedData = sosmedData.filter(s => s.id != id);
              renderSosmed();
            }).catch(err => console.error(err));
        });
      });

      sosmedContainer.querySelectorAll('.edit-sosmed').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const item = sosmedData.find(s => s.id == id);
          if (!item) return;
          sosmedFormEl.title.value = item.title;
          sosmedFormEl.content.value = item.content;
          sosmedModal.style.display = 'block';

          const newForm = sosmedFormEl.cloneNode(true);
          sosmedFormEl.parentNode.replaceChild(newForm, sosmedFormEl);
          sosmedFormEl = newForm;

          sosmedFormEl.addEventListener('submit', ev => {
            ev.preventDefault();
            fetch(`${LARAVEL_URL}/api/sosmed/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: sosmedFormEl.title.value, content: sosmedFormEl.content.value })
            }).then(res => res.json())
              .then(updated => {
                const idx = sosmedData.findIndex(s => s.id == id);
                sosmedData[idx] = updated;
                renderSosmed();
                sosmedModal.style.display = 'none';
              }).catch(err => console.error(err));
          });
        });
      });
    }

    addsosmedBtn?.addEventListener('click', () => sosmedModal.style.display = 'block');
    closesosmedModal?.addEventListener('click', () => sosmedModal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === sosmedModal) sosmedModal.style.display = 'none'; });

    sosmedFormEl?.addEventListener('submit', e => {
      e.preventDefault();
      fetch(`${LARAVEL_URL}/api/sosmed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: sosmedFormEl.title.value, content: sosmedFormEl.content.value })
      }).then(res => res.json())
        .then(newItem => {
          sosmedData.push(newItem);
          renderSosmed();
          sosmedModal.style.display = 'none';
          sosmedFormEl.reset();
        }).catch(err => console.error(err));
    });

});