document.addEventListener('DOMContentLoaded', () => {
  const LARAVEL_URL = "http://localhost:8000";

  const addSlideBtn = document.getElementById('addSlideBtn');
  const addSlideModal = document.getElementById('addSlideModal');
  const closeAddSlideModal = document.getElementById('closeAddSlideModal');
  const addSlideForm = document.getElementById('addSlideForm');
  const slidesContainer = document.getElementById('slides');

  const editSlideModal = document.getElementById('editSlideModal');
  const closeEditSlideModal = document.getElementById('closeEditSlideModal');
  const editSlideForm = document.getElementById('editSlideForm');

  let currentSlideId = null;
  let editingSlideId = null;
  let autoSlideInterval;

  function renderSlide(slide) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide';
    slideDiv.dataset.id = slide.id;

    slideDiv.innerHTML = `
      <div class="slide-card">
        <img src="${LARAVEL_URL}/storage/${slide.img}" alt="Slide">
        <div class="caption">${slide.caption || ''}</div>
      </div>
      <div class="card-buttons" style="display:flex; justify-content:center; gap:10px; margin-top:8px;">
        <button class="edit-btn" data-id="${slide.id}">Edit</button>
        <button class="delete-btn" data-id="${slide.id}">Hapus</button>
      </div>
    `;

    slidesContainer.appendChild(slideDiv);

    slideDiv.querySelector('.edit-btn').addEventListener('click', () => openEditModal(slide));
    slideDiv.querySelector('.delete-btn').addEventListener('click', () => deleteSlide(slide.id));
  }

  function openEditModal(slide) {
    editingSlideId = slide.id;
    editSlideForm.querySelector('textarea[name="caption"]').value = slide.caption || '';
    editSlideModal.style.display = 'block';
  }

  closeAddSlideModal.addEventListener('click', () => addSlideModal.style.display = 'none');
  closeEditSlideModal.addEventListener('click', () => editSlideModal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === addSlideModal) addSlideModal.style.display = 'none';
    if (e.target === editSlideModal) editSlideModal.style.display = 'none';
  });

  addSlideForm.addEventListener('submit', e => {
    e.preventDefault();
    const imgFile = addSlideForm.querySelector('input[name="img"]').files[0];
    const captionText = addSlideForm.querySelector('textarea[name="caption"]').value || '';

    if (!imgFile) { alert('Pilih gambar'); return; }

    const formData = new FormData();
    formData.append('img', imgFile);
    formData.append('caption', captionText);

    fetch(`${LARAVEL_URL}/api/slides`, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(newSlide => {
        renderSlide(newSlide);
        currentSlideId = newSlide.id.toString();
        showSlideById(currentSlideId);
        addSlideModal.style.display = 'none';
        addSlideForm.reset();
        startAutoSlide();
      })
      .catch(err => { console.error(err); alert('Gagal menyimpan slide'); });
  });

  editSlideForm.addEventListener('submit', e => {
  e.preventDefault();

    const isConfirmed = confirm("Apakah Anda yakin ingin menyimpan perubahan?");
    if (!isConfirmed) return; 

    const imgFile = editSlideForm.querySelector('input[name="img"]').files[0];
    const captionText = editSlideForm.querySelector('textarea[name="caption"]').value || '';

    const formData = new FormData();
    if (imgFile) formData.append('img', imgFile);
    formData.append('caption', captionText);
    formData.append('_method', 'PUT'); 

    fetch(`${LARAVEL_URL}/api/slides/${editingSlideId}`, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(updatedSlide => {
        const slideDiv = slidesContainer.querySelector(`.slide[data-id="${updatedSlide.id}"]`);
        if(slideDiv){
          if(updatedSlide.img) slideDiv.querySelector('img').src = `${LARAVEL_URL}/storage/${updatedSlide.img}`;
          slideDiv.querySelector('.caption').innerText = updatedSlide.caption || '';
        }
        editSlideModal.style.display = 'none';
        editSlideForm.reset();
        alert('Perubahan berhasil disimpan!'); // opsional notifikasi sukses
      })
      .catch(err => { console.error(err); alert('Gagal update slide'); });
  });

  function deleteSlide(id){
    if(!confirm('Apakah Anda yakin ingin menghapus slide ini?')) return;

    fetch(`${LARAVEL_URL}/api/slides/${id}`, { method: 'DELETE' })
      .then(res => {
        if(res.ok){
          const slideDiv = slidesContainer.querySelector(`.slide[data-id="${id}"]`);
          if(slideDiv) slidesContainer.removeChild(slideDiv);
          if(currentSlideId == id.toString()){
            const allSlides = getAllSlidesSorted();
            currentSlideId = allSlides.length ? allSlides[0].dataset.id : null;
            showSlideById(currentSlideId);
          }
        } else { alert('Gagal menghapus slide'); }
      })
      .catch(err => alert('Error saat menghapus slide'));
  }

  function loadSlides() {
    fetch(`${LARAVEL_URL}/api/slides`)
      .then(res => res.json())
      .then(data => {
        slidesContainer.innerHTML = '';
        data.forEach(slide => renderSlide(slide));
        const allSlides = getAllSlidesSorted();
        if(allSlides.length > 0){
          currentSlideId = allSlides[0].dataset.id;
          showSlideById(currentSlideId);
        }
        startAutoSlide();
      })
      .catch(err => console.error(err));
  }

  function getAllSlidesSorted() {
    return Array.from(document.querySelectorAll('.slides .slide'))
      .sort((a, b) => parseInt(b.dataset.id) - parseInt(a.dataset.id));
  }

  function showSlideById(id) {
    document.querySelectorAll('.slides .slide').forEach(slide => {
      slide.style.display = (slide.dataset.id === id ? 'flex' : 'none');
    });
  }

  window.nextSlide = function() {
    const allSlides = getAllSlidesSorted();
    if (!allSlides.length) return;
    const currentIndex = allSlides.findIndex(s => s.dataset.id === currentSlideId);
    const nextIndex = (currentIndex + 1) % allSlides.length;
    currentSlideId = allSlides[nextIndex].dataset.id;
    showSlideById(currentSlideId);
  };
  window.prevSlide = function() {
    const allSlides = getAllSlidesSorted();
    if (!allSlides.length) return;
    const currentIndex = allSlides.findIndex(s => s.dataset.id === currentSlideId);
    const prevIndex = (currentIndex - 1 + allSlides.length) % allSlides.length;
    currentSlideId = allSlides[prevIndex].dataset.id;
    showSlideById(currentSlideId);
  };


  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => { nextSlide(); }, 5000);
  }

  addSlideBtn.addEventListener('click', () => addSlideModal.style.display = 'block');

  window.onload = function() {
    const track = document.querySelector('.info-track');
    track.innerHTML += track.innerHTML;

    // Hitung lebar total track
    let totalWidth = 0;
    track.querySelectorAll('.info-card').forEach(card => {
      totalWidth += card.offsetWidth + parseInt(getComputedStyle(card).marginRight);
    });
    track.style.width = totalWidth + 'px';

    let x = 0;
    const speed = 1; // px/frame

    function animate() {
      x -= speed;
      if (x <= -totalWidth / 2) x = 0; // reset tepat di akhir track pertama
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(animate);
    }

    animate();
  };
  
  const marqueeLink  = document.getElementById('marquee-link');
  const btnPrev      = document.getElementById('btn-prev');
  const btnNext      = document.getElementById('btn-next');

  let newsList = [];      // array berisi {id, title}
  let currentIndex = 0;
  let autoTimer = null;

  function showNews(i) {
    if (!newsList.length) return;
    const item = newsList[i];
    marqueeLink.style.opacity = 0;
    setTimeout(() => {
      marqueeLink.textContent = item.title;
      marqueeLink.dataset.id  = item.id;       // simpan ID berita
      marqueeLink.style.opacity = 1;
    }, 400);
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % newsList.length;
      showNews(currentIndex);
    }, 5000);
  }

  btnPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + newsList.length) % newsList.length;
    showNews(currentIndex);
    startAuto();
  });
  btnNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % newsList.length;
    showNews(currentIndex);
    startAuto();
  });

  fetch(`${LARAVEL_URL}/api/berita`)
    .then(res => res.json())
    .then(data => {
      newsList = data
        .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
        .map(item => ({ id: item.id, title: item.title }));
      if (newsList.length) {
        showNews(currentIndex);
        startAuto();
      }
    })
    .catch(err => console.error('Error memuat berita:', err));

  marqueeLink.addEventListener('click', e => {
    e.preventDefault();
    const id = marqueeLink.dataset.id;
    if (!id) return;

    window.location.href = `/berita?id=${id}`;
  });

