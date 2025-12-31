// =================================================================
//                 SETUP DASAR THREE.JS
// =================================================================

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25; 

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#hero-canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// =================================================================
//                 MEMBUAT TEKSTUR PARTIKEL
// =================================================================

const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.arc(16, 16, 15, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.fill();
    return new THREE.CanvasTexture(canvas);
};
const circleTexture = createCircleTexture();


// =================================================================
//                 MEMBUAT PARTIKEL (BENTUK GALAKSI)
// =================================================================

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 20000;

const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

const parameters = {
    radius: 20,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
};

const colorInside = new THREE.Color(parameters.insideColor);
const colorOutside = new THREE.Color(parameters.outsideColor);

for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    map: circleTexture,
    size: 0.15,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);


// =================================================================
//      INTERAKSI DRAG 360 DERAJAT (UNTUK MOUSE & TOUCHSCREEN)
// =================================================================

let isDragging = false;
let previousPosition = { x: 0, y: 0 };
const canvas = renderer.domElement;

const getPosition = (e) => {
    // Cek jika ini adalah touch event
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    // Jika bukan, ini adalah mouse event
    return { x: e.clientX, y: e.clientY };
};

const onDragStart = (e) => {
    isDragging = true;
    canvas.classList.add('grabbing');
    const pos = getPosition(e);
    previousPosition.x = pos.x;
    previousPosition.y = pos.y;
};

const onDragMove = (e) => {
    if (!isDragging) return;
    // Mencegah scroll halaman di mobile saat dragging
    e.preventDefault(); 
    
    const pos = getPosition(e);
    const deltaX = pos.x - previousPosition.x;
    const deltaY = pos.y - previousPosition.y;

    particles.rotation.y += deltaX * 0.005;
    particles.rotation.x += deltaY * 0.005;

    previousPosition.x = pos.x;
    previousPosition.y = pos.y;
};

const onDragEnd = () => {
    isDragging = false;
    canvas.classList.remove('grabbing');
};

// Event Listeners untuk Mouse
canvas.addEventListener('mousedown', onDragStart);
canvas.addEventListener('mousemove', onDragMove);
canvas.addEventListener('mouseup', onDragEnd);
canvas.addEventListener('mouseleave', onDragEnd);

// Event Listeners untuk Touch
canvas.addEventListener('touchstart', onDragStart);
canvas.addEventListener('touchmove', onDragMove, { passive: false }); // `passive: false` penting
canvas.addEventListener('touchend', onDragEnd);
canvas.addEventListener('touchcancel', onDragEnd);


// =================================================================
//                 ANIMASI
// =================================================================

const animate = () => {
    requestAnimationFrame(animate);
    if (!isDragging) {
        particles.rotation.y += 0.0005;
    }
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
