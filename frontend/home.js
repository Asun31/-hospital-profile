document.addEventListener('DOMContentLoaded', () => {
  const LARAVEL_URL = "http://localhost:8000";

  const addSlideBtn = document.getElementById('addSlideBtn');
  const addSlideModal = document.getElementById('addSlideModal');
  const closeAddSlideModal = document.getElementById('closeAddSlideModal');
  const addSlideForm = document.getElementById('addSlideForm');
  const slidesContainer = document.getElementById('slides');

  let currentSlideId = null; // ID slide yang sedang tampil
  let autoSlideInterval;

  /** ==== Fungsi render slide di DOM ==== */
  function renderSlide(slide) {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'slide';
    slideDiv.dataset.id = slide.id; // simpan id slide
    slideDiv.innerHTML = `
      <div class="slide-card">
        <img src="${LARAVEL_URL}/storage/${slide.img}" alt="Slide">
        <div class="caption">${slide.caption || ''}</div>
      </div>
    `;
    slidesContainer.appendChild(slideDiv);
  }

  /** ==== Load semua slide dari backend ==== */
  function loadSlides() {
    fetch(`${LARAVEL_URL}/api/slides`)
      .then(res => res.json())
      .then(data => {
        slidesContainer.innerHTML = '';
        data.forEach(slide => renderSlide(slide));
        // urutkan berdasarkan id terbesar ke terkecil
        const allSlides = getAllSlidesSorted();
        if (allSlides.length > 0) {
          currentSlideId = allSlides[0].dataset.id;
          showSlideById(currentSlideId);
        }
        startAutoSlide();
      })
      .catch(err => console.error('Gagal load slides:', err));
  }

  /** ==== Ambil semua slide terurut dari id terbesar ke terkecil ==== */
  function getAllSlidesSorted() {
    return Array.from(document.querySelectorAll('.slides .slide'))
      .sort((a, b) => parseInt(b.dataset.id) - parseInt(a.dataset.id));
  }

  /** ==== Tampilkan slide berdasarkan id ==== */
  function showSlideById(id) {
    const allSlides = document.querySelectorAll('.slides .slide');
    allSlides.forEach(slide => {
      slide.style.display = (slide.dataset.id === id ? 'flex' : 'none');
    });
  }

  /** ==== Kontrol slide ==== */
  window.nextSlide = function() {
    const allSlides = getAllSlidesSorted();
    if (allSlides.length === 0) return;
    const currentIndex = allSlides.findIndex(slide => slide.dataset.id === currentSlideId);
    const nextIndex = (currentIndex + 1) % allSlides.length;
    currentSlideId = allSlides[nextIndex].dataset.id;
    showSlideById(currentSlideId);
  };

  window.prevSlide = function() {
    const allSlides = getAllSlidesSorted();
    if (allSlides.length === 0) return;
    const currentIndex = allSlides.findIndex(slide => slide.dataset.id === currentSlideId);
    const prevIndex = (currentIndex - 1 + allSlides.length) % allSlides.length;
    currentSlideId = allSlides[prevIndex].dataset.id;
    showSlideById(currentSlideId);
  };

  /** ==== Auto-slide setiap 15 detik ==== */
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 10000);
  }

  /** ==== Modal buka/tutup ==== */
  addSlideBtn.addEventListener('click', () => addSlideModal.style.display = 'block');
  closeAddSlideModal.addEventListener('click', () => addSlideModal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === addSlideModal) addSlideModal.style.display = 'none'; });

  /** ==== Submit form tambah slide ==== */
  addSlideForm.addEventListener('submit', e => {
    e.preventDefault();

    const imgFile = addSlideForm.querySelector('input[name="img"]').files[0];
    const captionText = addSlideForm.querySelector('textarea[name="caption"]').value || '';

    const formData = new FormData();

    if (imgFile) {
      const validImageTypes = ['image/jpeg','image/jpg','image/png','image/bmp','image/gif'];
      if (!validImageTypes.includes(imgFile.type)) {
        alert("File bukan gambar valid.");
        return;
      }
      formData.append('img', imgFile);
    }

    formData.append('caption', captionText);

    fetch(`${LARAVEL_URL}/api/slides`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(newSlide => {
      renderSlide(newSlide);
      currentSlideId = newSlide.id.toString(); // pakai id baru
      showSlideById(currentSlideId);
      addSlideModal.style.display = 'none';
      addSlideForm.reset();
      startAutoSlide(); // reset auto-slide
    })
    .catch(err => {
      console.error('Error:', err);
      alert("Gagal menyimpan slide. Periksa koneksi backend.");
    });
  });

  /** ==== Load slide pertama saat halaman ready ==== */
  loadSlides();
});
