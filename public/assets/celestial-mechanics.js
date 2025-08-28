/* Celestial Mechanics Learning Platform JavaScript */

// Global variables
let currentSection = 0;
let sectionProgress = { 0: true }; // Section 0 (introduction) is unlocked by default
let planetOrbits = null;
let gravityDemo = null;

// Planet data for calculations
const planetData = {
    mercury: { name: "水星", distance: 0.39, period: 0.24, mass: 0.055, radius: 0.383 },
    venus: { name: "金星", distance: 0.72, period: 0.62, mass: 0.815, radius: 0.949 },
    earth: { name: "地球", distance: 1.00, period: 1.00, mass: 1.000, radius: 1.000 },
    mars: { name: "火星", distance: 1.52, period: 1.88, mass: 0.107, radius: 0.532 },
    jupiter: { name: "木星", distance: 5.20, period: 11.86, mass: 317.8, radius: 11.21 },
    saturn: { name: "土星", distance: 9.54, period: 29.46, mass: 95.2, radius: 9.45 },
    uranus: { name: "天王星", distance: 19.22, period: 84.01, mass: 14.5, radius: 4.01 },
    neptune: { name: "海王星", distance: 30.11, period: 164.8, mass: 17.1, radius: 3.88 }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    updateSectionNav();
    initializeMath();
    showSection(0);
    
    // Section navigation event listeners
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionNum = parseInt(btn.dataset.section);
            if (sectionProgress[sectionNum]) {
                showSection(sectionNum);
            }
        });
    });
    
    // Next button event listeners
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextSection = parseInt(e.target.dataset.next);
            unlockSection(nextSection);
            showSection(nextSection);
        });
    });
    
    // Initialize section-specific content
    initializeSection0();
    initializeSection1();
    initializeSection2();
    initializeSection3();
    initializeSection4();
    initializeSection5();
    initializeSection6();
    initializeSection7();
});

// Initialize MathJax
function initializeMath() {
    if (window.MathJax) {
        MathJax.startup.defaultReady();
    }
}

// Section navigation functions
function showSection(sectionNum) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(`section-${sectionNum}`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionNum;
        
        // Update navigation active state
        document.querySelectorAll('.section-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionNum}"]`).classList.add('active');
        
        // Re-render MathJax for the new section
        if (window.MathJax) {
            MathJax.typesetPromise([targetSection]);
        }
        
        // Initialize section-specific animations
        initializeSectionAnimations(sectionNum);
    }
}

function unlockSection(sectionNum) {
    sectionProgress[sectionNum] = true;
    updateProgressBar();
    updateSectionNav();
}

function updateProgressBar() {
    const totalSections = 8;
    const completedSections = Object.keys(sectionProgress).length;
    const progressPercent = (completedSections / totalSections) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    
    if (progressText) {
        const progressSpan = document.getElementById('progress-text');
        if (progressSpan) {
            progressSpan.textContent = `${completedSections}/${totalSections}`;
        }
    }
}

function updateSectionNav() {
    document.querySelectorAll('.section-btn').forEach(btn => {
        const sectionNum = parseInt(btn.dataset.section);
        btn.classList.remove('locked', 'completed');
        
        if (sectionProgress[sectionNum]) {
            if (sectionNum < currentSection) {
                btn.classList.add('completed');
            }
        } else {
            btn.classList.add('locked');
        }
    });
}

