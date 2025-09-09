// Data untuk semua proyek.
const projectsData = {
    'g-the-bugs': {
        title: 'G-THE BUGS',
        images: [
            'images/BUGS1.png',
            'images/BUGS2.png',
            'images/BUGS3.png',
            'images/BUGS4.png',
            'images/BUGS5.png'
        ],
        description: `
            Selamat datang ke dunia "G-THE BUGS", sebuah game platformer 2D yang penuh aksi dan petualangan. Kendalikan seorang ksatria serangga yang gagah berani dalam perjalanannya melalui dunia yang misterius dan berbahaya untuk menghadapi kegelapan yang mengancam.

            Sinopsis : 
            Di sebuah dunia kecil yang dihuni oleh berbagai jenis serangga, kedamaian telah hancur oleh entitas jahat yang dikenal sebagai The Void. Kegelapan ini merayap ke seluruh negeri, merusak pikiran dan jiwa para penghuninya, mengubah mereka menjadi makhluk tanpa pikiran yang ganas.

            Di tengah kekacauan ini, muncullah seorang pahlawan seorang ksatria serangga yang tak kenal takut. Berbekal pedang dan keberanian, dia memulai misi berbahaya untuk melakukan perjalanan ke jantung kegelapan, menghadapi para pengikut The Void yang rusak, dan akhirnya mengalahkan sumber dari segala kejahatan itu sendiri. Akankah sang ksatria berhasil mengembalikan cahaya ke dunianya, atau akankah dia juga ditelan oleh kehampaan abadi?

        `,
        liveDemoUrl: 'https://github.com/tinyDevill/G-the-Bugs'
    },
    'library-system': {
        title: 'Sistem Manajemen Perpustakaan',
        images: [
            'images/ILMU2.png',
            'images/ILMU1.png',
            'images/ILMU3.png',
            'images/ILMU4.png', 
            'images/ILMU5.png',
            'images/ILMU6.png'
        ],
        description: `
            Sebuah sistem manajemen perpustakaan berbasis web yang dirancang khusus untuk 
            Asrama Bright Scholarship YBM Brilliant. Aplikasi ini memodernisasi proses 
            peminjaman dan pengembalian buku melalui antarmuka yang responsif dan integrasi 
            pemindai QR Code untuk mempercepat proses administrasi. Dibangun dengan HTML, CSS, 
            dan JavaScript untuk front-end, serta PHP dan MySQL untuk back-end.
        `,
        liveDemoUrl: 'https://15-188-taufik.github.io/PerpustakaanYBM/'
    },
    'dashboard': {
        title: 'Dasbor Aktivitas Harian (Digital Signage)',
        images: [
            'images/digital.jpeg',
            'images/digital.jpeg'
        ],
        description: `
            Proyek ini adalah sebuah dasbor visual (digital signage) yang dirancang untuk 
            menampilkan status penyelesaian aktivitas harian para penerima beasiswa (awardee) 
            Bright Scholarship YBM BRILiaN secara real-time. Tampilan ini ditujukan untuk 
            dipasang di layar monitor di area umum seperti asrama atau sekretariat untuk 
            meningkatkan transparansi dan motivasi.
        `,
        liveDemoUrl: 'https://15-188-taufik.github.io/Digital-Signage-Bright-Scholarship-Batch-9-Daily-Activity/'
    },
    'activity-logger': {
        title: 'Aplikasi Pencatatan Aktivitas',
        images: [
            'images/daily2.png',
            'images/daily.png',
        ],
        description: `
            Aplikasi web sederhana yang dirancang untuk membantu para penerima beasiswa 
            (awardee) Bright Scholarship dari YBM BRILiaN dalam mencatat dan memantau 
            aktivitas harian mereka. Proyek ini bertujuan untuk mendigitalisasi proses 
            pelaporan kegiatan sebagai bagian dari program pembinaan karakter yang komprehensif.
        `,
        liveDemoUrl: 'https://15-188-taufik.github.io/Check-in-Daily-Activity/'
    }
};

// Fungsi yang dijalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    const project = projectsData[projectId];

    if (project) {
        document.title = `Proyek | ${project.title}`;
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-description-text').textContent = project.description.trim();

        const slider = document.querySelector('.slider');
        project.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Screenshot ${project.title}`;
            slider.appendChild(img);
        });

        // Logika untuk menampilkan tombol Live Demo
        const linksContainer = document.getElementById('project-links');
        if (project.liveDemoUrl && project.liveDemoUrl !== '#') {
            const demoButton = document.createElement('a');
            demoButton.href = project.liveDemoUrl;
            demoButton.className = 'btn live-demo-btn';
            demoButton.textContent = 'Lihat Live Demo';
            demoButton.target = '_blank'; // Buka di tab baru
            linksContainer.appendChild(demoButton);
        }

        initializeSlider();
    } else {
        document.getElementById('project-title').textContent = 'Proyek Tidak Ditemukan';
        document.getElementById('project-description-text').textContent = 'Maaf, proyek yang Anda cari tidak ada.';
    }
});

// Fungsi untuk membuat slider berfungsi
function initializeSlider() {
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const images = document.querySelectorAll('.slider img');
    
    if (images.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }
    
    let currentIndex = 0;
    const totalImages = images.length;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateSlider();
    });
}

