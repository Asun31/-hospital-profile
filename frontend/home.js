/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("home.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; // URL backend Laravel
  const searchInput = document.getElementById('searchInput');

  /**
   * Inisialisasi section (reusable untuk profil, publikasi, dst.)
   */
  function initSection({ apiEndpoint, containerId, addBtnId, modalId, closeBtnId, formId }) {
    const container = document.getElementById(containerId);
    const addBtn = document.getElementById(addBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    const form = document.getElementById(formId);

    // ==== Ambil data awal dari API ====
    fetch(`${LARAVEL_URL}/api/${apiEndpoint}`)
      .then(res => res.json())
      .then(data => {
        container.innerHTML = "";
        data.forEach(item => {
          container.innerHTML += `
            <div class="card searchable">
              <img src="${LARAVEL_URL}/storage/${item.img}" alt="${item.title}">
              <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
              </div>
            </div>
          `;
        });
      })
      .catch(err => console.error(`Error fetching ${apiEndpoint}:`, err));

    // ==== Modal open/close ====
    addBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // ==== Form submit (tambah kartu) ====
    form.addEventListener('submit', e => {
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

      fetch(`${LARAVEL_URL}/api/${apiEndpoint}`, {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(newCard => {
        container.innerHTML += `
          <div class="card searchable">
            <img src="${LARAVEL_URL}/storage/${newCard.img}" alt="${newCard.title}">
            <div class="card-content">
              <h3>${newCard.title}</h3>
              <p>${newCard.content}</p>
            </div>
          </div>
        `;
        modal.style.display = 'none';
        form.reset();
      })
      .catch(err => {
        console.error(`Error adding ${apiEndpoint}:`, err);
        alert(`Gagal menambahkan data ${apiEndpoint}.`);
      });
    });
  }

  // ==== Inisialisasi Section sejarah ====
  initSection({
    apiEndpoint: 'sejarah',
    containerId: 'sejarah-sejarah_m',
    addBtnId: 'addSejarahBtn',
    modalId: 'sejarahModal',
    closeBtnId: 'closeSejarahModal',
    formId: 'sejarahForm'
  });

  // ==== Inisialisasi Section struktur ====
  initSection({
    apiEndpoint: 'struktur',
    containerId: 'struktur-struktur_m',
    addBtnId: 'addStrukturBtn',
    modalId: 'strukturModal',
    closeBtnId: 'closestrukturModal',
    formId: 'strukturForm'
  });

  // ==== Inisialisasi Section visimisi ====
  initSection({
    apiEndpoint: 'visimisi',
    containerId: 'visimisi-visimisi_m',
    addBtnId: 'addvisimisiBtn',
    modalId: 'visimisiModal',
    closeBtnId: 'closevisimisiModal',
    formId: 'visimisiForm'
  });

  // ==== Inisialisasi Section berita ====
  initSection({
    apiEndpoint: 'berita',
    containerId: 'berita-berita_m',
    addBtnId: 'addberitaBtn',
    modalId: 'beritaModal',
    closeBtnId: 'closeberitaModal',
    formId: 'beritaForm'
  });

  // ==== Inisialisasi Section pengumuman ====
  initSection({
    apiEndpoint: 'pengumuman',
    containerId: 'pengumuman-pengumuman_m',
    addBtnId: 'addpengumumanBtn',
    modalId: 'pengumumanModal',
    closeBtnId: 'closepengumumanModal',
    formId: 'pengumumanForm'
  });

  // ==== Inisialisasi Section penghargaan ====
  initSection({
    apiEndpoint: 'penghargaan',
    containerId: 'penghargaan-penghargaan_m',
    addBtnId: 'addpenghargaanBtn',
    modalId: 'penghargaanModal',
    closeBtnId: 'closepenghargaanModal',
    formId: 'penghargaanForm'
  });

  // ==== Inisialisasi Section daftar dokter ====
  initSection({
    apiEndpoint: 'daftardokter',
    containerId: 'daftardokter-daftardokter_m',
    addBtnId: 'adddaftardokterBtn',
    modalId: 'daftardokterModal',
    closeBtnId: 'closedaftardokterModal',
    formId: 'daftardokterForm'
  });

  // ==== Inisialisasi Section daftar dokter ====
  initSection({
    apiEndpoint: 'jadwaldokter',
    containerId: 'jadwaldokter-jadwaldokter_m',
    addBtnId: 'addjadwaldokterBtn',
    modalId: 'jadwaldokterModal',
    closeBtnId: 'closejadwaldokterModal',
    formId: 'jadwaldokterForm'
  });

  // ==== Pencarian Global ====
    searchInput.addEventListener('input', () => {
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
});