// Section-specific initialization functions
function initializeSection0() {
    // Introduction section - simple Earth orbit animation
    const container = document.getElementById('intro-animation');
    if (container) {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.background = '#1a1a2e';
        canvas.style.borderRadius = '10px';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let angle = 0;
        
        function drawIntroAnimation() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const sunRadius = 15;
            const orbitRadius = 80;
            
            // Draw Sun
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(centerX, centerY, sunRadius, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw orbit
            ctx.strokeStyle = 'rgba(100, 181, 246, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, orbitRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Draw Earth
            const earthX = centerX + orbitRadius * Math.cos(angle);
            const earthY = centerY + orbitRadius * Math.sin(angle);
            
            ctx.fillStyle = '#4fc3f7';
            ctx.beginPath();
            ctx.arc(earthX, earthY, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText('太陽', centerX - 12, centerY - 20);
            ctx.fillText('地球', earthX + 10, earthY - 10);
            
            angle += 0.02;
            requestAnimationFrame(drawIntroAnimation);
        }
        
        drawIntroAnimation();
    }
}

function initializeSection1() {
    // Historical observations - cosmology model animation
    const container = document.getElementById('cosmology-demo');
    if (container) {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.background = '#1a1a2e';
        canvas.style.borderRadius = '10px';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let isHeliocentric = false;
        let time = 0;
        
        function drawCosmologyModel() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            if (isHeliocentric) {
                // Heliocentric model (Copernican)
                // Draw Sun at center
                ctx.fillStyle = '#ffeb3b';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw Earth orbit
                const earthOrbit = 80;
                ctx.strokeStyle = 'rgba(79, 195, 247, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, earthOrbit, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Draw Earth
                const earthAngle = time * 0.01;
                const earthX = centerX + earthOrbit * Math.cos(earthAngle);
                const earthY = centerY + earthOrbit * Math.sin(earthAngle);
                
                ctx.fillStyle = '#4fc3f7';
                ctx.beginPath();
                ctx.arc(earthX, earthY, 8, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw Mars orbit
                const marsOrbit = 120;
                ctx.strokeStyle = 'rgba(229, 115, 115, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, marsOrbit, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Draw Mars
                const marsAngle = time * 0.005;
                const marsX = centerX + marsOrbit * Math.cos(marsAngle);
                const marsY = centerY + marsOrbit * Math.sin(marsAngle);
                
                ctx.fillStyle = '#e57373';
                ctx.beginPath();
                ctx.arc(marsX, marsY, 6, 0, 2 * Math.PI);
                ctx.fill();
                
                // Labels
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.fillText('太陽', centerX - 12, centerY - 20);
                ctx.fillText('地球', earthX + 10, earthY - 10);
                ctx.fillText('火星', marsX + 8, marsY - 8);
                
            } else {
                // Geocentric model (Ptolemaic)
                // Draw Earth at center
                ctx.fillStyle = '#4fc3f7';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw Sun orbit around Earth
                const sunOrbit = 100;
                ctx.strokeStyle = 'rgba(255, 235, 59, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, sunOrbit, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Draw Sun
                const sunAngle = time * 0.008;
                const sunX = centerX + sunOrbit * Math.cos(sunAngle);
                const sunY = centerY + sunOrbit * Math.sin(sunAngle);
                
                ctx.fillStyle = '#ffeb3b';
                ctx.beginPath();
                ctx.arc(sunX, sunY, 10, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw Mars with epicycle
                const marsMainOrbit = 130;
                const epicycleRadius = 20;
                const marsMainAngle = time * 0.003;
                const epicycleAngle = time * 0.05;
                
                const marsCenterX = centerX + marsMainOrbit * Math.cos(marsMainAngle);
                const marsCenterY = centerY + marsMainOrbit * Math.sin(marsMainAngle);
                
                // Draw epicycle
                ctx.strokeStyle = 'rgba(229, 115, 115, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(marsCenterX, marsCenterY, epicycleRadius, 0, 2 * Math.PI);
                ctx.stroke();
                
                const marsX = marsCenterX + epicycleRadius * Math.cos(epicycleAngle);
                const marsY = marsCenterY + epicycleRadius * Math.sin(epicycleAngle);
                
                ctx.fillStyle = '#e57373';
                ctx.beginPath();
                ctx.arc(marsX, marsY, 6, 0, 2 * Math.PI);
                ctx.fill();
                
                // Labels
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.fillText('地球', centerX - 12, centerY - 18);
                ctx.fillText('太陽', sunX + 12, sunY - 12);
                ctx.fillText('火星', marsX + 8, marsY - 8);
            }
            
            time++;
            requestAnimationFrame(drawCosmologyModel);
        }
        
        // Global function for toggling cosmology model
        window.toggleCosmologyModel = function() {
            isHeliocentric = !isHeliocentric;
            const description = document.getElementById('model-description');
            if (description) {
                description.textContent = isHeliocentric ? 
                    '地動説: 太陽を中心に惑星が回転' : 
                    '天動説: 地球を中心に天体が回転';
            }
        };
        
        drawCosmologyModel();
    }
}

function initializeSection2() {
    // First Law: Elliptical Orbits
    initializeEllipseDemo();
}

function initializeSection3() {
    // Second Law: Equal Areas
    initializeAreaDemo();
}

function initializeSection4() {
    // Third Law: Period-Distance Relationship
    initializePeriodDemo();
    initializePlanetCalculator();
    initializeThirdLawDemo();
}

// New function for third law interactive demo
function initializeThirdLawDemo() {
    const container = document.getElementById('third-law-demo');
    if (!container) return;
    
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 350;
    canvas.style.background = '#1a1a2e';
    canvas.style.borderRadius = '10px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    let selectedPlanet = 'earth';
    
    const planets = {
        mercury: { distance: 40, period: 0.24, color: '#8c7853', name: '水星' },
        venus: { distance: 60, period: 0.62, color: '#ffc649', name: '金星' },
        earth: { distance: 80, period: 1.0, color: '#4fc3f7', name: '地球' },
        mars: { distance: 110, period: 1.88, color: '#e57373', name: '火星' },
        jupiter: { distance: 180, period: 11.86, color: '#ffb74d', name: '木星' }
    };
    
    function drawThirdLawDemo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw Sun
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw all planet orbits
        Object.entries(planets).forEach(([key, planet]) => {
            ctx.strokeStyle = key === selectedPlanet ? 
                'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = key === selectedPlanet ? 2 : 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.distance, 0, 2 * Math.PI);
            ctx.stroke();
        });
        
        // Draw selected planet
        const planet = planets[selectedPlanet];
        const angle = (time * 0.02) / planet.period;
        const planetX = centerX + planet.distance * Math.cos(angle);
        const planetY = centerY + planet.distance * Math.sin(angle);
        
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(planetX, planetY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Labels and info
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText('太陽', centerX - 15, centerY - 20);
        ctx.fillText(planet.name, planetX + 12, planetY - 8);
        
        // Display planet data
        ctx.font = '12px Arial';
        ctx.fillText(`軌道半径: ${planet.distance / 80} AU`, 10, 25);
        ctx.fillText(`公転周期: ${planet.period} 年`, 10, 45);
        ctx.fillText(`T²/a³ = ${(planet.period ** 2 / (planet.distance / 80) ** 3).toFixed(3)}`, 10, 65);
        
        time++;
        requestAnimationFrame(drawThirdLawDemo);
    }
    
    // Global function for showing different planets
    window.showPlanet = function(planetKey) {
        if (planets[planetKey]) {
            selectedPlanet = planetKey;
        }
    };
    
    drawThirdLawDemo();
}

function initializeSection5() {
    // Newton's Universal Gravitation
    initializeGravityDemo();
}

function initializeSection6() {
    // Orbital Mechanics
    initializeOrbitalDemo();
}

function initializeSection7() {
    // Comprehensive Exercises
    initializeComprehensiveQuiz();
}

// Animation initialization
function initializeSectionAnimations(sectionNum) {
    switch(sectionNum) {
        case 2:
            if (typeof initEllipseAnimation === 'function') {
                initEllipseAnimation();
            }
            break;
        case 3:
            if (typeof initAreaAnimation === 'function') {
                initAreaAnimation();
            }
            break;
        case 4:
            if (typeof initPeriodAnimation === 'function') {
                initPeriodAnimation();
            }
            break;
        case 5:
            if (typeof initGravityAnimation === 'function') {
                initGravityAnimation();
            }
            break;
        case 6:
            if (typeof initOrbitalAnimation === 'function') {
                initOrbitalAnimation();
            }
            break;
        case 7:
            if (typeof initSpacecraftAnimation === 'function') {
                initSpacecraftAnimation();
            }
            break;
    }
}

// Ellipse demonstration for First Law
function initializeEllipseDemo() {
    const container = document.getElementById('ellipse-demo');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create canvas for ellipse animation
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 320;
    canvas.style.background = '#1a1a2e';
    canvas.style.borderRadius = '10px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let angle = 0;
    let isPlaying = true;
    
    // Eccentricity control
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <div class="slider-group">
            <label>離心率 (e): <span id="ecc-value">0.5</span></label>
            <input type="range" id="eccentricity" min="0" max="0.9" step="0.1" value="0.5">
        </div>
        <button id="play-pause">⏸️ 一時停止</button>
        <button id="reset">🔄 リセット</button>
    `;
    container.appendChild(controls);
    
    const eccSlider = controls.querySelector('#eccentricity');
    const eccValue = controls.querySelector('#ecc-value');
    const playPauseBtn = controls.querySelector('#play-pause');
    const resetBtn = controls.querySelector('#reset');
    
    eccSlider.addEventListener('input', (e) => {
        eccValue.textContent = e.target.value;
    });
    
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.textContent = isPlaying ? '⏸️ 一時停止' : '▶️ 再生';
        if (isPlaying) drawEllipse();
    });
    
    resetBtn.addEventListener('click', () => {
        angle = 0;
    });
    
    function drawEllipse() {
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const a = 170; // semi-major axis
        const e = parseFloat(eccSlider.value);
        const b = a * Math.sqrt(1 - e * e); // semi-minor axis
        const c = a * e; // distance to focus
        
        // Draw ellipse
        ctx.strokeStyle = '#64b5f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, a, b, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw foci
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(centerX - c, centerY, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + c, centerY, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw planet
        const planetX = centerX + a * Math.cos(angle) - c;
        const planetY = centerY + b * Math.sin(angle);
        
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.arc(planetX, planetY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw orbit trail
        ctx.strokeStyle = 'rgba(79, 195, 247, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let t = 0; t <= angle; t += 0.1) {
            const x = centerX + a * Math.cos(t) - c;
            const y = centerY + b * Math.sin(t);
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('太陽', centerX - c - 20, centerY - 10);
        ctx.fillText('空の焦点', centerX + c - 20, centerY - 10);
        ctx.fillText('惑星', planetX + 12, planetY - 5);
        
        // Show eccentricity info
        ctx.fillText(`離心率: ${e}`, 10, 25);
        if (e < 0.1) ctx.fillText('ほぼ円軌道', 10, 45);
        else if (e < 0.5) ctx.fillText('楕円軌道', 10, 45);
        else ctx.fillText('非常に扁平な楕円', 10, 45);
        
        angle += 0.025;
        if (angle > 2 * Math.PI) angle = 0;
        
        animationFrame = requestAnimationFrame(drawEllipse);
    }
    
    drawEllipse();
    
    // Store cleanup function
    container.cleanup = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        isPlaying = false;
    };
}

// Equal areas demonstration for Second Law
function initializeAreaDemo() {
    const container = document.getElementById('area-demo');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 350;
    canvas.style.background = '#1a1a2e';
    canvas.style.borderRadius = '10px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let time = 0;
    let showAreas = false;
    let isPlaying = false;
    
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button id="play-pause-btn">▶️ 再生</button>
        <button id="toggle-areas-btn">面積表示切替</button>
        <button id="reset-btn">リセット</button>
        <div style="margin-top: 1rem;">
            <p id="area-info" style="color: #ffffff; background: rgba(0,0,0,0.7); padding: 0.5rem; border-radius: 5px;">
                等面積法則: 同じ時間で掃く面積は等しい
            </p>
        </div>
    `;
    container.appendChild(controls);
    
    const playPauseBtn = controls.querySelector('#play-pause-btn');
    const toggleAreasBtn = controls.querySelector('#toggle-areas-btn');
    const resetBtn = controls.querySelector('#reset-btn');
    const areaInfo = controls.querySelector('#area-info');
    
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.textContent = isPlaying ? '⏸️ 停止' : '▶️ 再生';
        if (isPlaying) {
            animate();
        }
    });
    
    toggleAreasBtn.addEventListener('click', () => {
        showAreas = !showAreas;
        toggleAreasBtn.textContent = showAreas ? '面積非表示' : '面積表示';
    });
    
    resetBtn.addEventListener('click', () => {
        time = 0;
        showAreas = false;
        isPlaying = false;
        playPauseBtn.textContent = '▶️ 再生';
        toggleAreasBtn.textContent = '面積表示';
    });
    
    function animate() {
        if (!isPlaying) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Adjust positioning to prevent clipping
        const centerX = canvas.width / 2 + 50; // Move center to the right
        const centerY = canvas.height / 2;
        const a = 150; // semi-major axis
        const e = 0.6; // eccentricity
        const b = a * Math.sqrt(1 - e * e); // semi-minor axis
        const c = a * e; // distance to focus
        const focusX = centerX - c; // Sun position (left focus)
        
        // Draw ellipse
        ctx.strokeStyle = '#64b5f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, a, b, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw focus (Sun)
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(focusX, centerY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Current position
        const angle = time * 0.02;
        const planetX = centerX + a * Math.cos(angle) - c;
        const planetY = centerY + b * Math.sin(angle);
        
        // Draw planet
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.arc(planetX, planetY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw radius vector
        ctx.strokeStyle = '#81c784';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(focusX, centerY);
        ctx.lineTo(planetX, planetY);
        ctx.stroke();
        
        if (showAreas) {
            // Show two equal-time intervals
            const dt = Math.PI / 8; // time interval
            
            // Area 1 (near periapsis - rightmost part)
            const angle1Start = -dt / 2;
            const angle1End = angle1Start + dt;
            
            ctx.fillStyle = 'rgba(255, 235, 59, 0.4)';
            ctx.beginPath();
            ctx.moveTo(focusX, centerY);
            for (let t = angle1Start; t <= angle1End; t += 0.02) {
                const x = centerX + a * Math.cos(t) - c;
                const y = centerY + b * Math.sin(t);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Area 2 (near apoapsis - leftmost part)
            const angle2Start = Math.PI - dt / 2;
            const angle2End = angle2Start + dt;
            
            ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
            ctx.beginPath();
            ctx.moveTo(focusX, centerY);
            for (let t = angle2Start; t <= angle2End; t += 0.02) {
                const x = centerX + a * Math.cos(t) - c;
                const y = centerY + b * Math.sin(t);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Update info
            areaInfo.innerHTML = `
                🟡 近日点付近の面積 ≈ 🟢 遠日点付近の面積<br>
                同じ時間間隔で掃く面積は等しい（面積速度一定）
            `;
        } else {
            areaInfo.innerHTML = '等面積法則: 同じ時間で掃く面積は等しい';
        }
        
        // Draw orbit trail
        ctx.strokeStyle = 'rgba(79, 195, 247, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let t = 0; t <= angle; t += 0.05) {
            const x = centerX + a * Math.cos(t) - c;
            const y = centerY + b * Math.sin(t);
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText('太陽', focusX - 15, centerY - 15);
        ctx.fillText('惑星', planetX + 10, planetY - 10);
        
        // Show position info
        const distance = Math.sqrt((planetX - focusX) ** 2 + (planetY - centerY) ** 2);
        ctx.font = '12px Arial';
        ctx.fillText(`距離: ${(distance / 10).toFixed(1)} AU`, 10, 30);
        
        time++;
        if (time > 628) time = 0; // Reset after full orbit
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Initial draw
    animate();
    isPlaying = false;
    
    container.cleanup = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        isPlaying = false;
    };
}

// Period demonstration for Third Law
function initializePeriodDemo() {
    const container = document.getElementById('period-demo');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;
    canvas.style.background = '#1a1a2e';
    canvas.style.borderRadius = '10px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let time = 0;
    
    const planets = [
        { name: '地球', distance: 80, period: 1, color: '#4fc3f7', angle: 0 },
        { name: '火星', distance: 120, period: 1.88, color: '#e57373', angle: 0 },
        { name: '木星', distance: 200, period: 11.86, color: '#ffb74d', angle: 0 }
    ];
    
    function drawPeriodDemo() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw Sun
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        planets.forEach(planet => {
            // Draw orbit
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, planet.distance, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Update planet position
            planet.angle = (time * 0.02) / planet.period;
            const x = centerX + planet.distance * Math.cos(planet.angle);
            const y = centerY + planet.distance * Math.sin(planet.angle);
            
            // Draw planet
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw planet label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(planet.name, x + 10, y - 10);
        });
        
        time++;
        animationFrame = requestAnimationFrame(drawPeriodDemo);
    }
    
    drawPeriodDemo();
    
    container.cleanup = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
    };
}

// Planet calculator for Third Law
function initializePlanetCalculator() {
    const container = document.getElementById('planet-calculator');
    if (!container) return;
    
    const calculatorHTML = `
        <div class="calculation-box">
            <h5>ケプラーの第3法則計算機</h5>
            <p>T² ∝ a³ (周期の2乗は軌道長半径の3乗に比例)</p>
            
            <div style="margin: 1rem 0;">
                <label>惑星を選択:</label>
                <select id="planet-select">
                    <option value="">選択してください</option>
                    <option value="mercury">水星</option>
                    <option value="venus">金星</option>
                    <option value="earth">地球</option>
                    <option value="mars">火星</option>
                    <option value="jupiter">木星</option>
                    <option value="saturn">土星</option>
                    <option value="uranus">天王星</option>
                    <option value="neptune">海王星</option>
                </select>
            </div>
            
            <div id="planet-info"></div>
            
            <div style="margin: 1rem 0;">
                <h6>カスタム計算:</h6>
                <label>軌道長半径 (AU): </label>
                <input type="number" id="custom-distance" step="0.1" min="0.1">
                <button id="calculate-period">周期を計算</button>
            </div>
            
            <div id="calc-result"></div>
        </div>
    `;
    
    container.innerHTML = calculatorHTML;
    
    const planetSelect = container.querySelector('#planet-select');
    const planetInfo = container.querySelector('#planet-info');
    const customDistance = container.querySelector('#custom-distance');
    const calculateBtn = container.querySelector('#calculate-period');
    const calcResult = container.querySelector('#calc-result');
    
    planetSelect.addEventListener('change', (e) => {
        const planet = planetData[e.target.value];
        if (planet) {
            const t2 = Math.pow(planet.period, 2);
            const a3 = Math.pow(planet.distance, 3);
            const ratio = t2 / a3;
            
            planetInfo.innerHTML = `
                <div style="background: #f0f8ff; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h6>${planet.name}のデータ:</h6>
                    <p>軌道長半径 (a) = ${planet.distance} AU</p>
                    <p>公転周期 (T) = ${planet.period.toFixed(2)} 年</p>
                    <p>T² = ${t2.toFixed(3)}</p>
                    <p>a³ = ${a3.toFixed(3)}</p>
                    <p>T²/a³ = ${ratio.toFixed(3)} (≈1.0)</p>
                </div>
            `;
        }
    });
    
    calculateBtn.addEventListener('click', () => {
        const distance = parseFloat(customDistance.value);
        if (distance && distance > 0) {
            const period = Math.sqrt(Math.pow(distance, 3));
            calcResult.innerHTML = `
                <div class="calc-feedback correct">
                    <h6>計算結果:</h6>
                    <p>軌道長半径: ${distance} AU</p>
                    <p>推定周期: ${period.toFixed(2)} 年</p>
                    <p>計算式: T = √(a³) = √(${distance}³) = ${period.toFixed(2)}</p>
                </div>
            `;
        } else {
            calcResult.innerHTML = `
                <div class="calc-feedback incorrect">
                    <p>有効な軌道長半径を入力してください (0より大きい値)</p>
                </div>
            `;
        }
    });
}

// Gravity demonstration for Universal Gravitation
function initializeGravityDemo() {
    const container = document.getElementById('gravity-demo');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 280;
    canvas.style.background = '#1a1a2e';
    canvas.style.borderRadius = '10px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    
    function updateDisplay() {
        const mass1 = parseFloat(document.getElementById('mass1-slider').value);
        const mass2 = parseFloat(document.getElementById('mass2-slider').value);
        const distance = parseFloat(document.getElementById('distance-slider').value);
        
        document.getElementById('mass1-display').textContent = mass1;
        document.getElementById('mass2-display').textContent = mass2;
        document.getElementById('distance-display').textContent = distance;
        
        // Calculate force (simplified for visualization)
        const force = (mass1 * mass2) / (distance * distance);
        
        document.getElementById('force-result').innerHTML = `
            <div style="background: #fff3cd; padding: 0.8rem; border-radius: 8px; margin-top: 1rem;">
                <strong>重力: F = G × m₁ × m₂ / r²</strong><br>
                F = G × ${mass1} × ${mass2} / ${distance}² = ${force.toFixed(4)} (相対値)<br>
                <small>実際の重力定数 G = 6.67 × 10⁻¹¹ N⋅m²/kg²</small>
            </div>
        `;
        
        drawGravityDemo(mass1, mass2, distance, force);
    }
    
    function drawGravityDemo(m1, m2, distance, force) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Object positions
        const spacing = Math.min(distance * 1.5, 180);
        const obj1X = centerX - spacing / 2;
        const obj1Y = centerY;
        const obj2X = centerX + spacing / 2;
        const obj2Y = centerY;
        
        // Draw objects with size proportional to mass
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(obj1X, obj1Y, Math.max(m1 * 4, 10), 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(obj2X, obj2Y, Math.max(m2 * 4, 10), 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw force vectors
        const arrowLength = Math.min(force * 30, 60);
        
        // Force on object 1 (toward object 2)
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = Math.max(force * 2, 1);
        ctx.beginPath();
        ctx.moveTo(obj1X + m1 * 4, obj1Y);
        ctx.lineTo(obj1X + m1 * 4 + arrowLength, obj1Y);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.moveTo(obj1X + m1 * 4 + arrowLength, obj1Y);
        ctx.lineTo(obj1X + m1 * 4 + arrowLength - 8, obj1Y - 4);
        ctx.lineTo(obj1X + m1 * 4 + arrowLength - 8, obj1Y + 4);
        ctx.closePath();
        ctx.fill();
        
        // Force on object 2 (toward object 1)
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = Math.max(force * 2, 1);
        ctx.beginPath();
        ctx.moveTo(obj2X - m2 * 4, obj2Y);
        ctx.lineTo(obj2X - m2 * 4 - arrowLength, obj2Y);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.moveTo(obj2X - m2 * 4 - arrowLength, obj2Y);
        ctx.lineTo(obj2X - m2 * 4 - arrowLength + 8, obj2Y - 4);
        ctx.lineTo(obj2X - m2 * 4 - arrowLength + 8, obj2Y + 4);
        ctx.closePath();
        ctx.fill();
        
        // Draw distance line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(obj1X, obj1Y - m1 * 4 - 20);
        ctx.lineTo(obj2X, obj2Y - m2 * 4 - 20);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`m₁ = ${m1}`, obj1X, obj1Y + m1 * 4 + 20);
        ctx.fillText(`m₂ = ${m2}`, obj2X, obj2Y + m2 * 4 + 20);
        ctx.fillText(`r = ${distance}`, centerX, centerY - Math.max(m1, m2) * 4 - 30);
        
        ctx.textAlign = 'left';
        ctx.fillText('重力', obj1X + m1 * 4 + 5, obj1Y - 10);
        ctx.fillText('重力', obj2X - m2 * 4 - 35, obj2Y - 10);
    }
    
    // Setup event listeners after DOM elements are created
    setTimeout(() => {
        const sliders = ['mass1-slider', 'mass2-slider', 'distance-slider'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            if (slider) {
                slider.addEventListener('input', updateDisplay);
            }
        });
        updateDisplay();
    }, 100);
    
    container.cleanup = () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
    };
}

