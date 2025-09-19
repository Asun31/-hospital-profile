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

  /** ==== Render slide ==== */
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

    // Event tombol
    slideDiv.querySelector('.edit-btn').addEventListener('click', () => openEditModal(slide));
    slideDiv.querySelector('.delete-btn').addEventListener('click', () => deleteSlide(slide.id));
  }

  /** ==== Buka modal edit ==== */
  function openEditModal(slide) {
    editingSlideId = slide.id;
    editSlideForm.querySelector('textarea[name="caption"]').value = slide.caption || '';
    editSlideModal.style.display = 'block';
  }

  /** ==== Tutup modal ==== */
  closeAddSlideModal.addEventListener('click', () => addSlideModal.style.display = 'none');
  closeEditSlideModal.addEventListener('click', () => editSlideModal.style.display = 'none');
  window.addEventListener('click', e => {
    if (e.target === addSlideModal) addSlideModal.style.display = 'none';
    if (e.target === editSlideModal) editSlideModal.style.display = 'none';
  });

  /** ==== Submit tambah slide ==== */
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

  /** ==== Submit edit slide ==== */
  editSlideForm.addEventListener('submit', e => {
    e.preventDefault();
    const imgFile = editSlideForm.querySelector('input[name="img"]').files[0];
    const captionText = editSlideForm.querySelector('textarea[name="caption"]').value || '';

    const formData = new FormData();
    if(imgFile) formData.append('img', imgFile);
    formData.append('caption', captionText);
    formData.append('_method', 'PUT'); // supaya Laravel bisa menerima PUT dengan FormData

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
      })
      .catch(err => { console.error(err); alert('Gagal update slide'); });
  });

  /** ==== Hapus slide ==== */
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

  /** ==== Load slide ==== */
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

  /** ==== Sort slides ==== */
  function getAllSlidesSorted() {
    return Array.from(document.querySelectorAll('.slides .slide'))
      .sort((a, b) => parseInt(b.dataset.id) - parseInt(a.dataset.id));
  }

  /** ==== Tampilkan slide ==== */
  function showSlideById(id) {
    document.querySelectorAll('.slides .slide').forEach(slide => {
      slide.style.display = (slide.dataset.id === id ? 'flex' : 'none');
    });
  }

  /** ==== Navigasi ==== */
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

  /** ==== Auto slide ==== */
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => { nextSlide(); }, 8000);
  }

  /** ==== Modal buka ==== */
  addSlideBtn.addEventListener('click', () => addSlideModal.style.display = 'block');

  /** ==== Load pertama ==== */
  loadSlides();
});
