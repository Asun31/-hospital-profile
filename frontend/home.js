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


  loadSlides();
});