// Additional initialization functions for remaining sections
function initializeOrbitalDemo() {
    // Orbital mechanics visualization
    const container = document.getElementById('orbital-demo');
    if (!container) return;
    
    container.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.style.background = '#1a1a2e';
    canvas.style.borderRadius = '10px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let angle = 0;
    let isRunning = false;
    
    function drawOrbitalDemo() {
        if (!isRunning) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const altitude = parseFloat(document.getElementById('altitude-slider')?.value || 400);
        const earthRadius = 40;
        const orbitRadius = earthRadius + (altitude / 20); // Scale for visualization
        
        // Draw Earth
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.arc(centerX, centerY, earthRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw orbit
        ctx.strokeStyle = '#64b5f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbitRadius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw satellite
        const satX = centerX + orbitRadius * Math.cos(angle);
        const satY = centerY + orbitRadius * Math.sin(angle);
        
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(satX, satY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('地球', centerX - 15, centerY + 5);
        ctx.fillText('人工衛星', satX + 8, satY - 8);
        ctx.fillText(`高度: ${altitude} km`, 10, 20);
        
        // Calculate and display orbital velocity
        const velocity = Math.sqrt(398600 / (6371 + altitude)); // km/s
        ctx.fillText(`軌道速度: ${velocity.toFixed(2)} km/s`, 10, 40);
        
        angle += 0.03;
        animationFrame = requestAnimationFrame(drawOrbitalDemo);
    }
    
    // Global function for toggling simulation
    window.toggleOrbitSimulation = function() {
        isRunning = !isRunning;
        if (isRunning) {
            drawOrbitalDemo();
        }
    };
    
    // Update altitude display
    setTimeout(() => {
        const altitudeSlider = document.getElementById('altitude-slider');
        const altitudeDisplay = document.getElementById('altitude-display');
        if (altitudeSlider && altitudeDisplay) {
            altitudeSlider.addEventListener('input', (e) => {
                altitudeDisplay.textContent = e.target.value;
            });
        }
    }, 100);
}

function initializeSpacecraftDemo() {
    // Spacecraft trajectory visualization
    console.log('Spacecraft demo initialized');
}

function initializeComprehensiveQuiz() {
    // Initialize all quiz functionality
    initializeAllQuizzes();
}

// Quiz system
function initializeAllQuizzes() {
    // Initialize all quiz cards
    document.querySelectorAll('.quiz-card').forEach(quizCard => {
        const submitBtn = quizCard.querySelector('.quiz-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                checkQuizAnswer(quizCard);
            });
        }
    });
}

