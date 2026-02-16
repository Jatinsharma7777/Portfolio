// ===================================
// THREE.JS 3D BACKGROUND SCENE
// ===================================

let scene, camera, renderer, particles, geometries = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create wireframe geometries
    createWireframeGeometries();
    
    // Create particle system
    createParticleSystem();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    // Start animation
    animate();
}

function createWireframeGeometries() {
    const geometryTypes = [
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.OctahedronGeometry(8, 0),
        new THREE.TorusGeometry(6, 2, 16, 100),
        new THREE.IcosahedronGeometry(7, 0)
    ];
    
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    
    // Create multiple geometries at random positions
    for (let i = 0; i < 8; i++) {
        const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
        const mesh = new THREE.Mesh(geometry, material.clone());
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 100;
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = (Math.random() - 0.5) * 100;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Random scale
        const scale = 0.5 + Math.random() * 1.5;
        mesh.scale.set(scale, scale, scale);
        
        scene.add(mesh);
        geometries.push(mesh);
    }
}

function createParticleSystem() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;     // x
        positions[i + 1] = (Math.random() - 0.5) * 200; // y
        positions[i + 2] = (Math.random() - 0.5) * 200; // z
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate geometries
    geometries.forEach((mesh, index) => {
        mesh.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.002 * (index % 2 === 0 ? 1 : -1);
        
        // Floating animation
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
    });
    
    // Rotate particle system
    if (particles) {
        particles.rotation.y += 0.0005;
    }
    
    // Camera follows mouse with smooth easing
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.padding = '1rem 0';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
            nav.style.padding = '1.5rem 0';
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// PARTICLE CURSOR TRAIL
// ===================================

function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
    });
    
    // This creates a subtle visual effect
    // You can enhance this with canvas if needed
}

// ===================================
// TECH STACK HOVER EFFECTS
// ===================================

function initTechStackEffects() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===================================
// INITIALIZE ALL
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initCursorTrail();
    initTechStackEffects();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Throttle scroll events for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply optimizations
window.addEventListener('scroll', throttle(() => {
    // Scroll optimizations
}, 16)); // ~60fps

window.addEventListener('resize', debounce(onWindowResize, 250));