// --- Seleksi Container ---
const sejarahContainer = document.querySelector('.sejarah-kolom-satu');
const visimisiContainer = document.querySelector('.visimisi-kolom-satu');
const pengumumanContainer = document.querySelector('.pengumuman-kolom-satu');

if (!sejarahContainer || !visimisiContainer || !pengumumanContainer) return;

// --- Fetch Sejarah ---
fetch(`${LARAVEL_URL}/api/sejarah`)
  .then(res => res.json())
  .then(data => {
    sejarahContainer.innerHTML = ''; 
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'sejarah-item';
      div.style.cssText = `display: flex; align-items: flex-start; margin-bottom: 20px;`;

      div.innerHTML = `
        ${item.img ? `<div style="flex: 0 0 40%; margin-right: 15px;">
                        <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">
                      </div>` : ''}
        <div style="flex: 1;">
          <h3 style="margin:0 0 8px 0; font-size:18px; color:#333;">${item.title}</h3>
          <p style="margin:0; font-size:14px; color:#555; line-height:1.5; text-align: justify;white-space: pre-line;">${item.content}</p>
        </div>
      `;

      sejarahContainer.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Gagal memuat sejarah:', err);
    sejarahContainer.innerHTML = '<p style="color:red;">Gagal memuat data sejarah.</p>';
  });