function checkQuizAnswer(quizCard) {
    const selectedOption = quizCard.querySelector('input:checked');
    const feedback = quizCard.querySelector('.quiz-feedback');
    
    if (!selectedOption) {
        feedback.innerHTML = '<p>回答を選択してください。</p>';
        feedback.className = 'quiz-feedback incorrect';
        return;
    }
    
    const isCorrect = selectedOption.value === 'correct';
    
    if (isCorrect) {
        feedback.innerHTML = '<p>正解です！よく理解できています。</p>';
        feedback.className = 'quiz-feedback correct';
    } else {
        const explanation = selectedOption.dataset.explanation || '不正解です。もう一度考えてみてください。';
        feedback.innerHTML = `<p>${explanation}</p>`;
        feedback.className = 'quiz-feedback incorrect';
    }
}

// Global function for inline quiz checking
function checkQuiz(sectionNum, correctAnswer) {
    const quizName = getQuizNameBySection(sectionNum);
    const selectedOption = document.querySelector(`input[name="${quizName}"]:checked`);
    const feedback = document.getElementById(`quiz-feedback-${sectionNum}`);
    
    if (!selectedOption) {
        feedback.innerHTML = '<p>回答を選択してください。</p>';
        feedback.className = 'quiz-feedback incorrect';
        return;
    }
    
    const isCorrect = selectedOption.value === correctAnswer;
    
    if (isCorrect) {
        feedback.innerHTML = '<p>✅ 正解です！よく理解できています。</p>';
        feedback.className = 'quiz-feedback correct';
    } else {
        let explanation = '❌ 不正解です。';
        if (sectionNum === 0) {
            explanation += '太陽に近い惑星ほど太陽の重力が強く働くため、公転周期が短くなります。';
        } else if (sectionNum === 1) {
            explanation += 'コペルニクスの地動説は惑星の逆行運動を簡潔に説明できました。';
        }
        feedback.innerHTML = `<p>${explanation}</p>`;
        feedback.className = 'quiz-feedback incorrect';
    }
}

