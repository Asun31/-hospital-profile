/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */ 

document.addEventListener('DOMContentLoaded', () => {
  console.log("artikel.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; 
  const searchInput = document.getElementById('searchInput');
  const container = document.getElementById('artikel-artikel_m');

  let artikelData = [];

  function initSection() {
    fetch(`${LARAVEL_URL}/api/artikel`)
      .then(res => res.json())
      .then(data => {
        artikelData = data;
        renderCards();
      })
      .catch(err => console.error(`Error fetching artikel:`, err));
  }

  function renderCards() {
    if (!container) return;
    container.innerHTML = '';

    const itemsToRender = [...artikelData].sort(
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
              object-fit: cover;
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
            <p style="font-size: 10px; color: #777; margin: 0 0 8px;white-space: pre-line;">
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
 
    // Edit & Delete Artikel
      container.querySelectorAll('.delete-card, .edit-card').forEach(btn => {

        // Hover effect
        btn.addEventListener('mouseenter', () => {
          if (btn.classList.contains('delete-card')) btn.style.background = '#c0392b';
          if (btn.classList.contains('edit-card')) btn.style.background = '#2980b9';
          btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
          if (btn.classList.contains('delete-card')) btn.style.background = '#e74c3c';
          if (btn.classList.contains('edit-card')) btn.style.background = '#3498db';
          btn.style.transform = 'scale(1)';
        });

        // Click event
        btn.addEventListener('click', e => {
          e.stopPropagation(); // agar klik tombol tidak memicu modal detail
          const id = btn.dataset.id;
          const item = artikelData.find(a => a.id == id);
          if (!item) return;

          if (btn.classList.contains('delete-card')) {
            // Hapus artikel
            if (!confirm('Apakah yakin ingin menghapus artikel ini?')) return;

            fetch(`${LARAVEL_URL}/api/artikel/${id}`, { method: 'DELETE' })
              .then(res => {
                if (res.ok) {
                  artikelData = artikelData.filter(a => a.id != id);
                  renderCards();
                  alert('Artikel berhasil dihapus!');
                } else {
                  alert('Gagal menghapus artikel.');
                }
              })
              .catch(err => console.error(err));
            return;
          }

          if (btn.classList.contains('edit-card')) {
            // Edit artikel
            const editModal = document.getElementById('editartikelModal');
            const editForm = document.getElementById('editartikelForm');

            document.getElementById('editTitle').value = item.title;
            document.getElementById('editContent').value = item.content;
            editForm.setAttribute('data-id', item.id);
            editModal.style.display = 'block';
          }
        });
      });

      // Submit handler untuk edit artikel (hanya sekali, tidak duplikasi)
      const editForm = document.getElementById('editartikelForm');
      editForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = editForm.getAttribute('data-id');
        const formData = new FormData(editForm);
        const imgFile = document.getElementById('editImg').files[0];
        if (imgFile) formData.append('img', imgFile);

        fetch(`${LARAVEL_URL}/api/artikel/${id}`, {
          method: 'POST',
          headers: { 'X-HTTP-Method-Override': 'PUT' },
          body: formData
        })
          .then(res => res.json())
          .then(updated => {
            const idx = artikelData.findIndex(a => a.id == id);
            artikelData[idx] = updated;
            renderCards();
            document.getElementById('editartikelModal').style.display = 'none';
          })
          .catch(err => console.error('Error updating artikel:', err));
      });


    // --- Read more click ---
    container.querySelectorAll('.read-more').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id = btn.dataset.id;
        showDetailModal(id);
      });
    });
  }

  // === Detail Modal ===
  let detailModal = document.getElementById('detailModal');
  if(!detailModal){
    detailModal = document.createElement('div');
    detailModal.id='detailModal';
    detailModal.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);display:none;z-index:3000;overflow-y:auto;padding:30px 15px;box-sizing:border-box;font-family:Arial,sans-serif';
    detailModal.innerHTML=`
      <div id="detailModalContent" style="position: relative; max-width: 900px; width: 90%; margin: 50px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.25); transform:translateY(-50px); opacity:0; transition: all 0.3s ease;">
        <button id="closeDetailModal" style="position:absolute;top:15px;right:15px;font-size:20px;font-weight:bold;border:none;background:linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3));color:white;border-radius:50%;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.5);transition:transform 0.2s ease, background 0.3s ease, box-shadow 0.3s ease;">&times;</button>
        <div style="width:100%;height:400px;display:flex;justify-content:center;align-items:center;background:#f8f8f8;overflow:hidden;">
          <img id="detailImage" src="" alt="Gambar artikel" style="max-width:100%;max-height:100%;object-fit:contain;display:block;transition: transform 0.3s ease;">
        </div>
        <div style="padding:25px 30px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <h2 id="detailTitle" style="margin-top:0;margin-bottom:15px;font-size:16px;color:#048a16;"></h2>
          <p id="detailDate" style="font-size:10px;color:#007bff;margin-top:0;margin-bottom:20px;font-weight:600;"></p>
          <p id="detailContent" style="font-size:14px;line-height:1.6;white-space:pre-line;color:#444;text-align:justify;"></p>
        </div>
      </div>
    `;
    document.body.appendChild(detailModal);
    setTimeout(()=>{ document.getElementById('detailModalContent').style.transform='translateY(0)'; document.getElementById('detailModalContent').style.opacity='1'; },10);
    document.getElementById('closeDetailModal').addEventListener('click', ()=>detailModal.style.display='none');
    detailModal.addEventListener('click', e=>{ if(e.target===detailModal) detailModal.style.display='none'; });
  }

  function showDetailModal(id){
    const item = artikelData.find(a=>a.id==id);
    if(!item) return;
    document.getElementById('detailTitle').innerText=item.title;
    const dateStr = item.created_at?new Date(item.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'';
    document.getElementById('detailDate').innerText=`Upload pada tanggal ${dateStr}, oleh ${item.author||'Admin'}`;
    document.getElementById('detailImage').src=`${LARAVEL_URL}/storage/${item.img}`;
    document.getElementById('detailImage').alt=item.title;
    document.getElementById('detailContent').innerText=item.content;
    detailModal.style.display='block';
    detailModal.scrollTop=0;
  }

  // === Add/Edit Artikel Modal ===
  const addBtn=document.getElementById('addartikelBtn');
  const modal=document.getElementById('artikelModal');
  const closeBtn=document.getElementById('closeartikelModal');
  let form=document.getElementById('artikelForm');

  addBtn?.addEventListener('click', ()=>modal.style.display='block');
  closeBtn?.addEventListener('click', ()=>modal.style.display='none');
  window.addEventListener('click', e=>{ if(e.target===modal) modal.style.display='none'; });

  form?.addEventListener('submit', e=>{
    e.preventDefault();
    const img=form.querySelector('input[type="file"]').files[0];
    const title=form.querySelector('input[name="title"]').value;
    const content=form.querySelector('textarea[name="content"]').value;
    if(!img) return alert("Harap pilih gambar!");
    const validImageTypes=['image/jpeg','image/jpg','image/png','image/bmp','image/gif'];
    if(!validImageTypes.includes(img.type)) return alert("File bukan gambar valid.");
    const formData=new FormData();
    formData.append('img',img); formData.append('title',title); formData.append('content',content);
    fetch(`${LARAVEL_URL}/api/artikel`, {method:'POST',body:formData})
      .then(res=>res.json())
      .then(newCard=>{
        artikelData.push(newCard);
        renderCards();
        modal.style.display='none';
        form.reset();
      })
      .catch(err=>{console.error(err); alert('Gagal menambahkan artikel');});
  });

  searchInput?.addEventListener('input', ()=>{
    const searchTerm=searchInput.value.trim().toLowerCase();
    const sections=document.querySelectorAll('main section');
    sections.forEach(section=>{
      const sectionTitle=section.querySelector('h2.section-title')?.innerText.toLowerCase()||'';
      const cards=section.getElementsByClassName('card');
      let cardMatches=false;
      if(sectionTitle.includes(searchTerm) && searchTerm!==''){
        section.style.display='';
        Array.from(cards).forEach(card=>card.style.display='');
        return;
      }
      Array.from(cards).forEach(card=>{
        const title=card.querySelector('h3')?.innerText.toLowerCase()||'';
        const content=card.querySelector('p')?.innerText.toLowerCase()||'';
        const matches=title.includes(searchTerm)||content.includes(searchTerm);
        card.style.display=matches||searchTerm===''?'':'none';
        if(matches) cardMatches=true;
      });
      section.style.display=sectionTitle.includes(searchTerm)||cardMatches||searchTerm===''?'none':'none';
    });
  });

  // === Edit Modal ===
  const editModal=document.createElement('div');
  editModal.id="editartikelModal";
  editModal.style.display="none";
  editModal.style.position="fixed";
  editModal.style.top="0";
  editModal.style.left="0";
  editModal.style.width="100%";
  editModal.style.height="100%";
  editModal.style.backgroundColor="rgba(0,0,0,0.7)";
  editModal.style.zIndex="3000";
  editModal.style.overflow="auto";
  editModal.innerHTML=`
    <div style="background:white; max-width:520px; margin:60px auto; padding:25px 30px; border-radius:12px; position:relative; box-shadow:0 8px 30px rgba(0,0,0,0.2); font-family:'Segoe UI', Tahoma, sans-serif;">
      <button id="closeEditModal" style="position:absolute; top:12px; right:12px; font-size:22px; font-weight:bold; color:#555; background:transparent; border:none; cursor:pointer; transition: transform 0.2s ease, color 0.2s ease;">&times;</button>
      <h3 style="text-align:center; font-size:20px; font-weight:bold; color:#2c3e50; margin-bottom:20px;">✏️ Edit artikel</h3>
      <form id="editartikelForm" style="display:flex; flex-direction:column; gap:15px;">
        <textarea id="editTitle" name="title" placeholder="Judul artikel" required style="padding:10px 12px; border:1px solid #ccc; border-radius:8px; font-size:15px; font-weight:600; resize:none; min-height:60px; line-height:1.4;"></textarea>
        <textarea id="editContent" name="content" placeholder="Deskripsi / Konten" required style="padding:12px 14px; border:1px solid #ccc; border-radius:8px; font-size:14px; resize:vertical; min-height:120px;"></textarea>
        <input type="file" id="editImg" name="img" accept="image/*" style="font-size:14px; padding:6px 0;">
        <button type="submit" style="background:#3498db;color:white;border:none;padding:12px;border-radius:8px;font-weight:bold;font-size:15px;cursor:pointer;transition: background 0.2s ease, transform 0.2s ease;">💾 Simpan Perubahan</button>
      </form>
    </div>
  `;
  document.body.appendChild(editModal);
  document.getElementById('closeEditModal').addEventListener('click', ()=>editModal.style.display='none');

  document.getElementById('editartikelForm').addEventListener('submit', e=>{
    e.preventDefault();
    const yakin=confirm("Yakin mau menyimpan perubahan?");
    if(!yakin) return;
    const formEl=e.target;
    const id=formEl.getAttribute('data-id');
    const formData=new FormData(formEl);
    const imgFile=document.getElementById('editImg').files[0];
    if(imgFile) formData.append('img', imgFile);
    fetch(`${LARAVEL_URL}/api/artikel/${id}`, {method:'POST', headers:{'X-HTTP-Method-Override':'PUT'}, body:formData})
      .then(res=>res.json())
      .then(updated=>{
        const idx=artikelData.findIndex(p=>p.id==id);
        artikelData[idx]=updated;
        renderCards();
        editModal.style.display='none';
      })
      .catch(err=>console.error("Error updating:", err));
  });

  // === Sosmed Section ===
  const sosmedContainer=document.getElementById('sosmed-sosmed_m');
  const addsosmedBtn=document.getElementById('addsosmedBtn');
  const sosmedModal=document.getElementById('sosmedModal');
  const closesosmedModal=document.getElementById('closesosmedModal');
  let sosmedForm=document.getElementById('sosmedForm');
  let sosmedData=[];

  function initSosmed(){
    fetch(`${LARAVEL_URL}/api/sosmed`)
      .then(res=>res.json())
      .then(data=>{ sosmedData=data; renderSosmed(); })
      .catch(err=>console.error("Gagal fetch sosmed:", err));
  }

  function renderSosmed(){
    if(!sosmedContainer) return;
    sosmedContainer.innerHTML='';
    sosmedData.forEach(item=>{
      const card=document.createElement('div');
      card.className='card searchable';
      card.dataset.id=item.id;
      card.style.cssText='margin-top:10px;padding:10px;border:1px solid #ccc;border-radius:8px';
      card.innerHTML=`
        <h3 style="font-size:14px; margin:5px 0;">${item.title}</h3>
        <p style="font-size:12px; margin:0 0 6px;">${item.content}</p>
        <button class="edit-sosmed" data-id="${item.id}" style="background:#3498db;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;margin-right:5px;">✏️ Edit</button>
        <button class="delete-sosmed" data-id="${item.id}" style="background:#e74c3c;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;margin-right:5px;">🗑️ Hapus</button>
      `;
      sosmedContainer.appendChild(card);
    });

    // Delete Sosmed
    sosmedContainer.querySelectorAll('.delete-sosmed').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id=btn.dataset.id;
        if(!confirm('Yakin ingin menghapus sosmed ini?')) return;
        fetch(`${LARAVEL_URL}/api/sosmed/${id}`, {method:'DELETE'})
          .then(res=>res.json())
          .then(()=>{ sosmedData=sosmedData.filter(s=>s.id!=id); renderSosmed(); })
          .catch(err=>console.error(err));
      });
    });

    // Edit Sosmed
    sosmedContainer.querySelectorAll('.edit-sosmed').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = btn.dataset.id;
        const item = sosmedData.find(s => s.id == id);
        if (!item) return;

        // Isi form
        sosmedForm.title.value = item.title;
        sosmedForm.content.value = item.content;
        sosmedModal.style.display = 'block';

        // Hapus listener lama
        const newForm = sosmedForm.cloneNode(true);
        sosmedForm.parentNode.replaceChild(newForm, sosmedForm);
        sosmedForm = newForm;

        // Assign listener baru
        sosmedForm.addEventListener('submit', ev => {
          ev.preventDefault();
          const title = sosmedForm.title.value;
          const content = sosmedForm.content.value;

          fetch(`${LARAVEL_URL}/api/sosmed/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
          })
            .then(res => res.json())
            .then(updated => {
              const idx = sosmedData.findIndex(s => s.id == id);
              sosmedData[idx] = updated;
              renderSosmed();
              sosmedModal.style.display = 'none';
              sosmedForm.reset();
            })
            .catch(err => console.error(err));
        });
      });
    });
  }

  addsosmedBtn?.addEventListener('click', ()=>sosmedModal.style.display='block');
  closesosmedModal?.addEventListener('click', ()=>sosmedModal.style.display='none');
  window.addEventListener('click', e=>{ if(e.target===sosmedModal) sosmedModal.style.display='none'; });

  sosmedForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const title=sosmedForm.title.value;
    const content=sosmedForm.content.value;
    fetch(`${LARAVEL_URL}/api/sosmed`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title,content})})
      .then(res=>res.json())
      .then(newSosmed=>{ sosmedData.push(newSosmed); renderSosmed(); sosmedModal.style.display='none'; sosmedForm.reset(); })
      .catch(err=>console.error(err));
  });

  initSosmed();
  initSection();
});
