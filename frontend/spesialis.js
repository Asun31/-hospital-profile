/**
 * Created by PhpStorm.
 * User: asun fadrianto
 * Date: 07/09/2025
 * Time: 10.05
 */ 

document.addEventListener('DOMContentLoaded', () => {
  console.log("spesialis.js loaded!");

  const LARAVEL_URL = "http://localhost:8000"; 
  const searchInput = document.getElementById('searchInput');
  const container = document.getElementById('spesialis-spesialis_m');

  let spesialisData = [];

  function initSection() {
    fetch(`${LARAVEL_URL}/api/spesialis`)
      .then(res => res.json())
      .then(data => {
        spesialisData = data;
        renderCards();
      })
      .catch(err => console.error(`Error fetching spesialis:`, err));
  }

  function renderCards() {
    container.innerHTML = '';

    const itemsToRender = [...spesialisData].sort(
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
  }

  searchInput?.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const sections = document.querySelectorAll('main section');

    sections.forEach(section => {
      const sectionTitle = section.querySelector('h2.section-title')?.innerText.toLowerCase() || '';
      const cards = section.getElementsByClassName('card');
      let cardMatches = false;

      if (sectionTitle.includes(searchTerm) && searchTerm !== '') {
        section.style.display = '';
        Array.from(cards).forEach(card => { card.style.display = ''; });
        return; 
      }

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

  initSection();
});