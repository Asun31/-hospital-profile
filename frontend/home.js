document.addEventListener('DOMContentLoaded', () => {
    console.log("homeAdmin.js loaded!");

    // ==== Mengambil Data Profil dari API Backend ==== 
    fetch('http://localhost:8000/api/profile')
        .then(response => response.json())
        .then(data => {
            const profileContainer = document.getElementById('profile-cards');
            data.forEach(p => profileContainer.innerHTML += `
                <div class="card searchable">
                    <img src="/storage/${p.img}" alt="${p.title}">
                    <div class="card-content">
                        <h3>${p.title}</h3>
                        <p>${p.content}</p>
                    </div>
                </div>
            `);
        })
        .catch(error => console.error('Error fetching profile data:', error));

    // ==== Tombol Tambah Kartu dan Modal ==== 
    const addCardBtn = document.getElementById('addCardBtn');
    const addCardModal = document.getElementById('addCardModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addCardForm = document.getElementById('addCardForm');

    // Tampilkan modal saat tombol "Tambah Kartu" diklik
    addCardBtn.addEventListener('click', () => {
        addCardModal.style.display = 'block';
    });

    // Tutup modal saat tombol "X" diklik
    closeModalBtn.addEventListener('click', () => {
        addCardModal.style.display = 'none';
    });

    // Tutup modal jika klik di luar modal content
    window.addEventListener('click', (event) => {
        if (event.target === addCardModal) {
            addCardModal.style.display = 'none';
        }
    });

    // ==== Pengiriman Data Form ke API (Tambah Kartu) ==== 
    addCardForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Mencegah form untuk refresh halaman

        const img = document.getElementById('img').files[0];  // Ambil gambar yang di-upload
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        if (!img) {
            alert("Harap pilih gambar untuk kartu.");
            return;
        }

        const formData = new FormData();
        formData.append('img', img);  // Gambar
        formData.append('title', title);  // Judul Kartu
        formData.append('content', content);  // Konten Kartu

        // Kirim data ke API untuk ditambahkan ke database
        fetch('http://localhost:8000/api/profile', {  // Perhatikan URL API yang benar (sesuai route di Laravel)
            method: 'POST',
            body: formData,  // Mengirim data menggunakan FormData
        })
        .then(response => response.json())
        .then(newCard => {
            // Menambahkan kartu baru di dalam container
            const profileContainer = document.getElementById('profile-cards');
            profileContainer.innerHTML += `
                <div class="card searchable">
                    <img src="/storage/${newCard.img}" alt="${newCard.title}">
                    <div class="card-content">
                        <h3>${newCard.title}</h3>
                        <p>${newCard.content}</p>
                    </div>
                </div>
            `;
            
            // Menutup modal setelah berhasil menambahkan kartu
            addCardModal.style.display = 'none';
        })
        .catch(error => {
            console.error('Error adding new card:', error);
            alert('Gagal menambahkan kartu. Silakan coba lagi.');
        });
    });

    // ==== Pencarian ==== 
    const searchInput = document.getElementById('searchInput');
    const cardsContainer = document.getElementById('profile-cards');
    const cards = cardsContainer.getElementsByClassName('card');

    // Fungsi untuk mencari berdasarkan input
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();

        // Loop untuk setiap kartu
        for (let card of cards) {
            const title = card.querySelector('h3').innerText.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
});