// Global function for completing sections
function completeSection(sectionNum) {
    const nextSection = sectionNum + 1;
    if (nextSection <= 7) {
        unlockSection(nextSection);
        showSection(nextSection);
    }
}

// Global function for completing the course
function completeCourse() {
    alert('🎉 おめでとうございます！天体力学コースを完了しました！');
}

// Global function for checking calculations
function checkCalculation(inputId, correctAnswer) {
    const input = document.getElementById(inputId);
    let feedbackId;
    
    // Map input IDs to feedback IDs
    const feedbackMap = {
        'earth-calculation': 'calc-feedback-earth',
        'velocity-calculation': 'calc-feedback-velocity',
        'asteroid-period': 'calc-feedback-asteroid',
        'gravity-force': 'calc-feedback-gravity'
    };
    
    feedbackId = feedbackMap[inputId];
    const feedback = document.getElementById(feedbackId);
    
    if (!input || !feedback) {
        console.error(`Element not found: input=${inputId}, feedback=${feedbackId}`);
        return;
    }
    
    const userAnswer = parseFloat(input.value);
    const tolerance = correctAnswer * 0.05; // 5% tolerance
    
    if (isNaN(userAnswer)) {
        feedback.innerHTML = '❌ 数値を入力してください。';
        feedback.className = 'calc-feedback incorrect';
    } else if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
        feedback.innerHTML = '✅ 正解です！素晴らしい計算力です。';
        feedback.className = 'calc-feedback correct';
    } else {
        feedback.innerHTML = `❌ 不正解です。正解は約 ${correctAnswer} です。もう一度計算してみてください。`;
        feedback.className = 'calc-feedback incorrect';
    }
    
    feedback.style.display = 'block';
}

