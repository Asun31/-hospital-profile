/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("visimisi.js loaded!");

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
                <br><p>${item.content}</p>
              </div>
            </div>
          `;
        });
      })
      .catch(err => console.error(`Error fetching ${apiEndpoint}:`, err));

      // ===== Tambahkan di bawah kode fetch untuk render kartu =====
      container.addEventListener('click', (e) => {
          if (e.target.tagName === 'IMG') {
              const src = e.target.src;

              let modal = document.getElementById('imgModal');
              if (!modal) {
                  modal = document.createElement('div');
                  modal.id = 'imgModal';
                  modal.style.position = 'fixed';
                  modal.style.top = '0';
                  modal.style.left = '0';
                  modal.style.width = '100%';
                  modal.style.height = '100%';
                  modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
                  modal.style.display = 'flex';
                  modal.style.alignItems = 'center';
                  modal.style.justifyContent = 'center';
                  modal.style.zIndex = '2000';
                  modal.style.cursor = 'pointer';

                  const img = document.createElement('img');
                  img.id = 'imgModalContent';
                  img.style.maxWidth = '90%';
                  img.style.maxHeight = '90%';
                  img.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
                  modal.appendChild(img);

                  document.body.appendChild(modal);

                  modal.addEventListener('click', () => {
                      modal.style.display = 'none';
                  });
              }

              const modalImg = document.getElementById('imgModalContent');
              modalImg.src = src;
              modal.style.display = 'flex';
          }
      });

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
        alert(`Gagal menambahkan data, periksa koneksi backend ${apiEndpoint}.`);
      });
    });
  }

  // ==== Inisialisasi Section visimisi ====
  initSection({
    apiEndpoint: 'visimisi',
    containerId: 'visimisi-visimisi_m',
    addBtnId: 'addVisimisiBtn',
    modalId: 'visimisiModal',
    closeBtnId: 'closevisimisiModal',
    formId: 'visimisiForm'
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
