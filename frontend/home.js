document.addEventListener('DOMContentLoaded', () => {
  console.log("home.js loaded!");

  // ==== Mengambil Data Profil dari API Backend ====
  fetch('http://localhost:8000/api/profile')
    .then(response => response.json())
    .then(data => {
      const profileContainer = document.getElementById('profile-cards');
      data.forEach(p => profileContainer.innerHTML += `
        <div class="card searchable">
          <img src="${p.img}" alt="${p.title}">
          <div class="card-content">
            <h3>${p.title}</h3>
            <p>${p.content}</p>
          </div>
        </div>
      `);
    })
    .catch(error => console.error('Error fetching profile data:', error));


  // ==== selamat datang ====
  const message = document.querySelector('.welcome-message');
    message.innerHTML = message.textContent
      .split('')
      .map((char, i) => {
          if(char === ' ') char = '&nbsp;'; // spasi tetap terlihat
          return `<span style="animation-delay:${i*0.05}s">${char}</span>`;
      })
      .join('');

  // ==== Slider ====
  let currentIndex = 0;
  const slides = document.getElementById('slides');
  const totalSlides = document.querySelectorAll('.slide').length;

  function showSlide(index) {
    if (index >= totalSlides) currentIndex = 0;
    else if (index < 0) currentIndex = totalSlides - 1;
    else currentIndex = index;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  window.nextSlide = () => showSlide(currentIndex + 1);
  window.prevSlide = () => showSlide(currentIndex - 1);
  setInterval(nextSlide, 4000);

  // ==== Pencarian ====
  document.getElementById('searchInput').addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    document.querySelectorAll('.searchable').forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(keyword) ? 'block' : 'none';
    });
  });
});