// Helper function to get quiz name by section
function getQuizNameBySection(sectionNum) {
    const quizNames = [
        'intro-quiz',
        'history-quiz',
        'ellipse-quiz',
        'area-quiz',
        'third-law-quiz',
        'gravity-quiz',
        'orbital-quiz',
        'final-quiz'
    ];
    return quizNames[sectionNum] || 'quiz';
}

// Utility functions
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

function calculateGravitationalForce(m1, m2, r) {
    const G = 6.67430e-11; // N⋅m²/kg²
    return (G * m1 * m2) / (r * r);
}

function calculateOrbitalPeriod(semiMajorAxis) {
    // Kepler's third law: T² = (4π²/GM) × a³
    // For simplicity, using Earth units where T is in years and a is in AU
    return Math.sqrt(Math.pow(semiMajorAxis, 3));
}

function calculateOrbitalVelocity(semiMajorAxis, eccentricity, trueAnomaly) {
    // Vis-viva equation: v² = GM(2/r - 1/a)
    const a = semiMajorAxis;
    const e = eccentricity;
    const nu = trueAnomaly;
    
    const r = a * (1 - e * e) / (1 + e * Math.cos(nu));
    const GM = 1; // Normalized for Earth-Sun system
    
    return Math.sqrt(GM * (2 / r - 1 / a));
}

