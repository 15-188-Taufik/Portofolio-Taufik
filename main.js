// =================================================================
//                 SETUP DASAR THREE.JS
// =================================================================

// 1. Scene: Wadah untuk semua objek 3D, kamera, dan cahaya.
const scene = new THREE.Scene();

// 2. Camera: Sudut pandang kita terhadap scene.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// 3. Renderer: "Pelukis" yang menggambar scene dari sudut pandang kamera.
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#hero-canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// =================================================================
//                 MEMBUAT TEKSTUR PARTIKEL (BARU)
// =================================================================

// Fungsi untuk membuat tekstur lingkaran secara dinamis
const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    
    // Menggambar lingkaran putih di tengah canvas
    context.beginPath();
    context.arc(16, 16, 15, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
    context.fillStyle = '#ffffff';
    context.fill();
    
    return new THREE.CanvasTexture(canvas);
};

const circleTexture = createCircleTexture();


// =================================================================
//                 MEMBUAT PARTIKEL (DOT MATRIX)
// =================================================================

const particlesCount = 7000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material: Tampilan dari objek (DIUBAH)
const particlesMaterial = new THREE.PointsMaterial({
    // Menggunakan tekstur lingkaran yang sudah kita buat
    map: circleTexture, 
    size: 0.25,// Ukuran bisa disesuaikan lagi
    color: 0xFFC900, // golden color in hex
    transparent: true, // Wajib true agar latar belakang transparan tekstur berfungsi
    blending: THREE.AdditiveBlending,
    // Mencegah bug render aneh pada beberapa GPU
    depthWrite: false, 
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// =================================================================
//                 INTERAKSI MOUSE
// =================================================================

const mouse = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// =================================================================
//                 ANIMASI
// =================================================================

const clock = new THREE.Clock();

const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Animasi gelombang partikel
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x * 0.5) * 2;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Interaksi mouse
    const targetX = mouse.x * 0.1;
    const targetY = mouse.y * 0.1;

    particles.rotation.y += 0.5 * (targetX - particles.rotation.y);
    particles.rotation.x += 0.5 * (targetY - particles.rotation.x);
    
    renderer.render(scene, camera);
};

animate();

// =================================================================
//                 RESPONSIVE DESIGN
// =================================================================

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// =================================================================
//                 TOPBAR SCROLL EFFECT
// =================================================================

const header = document.getElementById('main-header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