// --- Fetch VisiMisi ---
fetch(`${LARAVEL_URL}/api/visimisi`)
  .then(res => res.json())
  .then(data => {
    visimisiContainer.innerHTML = '';
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'visimisi-item';
      div.style.cssText = `display: flex; align-items: flex-start; margin-bottom: 20px;`;

      div.innerHTML = `
        <div style="flex: 1; padding-right: 15px;">
          <h3 style="margin:0 0 8px 0; font-size:18px; color:#333;">${item.title}</h3>
          <p style="margin:0; font-size:14px; color:#555; line-height:1.5; text-align: justify; white-space: pre-line;">${item.content}</p>
        </div>
        ${item.img ? `<div style="flex: 0 0 40%;">
        <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">
        </div>` : ''}
      `;

      visimisiContainer.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Gagal memuat visimisi:', err);
    visimisiContainer.innerHTML = '<p style="color:red;">Gagal memuat data VisiMisi.</p>';
  });

  // --- Fetch Pengumuman dengan Pagination ---
  fetch(`${LARAVEL_URL}/api/pengumuman`)
    .then(res => res.json())
    .then(data => {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const pengumumanPerPage = 4;
      let currentPage = 1;
      const totalPages = Math.ceil(data.length / pengumumanPerPage);

      const renderPage = (page) => {
        pengumumanContainer.innerHTML = '';

        // --- Header ---
        const header = document.createElement('div');
        header.textContent = 'PENGUMUMAN TERBARU';
        header.style.cssText = `
          width: 100%;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: left;
        `;
        pengumumanContainer.appendChild(header);

        // --- Grid Container ---
        const pengumumanListContainer = document.createElement('div');
        pengumumanListContainer.style.display = 'grid';
        pengumumanListContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        pengumumanListContainer.style.gap = '10px';
        pengumumanContainer.appendChild(pengumumanListContainer);

        // Data per halaman
        const start = (page - 1) * pengumumanPerPage;
        const end = start + pengumumanPerPage;
        const pageData = data.slice(start, end);

        pageData.forEach(item => {
          const createdTime = new Date(item.created_at).getTime();
          const now = Date.now();
          const isNew = now - createdTime < 24 * 60 * 60 * 1000;

          const div = document.createElement('div');
          div.className = 'pengumuman-item card';
          div.style.cssText = `
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.2s ease, box-shadow 0.3s ease;
            cursor: pointer;
          `;

          // Hover effect card
          div.addEventListener('mouseenter', () => {
            div.style.transform = 'translateY(-5px)';
            div.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
          });
          div.addEventListener('mouseleave', () => {
            div.style.transform = 'translateY(0)';
            div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          });

          div.innerHTML = `
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
              ${item.img ? `<img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
              ">` : '' }
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
              <p style="font-size: 10px; color: #777; margin: 0 0 8px; white-space: pre-line;">
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
          `;

          pengumumanListContainer.appendChild(div);

          // Hover effect tombol Selengkapnya
          const readMoreBtn = div.querySelector('.read-more');
          readMoreBtn.addEventListener('mouseenter', () => {
            readMoreBtn.style.background = '#3498db';
            readMoreBtn.style.color = '#fff';
            readMoreBtn.style.transform = 'scale(1.05)';
          });
          readMoreBtn.addEventListener('mouseleave', () => {
            readMoreBtn.style.background = 'transparent';
            readMoreBtn.style.color = '#3498db';
            readMoreBtn.style.transform = 'scale(1)';
          });

          // --- Klik card atau Selengkapnya ke halaman detail ---
          const goToDetail = () => {
            window.location.href = `/pengumuman?id=${item.id}`;
          };

          div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('edit-card') && !e.target.classList.contains('delete-card') && !e.target.classList.contains('read-more')) {
              goToDetail();
            }
          });

          readMoreBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // cegah click card
            goToDetail();
          });
        });

        // --- Pagination Controls ---
        const pagination = document.createElement('div');
        pagination.style.cssText = `
          margin-top: 15px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 100%;
        `;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.disabled = page === 1;
        prevBtn.onclick = () => renderPage(currentPage - 1);
        pagination.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.textContent = i;
          pageBtn.style.fontWeight = i === page ? 'bold' : 'normal';
          pageBtn.onclick = () => renderPage(i);
          pagination.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => renderPage(currentPage + 1);
        pagination.appendChild(nextBtn);

        pengumumanContainer.appendChild(pagination);
        currentPage = page;
      };

      renderPage(1);
    })
    .catch(err => {
      console.error('Gagal memuat pengumuman:', err);
      pengumumanContainer.innerHTML = '<p style="color:red;">Gagal memuat data pengumuman.</p>';
    });

  loadSlides();
});