// Cleanup function for section changes
function cleanupSectionAnimations() {
    // Clean up any running animations
    document.querySelectorAll('.interactive-demo').forEach(demo => {
        if (demo.cleanup && typeof demo.cleanup === 'function') {
            demo.cleanup();
        }
    });
}

// Export for global access
window.celestialMechanics = {
    showSection,
    unlockSection,
    initializeSectionAnimations,
    cleanupSectionAnimations,
    planetData,
    calculateOrbitalPeriod,
    calculateGravitationalForce
};

// Calculation problem checking functions for final exercises
function checkMarsOrbit() {
    const semiMajor = parseFloat(document.getElementById('mars-semimajor').value);
    const eccentricity = parseFloat(document.getElementById('mars-eccentricity').value);
    const resultElement = document.getElementById('mars-orbit-result');
    
    // 計算: a = (近日点 + 遠日点) / 2 = (1.38 + 1.67) / 2 = 1.525 AU
    // e = (遠日点 - 近日点) / (遠日点 + 近日点) = (1.67 - 1.38) / (1.67 + 1.38) = 0.095
    
    const correctSemiMajor = 1.525;
    const correctEccentricity = 0.095;
    
    if (Math.abs(semiMajor - correctSemiMajor) < 0.01 && Math.abs(eccentricity - correctEccentricity) < 0.005) {
        resultElement.className = 'calculation-result correct';
        resultElement.innerHTML = '✅ 正解です！ 長半径 a = 1.525 AU、離心率 e = 0.095';
    } else {
        resultElement.className = 'calculation-result incorrect';
        resultElement.innerHTML = '❌ 再計算してみてください。ヒント: a = (近日点 + 遠日点) / 2、e = (遠日点 - 近日点) / (遠日点 + 近日点)';
    }
}

