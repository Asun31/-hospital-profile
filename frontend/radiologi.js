/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */ 

document.addEventListener('DOMContentLoaded', () => {
  console.log("radiologi.js loaded!");

  const LARAVEL_URL = "http://localhost:8000";
  const container = document.getElementById('radiologi-radiologi_m');
  const searchInput = document.getElementById('searchInput');
  const addBtn = document.getElementById('addradiologiBtn');
  const addModal = document.getElementById('radiologiModal');
  const closeAddBtn = document.getElementById('closeradiologiModal');
  const addForm = document.getElementById('radiologiForm');

  let radiologiData = [];

  // ---------------------------
  // Utility: open/close modal
  // ---------------------------
  const openModal = modal => modal.style.display = 'block';
  const closeModal = modal => modal.style.display = 'none';

  window.addEventListener('click', e => {
    if (e.target === addModal) closeModal(addModal);
    if (e.target === editModal) closeModal(editModal);
  });

  // ---------------------------
  // Fetch CRUD functions
  // ---------------------------
  const fetchradiologi = async () => {
    try {
      const res = await fetch(`${LARAVEL_URL}/api/radiologi`);
      radiologiData = await res.json();
      renderCards();
    } catch (err) {
      console.error("Error fetching radiologi:", err);
    }
  };

  const addradiologi = async form => {
    try {
      const formData = new FormData(form);
      const res = await fetch(`${LARAVEL_URL}/api/radiologi`, { method: 'POST', body: formData });
      const newCard = await res.json();
      radiologiData.push(newCard);
      renderCards();
      closeModal(addModal);
      form.reset();
    } catch (err) {
      console.error("Error adding radiologi:", err);
      alert("Gagal menambahkan data, periksa koneksi backend radiologi.");
    }
  };

  const updateradiologi = async (id, form) => {
    try {
      const formData = new FormData(form);
      const imgFile = document.getElementById('editImg').files[0];
      if (imgFile) formData.append('img', imgFile);

      const res = await fetch(`${LARAVEL_URL}/api/radiologi/${id}`, {
        method: 'POST',
        headers: { 'X-HTTP-Method-Override': 'PUT' },
        body: formData
      });
      const updated = await res.json();
      const idx = radiologiData.findIndex(p => p.id == id);
      radiologiData[idx] = updated;
      renderCards();
      closeModal(editModal);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const deleteradiologi = async id => {
    try {
      const res = await fetch(`${LARAVEL_URL}/api/radiologi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        radiologiData = radiologiData.filter(b => b.id != id);
        renderCards();
        alert('radiologi berhasil dihapus!');
      } else alert('Gagal menghapus radiologi.');
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // Card template & render
  // ---------------------------
  const cardTemplate = item => {
    const isNew = Date.now() - new Date(item.created_at).getTime() < 24*60*60*1000;
    return `
      <div class="card searchable" data-id="${item.id}" style="cursor:pointer; position:relative; margin:20px 0; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.08); display:flex; gap:20px; background:#fff; padding:20px;">
        ${isNew ? `<span class="badge-new" style="position:absolute; top:16px; left:16px; background:#28a745; color:#fff; font-size:11px; font-weight:bold; padding:4px 8px; border-radius:6px; text-transform:uppercase;">Terbaru</span>` : ''}
        <div style="width:400px; height:400px; flex-shrink:0; background:#f8f9fa; border-radius:12px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="max-width:100%; max-height:100%; object-fit:contain; transition:transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        </div>
        <div style="flex:1; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="edit-card" data-id="${item.id}" style="background:#007bff; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:600; font-size:13px;">✏️ Edit</button>
            <button class="delete-card" data-id="${item.id}" style="background:#dc3545; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:600;">🗑️ Hapus</button>
          </div>
          <div style="flex:1;">
            <h3 style="font-size:16px; margin:0 0 10px; font-weight:600; color:#333;">${item.title}</h3>
            <p style="font-size:14px; line-height:1.7; margin:0 0 12px; color:#555; white-space:pre-line; text-align:justify;">${item.content}</p>
            <p style="font-size:11px; color:#888; margin:0; white-space:pre-line; text-align:justify;">
              <strong>Upload:</strong> ${item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}<br>
              <strong>Oleh:</strong> ${item.author || 'Admin'}
            </p>
          </div>
        </div>
      </div>
    `;
  };

  const renderCards = () => {
    container.innerHTML = radiologiData
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(cardTemplate)
      .join('');
  };

  // ---------------------------
  // Event delegation for edit/delete
  // ---------------------------
  container.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-card');
    const deleteBtn = e.target.closest('.delete-card');

    if (editBtn) handleEdit(editBtn.dataset.id);
    if (deleteBtn) handleDelete(deleteBtn.dataset.id);
  });

  // ---------------------------
  // Add radiologi
  // ---------------------------
  addBtn?.addEventListener('click', () => openModal(addModal));
  closeAddBtn?.addEventListener('click', () => closeModal(addModal));
  addForm?.addEventListener('submit', e => {
    e.preventDefault();
    addradiologi(addForm);
  });

  // ---------------------------
  // Edit Modal
  // ---------------------------
  const editModal = document.createElement('div');
  editModal.id = "editradiologiModal";
  editModal.style.cssText = "display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7); z-index:3000; overflow:auto;";
  editModal.innerHTML = `
    <div style="background:white; max-width:520px; margin:60px auto; padding:25px 30px; border-radius:12px; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.2); font-family:'Segoe UI', Tahoma, sans-serif;">
      <button id="closeEditModal" style="position:absolute;top:12px;right:12px;font-size:22px;font-weight:bold;color:#555;background:transparent;border:none;cursor:pointer;">&times;</button>
      <h3 style="text-align:center;font-size:20px;font-weight:bold;color:#2c3e50;margin-bottom:20px;">✏️ Edit radiologi</h3>
      <form id="editradiologiForm" style="display:flex;flex-direction:column;gap:15px;">
        <textarea id="editTitle" name="title" placeholder="Judul radiologi" required style="padding:10px 12px;border:1px solid #ccc;border-radius:8px;font-size:15px;font-weight:600;resize:none;min-height:60px;line-height:1.4;"></textarea>
        <textarea id="editContent" name="content" placeholder="Deskripsi / Konten" required style="padding:12px 14px;border:1px solid #ccc;border-radius:8px;font-size:14px;resize:vertical;min-height:120px;"></textarea>
        <input type="file" id="editImg" name="img" accept="image/*" style="font-size:14px;padding:6px 0;">
        <button type="submit" style="background:#3498db;color:white;border:none;padding:12px;border-radius:8px;font-weight:bold;font-size:15px;cursor:pointer;">💾 Simpan Perubahan</button>
      </form>
    </div>
  `;
  document.body.appendChild(editModal);

  document.getElementById('closeEditModal').addEventListener('click', () => closeModal(editModal));

  const handleEdit = id => {
    const item = radiologiData.find(b => b.id == id);
    if (!item) return;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editContent').value = item.content;
    document.getElementById('editradiologiForm').setAttribute('data-id', item.id);
    openModal(editModal);
  };

  const handleDelete = id => {
    if (confirm('Apakah yakin ingin menghapus radiologi ini?')) {
      deleteradiologi(id);
    }
  };

  document.getElementById('editradiologiForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!confirm("Yakin mau menyimpan perubahan?")) return;
    const form = e.target;
    const id = form.getAttribute('data-id');
    updateradiologi(id, form);
  });

  // ---------------------------
  // Search
  // ---------------------------
  searchInput?.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('main section').forEach(section => {
      const sectionTitle = section.querySelector('h2.section-title')?.innerText.toLowerCase() || '';
      const cards = section.getElementsByClassName('card');
      let cardMatches = false;

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

  // ---------------------------
  // Initialize
  // ---------------------------
  fetchradiologi();
});