function checkAsteroidPeriod() {
    const period = parseFloat(document.getElementById('asteroid-period').value);
    const resultElement = document.getElementById('asteroid-period-result');
    
    // ケプラーの第三法則: T² = a³ (AU, 年単位)
    // T = √(a³) = √(2.8³) = √(21.952) ≈ 4.68年
    
    const correctPeriod = Math.sqrt(Math.pow(2.8, 3));
    
    if (Math.abs(period - correctPeriod) < 0.2) {
        resultElement.className = 'calculation-result correct';
        resultElement.innerHTML = `✅ 正解です！ 公転周期は約 ${correctPeriod.toFixed(2)} 年です`;
    } else {
        resultElement.className = 'calculation-result incorrect';
        resultElement.innerHTML = '❌ 再計算してみてください。ヒント: ケプラーの第三法則 T² = a³ を使います';
    }
}

function checkEarthMoonForce() {
    const force = parseFloat(document.getElementById('earth-moon-force').value);
    const resultElement = document.getElementById('earth-moon-force-result');
    
    // F = G * M₁ * M₂ / r²
    // G = 6.67 × 10⁻¹¹ N⋅m²/kg²
    // M₁ = 5.97 × 10²⁴ kg, M₂ = 7.35 × 10²² kg, r = 3.8 × 10⁸ m
    // F = 6.67×10⁻¹¹ × 5.97×10²⁴ × 7.35×10²² / (3.8×10⁸)² ≈ 2.02 × 10²⁰ N
    
    const correctForce = 2.02;
    
    if (Math.abs(force - correctForce) < 0.1) {
        resultElement.className = 'calculation-result correct';
        resultElement.innerHTML = '✅ 正解です！ 万有引力は約 2.02 × 10²⁰ N です';
    } else {
        resultElement.className = 'calculation-result incorrect';
        resultElement.innerHTML = '❌ 再計算してみてください。ヒント: F = GMm/r² を使います（G = 6.67×10⁻¹¹）';
    }
}

function checkEscapeVelocity() {
    const velocity = parseFloat(document.getElementById('escape-velocity').value);
    const resultElement = document.getElementById('escape-velocity-result');
    
    // v_escape = √(2GM/R)
    // G = 6.67×10⁻¹¹, M = 6.0×10²⁴ kg, R = 6.4×10⁶ m
    // v = √(2 × 6.67×10⁻¹¹ × 6.0×10²⁴ / 6.4×10⁶) ≈ 11.2 km/s
    
    const correctVelocity = 11.2;
    
    if (Math.abs(velocity - correctVelocity) < 0.5) {
        resultElement.className = 'calculation-result correct';
        resultElement.innerHTML = '✅ 正解です！ 脱出速度は約 11.2 km/s です';
    } else {
        resultElement.className = 'calculation-result incorrect';
        resultElement.innerHTML = '❌ 再計算してみてください。ヒント: v = √(2GM/R) を使います';
    }
}

function checkHohmannTime() {
    const time = parseFloat(document.getElementById('hohmann-time').value);
    const resultElement = document.getElementById('hohmann-time-result');
    
    // ホーマン軌道の半周期
    // 軌道半径 a = (1 + 1.52) / 2 = 1.26 AU
    // 周期 T = √(a³) = √(1.26³) ≈ 1.41 年
    // 半周期 = T/2 ≈ 0.71 年 ≈ 259日
    
    const correctTime = 259;
    
    if (Math.abs(time - correctTime) < 10) {
        resultElement.className = 'calculation-result correct';
        resultElement.innerHTML = '✅ 正解です！ ホーマン軌道の移動時間は約 259 日です';
    } else {
        resultElement.className = 'calculation-result hint';
        resultElement.innerHTML = '💡 ヒント: ホーマン軌道の長半径は (地球軌道 + 火星軌道) / 2、移動時間は軌道周期の半分です';
    }
}
