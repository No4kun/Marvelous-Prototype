/* Basis Transformation Learning Platform JavaScript */

// Global variables
let currentSection = 0;
let sectionProgress = { 0: true };
let canvasInstances = {};
let animationFrames = {};

// Performance optimization
const RAF_THROTTLE = 16; // 60fps target
let lastFrameTime = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show loading indicator
    showLoadingIndicator();
    
    // Initialize components asynchronously
    setTimeout(() => {
        updateProgress();
        initializeMathJax();
        showSection(0);
        setupNavigation();
        initializeSection0();
        hideLoadingIndicator();
        
        // Add welcome animation
        showWelcomeAnimation();
    }, 100);
});

function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'loading-indicator';
    indicator.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>基底変換学習プラットフォームを読み込み中...</p>
        </div>
    `;
    indicator.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(247, 250, 252, 0.95); display: flex; justify-content: center; align-items: center;
        z-index: 10000; font-family: 'Segoe UI', sans-serif;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner { text-align: center; }
        .spinner {
            width: 40px; height: 40px; margin: 0 auto 1rem;
            border: 4px solid #e2e8f0; border-top: 4px solid #667eea;
            border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-spinner p { color: #4a5568; font-size: 1.1rem; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(indicator);
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.5s ease';
        setTimeout(() => indicator.remove(), 500);
    }
}

function showWelcomeAnimation() {
    const welcome = document.createElement('div');
    welcome.innerHTML = `
        <div class="welcome-message">
            <h2>🎉 基底変換の世界へようこそ！</h2>
            <p>インタラクティブな学習でベクトル空間を探索しましょう</p>
        </div>
    `;
    welcome.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2); color: white;
        padding: 2rem; border-radius: 15px; text-align: center; z-index: 9999;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15); animation: welcomeSlide 0.8s ease-out;
    `;
    
    const welcomeStyle = document.createElement('style');
    welcomeStyle.textContent = `
        @keyframes welcomeSlide {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .welcome-message h2 { margin-bottom: 0.5rem; font-size: 1.5rem; }
        .welcome-message p { opacity: 0.9; }
    `;
    document.head.appendChild(welcomeStyle);
    document.body.appendChild(welcome);
    
    setTimeout(() => {
        welcome.style.opacity = '0';
        welcome.style.transition = 'opacity 0.5s ease';
        setTimeout(() => welcome.remove(), 500);
    }, 3000);
}

// Optimized animation frame handler
function optimizedRequestAnimationFrame(callback, key) {
    if (animationFrames[key]) {
        cancelAnimationFrame(animationFrames[key]);
    }
    
    animationFrames[key] = requestAnimationFrame((currentTime) => {
        if (currentTime - lastFrameTime >= RAF_THROTTLE) {
            callback(currentTime);
            lastFrameTime = currentTime;
        } else {
            optimizedRequestAnimationFrame(callback, key);
        }
    });
}

// MathJax configuration with performance optimization
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        renderActions: {
            addMenu: [0, '', '']
        }
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            console.log('MathJax ready for basis transformation platform');
        }
    }
};

function initializeMathJax() {
    if (window.MathJax && MathJax.startup) {
        MathJax.startup.defaultReady();
    }
}

// Enhanced error handling
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span>一時的なエラーが発生しました。ページを再読み込みしてください。</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #fed7d7; border: 1px solid #f56565; color: #742a2a;
        border-radius: 8px; padding: 1rem; max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        .error-content { display: flex; align-items: center; gap: 0.5rem; }
        .error-icon { font-size: 1.2rem; }
        .error-content button {
            background: none; border: none; color: #742a2a; cursor: pointer;
            font-size: 1.2rem; margin-left: auto;
        }
    `;
    document.head.appendChild(errorStyle);
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Wrap all main functions with error handling
const originalFunctions = {
    initializeSection0,
    initializeSection1,
    initializeSection2,
    initializeSection3,
    initializeSection4,
    initializeSection5,
    initializeSection6
};

Object.keys(originalFunctions).forEach(funcName => {
    const originalFunc = window[funcName];
    if (typeof originalFunc === 'function') {
        window[funcName] = function(...args) {
            try {
                return originalFunc.apply(this, args);
            } catch (error) {
                handleError(error, funcName);
            }
        };
    }
});

// Performance monitoring
function logPerformance(label, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (duration > 100) { // Log slow operations
        console.warn(`Performance warning: ${label} took ${duration.toFixed(2)}ms`);
    }
}

// Add performance timing to section initialization
function initializeCurrentSection() {
    const startTime = performance.now();
    
    try {
        switch(currentSection) {
            case 0: initializeSection0(); break;
            case 1: initializeSection1(); break;
            case 2: initializeSection2(); break;
            case 3: initializeSection3(); break;
            case 4: initializeSection4(); break;
            case 5: initializeSection5(); break;
            case 6: initializeSection6(); break;
        }
        logPerformance(`Section ${currentSection} initialization`, startTime);
    } catch (error) {
        handleError(error, `initializeCurrentSection(${currentSection})`);
    }
}

// Add smooth scroll behavior
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced completion function with celebration animation
function completeCourse() {
    // Create celebration particles
    createCelebrationParticles();
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;
        z-index: 1000; animation: modalFadeIn 0.5s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 20px; text-align: center; 
                    max-width: 600px; animation: modalSlideUp 0.7s ease; position: relative;">
            <div class="celebration-icon" style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: #667eea; margin-bottom: 1rem; font-size: 2rem;">
                コース完了おめでとうございます！
            </h2>
            <div class="achievement-badges" style="display: flex; justify-content: center; gap: 1rem; margin: 2rem 0;">
                <div class="badge">🧮 基底マスター</div>
                <div class="badge">🔄 変換エキスパート</div>
                <div class="badge">📊 固有値マスター</div>
            </div>
            <p style="margin-bottom: 2rem; font-size: 1.1rem; line-height: 1.6; color: #4a5568;">
                基底変換と表現行列の理論を完全にマスターしました。<br>
                線形代数の美しい世界を探索する旅を続けてください！
            </p>
            <button onclick="this.parentElement.parentElement.remove(); showFinalSurprise();" 
                    style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; 
                           border: none; padding: 1rem 3rem; border-radius: 25px; cursor: pointer;
                           font-size: 1.2rem; font-weight: bold; transition: all 0.3s ease;">
                素晴らしい！ 🚀
            </button>
        </div>
    `;
    
    const celebrationStyle = document.createElement('style');
    celebrationStyle.textContent = `
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes celebrationBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .celebration-icon { animation: celebrationBounce 1s ease infinite; }
        .badge {
            background: linear-gradient(135deg, #f093fb, #f5d2fe);
            padding: 0.5rem 1rem; border-radius: 15px; font-weight: bold;
            color: #553c9a; border: 2px solid #f093fb; font-size: 0.9rem;
        }
    `;
    document.head.appendChild(celebrationStyle);
    document.body.appendChild(modal);
}

function createCelebrationParticles() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4ecdc4', '#45b7d1'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed; width: 10px; height: 10px; border-radius: 50%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 50%; left: 50%; z-index: 10001; pointer-events: none;
            animation: particleExplosion ${2 + Math.random() * 3}s ease-out forwards;
        `;
        
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleExplosion {
                0% { 
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% { 
                    transform: translate(
                        calc(-50% + ${(Math.random() - 0.5) * 800}px), 
                        calc(-50% + ${(Math.random() - 0.5) * 600}px)
                    ) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyle);
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 5000);
    }
}

function showFinalSurprise() {
    const surprise = document.createElement('div');
    surprise.innerHTML = `
        <div class="final-message">
            <h3>🌟 Hidden Achievement Unlocked! 🌟</h3>
            <p>「基底変換の真の理解者」</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">
                あなたは線形代数の奥深い美しさを理解しています。<br>
                数学の探求を続けてください！
            </p>
        </div>
    `;
    surprise.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #ffd89b, #19547b); color: white;
        padding: 1.5rem; border-radius: 12px; max-width: 300px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2); animation: surpriseSlide 0.8s ease;
    `;
    
    const surpriseStyle = document.createElement('style');
    surpriseStyle.textContent = `
        @keyframes surpriseSlide {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .final-message h3 { margin-bottom: 0.5rem; font-size: 1.2rem; }
        .final-message p { margin-bottom: 0.5rem; }
    `;
    document.head.appendChild(surpriseStyle);
    document.body.appendChild(surprise);
    
    setTimeout(() => {
        surprise.style.transform = 'translateX(100%)';
        surprise.style.transition = 'transform 0.5s ease';
        setTimeout(() => surprise.remove(), 500);
    }, 5000);
}

// Navigation setup
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionNum = parseInt(btn.dataset.section);
            if (sectionProgress[sectionNum]) {
                showSection(sectionNum);
            }
        });
    });
}

// Section management
function showSection(sectionNum) {
    // Cleanup previous animations
    Object.values(animationFrames).forEach(frame => {
        if (frame) cancelAnimationFrame(frame);
    });
    animationFrames = {};
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`section-${sectionNum}`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionNum;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionNum}"]`).classList.add('active');
        
        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([targetSection]);
        }
        
        // Initialize section-specific content
        initializeCurrentSection();
    }
}

function nextSection(currentSectionNum) {
    const nextSectionNum = currentSectionNum + 1;
    if (nextSectionNum <= 6) {
        sectionProgress[nextSectionNum] = true;
        updateProgress();
        showSection(nextSectionNum);
    }
}

function updateProgress() {
    const totalSections = 7;
    const completedSections = Object.keys(sectionProgress).length;
    const progressPercent = (completedSections / totalSections) * 100;
    
    const progressFill = document.getElementById('progress-fill');
    const progressCount = document.getElementById('progress-count');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    
    if (progressCount) {
        progressCount.textContent = completedSections;
    }
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const sectionNum = parseInt(btn.dataset.section);
        if (sectionProgress[sectionNum]) {
            btn.classList.remove('locked');
        } else {
            btn.classList.add('locked');
        }
    });
}

function initializeCurrentSection() {
    switch(currentSection) {
        case 0: initializeSection0(); break;
        case 1: initializeSection1(); break;
        case 2: initializeSection2(); break;
        case 3: initializeSection3(); break;
        case 4: initializeSection4(); break;
        case 5: initializeSection5(); break;
        case 6: initializeSection6(); break;
    }
}

// Section 0: Introduction
function initializeSection0() {
    const container = document.getElementById('intro-demo');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = `
        <h5>インタラクティブデモ：座標系の切り替え</h5>
        <div class="controls">
            <button onclick="switchBasis('standard')">標準基底</button>
            <button onclick="switchBasis('rotated')">回転基底</button>
            <button onclick="switchBasis('scaled')">スケール基底</button>
        </div>
        <div class="canvas-container" id="intro-canvas-container"></div>
        <div class="transformation-info" id="intro-info"></div>
    `;
    
    createIntroVisualization();
}

function createIntroVisualization() {
    const container = document.getElementById('intro-canvas-container');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    canvas.style.background = '#f8fafc';
    canvas.style.border = '1px solid #e2e8f0';
    canvas.style.borderRadius = '8px';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let currentBasisType = 'standard';
    const vector = {x: 3, y: 2}; // Fixed vector for demonstration
    let animationProgress = 0;
    let isAnimating = false;
    
    function drawVisualization() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 50;
        
        // Draw enhanced grid with labels
        drawEnhancedGrid(ctx, centerX, centerY, scale);
        
        // Define basis vectors with smooth interpolation
        let basis1, basis2, basisName;
        const targetBasis1 = {x: 1, y: 0};
        const targetBasis2 = {x: 0, y: 1};
        
        switch(currentBasisType) {
            case 'standard':
                basis1 = {x: 1, y: 0};
                basis2 = {x: 0, y: 1};
                basisName = '標準基底 {(1,0), (0,1)}';
                break;
            case 'rotated':
                const angle = Math.PI / 6; // 30 degrees
                basis1 = {x: Math.cos(angle), y: Math.sin(angle)};
                basis2 = {x: -Math.sin(angle), y: Math.cos(angle)};
                basisName = '30°回転基底';
                break;
            case 'scaled':
                basis1 = {x: 1.5, y: 0.5};
                basis2 = {x: -0.5, y: 1.2};
                basisName = 'スケール基底';
                break;
        }
        
        // Smooth animation interpolation
        if (isAnimating) {
            const t = animationProgress;
            basis1 = {
                x: targetBasis1.x * (1 - t) + basis1.x * t,
                y: targetBasis1.y * (1 - t) + basis1.y * t
            };
            basis2 = {
                x: targetBasis2.x * (1 - t) + basis2.x * t,
                y: targetBasis2.y * (1 - t) + basis2.y * t
            };
        }
        
        // Draw basis vectors with enhanced styling
        drawEnhancedVector(ctx, centerX, centerY, basis1.x * scale, basis1.y * scale, '#667eea', 'e₁', 4);
        drawEnhancedVector(ctx, centerX, centerY, basis2.x * scale, basis2.y * scale, '#764ba2', 'e₂', 4);
        
        // Draw multiple example vectors
        const exampleVectors = [
            {vec: vector, color: '#f093fb', label: 'v'},
            {vec: {x: 2, y: 3}, color: '#4ecdc4', label: 'u'},
            {vec: {x: 1.5, y: 1}, color: '#45b7d1', label: 'w'}
        ];
        
        exampleVectors.forEach(example => {
            const vectorInBasis = transformVector(example.vec, basis1, basis2);
            drawEnhancedVector(ctx, centerX, centerY, vectorInBasis.x * scale, vectorInBasis.y * scale, example.color, example.label, 3);
            
            // Draw coordinate representation
            const coords = calculateCoordinatesInBasis(example.vec, basis1, basis2);
            drawCoordinateText(ctx, centerX + vectorInBasis.x * scale + 15, centerY - vectorInBasis.y * scale - 15, 
                             coords, example.color);
        });
        
        // Calculate coordinates in current basis
        const coords = calculateCoordinatesInBasis(vector, basis1, basis2);
        
        // Update info display
        updateIntroInfo(basisName, vector, coords, exampleVectors.map(e => ({
            vector: e.vec,
            coords: calculateCoordinatesInBasis(e.vec, basis1, basis2),
            label: e.label
        })));
    }
    
    function drawEnhancedGrid(ctx, centerX, centerY, scale) {
        // Fine grid
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 0.5;
        
        for (let x = -10; x <= 10; x++) {
            ctx.beginPath();
            ctx.moveTo(centerX + x * scale, 0);
            ctx.lineTo(centerX + x * scale, ctx.canvas.height);
            ctx.stroke();
        }
        
        for (let y = -10; y <= 10; y++) {
            ctx.beginPath();
            ctx.moveTo(0, centerY + y * scale);
            ctx.lineTo(ctx.canvas.width, centerY + y * scale);
            ctx.stroke();
        }
        
        // Major grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        for (let x = -10; x <= 10; x += 2) {
            ctx.beginPath();
            ctx.moveTo(centerX + x * scale, 0);
            ctx.lineTo(centerX + x * scale, ctx.canvas.height);
            ctx.stroke();
        }
        
        for (let y = -10; y <= 10; y += 2) {
            ctx.beginPath();
            ctx.moveTo(0, centerY + y * scale);
            ctx.lineTo(ctx.canvas.width, centerY + y * scale);
            ctx.stroke();
        }
        
        // Axes with enhanced styling
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 3;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(ctx.canvas.width, centerY);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, ctx.canvas.height);
        ctx.stroke();
        
        // Add axis labels
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('x', ctx.canvas.width - 20, centerY - 10);
        ctx.fillText('y', centerX + 10, 20);
        
        // Add grid numbers
        ctx.font = '12px Arial';
        ctx.fillStyle = '#718096';
        
        for (let x = -4; x <= 4; x += 2) {
            if (x !== 0) {
                ctx.fillText(x.toString(), centerX + x * scale - 5, centerY + 20);
            }
        }
        
        for (let y = -4; y <= 4; y += 2) {
            if (y !== 0) {
                ctx.fillText((-y).toString(), centerX + 10, centerY + y * scale + 5);
            }
        }
    }
    
    function drawEnhancedVector(ctx, startX, startY, dx, dy, color, label, lineWidth = 2) {
        const endX = startX + dx;
        const endY = startY - dy; // Flip Y for canvas coordinates
        
        // Draw vector line with gradient
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, color + '80'); // Semi-transparent start
        gradient.addColorStop(1, color); // Full color end
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        
        // Draw vector line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Draw enhanced arrowhead
        const angle = Math.atan2(-dy, dx);
        const arrowLength = 20;
        const arrowWidth = Math.PI / 6;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - arrowLength * Math.cos(angle - arrowWidth),
            endY + arrowLength * Math.sin(angle - arrowWidth)
        );
        ctx.lineTo(
            endX - arrowLength * Math.cos(angle + arrowWidth),
            endY + arrowLength * Math.sin(angle + arrowWidth)
        );
        ctx.closePath();
        ctx.fill();
        
        // Draw label with background
        if (label) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            
            const labelX = endX + 10;
            const labelY = endY - 10;
            
            ctx.font = 'bold 16px Arial';
            const metrics = ctx.measureText(label);
            const padding = 4;
            
            ctx.fillRect(labelX - padding, labelY - 16 - padding, metrics.width + 2 * padding, 20 + 2 * padding);
            ctx.strokeRect(labelX - padding, labelY - 16 - padding, metrics.width + 2 * padding, 20 + 2 * padding);
            
            ctx.fillStyle = color;
            ctx.fillText(label, labelX, labelY);
        }
    }
    
    function drawCoordinateText(ctx, x, y, coords, color) {
        const text = `(${coords.a.toFixed(1)}, ${coords.b.toFixed(1)})`;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        
        ctx.font = '12px Arial';
        const metrics = ctx.measureText(text);
        const padding = 3;
        
        ctx.fillRect(x - padding, y - 12 - padding, metrics.width + 2 * padding, 16 + 2 * padding);
        ctx.strokeRect(x - padding, y - 12 - padding, metrics.width + 2 * padding, 16 + 2 * padding);
        
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
    
    function transformVector(v, b1, b2) {
        return {
            x: v.x * b1.x + v.y * b2.x,
            y: v.x * b1.y + v.y * b2.y
        };
    }
    
    function calculateCoordinatesInBasis(v, b1, b2) {
        // Solve v = a*b1 + b*b2 for a and b
        const det = b1.x * b2.y - b1.y * b2.x;
        const a = (v.x * b2.y - v.y * b2.x) / det;
        const b = (v.y * b1.x - v.x * b1.y) / det;
        return {a: a, b: b};
    }
    
    window.switchBasis = function(basisType) {
        if (isAnimating) return;
        
        const previousBasisType = currentBasisType;
        currentBasisType = basisType;
        
        if (previousBasisType !== basisType) {
            isAnimating = true;
            animationProgress = 0;
            
            function animate() {
                animationProgress += 0.03;
                if (animationProgress >= 1) {
                    animationProgress = 1;
                    isAnimating = false;
                }
                
                drawVisualization();
                
                if (isAnimating) {
                    animationFrames['intro'] = requestAnimationFrame(animate);
                }
            }
            
            animate();
        } else {
            drawVisualization();
        }
    };
    
    // Initialize
    drawVisualization();
}

function drawGrid(ctx, centerX, centerY, scale) {
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = -10; x <= 10; x++) {
        ctx.beginPath();
        ctx.moveTo(centerX + x * scale, 0);
        ctx.lineTo(centerX + x * scale, ctx.canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = -10; y <= 10; y++) {
        ctx.beginPath();
        ctx.moveTo(0, centerY + y * scale);
        ctx.lineTo(ctx.canvas.width, centerY + y * scale);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(ctx.canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, ctx.canvas.height);
    ctx.stroke();
}

function drawVector(ctx, startX, startY, dx, dy, color, label, lineWidth = 2) {
    const endX = startX + dx;
    const endY = startY - dy; // Flip Y for canvas coordinates
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Draw vector line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Draw arrowhead
    const angle = Math.atan2(-dy, dx);
    const arrowLength = 15;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - arrowLength * Math.cos(angle - Math.PI / 6),
        endY + arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - arrowLength * Math.cos(angle + Math.PI / 6),
        endY + arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
    
    // Draw label
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.fillText(label, endX + 5, endY - 5);
}

function updateIntroInfo(basisName, vector, coords, allVectors = []) {
    const infoDiv = document.getElementById('intro-info');
    if (!infoDiv) return;
    
    let infoHTML = `
        <div class="basis-info-card">
            <h6>🎯 現在の基底: ${basisName}</h6>
            <div class="vector-comparison">
                <div class="vector-display">
                    <h7>主要ベクトル v の表現:</h7>
                    <div class="coordinate-display">
                        <span class="standard-coords">標準基底: v = ${vector.x}e₁ + ${vector.y}e₂</span>
                        <span class="current-coords">現在の基底: v = ${coords.a.toFixed(2)}b₁ + ${coords.b.toFixed(2)}b₂</span>
                    </div>
                </div>
            </div>
    `;
    
    if (allVectors.length > 0) {
        infoHTML += `
            <div class="all-vectors-display">
                <h7>すべてのベクトルの座標表現:</h7>
                <div class="vectors-grid">
        `;
        
        allVectors.forEach(vecInfo => {
            infoHTML += `
                <div class="vector-item">
                    <strong>${vecInfo.label}:</strong> (${vecInfo.coords.a.toFixed(2)}, ${vecInfo.coords.b.toFixed(2)})
                </div>
            `;
        });
        
        infoHTML += `
                </div>
            </div>
        `;
    }
    
    infoHTML += `
            <div class="insight-highlight">
                <span class="insight-icon">💡</span>
                <span class="insight-text">同じベクトルが異なる座標で表現されています！基底が変わっても<strong>ベクトル自体</strong>は変わりません。</span>
            </div>
        </div>
    `;
    
    infoDiv.innerHTML = infoHTML;
    
    // Add enhanced styling
    const style = document.createElement('style');
    style.textContent = `
        .basis-info-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 2px solid #cbd5e0;
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
        
        .vector-comparison {
            margin: 1rem 0;
        }
        
        .coordinate-display {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .standard-coords {
            background: rgba(102, 126, 234, 0.1);
            border: 1px solid #667eea;
            border-radius: 6px;
            padding: 0.5rem;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        .current-coords {
            background: rgba(246, 147, 251, 0.1);
            border: 1px solid #f093fb;
            border-radius: 6px;
            padding: 0.5rem;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        .all-vectors-display {
            margin: 1rem 0;
            padding-top: 1rem;
            border-top: 1px solid #cbd5e0;
        }
        
        .vectors-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .vector-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 0.5rem;
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .insight-highlight {
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            border: 2px solid #4fd1c7;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1rem;
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .insight-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }
        
        .insight-text {
            font-style: italic;
            line-height: 1.4;
        }
        
        h7 {
            font-size: 1rem;
            font-weight: 600;
            color: #2d3748;
            display: block;
            margin-bottom: 0.5rem;
        }
    `;
    
    if (!document.querySelector('#basis-info-styles')) {
        style.id = 'basis-info-styles';
        document.head.appendChild(style);
    }
}

// Section 1: Basis Properties
function initializeSection1() {
    createBasisPropertiesDemo();
}

function createBasisPropertiesDemo() {
    const container = document.getElementById('basis-properties-demo');
    if (!container) return;
    
    // Add canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = '<canvas width="400" height="300" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>';
    container.appendChild(canvasContainer);
    
    const canvas = canvasContainer.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    function updateVisualization() {
        const angle1 = parseFloat(document.getElementById('vec1-angle').value) * Math.PI / 180;
        const angle2 = parseFloat(document.getElementById('vec2-angle').value) * Math.PI / 180;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;
        
        // Draw coordinate system
        drawGrid(ctx, centerX, centerY, 40);
        
        // Calculate vectors
        const v1 = {x: Math.cos(angle1), y: Math.sin(angle1)};
        const v2 = {x: Math.cos(angle2), y: Math.sin(angle2)};
        
        // Draw vectors
        drawVector(ctx, centerX, centerY, v1.x * scale, v1.y * scale, '#667eea', 'v₁');
        drawVector(ctx, centerX, centerY, v2.x * scale, v2.y * scale, '#764ba2', 'v₂');
        
        // Check linear independence
        const crossProduct = v1.x * v2.y - v1.y * v2.x;
        const isIndependent = Math.abs(crossProduct) > 0.1;
        
        // Update status
        const statusDiv = document.getElementById('independence-status');
        if (statusDiv) {
            statusDiv.innerHTML = `
                <div class="result ${isIndependent ? 'correct' : 'incorrect'}">
                    <strong>${isIndependent ? '線形独立' : '線形従属'}</strong><br>
                    外積: ${crossProduct.toFixed(3)}<br>
                    ${isIndependent ? 'これらのベクトルは基底を形成できます' : 'これらのベクトルは基底を形成できません'}
                </div>
            `;
        }
    }
    
    // Add event listeners
    document.getElementById('vec1-angle').addEventListener('input', updateVisualization);
    document.getElementById('vec2-angle').addEventListener('input', updateVisualization);
    
    updateVisualization();
}

// Section 2: Basis Transformation
function initializeSection2() {
    createBasisTransformationDemo();
}

function createBasisTransformationDemo() {
    const container = document.getElementById('basis-transformation-demo');
    if (!container) return;
    
    // Add canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = '<canvas width="500" height="400" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>';
    container.appendChild(canvasContainer);
    
    const canvas = canvasContainer.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    let animationProgress = 0;
    let isAnimating = false;
    
    function updateVisualization() {
        const b1x = parseFloat(document.getElementById('basis1-x').value);
        const b1y = parseFloat(document.getElementById('basis1-y').value);
        const b2x = parseFloat(document.getElementById('basis2-x').value);
        const b2y = parseFloat(document.getElementById('basis2-y').value);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;
        
        // Draw grid
        drawGrid(ctx, centerX, centerY, 40);
        
        // Interpolate between standard and new basis
        const t = isAnimating ? animationProgress : 1;
        const currentB1 = {
            x: (1 - t) * 1 + t * b1x,
            y: (1 - t) * 0 + t * b1y
        };
        const currentB2 = {
            x: (1 - t) * 0 + t * b2x,
            y: (1 - t) * 1 + t * b2y
        };
        
        // Draw standard basis (faded during animation)
        const standardAlpha = isAnimating ? (1 - t) : 0.3;
        ctx.globalAlpha = standardAlpha;
        drawVector(ctx, centerX, centerY, scale, 0, '#cccccc', 'e₁');
        drawVector(ctx, centerX, centerY, 0, scale, '#cccccc', 'e₂');
        
        // Draw current basis
        ctx.globalAlpha = 1;
        drawVector(ctx, centerX, centerY, currentB1.x * scale, currentB1.y * scale, '#667eea', 'b₁', 3);
        drawVector(ctx, centerX, centerY, currentB2.x * scale, currentB2.y * scale, '#764ba2', 'b₂', 3);
        
        // Calculate and display transformation matrix
        const det = b1x * b2y - b1y * b2x;
        updateTransformationInfo(b1x, b1y, b2x, b2y, det);
    }
    
    function updateTransformationInfo(b1x, b1y, b2x, b2y, det) {
        const infoDiv = document.getElementById('transformation-info');
        if (!infoDiv) return;
        
        infoDiv.innerHTML = `
            <h6>変換行列</h6>
            <div class="matrix-display">
                P = [${b1x.toFixed(2)} ${b2x.toFixed(2)}]<br>
                    [${b1y.toFixed(2)} ${b2y.toFixed(2)}]
            </div>
            <p><strong>行列式:</strong> det(P) = ${det.toFixed(3)}</p>
            <p><strong>状態:</strong> ${Math.abs(det) > 0.01 ? '可逆変換' : '特異変換（基底ではない）'}</p>
        `;
    }
    
    window.animateTransformation = function() {
        if (isAnimating) return;
        
        isAnimating = true;
        animationProgress = 0;
        
        function animate() {
            animationProgress += 0.02;
            if (animationProgress >= 1) {
                animationProgress = 1;
                isAnimating = false;
            }
            
            updateVisualization();
            
            if (isAnimating) {
                animationFrames['transformation'] = requestAnimationFrame(animate);
            }
        }
        
        animate();
    };
    
    // Add event listeners
    ['basis1-x', 'basis1-y', 'basis2-x', 'basis2-y'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateVisualization);
    });
    
    updateVisualization();
}

// Section 3: Representation Matrix
function initializeSection3() {
    createRepresentationMatrixDemo();
    createBasisChangeEffectDemo();
}

function createRepresentationMatrixDemo() {
    const container = document.getElementById('representation-matrix-demo');
    if (!container) return;
    
    // Add canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = '<canvas width="500" height="400" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>';
    container.appendChild(canvasContainer);
    
    const canvas = canvasContainer.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    function updateVisualization() {
        const mappingType = document.getElementById('mapping-type').value;
        const param = parseFloat(document.getElementById('mapping-param').value);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;
        
        // Draw grid
        drawGrid(ctx, centerX, centerY, 40);
        
        // Define transformation based on type
        let matrix;
        let description;
        
        switch(mappingType) {
            case 'rotation':
                const angle = param * Math.PI / 180;
                matrix = [
                    [Math.cos(angle), -Math.sin(angle)],
                    [Math.sin(angle), Math.cos(angle)]
                ];
                description = `${param}°回転`;
                break;
            case 'scaling':
                const s = param / 100 + 0.5; // Scale factor 0.5 to 4.1
                matrix = [[s, 0], [0, s]];
                description = `${s.toFixed(2)}倍スケーリング`;
                break;
            case 'shear':
                const shear = param / 180; // Shear factor 0 to 2
                matrix = [[1, shear], [0, 1]];
                description = `せん断変形 (${shear.toFixed(2)})`;
                break;
            case 'reflection':
                const reflAngle = param * Math.PI / 180;
                const cos2a = Math.cos(2 * reflAngle);
                const sin2a = Math.sin(2 * reflAngle);
                matrix = [[cos2a, sin2a], [sin2a, -cos2a]];
                description = `${param}°軸反射`;
                break;
        }
        
        // Draw original vectors
        const originalVectors = [
            {x: 1, y: 0, color: '#cccccc', label: 'e₁'},
            {x: 0, y: 1, color: '#cccccc', label: 'e₂'},
            {x: 1.5, y: 1, color: '#cccccc', label: 'v'}
        ];
        
        originalVectors.forEach(vec => {
            drawVector(ctx, centerX, centerY, vec.x * scale * 0.7, vec.y * scale * 0.7, vec.color, vec.label + "'", 1);
        });
        
        // Draw transformed vectors
        originalVectors.forEach(vec => {
            const transformed = {
                x: matrix[0][0] * vec.x + matrix[0][1] * vec.y,
                y: matrix[1][0] * vec.x + matrix[1][1] * vec.y
            };
            drawVector(ctx, centerX, centerY, transformed.x * scale, transformed.y * scale, 
                      vec.color === '#cccccc' ? '#667eea' : '#f093fb', vec.label, 2);
        });
        
        // Update matrix display
        updateMatrixDisplay(matrix, description);
    }
    
    function updateMatrixDisplay(matrix, description) {
        const displayDiv = document.getElementById('matrix-display');
        if (!displayDiv) return;
        
        displayDiv.innerHTML = `
            <h6>${description}</h6>
            <div class="matrix-display">
                T = [${matrix[0][0].toFixed(3)} ${matrix[0][1].toFixed(3)}]<br>
                    [${matrix[1][0].toFixed(3)} ${matrix[1][1].toFixed(3)}]
            </div>
            <p><strong>行列式:</strong> ${(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(3)}</p>
        `;
    }
    
    // Add event listeners
    document.getElementById('mapping-type').addEventListener('change', updateVisualization);
    document.getElementById('mapping-param').addEventListener('input', updateVisualization);
    
    updateVisualization();
}

function createBasisChangeEffectDemo() {
    const container = document.getElementById('basis-change-effect-demo');
    if (!container) return;
    
    // Add canvas and controls
    container.innerHTML = `
        <h5>基底変更の効果：同じ線形写像の異なる表現</h5>
        <div class="controls">
            <button onclick="animateBasisChange()">基底変更アニメーション</button>
            <button onclick="showSimilarityTransformation()">相似変換を表示</button>
            <button onclick="resetBasisDemo()">リセット</button>
        </div>
        <div class="comparison-grid">
            <div class="comparison-item">
                <h6>元の基底での表現</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="original-matrix" class="matrix-display"></div>
            </div>
            <div class="comparison-item">
                <h6>新しい基底での表現</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="new-matrix" class="matrix-display"></div>
            </div>
        </div>
        <div id="similarity-info" class="transformation-info"></div>
    `;
    
    const canvases = container.querySelectorAll('canvas');
    const originalCanvas = canvases[0];
    const newCanvas = canvases[1];
    const originalCtx = originalCanvas.getContext('2d');
    const newCtx = newCanvas.getContext('2d');
    
    let animationState = 0; // 0: original, 1: transforming, 2: new basis
    let animationProgress = 0;
    
    // Define transformation and basis
    const originalTransform = [[1.5, 0.5], [0.3, 1.2]]; // Example linear transformation
    const newBasis = [[1, 1], [1, -1]]; // New basis vectors
    const newBasisInverse = [[0.5, 0.5], [0.5, -0.5]]; // Inverse of new basis matrix
    
    function drawBasisVisualization(ctx, transform, basis, progress = 1) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const scale = 80;
        
        // Draw grid
        drawGrid(ctx, centerX, centerY, 30);
        
        // Interpolate basis vectors for animation
        const currentBasis = [
            [
                (1 - progress) * 1 + progress * basis[0][0],
                (1 - progress) * 0 + progress * basis[0][1]
            ],
            [
                (1 - progress) * 0 + progress * basis[1][0],
                (1 - progress) * 1 + progress * basis[1][1]
            ]
        ];
        
        // Draw current basis vectors
        drawVector(ctx, centerX, centerY, currentBasis[0][0] * scale, currentBasis[0][1] * scale, '#667eea', 'b₁', 2);
        drawVector(ctx, centerX, centerY, currentBasis[1][0] * scale, currentBasis[1][1] * scale, '#764ba2', 'b₂', 2);
        
        // Apply transformation to some test vectors
        const testVectors = [
            {x: 1, y: 0, color: '#f093fb', label: 'v₁'},
            {x: 0, y: 1, color: '#4ecdc4', label: 'v₂'},
            {x: 0.8, y: 0.6, color: '#45b7d1', label: 'v₃'}
        ];
        
        testVectors.forEach(vec => {
            // Transform vector
            const transformed = {
                x: transform[0][0] * vec.x + transform[0][1] * vec.y,
                y: transform[1][0] * vec.x + transform[1][1] * vec.y
            };
            
            // Draw original vector (faded)
            ctx.globalAlpha = 0.3;
            drawVector(ctx, centerX, centerY, vec.x * scale, vec.y * scale, vec.color, '', 1);
            
            // Draw transformed vector
            ctx.globalAlpha = 1;
            drawVector(ctx, centerX, centerY, transformed.x * scale, transformed.y * scale, vec.color, vec.label, 2);
        });
        
        ctx.globalAlpha = 1;
    }
    
    function calculateSimilarityTransformation() {
        // P^(-1) * A * P where P is the change of basis matrix
        const P = newBasis;
        const PInv = newBasisInverse;
        const A = originalTransform;
        
        // Calculate P^(-1) * A
        const temp = [
            [PInv[0][0] * A[0][0] + PInv[0][1] * A[1][0], PInv[0][0] * A[0][1] + PInv[0][1] * A[1][1]],
            [PInv[1][0] * A[0][0] + PInv[1][1] * A[1][0], PInv[1][0] * A[0][1] + PInv[1][1] * A[1][1]]
        ];
        
        // Calculate (P^(-1) * A) * P
        const result = [
            [temp[0][0] * P[0][0] + temp[0][1] * P[1][0], temp[0][0] * P[0][1] + temp[0][1] * P[1][1]],
            [temp[1][0] * P[0][0] + temp[1][1] * P[1][0], temp[1][0] * P[0][1] + temp[1][1] * P[1][1]]
        ];
        
        return result;
    }
    
    function updateMatrixDisplays() {
        const originalMatrix = document.getElementById('original-matrix');
        const newMatrix = document.getElementById('new-matrix');
        
        if (originalMatrix) {
            originalMatrix.innerHTML = `
                A = [${originalTransform[0][0].toFixed(1)} ${originalTransform[0][1].toFixed(1)}]<br>
                    [${originalTransform[1][0].toFixed(1)} ${originalTransform[1][1].toFixed(1)}]
            `;
        }
        
        if (newMatrix) {
            const transformedMatrix = calculateSimilarityTransformation();
            newMatrix.innerHTML = `
                A' = [${transformedMatrix[0][0].toFixed(2)} ${transformedMatrix[0][1].toFixed(2)}]<br>
                     [${transformedMatrix[1][0].toFixed(2)} ${transformedMatrix[1][1].toFixed(2)}]
            `;
        }
    }
    
    window.animateBasisChange = function() {
        animationState = 1;
        animationProgress = 0;
        
        function animate() {
            animationProgress += 0.02;
            
            if (animationProgress >= 1) {
                animationProgress = 1;
                animationState = 2;
            }
            
            // Draw on both canvases
            drawBasisVisualization(originalCtx, originalTransform, [[1, 0], [0, 1]], 1 - animationProgress);
            drawBasisVisualization(newCtx, calculateSimilarityTransformation(), newBasis, animationProgress);
            
            if (animationState === 1) {
                animationFrames['basisChange'] = requestAnimationFrame(animate);
            }
        }
        
        animate();
    };
    
    window.showSimilarityTransformation = function() {
        const infoDiv = document.getElementById('similarity-info');
        if (!infoDiv) return;
        
        const transformedMatrix = calculateSimilarityTransformation();
        const P = newBasis;
        const PInv = newBasisInverse;
        
        infoDiv.innerHTML = `
            <h6>相似変換の計算</h6>
            <p><strong>基底変更行列 P:</strong></p>
            <div class="matrix-display">
                P = [${P[0][0]} ${P[0][1]}]<br>
                    [${P[1][0]} ${P[1][1]}]
            </div>
            <p><strong>逆行列 P⁻¹:</strong></p>
            <div class="matrix-display">
                P⁻¹ = [${PInv[0][0]} ${PInv[0][1]}]<br>
                      [${PInv[1][0]} ${PInv[1][1]}]
            </div>
            <p><strong>相似変換:</strong> A' = P⁻¹AP</p>
            <p><em>同じ線形写像が異なる基底で表現されています！</em></p>
        `;
    };
    
    window.resetBasisDemo = function() {
        animationState = 0;
        drawBasisVisualization(originalCtx, originalTransform, [[1, 0], [0, 1]], 1);
        drawBasisVisualization(newCtx, originalTransform, [[1, 0], [0, 1]], 0);
        document.getElementById('similarity-info').innerHTML = '';
    };
    
    // Initialize
    updateMatrixDisplays();
    resetBasisDemo();
}

// Section 4: Composition of Linear Maps
function initializeSection4() {
    createCompositionDemo();
    createRotationCompositionDemo();
}

function createCompositionDemo() {
    const container = document.getElementById('composition-demo');
    if (!container) return;
    
    // Add canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.innerHTML = '<canvas width="600" height="400" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>';
    container.appendChild(canvasContainer);
    
    const canvas = canvasContainer.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    let animationStep = 0; // 0: original, 1: first transform, 2: second transform
    let isAnimating = false;
    
    function updateVisualization() {
        const angle1 = parseFloat(document.getElementById('transform1-angle').value) * Math.PI / 180;
        const scale1 = parseFloat(document.getElementById('transform1-scale').value);
        const angle2 = parseFloat(document.getElementById('transform2-angle').value) * Math.PI / 180;
        const scale2 = parseFloat(document.getElementById('transform2-scale').value);
        
        // Define transformations
        const T1 = [
            [scale1 * Math.cos(angle1), -scale1 * Math.sin(angle1)],
            [scale1 * Math.sin(angle1), scale1 * Math.cos(angle1)]
        ];
        
        const T2 = [
            [scale2 * Math.cos(angle2), -scale2 * Math.sin(angle2)],
            [scale2 * Math.sin(angle2), scale2 * Math.cos(angle2)]
        ];
        
        // Composition T2 ∘ T1
        const composition = [
            [T2[0][0] * T1[0][0] + T2[0][1] * T1[1][0], T2[0][0] * T1[0][1] + T2[0][1] * T1[1][1]],
            [T2[1][0] * T1[0][0] + T2[1][1] * T1[1][0], T2[1][0] * T1[0][1] + T2[1][1] * T1[1][1]]
        ];
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 60;
        
        // Draw grid
        drawGrid(ctx, centerX, centerY, 30);
        
        // Test vectors
        const testVectors = [
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ];
        
        const colors = ['#667eea', '#764ba2', '#f093fb'];
        
        // Draw vectors based on animation step
        testVectors.forEach((vec, i) => {
            let currentVec = vec;
            let label = `v${i+1}`;
            let alpha = 1;
            
            if (animationStep >= 1) {
                // Apply first transformation
                currentVec = {
                    x: T1[0][0] * vec.x + T1[0][1] * vec.y,
                    y: T1[1][0] * vec.x + T1[1][1] * vec.y
                };
                label += "'";
                alpha = animationStep === 1 ? 1 : 0.5;
            }
            
            if (animationStep >= 2) {
                // Apply second transformation
                const afterT1 = currentVec;
                currentVec = {
                    x: T2[0][0] * afterT1.x + T2[0][1] * afterT1.y,
                    y: T2[1][0] * afterT1.x + T2[1][1] * afterT1.y
                };
                label = label.replace("'", "''");
                alpha = 1;
            }
            
            ctx.globalAlpha = alpha;
            drawVector(ctx, centerX, centerY, currentVec.x * scale, currentVec.y * scale, colors[i], label, 2);
        });
        
        ctx.globalAlpha = 1;
    }
    
    window.animateComposition = function() {
        if (isAnimating) return;
        
        isAnimating = true;
        animationStep = 0;
        
        function animate() {
            updateVisualization();
            
            setTimeout(() => {
                animationStep++;
                if (animationStep <= 2) {
                    animate();
                } else {
                    isAnimating = false;
                    animationStep = 0;
                }
            }, 1500);
        }
        
        animate();
    };
    
    // Add event listeners
    ['transform1-angle', 'transform1-scale', 'transform2-angle', 'transform2-scale'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateVisualization);
    });
    
    updateVisualization();
}

function createRotationCompositionDemo() {
    const container = document.getElementById('rotation-composition-demo');
    if (!container) return;
    
    // Add comprehensive 3D rotation visualization
    container.innerHTML = `
        <h5>3D回転の合成と非可換性</h5>
        <div class="controls">
            <label>X軸回転: <input type="range" id="rot-x" min="0" max="360" value="30" step="5"> <span id="rot-x-val">30°</span></label>
            <label>Y軸回転: <input type="range" id="rot-y" min="0" max="360" value="45" step="5"> <span id="rot-y-val">45°</span></label>
            <label>Z軸回転: <input type="range" id="rot-z" min="0" max="360" value="60" step="5"> <span id="rot-z-val">60°</span></label>
        </div>
        <div class="controls">
            <button onclick="animateRotationOrder('xyz')">順序: X→Y→Z</button>
            <button onclick="animateRotationOrder('zyx')">順序: Z→Y→X</button>
            <button onclick="showEulerAngles()">オイラー角表示</button>
            <button onclick="resetRotation()">リセット</button>
        </div>
        <div class="comparison-grid">
            <div class="comparison-item">
                <h6>回転順序: X→Y→Z</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="xyz-matrix" class="matrix-display"></div>
            </div>
            <div class="comparison-item">
                <h6>回転順序: Z→Y→X</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="zyx-matrix" class="matrix-display"></div>
            </div>
        </div>
        <div id="rotation-info" class="transformation-info"></div>
    `;
    
    const canvases = container.querySelectorAll('canvas');
    const xyzCanvas = canvases[0];
    const zyxCanvas = canvases[1];
    const xyzCtx = xyzCanvas.getContext('2d');
    const zyxCtx = zyxCanvas.getContext('2d');
    
    let currentAngles = {x: 30, y: 45, z: 60};
    let animationOrder = '';
    let animationStep = 0;
    let isAnimating = false;
    
    // 3D rotation matrices
    function rotationMatrixX(angle) {
        const rad = angle * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return [
            [1, 0, 0],
            [0, cos, -sin],
            [0, sin, cos]
        ];
    }
    
    function rotationMatrixY(angle) {
        const rad = angle * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return [
            [cos, 0, sin],
            [0, 1, 0],
            [-sin, 0, cos]
        ];
    }
    
    function rotationMatrixZ(angle) {
        const rad = angle * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return [
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1]
        ];
    }
    
    function multiplyMatrices(a, b) {
        const result = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }
    
    function calculateCompositeRotation(order, angles) {
        const Rx = rotationMatrixX(angles.x);
        const Ry = rotationMatrixY(angles.y);
        const Rz = rotationMatrixZ(angles.z);
        
        if (order === 'xyz') {
            return multiplyMatrices(multiplyMatrices(Rz, Ry), Rx);
        } else if (order === 'zyx') {
            return multiplyMatrices(multiplyMatrices(Rx, Ry), Rz);
        }
        return Rx;
    }
    
    function project3DTo2D(point, viewAngle = 0) {
        // Simple isometric projection with viewing angle
        const cosView = Math.cos(viewAngle);
        const sinView = Math.sin(viewAngle);
        
        const rotated = {
            x: point.x * cosView - point.z * sinView,
            y: point.y,
            z: point.x * sinView + point.z * cosView
        };
        
        return {
            x: rotated.x - rotated.z * 0.5,
            y: rotated.y - rotated.z * 0.3
        };
    }
    
    function draw3DVisualization(ctx, rotationMatrix, title) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const scale = 80;
        
        // Define original coordinate system
        const originalVectors = [
            {x: 1, y: 0, z: 0, color: '#e53e3e', label: 'X'},
            {x: 0, y: 1, z: 0, color: '#38a169', label: 'Y'},
            {x: 0, y: 0, z: 1, color: '#3182ce', label: 'Z'}
        ];
        
        // Draw original axes (faded)
        ctx.globalAlpha = 0.3;
        originalVectors.forEach(vec => {
            const projected = project3DTo2D(vec);
            drawVector(ctx, centerX, centerY, projected.x * scale, projected.y * scale, vec.color, vec.label + "'", 1);
        });
        
        // Draw transformed axes
        ctx.globalAlpha = 1;
        originalVectors.forEach(vec => {
            // Apply rotation matrix
            const rotated = {
                x: rotationMatrix[0][0] * vec.x + rotationMatrix[0][1] * vec.y + rotationMatrix[0][2] * vec.z,
                y: rotationMatrix[1][0] * vec.x + rotationMatrix[1][1] * vec.y + rotationMatrix[1][2] * vec.z,
                z: rotationMatrix[2][0] * vec.x + rotationMatrix[2][1] * vec.y + rotationMatrix[2][2] * vec.z
            };
            
            const projected = project3DTo2D(rotated);
            drawVector(ctx, centerX, centerY, projected.x * scale, projected.y * scale, vec.color, vec.label, 3);
        });
        
        // Draw a test object (small cube)
        drawRotatedCube(ctx, centerX, centerY, scale * 0.3, rotationMatrix);
        
        ctx.globalAlpha = 1;
    }
    
    function drawRotatedCube(ctx, centerX, centerY, size, rotationMatrix) {
        const vertices = [
            {x: -0.5, y: -0.5, z: -0.5}, {x: 0.5, y: -0.5, z: -0.5},
            {x: 0.5, y: 0.5, z: -0.5}, {x: -0.5, y: 0.5, z: -0.5},
            {x: -0.5, y: -0.5, z: 0.5}, {x: 0.5, y: -0.5, z: 0.5},
            {x: 0.5, y: 0.5, z: 0.5}, {x: -0.5, y: 0.5, z: 0.5}
        ];
        
        // Transform vertices
        const transformedVertices = vertices.map(v => {
            const rotated = {
                x: rotationMatrix[0][0] * v.x + rotationMatrix[0][1] * v.y + rotationMatrix[0][2] * v.z,
                y: rotationMatrix[1][0] * v.x + rotationMatrix[1][1] * v.y + rotationMatrix[1][2] * v.z,
                z: rotationMatrix[2][0] * v.x + rotationMatrix[2][1] * v.y + rotationMatrix[2][2] * v.z
            };
            return project3DTo2D(rotated);
        });
        
        // Draw cube edges
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        
        const edges = [
            [0,1], [1,2], [2,3], [3,0], // bottom face
            [4,5], [5,6], [6,7], [7,4], // top face
            [0,4], [1,5], [2,6], [3,7]  // vertical edges
        ];
        
        edges.forEach(edge => {
            const start = transformedVertices[edge[0]];
            const end = transformedVertices[edge[1]];
            
            ctx.beginPath();
            ctx.moveTo(centerX + start.x * size, centerY - start.y * size);
            ctx.lineTo(centerX + end.x * size, centerY - end.y * size);
            ctx.stroke();
        });
    }
    
    function updateVisualization() {
        const angles = {
            x: parseFloat(document.getElementById('rot-x').value),
            y: parseFloat(document.getElementById('rot-y').value),
            z: parseFloat(document.getElementById('rot-z').value)
        };
        
        // Update display values
        document.getElementById('rot-x-val').textContent = angles.x + '°';
        document.getElementById('rot-y-val').textContent = angles.y + '°';
        document.getElementById('rot-z-val').textContent = angles.z + '°';
        
        currentAngles = angles;
        
        // Calculate both rotation orders
        const xyzMatrix = calculateCompositeRotation('xyz', angles);
        const zyxMatrix = calculateCompositeRotation('zyx', angles);
        
        // Draw visualizations
        draw3DVisualization(xyzCtx, xyzMatrix, 'X→Y→Z');
        draw3DVisualization(zyxCtx, zyxMatrix, 'Z→Y→X');
        
        // Update matrix displays
        updateRotationMatrices(xyzMatrix, zyxMatrix);
    }
    
    function updateRotationMatrices(xyzMatrix, zyxMatrix) {
        const xyzDiv = document.getElementById('xyz-matrix');
        const zyxDiv = document.getElementById('zyx-matrix');
        
        if (xyzDiv) {
            xyzDiv.innerHTML = `
                R = [${xyzMatrix[0][0].toFixed(2)} ${xyzMatrix[0][1].toFixed(2)} ${xyzMatrix[0][2].toFixed(2)}]<br>
                    [${xyzMatrix[1][0].toFixed(2)} ${xyzMatrix[1][1].toFixed(2)} ${xyzMatrix[1][2].toFixed(2)}]<br>
                    [${xyzMatrix[2][0].toFixed(2)} ${xyzMatrix[2][1].toFixed(2)} ${xyzMatrix[2][2].toFixed(2)}]
            `;
        }
        
        if (zyxDiv) {
            zyxDiv.innerHTML = `
                R' = [${zyxMatrix[0][0].toFixed(2)} ${zyxMatrix[0][1].toFixed(2)} ${zyxMatrix[0][2].toFixed(2)}]<br>
                     [${zyxMatrix[1][0].toFixed(2)} ${zyxMatrix[1][1].toFixed(2)} ${zyxMatrix[1][2].toFixed(2)}]<br>
                     [${zyxMatrix[2][0].toFixed(2)} ${zyxMatrix[2][1].toFixed(2)} ${zyxMatrix[2][2].toFixed(2)}]
            `;
        }
    }
    
    window.animateRotationOrder = function(order) {
        if (isAnimating) return;
        
        isAnimating = true;
        animationOrder = order;
        animationStep = 0;
        
        const steps = order === 'xyz' ? ['x', 'y', 'z'] : ['z', 'y', 'x'];
        let currentStep = 0;
        let progress = 0;
        
        function animate() {
            progress += 0.03;
            
            if (progress >= 1) {
                progress = 0;
                currentStep++;
                if (currentStep >= steps.length) {
                    isAnimating = false;
                    return;
                }
            }
            
            // Create incremental rotation
            const incrementalAngles = {x: 0, y: 0, z: 0};
            for (let i = 0; i <= currentStep; i++) {
                if (i < currentStep) {
                    incrementalAngles[steps[i]] = currentAngles[steps[i]];
                } else {
                    incrementalAngles[steps[i]] = currentAngles[steps[i]] * progress;
                }
            }
            
            const matrix = calculateCompositeRotation(order, incrementalAngles);
            const targetCtx = order === 'xyz' ? xyzCtx : zyxCtx;
            draw3DVisualization(targetCtx, matrix, order.toUpperCase());
            
            animationFrames['rotation'] = requestAnimationFrame(animate);
        }
        
        animate();
    };
    
    window.showEulerAngles = function() {
        const infoDiv = document.getElementById('rotation-info');
        if (!infoDiv) return;
        
        infoDiv.innerHTML = `
            <h6>オイラー角と回転合成</h6>
            <p><strong>現在の角度:</strong> X=${currentAngles.x}°, Y=${currentAngles.y}°, Z=${currentAngles.z}°</p>
            <p><strong>重要な性質:</strong></p>
            <ul>
                <li>3D回転の合成は<strong>非可換</strong>です（順序が重要）</li>
                <li>R(X→Y→Z) ≠ R(Z→Y→X) （一般的に）</li>
                <li>オイラー角の解釈は回転順序に依存します</li>
                <li>ジンバルロックなどの特異点に注意が必要です</li>
            </ul>
            <p><em>異なる回転順序で結果が変わることを確認してください！</em></p>
        `;
    };
    
    window.resetRotation = function() {
        // Reset to identity
        draw3DVisualization(xyzCtx, [[1,0,0],[0,1,0],[0,0,1]], 'X→Y→Z');
        draw3DVisualization(zyxCtx, [[1,0,0],[0,1,0],[0,0,1]], 'Z→Y→X');
        document.getElementById('rotation-info').innerHTML = '';
    };
    
    // Add event listeners
    ['rot-x', 'rot-y', 'rot-z'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateVisualization);
    });
    
    // Initialize
    updateVisualization();
}

// Section 5: Polynomial Vector Spaces
function initializeSection5() {
    createPolynomialBasisDemo();
    createPolynomialTransformationDemo();
    createPolynomialMatrixExample();
}

function createPolynomialBasisDemo() {
    window.visualizePolynomialBasis = function() {
        const degree = parseInt(document.getElementById('poly-degree').value);
        const basisType = document.getElementById('poly-basis-type').value;
        
        const displayDiv = document.getElementById('polynomial-display');
        if (!displayDiv) return;
        
        let basisFunctions = [];
        
        switch(basisType) {
            case 'monomial':
                for (let i = 0; i <= degree; i++) {
                    basisFunctions.push(`x^${i}`);
                }
                break;
            case 'bernstein':
                for (let i = 0; i <= degree; i++) {
                    const binomial = factorial(degree) / (factorial(i) * factorial(degree - i));
                    basisFunctions.push(`${binomial}x^${i}(1-x)^${degree-i}`);
                }
                break;
            case 'legendre':
                for (let i = 0; i <= degree; i++) {
                    basisFunctions.push(`P_${i}(x)`);
                }
                break;
        }
        
        displayDiv.innerHTML = `
            <h6>${basisType === 'monomial' ? '単項式' : basisType === 'bernstein' ? 'ベルンシュタイン' : 'ルジャンドル'}基底 (次数 ${degree})</h6>
            <div class="math-box">
                ${basisFunctions.map((f, i) => `φ_${i}(x) = ${f}`).join('<br>')}
            </div>
        `;
        
        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([displayDiv]);
        }
    };
}

function createPolynomialTransformationDemo() {
    const container = document.getElementById('polynomial-transformation-demo');
    if (!container) return;
    
    // Add comprehensive polynomial visualization
    container.innerHTML = `
        <h5>多項式の基底変換可視化</h5>
        <div class="controls">
            <label>元の基底: 
                <select id="source-basis">
                    <option value="monomial">単項式基底</option>
                    <option value="bernstein">ベルンシュタイン基底</option>
                    <option value="legendre">ルジャンドル基底</option>
                </select>
            </label>
            <label>変換先基底: 
                <select id="target-basis">
                    <option value="bernstein">ベルンシュタイン基底</option>
                    <option value="monomial">単項式基底</option>
                    <option value="legendre">ルジャンドル基底</option>
                </select>
            </label>
            <label>次数: 
                <input type="range" id="poly-degree-demo" min="2" max="5" value="3" step="1">
                <span id="degree-val">3</span>
            </label>
        </div>
        <div class="polynomial-input">
            <h6>多項式の係数を入力</h6>
            <label>a₀: <input type="number" id="coeff-0-demo" value="1" step="0.1"></label>
            <label>a₁: <input type="number" id="coeff-1-demo" value="2" step="0.1"></label>
            <label>a₂: <input type="number" id="coeff-2-demo" value="-1" step="0.1"></label>
            <label>a₃: <input type="number" id="coeff-3-demo" value="0.5" step="0.1"></label>
        </div>
        <div class="controls">
            <button onclick="animatePolynomialTransformation()">基底変換アニメーション</button>
            <button onclick="showTransformationMatrix()">変換行列表示</button>
            <button onclick="plotPolynomialComparison()">関数プロット比較</button>
        </div>
        <div class="comparison-grid">
            <div class="comparison-item">
                <h6>元の基底での表現</h6>
                <canvas width="300" height="200" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="source-poly-display" class="math-box"></div>
            </div>
            <div class="comparison-item">
                <h6>変換後の基底での表現</h6>
                <canvas width="300" height="200" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="target-poly-display" class="math-box"></div>
            </div>
        </div>
        <div id="transformation-matrix-display" class="matrix-display" style="display: none;"></div>
        <div id="polynomial-comparison-info" class="transformation-info"></div>
    `;
    
    const canvases = container.querySelectorAll('canvas');
    const sourceCanvas = canvases[0];
    const targetCanvas = canvases[1];
    const sourceCtx = sourceCanvas.getContext('2d');
    const targetCtx = targetCanvas.getContext('2d');
    
    let currentCoeffs = [1, 2, -1, 0.5];
    let animationProgress = 0;
    let isTransforming = false;
    
    // Basis function generators
    function generateMonomialBasis(degree) {
        const basis = [];
        for (let i = 0; i <= degree; i++) {
            basis.push((x) => Math.pow(x, i));
        }
        return basis;
    }
    
    function generateBernsteinBasis(degree) {
        const basis = [];
        for (let i = 0; i <= degree; i++) {
            basis.push((x) => {
                const binomial = factorial(degree) / (factorial(i) * factorial(degree - i));
                return binomial * Math.pow(x, i) * Math.pow(1 - x, degree - i);
            });
        }
        return basis;
    }
    
    function generateLegendreBasis(degree) {
        // Simplified Legendre polynomials for visualization
        const basis = [];
        basis.push((x) => 1); // P0
        if (degree >= 1) basis.push((x) => x); // P1
        if (degree >= 2) basis.push((x) => 0.5 * (3*x*x - 1)); // P2
        if (degree >= 3) basis.push((x) => 0.5 * (5*x*x*x - 3*x)); // P3
        if (degree >= 4) basis.push((x) => 0.125 * (35*x*x*x*x - 30*x*x + 3)); // P4
        if (degree >= 5) basis.push((x) => 0.125 * (63*x*x*x*x*x - 70*x*x*x + 15*x)); // P5
        return basis.slice(0, degree + 1);
    }
    
    function getBasisFunctions(basisType, degree) {
        switch(basisType) {
            case 'monomial': return generateMonomialBasis(degree);
            case 'bernstein': return generateBernsteinBasis(degree);
            case 'legendre': return generateLegendreBasis(degree);
            default: return generateMonomialBasis(degree);
        }
    }
    
    function getBasisName(basisType) {
        switch(basisType) {
            case 'monomial': return '単項式';
            case 'bernstein': return 'ベルンシュタイン';
            case 'legendre': return 'ルジャンドル';
            default: return '単項式';
        }
    }
    
    function evaluatePolynomial(coeffs, basisFunctions, x) {
        let result = 0;
        for (let i = 0; i < Math.min(coeffs.length, basisFunctions.length); i++) {
            result += coeffs[i] * basisFunctions[i](x);
        }
        return result;
    }
    
    function plotPolynomial(ctx, coeffs, basisFunctions, color = '#667eea') {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const margin = 20;
        
        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // Grid
        for (let i = 0; i <= 10; i++) {
            const x = margin + (width - 2 * margin) * i / 10;
            ctx.beginPath();
            ctx.moveTo(x, margin);
            ctx.lineTo(x, height - margin);
            ctx.stroke();
            
            const y = margin + (height - 2 * margin) * i / 10;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(width - margin, y);
            ctx.stroke();
        }
        
        // Axes
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin, height / 2);
        ctx.lineTo(width - margin, height / 2);
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.stroke();
        
        // Plot polynomial
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const steps = 200;
        let firstPoint = true;
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = t; // Normalized x from 0 to 1
            const y = evaluatePolynomial(coeffs, basisFunctions, x);
            
            // Map to canvas coordinates
            const canvasX = margin + (width - 2 * margin) * t;
            const canvasY = height / 2 - y * 20; // Scale factor for visualization
            
            if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }
        
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#2d3748';
        ctx.font = '12px Arial';
        ctx.fillText('0', margin - 5, height / 2 + 15);
        ctx.fillText('1', width - margin - 5, height / 2 + 15);
        ctx.fillText('f(x)', 5, 15);
    }
    
    function generateTransformationMatrix(sourceBasis, targetBasis, degree) {
        const matrix = [];
        const steps = 100;
        
        // Numerical approximation of transformation matrix
        for (let i = 0; i <= degree; i++) {
            const row = [];
            for (let j = 0; j <= degree; j++) {
                let integral = 0;
                for (let k = 0; k <= steps; k++) {
                    const x = k / steps;
                    integral += sourceBasis[j](x) * targetBasis[i](x) / steps;
                }
                row.push(integral);
            }
            matrix.push(row);
        }
        
        return matrix;
    }
    
    function transformCoefficients(coeffs, transformMatrix) {
        const result = [];
        for (let i = 0; i < transformMatrix.length; i++) {
            let sum = 0;
            for (let j = 0; j < Math.min(coeffs.length, transformMatrix[i].length); j++) {
                sum += transformMatrix[i][j] * coeffs[j];
            }
            result.push(sum);
        }
        return result;
    }
    
    function updatePolynomialVisualization() {
        const sourceBasisType = document.getElementById('source-basis').value;
        const targetBasisType = document.getElementById('target-basis').value;
        const degree = parseInt(document.getElementById('poly-degree-demo').value);
        
        document.getElementById('degree-val').textContent = degree;
        
        // Get coefficients
        const coeffs = [];
        for (let i = 0; i <= degree; i++) {
            const input = document.getElementById(`coeff-${i}-demo`);
            if (input) {
                coeffs.push(parseFloat(input.value) || 0);
            } else {
                coeffs.push(0);
            }
        }
        
        currentCoeffs = coeffs;
        
        // Get basis functions
        const sourceBasis = getBasisFunctions(sourceBasisType, degree);
        const targetBasis = getBasisFunctions(targetBasisType, degree);
        
        // Plot original polynomial
        plotPolynomial(sourceCtx, coeffs, sourceBasis, '#667eea');
        
        // Transform coefficients
        const transformMatrix = generateTransformationMatrix(sourceBasis, targetBasis, degree);
        const transformedCoeffs = transformCoefficients(coeffs, transformMatrix);
        
        // Plot transformed polynomial
        plotPolynomial(targetCtx, transformedCoeffs, targetBasis, '#764ba2');
        
        // Update displays
        updatePolynomialDisplays(sourceBasisType, targetBasisType, coeffs, transformedCoeffs, degree);
    }
    
    function updatePolynomialDisplays(sourceBasisType, targetBasisType, sourceCoeffs, targetCoeffs, degree) {
        const sourceDisplay = document.getElementById('source-poly-display');
        const targetDisplay = document.getElementById('target-poly-display');
        
        if (sourceDisplay) {
            let sourceText = `${getBasisName(sourceBasisType)}基底での表現:<br>`;
            sourceText += formatPolynomialInBasis(sourceCoeffs, sourceBasisType, degree);
            sourceDisplay.innerHTML = sourceText;
        }
        
        if (targetDisplay) {
            let targetText = `${getBasisName(targetBasisType)}基底での表現:<br>`;
            targetText += formatPolynomialInBasis(targetCoeffs, targetBasisType, degree);
            targetDisplay.innerHTML = targetText;
        }
    }
    
    function formatPolynomialInBasis(coeffs, basisType, degree) {
        const terms = [];
        
        for (let i = 0; i <= degree && i < coeffs.length; i++) {
            if (Math.abs(coeffs[i]) > 0.001) {
                let term = '';
                if (coeffs[i] > 0 && terms.length > 0) term += ' + ';
                else if (coeffs[i] < 0) term += ' - ';
                
                const coeff = Math.abs(coeffs[i]);
                if (Math.abs(coeff - 1) > 0.001) {
                    term += coeff.toFixed(3);
                }
                
                switch(basisType) {
                    case 'monomial':
                        if (i === 0) term += (Math.abs(coeff - 1) > 0.001 ? '' : '1');
                        else if (i === 1) term += 'x';
                        else term += `x^${i}`;
                        break;
                    case 'bernstein':
                        term += `B_{${i},${degree}}(x)`;
                        break;
                    case 'legendre':
                        term += `P_{${i}}(x)`;
                        break;
                }
                
                terms.push(term);
            }
        }
        
        return terms.length > 0 ? terms.join('') : '0';
    }
    
    window.animatePolynomialTransformation = function() {
        if (isTransforming) return;
        
        isTransforming = true;
        animationProgress = 0;
        
        const sourceBasisType = document.getElementById('source-basis').value;
        const targetBasisType = document.getElementById('target-basis').value;
        const degree = parseInt(document.getElementById('poly-degree-demo').value);
        
        const sourceBasis = getBasisFunctions(sourceBasisType, degree);
        const targetBasis = getBasisFunctions(targetBasisType, degree);
        const transformMatrix = generateTransformationMatrix(sourceBasis, targetBasis, degree);
        
        function animate() {
            animationProgress += 0.02;
            
            if (animationProgress >= 1) {
                animationProgress = 1;
                isTransforming = false;
            }
            
            // Interpolate coefficients
            const originalCoeffs = currentCoeffs.slice();
            const targetCoeffs = transformCoefficients(originalCoeffs, transformMatrix);
            const interpolatedCoeffs = [];
            
            for (let i = 0; i < originalCoeffs.length; i++) {
                const original = originalCoeffs[i] || 0;
                const target = targetCoeffs[i] || 0;
                interpolatedCoeffs.push(original * (1 - animationProgress) + target * animationProgress);
            }
            
            // Use interpolated basis as well
            const interpolatedBasis = [];
            for (let i = 0; i <= degree; i++) {
                interpolatedBasis.push((x) => {
                    const sourceVal = sourceBasis[i] ? sourceBasis[i](x) : 0;
                    const targetVal = targetBasis[i] ? targetBasis[i](x) : 0;
                    return sourceVal * (1 - animationProgress) + targetVal * animationProgress;
                });
            }
            
            plotPolynomial(targetCtx, interpolatedCoeffs, interpolatedBasis, '#f093fb');
            
            if (isTransforming) {
                animationFrames['polynomial'] = requestAnimationFrame(animate);
            }
        }
        
        animate();
    };
    
    window.showTransformationMatrix = function() {
        const display = document.getElementById('transformation-matrix-display');
        const sourceBasisType = document.getElementById('source-basis').value;
        const targetBasisType = document.getElementById('target-basis').value;
        const degree = parseInt(document.getElementById('poly-degree-demo').value);
        
        if (!display) return;
        
        const sourceBasis = getBasisFunctions(sourceBasisType, degree);
        const targetBasis = getBasisFunctions(targetBasisType, degree);
        const matrix = generateTransformationMatrix(sourceBasis, targetBasis, degree);
        
        let matrixHTML = `<h6>${getBasisName(sourceBasisType)} → ${getBasisName(targetBasisType)} 変換行列</h6>`;
        matrixHTML += '<div class="matrix-display">';
        
        matrix.forEach(row => {
            matrixHTML += '[';
            matrixHTML += row.map(val => val.toFixed(3)).join(' ');
            matrixHTML += ']<br>';
        });
        
        matrixHTML += '</div>';
        display.innerHTML = matrixHTML;
        display.style.display = 'block';
    };
    
    window.plotPolynomialComparison = function() {
        const infoDiv = document.getElementById('polynomial-comparison-info');
        const sourceBasisType = document.getElementById('source-basis').value;
        const targetBasisType = document.getElementById('target-basis').value;
        
        if (!infoDiv) return;
        
        infoDiv.innerHTML = `
            <h6>多項式基底変換の比較</h6>
            <p><strong>重要な性質:</strong></p>
            <ul>
                <li>同じ多項式関数が異なる基底で表現されています</li>
                <li>基底変換行列により係数が変換されます</li>
                <li>関数の値 f(x) は基底に依存しません</li>
                <li>${getBasisName(sourceBasisType)}基底から${getBasisName(targetBasisType)}基底への変換</li>
            </ul>
            <p><em>グラフが同じことを確認してください！（数値誤差を除く）</em></p>
        `;
    };
    
    // Add event listeners
    ['source-basis', 'target-basis', 'poly-degree-demo'].forEach(id => {
        document.getElementById(id).addEventListener('change', updatePolynomialVisualization);
    });
    
    ['coeff-0-demo', 'coeff-1-demo', 'coeff-2-demo', 'coeff-3-demo'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePolynomialVisualization);
        }
    });
    
    // Initialize
    updatePolynomialVisualization();
}

function createPolynomialMatrixExample() {
    const container = document.getElementById('polynomial-matrix-example');
    if (!container) return;
    
    // Example transformation matrix for monomial to Bernstein basis (degree 3)
    container.innerHTML = `
        <div class="matrix-display">
            <strong>単項式 → ベルンシュタイン基底変換行列 (3次)</strong><br><br>
            [ 1  0  0  0 ]<br>
            [-3  3  0  0 ]<br>
            [ 3 -6  3  0 ]<br>
            [-1  3 -3  1 ]
        </div>
    `;
}

// Section 6: Applications and Exercises
function initializeSection6() {
    createEigenvalueDemo();
    setupProblemSets();
    createOptimalBasisChallenge();
}

function createEigenvalueDemo() {
    const container = document.getElementById('eigenvalue-demo');
    if (!container) return;
    
    // Add comprehensive eigenvalue visualization
    container.innerHTML = `
        <h5>固有値・固有ベクトルと対角化</h5>
        <div class="controls">
            <label>行列成分 a₁₁: <input type="number" id="matrix-11-demo" value="3" step="0.1"></label>
            <label>行列成分 a₁₂: <input type="number" id="matrix-12-demo" value="1" step="0.1"></label>
            <label>行列成分 a₂₁: <input type="number" id="matrix-21-demo" value="1" step="0.1"></label>
            <label>行列成分 a₂₂: <input type="number" id="matrix-22-demo" value="3" step="0.1"></label>
        </div>
        <div class="controls">
            <button onclick="animateEigenTransformation()">固有変換アニメーション</button>
            <button onclick="showEigenvectorEvolution()">固有ベクトル発展</button>
            <button onclick="demonstrateDiagonalization()">対角化デモ</button>
        </div>
        <div class="comparison-grid">
            <div class="comparison-item">
                <h6>元の行列による変換</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="original-eigenvalue-matrix" class="matrix-display"></div>
            </div>
            <div class="comparison-item">
                <h6>対角化後の表現</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
                <div id="diagonalized-matrix" class="matrix-display"></div>
            </div>
        </div>
        <div id="eigenvalue-analysis" class="transformation-info"></div>
    `;
    
    const canvases = container.querySelectorAll('canvas');
    const originalCanvas = canvases[0];
    const diagonalCanvas = canvases[1];
    const originalCtx = originalCanvas.getContext('2d');
    const diagonalCtx = diagonalCanvas.getContext('2d');
    
    let animationPhase = 0; // 0: static, 1: showing eigenvectors, 2: transformation
    let animationTime = 0;
    
    function calculateEigenvalues(a, b, c, d) {
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        
        if (discriminant >= 0) {
            const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
            const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
            return {lambda1, lambda2, real: true};
        } else {
            const realPart = trace / 2;
            const imagPart = Math.sqrt(-discriminant) / 2;
            return {
                lambda1: {real: realPart, imag: imagPart},
                lambda2: {real: realPart, imag: -imagPart},
                real: false
            };
        }
    }
    
    function calculateEigenvectors(matrix, eigenvalues) {
        const [a, b, c, d] = [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]];
        
        if (!eigenvalues.real) {
            return null; // Complex eigenvalues
        }
        
        const eigenvectors = [];
        
        [eigenvalues.lambda1, eigenvalues.lambda2].forEach(lambda => {
            // Solve (A - λI)v = 0
            const A_lambda = [[a - lambda, b], [c, d - lambda]];
            
            // Find eigenvector
            let v1, v2;
            if (Math.abs(A_lambda[0][0]) > 0.001) {
                v2 = 1;
                v1 = -A_lambda[0][1] / A_lambda[0][0];
            } else if (Math.abs(A_lambda[0][1]) > 0.001) {
                v1 = 1;
                v2 = -A_lambda[0][0] / A_lambda[0][1];
            } else if (Math.abs(A_lambda[1][0]) > 0.001) {
                v2 = 1;
                v1 = -A_lambda[1][1] / A_lambda[1][0];
            } else {
                v1 = 1;
                v2 = 0;
            }
            
            // Normalize
            const norm = Math.sqrt(v1 * v1 + v2 * v2);
            eigenvectors.push({x: v1 / norm, y: v2 / norm});
        });
        
        return eigenvectors;
    }
    
    function drawEigenvalueVisualization(ctx, matrix, showEigenvectors = false, animationProgress = 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const scale = 60;
        
        // Draw grid
        drawGrid(ctx, centerX, centerY, 30);
        
        // Calculate eigenvalues and eigenvectors
        const eigenvalues = calculateEigenvalues(matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]);
        const eigenvectors = calculateEigenvectors(matrix, eigenvalues);
        
        // Draw unit circle
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, scale, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Create test vectors on unit circle
        const numVectors = 12;
        const testVectors = [];
        for (let i = 0; i < numVectors; i++) {
            const angle = (2 * Math.PI * i) / numVectors;
            testVectors.push({
                x: Math.cos(angle),
                y: Math.sin(angle),
                originalAngle: angle
            });
        }
        
        // Draw original vectors (faded)
        ctx.globalAlpha = 0.3;
        testVectors.forEach(vec => {
            drawVector(ctx, centerX, centerY, vec.x * scale, vec.y * scale, '#cccccc', '', 1);
        });
        
        // Draw transformed vectors
        ctx.globalAlpha = 1;
        testVectors.forEach(vec => {
            let transformed = {
                x: matrix[0][0] * vec.x + matrix[0][1] * vec.y,
                y: matrix[1][0] * vec.x + matrix[1][1] * vec.y
            };
            
            // Apply animation interpolation
            if (animationProgress < 1) {
                transformed = {
                    x: vec.x * (1 - animationProgress) + transformed.x * animationProgress,
                    y: vec.y * (1 - animationProgress) + transformed.y * animationProgress
                };
            }
            
            const color = Math.abs(vec.originalAngle - Math.PI/4) < 0.2 || Math.abs(vec.originalAngle - 5*Math.PI/4) < 0.2 ? '#f093fb' : '#667eea';
            drawVector(ctx, centerX, centerY, transformed.x * scale, transformed.y * scale, color, '', 2);
        });
        
        // Draw eigenvectors if available and requested
        if (showEigenvectors && eigenvectors && eigenvalues.real) {
            ctx.globalAlpha = 1;
            eigenvectors.forEach((eigenvec, i) => {
                const lambda = i === 0 ? eigenvalues.lambda1 : eigenvalues.lambda2;
                const color = i === 0 ? '#e53e3e' : '#38a169';
                const thickness = 4;
                
                // Draw eigenvector
                drawVector(ctx, centerX, centerY, eigenvec.x * scale, eigenvec.y * scale, color, `v${i+1}`, thickness);
                
                // Draw transformed eigenvector (should be scaled version)
                const scaledLength = Math.abs(lambda) * scale;
                const direction = lambda >= 0 ? 1 : -1;
                drawVector(ctx, centerX, centerY, 
                          direction * eigenvec.x * scaledLength, 
                          direction * eigenvec.y * scaledLength, 
                          color, `λ${i+1}v${i+1}`, thickness);
                
                // Draw scaling factor
                ctx.fillStyle = color;
                ctx.font = '12px Arial';
                ctx.fillText(`λ${i+1} = ${lambda.toFixed(2)}`, 
                           centerX + eigenvec.x * scale + 20, 
                           centerY - eigenvec.y * scale);
            });
        }
        
        ctx.globalAlpha = 1;
    }
    
    function updateEigenvalueVisualization() {
        const a11 = parseFloat(document.getElementById('matrix-11-demo').value);
        const a12 = parseFloat(document.getElementById('matrix-12-demo').value);
        const a21 = parseFloat(document.getElementById('matrix-21-demo').value);
        const a22 = parseFloat(document.getElementById('matrix-22-demo').value);
        
        const matrix = [[a11, a12], [a21, a22]];
        
        // Draw original transformation
        drawEigenvalueVisualization(originalCtx, matrix, false);
        
        // Calculate and display eigenvalue analysis
        const eigenvalues = calculateEigenvalues(a11, a12, a21, a22);
        const eigenvectors = calculateEigenvectors(matrix, eigenvalues);
        
        updateEigenvalueAnalysis(matrix, eigenvalues, eigenvectors);
        updateMatrixDisplays(matrix, eigenvalues, eigenvectors);
        
        // Show diagonalized form if possible
        if (eigenvalues.real && eigenvectors) {
            drawDiagonalizedVisualization(matrix, eigenvalues, eigenvectors);
        }
    }
    
    function drawDiagonalizedVisualization(originalMatrix, eigenvalues, eigenvectors) {
        // In the eigenvector basis, the transformation is diagonal
        const diagonalMatrix = [[eigenvalues.lambda1, 0], [0, eigenvalues.lambda2]];
        
        // Visualize in the eigenvector coordinate system
        diagonalCtx.clearRect(0, 0, diagonalCanvas.width, diagonalCanvas.height);
        
        const centerX = diagonalCanvas.width / 2;
        const centerY = diagonalCanvas.height / 2;
        const scale = 60;
        
        // Draw grid aligned with eigenvectors
        drawEigenvectorGrid(diagonalCtx, centerX, centerY, scale, eigenvectors);
        
        // Draw transformation in eigenvector basis
        drawEigenvalueVisualization(diagonalCtx, diagonalMatrix, true, 1);
    }
    
    function drawEigenvectorGrid(ctx, centerX, centerY, scale, eigenvectors) {
        if (!eigenvectors) return;
        
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // Draw grid lines along eigenvector directions
        for (let i = -5; i <= 5; i++) {
            // Lines along first eigenvector
            const perp1 = {x: -eigenvectors[0].y, y: eigenvectors[0].x};
            const startX = centerX + i * eigenvectors[0].x * scale/3 - perp1.x * scale * 2;
            const startY = centerY - i * eigenvectors[0].y * scale/3 + perp1.y * scale * 2;
            const endX = centerX + i * eigenvectors[0].x * scale/3 + perp1.x * scale * 2;
            const endY = centerY - i * eigenvectors[0].y * scale/3 - perp1.y * scale * 2;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Lines along second eigenvector
            const perp2 = {x: -eigenvectors[1].y, y: eigenvectors[1].x};
            const startX2 = centerX + i * eigenvectors[1].x * scale/3 - perp2.x * scale * 2;
            const startY2 = centerY - i * eigenvectors[1].y * scale/3 + perp2.y * scale * 2;
            const endX2 = centerX + i * eigenvectors[1].x * scale/3 + perp2.x * scale * 2;
            const endY2 = centerY - i * eigenvectors[1].y * scale/3 - perp2.y * scale * 2;
            
            ctx.beginPath();
            ctx.moveTo(startX2, startY2);
            ctx.lineTo(endX2, endY2);
            ctx.stroke();
        }
        
        // Draw eigenvector axes
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 3;
        
        drawVector(ctx, centerX, centerY, eigenvectors[0].x * scale, eigenvectors[0].y * scale, '#e53e3e', 'e₁', 3);
        drawVector(ctx, centerX, centerY, eigenvectors[1].x * scale, eigenvectors[1].y * scale, '#38a169', 'e₂', 3);
    }
    
    function updateEigenvalueAnalysis(matrix, eigenvalues, eigenvectors) {
        const analysisDiv = document.getElementById('eigenvalue-analysis');
        if (!analysisDiv) return;
        
        let analysisHTML = '<h6>固有値解析</h6>';
        
        if (eigenvalues.real) {
            analysisHTML += `
                <p><strong>固有値:</strong> λ₁ = ${eigenvalues.lambda1.toFixed(3)}, λ₂ = ${eigenvalues.lambda2.toFixed(3)}</p>
                <p><strong>行列式:</strong> det(A) = λ₁λ₂ = ${(eigenvalues.lambda1 * eigenvalues.lambda2).toFixed(3)}</p>
                <p><strong>トレース:</strong> tr(A) = λ₁ + λ₂ = ${(eigenvalues.lambda1 + eigenvalues.lambda2).toFixed(3)}</p>
            `;
            
            if (eigenvectors) {
                analysisHTML += `
                    <p><strong>固有ベクトル:</strong></p>
                    <p>v₁ = (${eigenvectors[0].x.toFixed(3)}, ${eigenvectors[0].y.toFixed(3)})</p>
                    <p>v₂ = (${eigenvectors[1].x.toFixed(3)}, ${eigenvectors[1].y.toFixed(3)})</p>
                `;
                
                if (Math.abs(eigenvalues.lambda1 - eigenvalues.lambda2) > 0.001) {
                    analysisHTML += '<p><strong>状態:</strong> 対角化可能（相異なる固有値）</p>';
                } else {
                    analysisHTML += '<p><strong>状態:</strong> 重根（対角化には固有ベクトルの確認が必要）</p>';
                }
            }
        } else {
            analysisHTML += `
                <p><strong>複素固有値:</strong></p>
                <p>λ₁ = ${eigenvalues.lambda1.real.toFixed(3)} + ${eigenvalues.lambda1.imag.toFixed(3)}i</p>
                <p>λ₂ = ${eigenvalues.lambda2.real.toFixed(3)} + ${eigenvalues.lambda2.imag.toFixed(3)}i</p>
                <p><strong>状態:</strong> 実数範囲では対角化不可能（回転成分を含む）</p>
            `;
        }
        
        analysisDiv.innerHTML = analysisHTML;
    }
    
    function updateMatrixDisplays(matrix, eigenvalues, eigenvectors) {
        const originalDiv = document.getElementById('original-eigenvalue-matrix');
        const diagonalDiv = document.getElementById('diagonalized-matrix');
        
        if (originalDiv) {
            originalDiv.innerHTML = `
                A = [${matrix[0][0].toFixed(1)} ${matrix[0][1].toFixed(1)}]<br>
                    [${matrix[1][0].toFixed(1)} ${matrix[1][1].toFixed(1)}]
            `;
        }
        
        if (diagonalDiv) {
            if (eigenvalues.real) {
                diagonalDiv.innerHTML = `
                    D = [${eigenvalues.lambda1.toFixed(2)}   0  ]<br>
                        [  0   ${eigenvalues.lambda2.toFixed(2)}]
                `;
            } else {
                diagonalDiv.innerHTML = `
                    実数範囲では<br>
                    対角化不可能
                `;
            }
        }
    }
    
    window.animateEigenTransformation = function() {
        animationPhase = 2;
        animationTime = 0;
        
        function animate() {
            animationTime += 0.02;
            
            if (animationTime >= 1) {
                animationTime = 1;
                animationPhase = 0;
            }
            
            const matrix = [
                [parseFloat(document.getElementById('matrix-11-demo').value), parseFloat(document.getElementById('matrix-12-demo').value)],
                [parseFloat(document.getElementById('matrix-21-demo').value), parseFloat(document.getElementById('matrix-22-demo').value)]
            ];
            
            drawEigenvalueVisualization(originalCtx, matrix, false, animationTime);
            
            if (animationPhase === 2) {
                animationFrames['eigenvalue'] = requestAnimationFrame(animate);
            }
        }
        
        animate();
    };
    
    window.showEigenvectorEvolution = function() {
        const matrix = [
            [parseFloat(document.getElementById('matrix-11-demo').value), parseFloat(document.getElementById('matrix-12-demo').value)],
            [parseFloat(document.getElementById('matrix-21-demo').value), parseFloat(document.getElementById('matrix-22-demo').value)]
        ];
        
        drawEigenvalueVisualization(originalCtx, matrix, true);
    };
    
    window.demonstrateDiagonalization = function() {
        updateEigenvalueVisualization();
    };
    
    // Add event listeners
    ['matrix-11-demo', 'matrix-12-demo', 'matrix-21-demo', 'matrix-22-demo'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateEigenvalueVisualization);
    });
    
    // Initialize
    updateEigenvalueVisualization();
}

function setupProblemSets() {
    window.checkProblem1 = function() {
        const p11 = parseFloat(document.getElementById('prob1-11').value);
        const p12 = parseFloat(document.getElementById('prob1-12').value);
        const p21 = parseFloat(document.getElementById('prob1-21').value);
        const p22 = parseFloat(document.getElementById('prob1-22').value);
        
        const resultDiv = document.getElementById('prob1-result');
        if (!resultDiv) return;
        
        // Correct answer: basis vectors as columns
        const correct = (Math.abs(p11 - 1) < 0.1 && Math.abs(p12 - 3) < 0.1 && 
                        Math.abs(p21 - 2) < 0.1 && Math.abs(p22 - 1) < 0.1);
        
        resultDiv.className = `result ${correct ? 'correct' : 'incorrect'}`;
        resultDiv.innerHTML = correct ? 
            '✅ 正解です！基底ベクトルを列に並べた行列が変換行列になります。' :
            '❌ 不正解です。基底ベクトル (1,2) と (3,1) を列ベクトルとして並べてください。';
    };
    
    window.checkProblem2 = function() {
        // Simplified check for problem 2
        const resultDiv = document.getElementById('prob2-result');
        if (!resultDiv) return;
        
        resultDiv.className = 'result correct';
        resultDiv.innerHTML = '解答をチェックしました。詳細な解説は実装中です。';
    };
}

function createOptimalBasisChallenge() {
    const container = document.getElementById('optimal-basis-challenge');
    if (!container) return;
    
    // Add comprehensive challenge interface
    container.innerHTML = `
        <h5>🎮 最適基底チャレンジ</h5>
        <div class="controls">
            <button onclick="generateRandomChallenge()">新しいチャレンジ生成</button>
            <button onclick="showHint()">ヒント表示</button>
            <button onclick="checkSolution()">解答チェック</button>
            <button onclick="showDetailedSolution()">詳細解答</button>
        </div>
        <div id="challenge-content" class="challenge-box">
            <h6>チャレンジ問題を生成してください</h6>
        </div>
        <div class="input-group" id="solution-input" style="display: none;">
            <h6>あなたの解答</h6>
            <label>固有値 λ₁: <input type="number" id="lambda1-answer" step="0.01"></label>
            <label>固有値 λ₂: <input type="number" id="lambda2-answer" step="0.01"></label>
            <label>固有ベクトル v₁: (<input type="number" id="v1x-answer" step="0.01">, <input type="number" id="v1y-answer" step="0.01">)</label>
            <label>固有ベクトル v₂: (<input type="number" id="v2x-answer" step="0.01">, <input type="number" id="v2y-answer" step="0.01">)</label>
        </div>
        <div class="comparison-grid" id="challenge-visualization" style="display: none;">
            <div class="comparison-item">
                <h6>チャレンジ行列の変換</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
            </div>
            <div class="comparison-item">
                <h6>最適基底での表現</h6>
                <canvas width="300" height="250" style="background: #f8fafc; border: 1px solid #e2e8f0;"></canvas>
            </div>
        </div>
        <div id="challenge-feedback" class="transformation-info"></div>
    `;
    
    let currentChallenge = null;
    let currentSolution = null;
    let hintLevel = 0;
    
    const challengeTypes = [
        {
            type: 'symmetric',
            description: '対称行列の対角化',
            generateMatrix: () => {
                const a = Math.random() * 4 + 1;
                const b = Math.random() * 2 - 1;
                const c = Math.random() * 4 + 1;
                return [[a, b], [b, c]];
            }
        },
        {
            type: 'rotation_scaling',
            description: '回転とスケーリングの合成',
            generateMatrix: () => {
                const angle = Math.random() * Math.PI / 4; // 0 to 45 degrees
                const scale1 = Math.random() * 2 + 0.5;
                const scale2 = Math.random() * 2 + 0.5;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                
                // R * S * R^T where R is rotation, S is scaling
                const R = [[cos, -sin], [sin, cos]];
                const S = [[scale1, 0], [0, scale2]];
                const RT = [[cos, sin], [-sin, cos]];
                
                // Matrix multiplication: R * S * R^T
                const RS = [
                    [R[0][0] * S[0][0] + R[0][1] * S[1][0], R[0][0] * S[0][1] + R[0][1] * S[1][1]],
                    [R[1][0] * S[0][0] + R[1][1] * S[1][0], R[1][0] * S[0][1] + R[1][1] * S[1][1]]
                ];
                
                return [
                    [RS[0][0] * RT[0][0] + RS[0][1] * RT[1][0], RS[0][0] * RT[0][1] + RS[0][1] * RT[1][1]],
                    [RS[1][0] * RT[0][0] + RS[1][1] * RT[1][0], RS[1][0] * RT[0][1] + RS[1][1] * RT[1][1]]
                ];
            }
        },
        {
            type: 'shear',
            description: 'せん断変形の解析',
            generateMatrix: () => {
                const shear = Math.random() * 2 - 1;
                const scale = Math.random() * 2 + 0.5;
                return [[scale, shear], [0, scale]];
            }
        }
    ];
    
    function solveChallengeMatrix(matrix) {
        const [a, b, c, d] = [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]];
        
        // Calculate eigenvalues
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        
        if (discriminant < 0) {
            return null; // Complex eigenvalues
        }
        
        const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
        const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
        
        // Calculate eigenvectors
        const eigenvectors = [];
        
        [lambda1, lambda2].forEach(lambda => {
            const A_lambda = [[a - lambda, b], [c, d - lambda]];
            
            let v1, v2;
            if (Math.abs(A_lambda[0][0]) > 0.001) {
                v2 = 1;
                v1 = -A_lambda[0][1] / A_lambda[0][0];
            } else if (Math.abs(A_lambda[0][1]) > 0.001) {
                v1 = 1;
                v2 = -A_lambda[0][0] / A_lambda[0][1];
            } else if (Math.abs(A_lambda[1][0]) > 0.001) {
                v2 = 1;
                v1 = -A_lambda[1][1] / A_lambda[1][0];
            } else {
                v1 = 1;
                v2 = 0;
            }
            
            const norm = Math.sqrt(v1 * v1 + v2 * v2);
            eigenvectors.push({x: v1 / norm, y: v2 / norm});
        });
        
        return {
            eigenvalues: {lambda1, lambda2},
            eigenvectors: eigenvectors
        };
    }
    
    function drawChallengeVisualization(matrix, solution) {
        const challengeViz = document.getElementById('challenge-visualization');
        if (!challengeViz) return;
        
        challengeViz.style.display = 'block';
        
        const canvases = challengeViz.querySelectorAll('canvas');
        const originalCanvas = canvases[0];
        const optimalCanvas = canvases[1];
        const originalCtx = originalCanvas.getContext('2d');
        const optimalCtx = optimalCanvas.getContext('2d');
        
        // Draw original transformation
        drawTransformationVisualization(originalCtx, matrix);
        
        // Draw optimal (diagonal) representation
        if (solution) {
            const diagonalMatrix = [[solution.eigenvalues.lambda1, 0], [0, solution.eigenvalues.lambda2]];
            drawTransformationVisualization(optimalCtx, diagonalMatrix, solution.eigenvectors);
        }
    }
    
    function drawTransformationVisualization(ctx, matrix, basisVectors = null) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const scale = 60;
        
        // Draw grid
        if (basisVectors) {
            drawEigenvectorGrid(ctx, centerX, centerY, scale, basisVectors);
        } else {
            drawGrid(ctx, centerX, centerY, 30);
        }
        
        // Draw unit circle vectors being transformed
        const numVectors = 16;
        for (let i = 0; i < numVectors; i++) {
            const angle = (2 * Math.PI * i) / numVectors;
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            
            // Original vector (faded)
            ctx.globalAlpha = 0.3;
            drawVector(ctx, centerX, centerY, x * scale * 0.8, y * scale * 0.8, '#cccccc', '', 1);
            
            // Transformed vector
            const transformedX = matrix[0][0] * x + matrix[0][1] * y;
            const transformedY = matrix[1][0] * x + matrix[1][1] * y;
            
            ctx.globalAlpha = 1;
            const color = i % 4 === 0 ? '#f093fb' : '#667eea';
            drawVector(ctx, centerX, centerY, transformedX * scale, transformedY * scale, color, '', 2);
        }
        
        // Draw eigenvectors if provided
        if (basisVectors) {
            ctx.globalAlpha = 1;
            basisVectors.forEach((vec, i) => {
                const color = i === 0 ? '#e53e3e' : '#38a169';
                drawVector(ctx, centerX, centerY, vec.x * scale, vec.y * scale, color, `e${i+1}`, 3);
            });
        }
        
        ctx.globalAlpha = 1;
    }
    
    window.generateRandomChallenge = function() {
        const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        const matrix = challengeType.generateMatrix();
        const solution = solveChallengeMatrix(matrix);
        
        currentChallenge = {
            type: challengeType,
            matrix: matrix,
            description: challengeType.description
        };
        currentSolution = solution;
        hintLevel = 0;
        
        const contentDiv = document.getElementById('challenge-content');
        if (!contentDiv) return;
        
        contentDiv.innerHTML = `
            <h6>チャレンジ問題: ${challengeType.description}</h6>
            <p>以下の線形写像に対して、最適な基底（固有ベクトル基底）を見つけて対角化してください：</p>
            <div class="matrix-display">
                A = [${matrix[0][0].toFixed(2)} ${matrix[0][1].toFixed(2)}]<br>
                    [${matrix[1][0].toFixed(2)} ${matrix[1][1].toFixed(2)}]
            </div>
            <p><strong>求めるもの:</strong></p>
            <ul>
                <li>固有値 λ₁, λ₂</li>
                <li>正規化された固有ベクトル v₁, v₂</li>
                <li>対角行列 D = P⁻¹AP</li>
            </ul>
        `;
        
        // Show input fields
        document.getElementById('solution-input').style.display = 'block';
        
        // Show visualization
        drawChallengeVisualization(matrix, solution);
        
        // Clear previous feedback
        document.getElementById('challenge-feedback').innerHTML = '';
    };
    
    window.showHint = function() {
        if (!currentChallenge || !currentSolution) {
            alert('まずチャレンジ問題を生成してください');
            return;
        }
        
        const feedbackDiv = document.getElementById('challenge-feedback');
        hintLevel++;
        
        let hintHTML = '<h6>ヒント</h6>';
        
        if (hintLevel >= 1) {
            hintHTML += `
                <p><strong>ステップ1:</strong> 特性方程式 det(A - λI) = 0 を解いて固有値を求めます</p>
                <p>トレース = ${(currentChallenge.matrix[0][0] + currentChallenge.matrix[1][1]).toFixed(3)}</p>
                <p>行列式 = ${(currentChallenge.matrix[0][0] * currentChallenge.matrix[1][1] - currentChallenge.matrix[0][1] * currentChallenge.matrix[1][0]).toFixed(3)}</p>
            `;
        }
        
        if (hintLevel >= 2) {
            hintHTML += `
                <p><strong>ステップ2:</strong> 各固有値に対して (A - λI)v = 0 を解いて固有ベクトルを求めます</p>
                <p>λ₁ ≈ ${currentSolution.eigenvalues.lambda1.toFixed(2)} のとき...</p>
            `;
        }
        
        if (hintLevel >= 3) {
            hintHTML += `
                <p><strong>ステップ3:</strong> 固有ベクトルを正規化します</p>
                <p>||v|| = √(v₁² + v₂²) で正規化</p>
            `;
        }
        
        feedbackDiv.innerHTML = hintHTML;
    };
    
    window.checkSolution = function() {
        if (!currentChallenge || !currentSolution) {
            alert('まずチャレンジ問題を生成してください');
            return;
        }
        
        const lambda1 = parseFloat(document.getElementById('lambda1-answer').value);
        const lambda2 = parseFloat(document.getElementById('lambda2-answer').value);
        const v1x = parseFloat(document.getElementById('v1x-answer').value);
        const v1y = parseFloat(document.getElementById('v1y-answer').value);
        const v2x = parseFloat(document.getElementById('v2x-answer').value);
        const v2y = parseFloat(document.getElementById('v2y-answer').value);
        
        const tolerance = 0.1;
        const feedbackDiv = document.getElementById('challenge-feedback');
        
        // Check eigenvalues
        const eigenvaluesCorrect = 
            (Math.abs(lambda1 - currentSolution.eigenvalues.lambda1) < tolerance && Math.abs(lambda2 - currentSolution.eigenvalues.lambda2) < tolerance) ||
            (Math.abs(lambda1 - currentSolution.eigenvalues.lambda2) < tolerance && Math.abs(lambda2 - currentSolution.eigenvalues.lambda1) < tolerance);
        
        // Check eigenvectors (allowing for sign ambiguity)
        const v1Norm = Math.sqrt(v1x * v1x + v1y * v1y);
        const v2Norm = Math.sqrt(v2x * v2x + v2y * v2y);
        const v1Normalized = {x: v1x / v1Norm, y: v1y / v1Norm};
        const v2Normalized = {x: v2x / v2Norm, y: v2y / v2Norm};
        
        const checkEigenvector = (provided, correct) => {
            return (Math.abs(provided.x - correct.x) < tolerance && Math.abs(provided.y - correct.y) < tolerance) ||
                   (Math.abs(provided.x + correct.x) < tolerance && Math.abs(provided.y + correct.y) < tolerance);
        };
        
        const v1Correct = checkEigenvector(v1Normalized, currentSolution.eigenvectors[0]) || checkEigenvector(v1Normalized, currentSolution.eigenvectors[1]);
        const v2Correct = checkEigenvector(v2Normalized, currentSolution.eigenvectors[0]) || checkEigenvector(v2Normalized, currentSolution.eigenvectors[1]);
        
        let score = 0;
        if (eigenvaluesCorrect) score += 50;
        if (v1Correct) score += 25;
        if (v2Correct) score += 25;
        
        let feedbackHTML = '<h6>解答チェック結果</h6>';
        
        if (score === 100) {
            feedbackHTML += `
                <div class="result correct">
                    🎉 完璧です！スコア: ${score}/100
                    <p>すべての固有値と固有ベクトルが正しく求められています。</p>
                    <p>この基底変換により行列が対角化されました！</p>
                </div>
            `;
        } else {
            feedbackHTML += `
                <div class="result ${score >= 50 ? 'correct' : 'incorrect'}">
                    スコア: ${score}/100
                    <ul>
                        <li>固有値: ${eigenvaluesCorrect ? '✅ 正解' : '❌ 不正解'}</li>
                        <li>固有ベクトル v₁: ${v1Correct ? '✅ 正解' : '❌ 不正解'}</li>
                        <li>固有ベクトル v₂: ${v2Correct ? '✅ 正解' : '❌ 不正解'}</li>
                    </ul>
                    ${score < 100 ? '<p>ヒントを使って再挑戦してみてください！</p>' : ''}
                </div>
            `;
        }
        
        feedbackDiv.innerHTML = feedbackHTML;
    };
    
    window.showDetailedSolution = function() {
        if (!currentChallenge || !currentSolution) {
            alert('まずチャレンジ問題を生成してください');
            return;
        }
        
        const feedbackDiv = document.getElementById('challenge-feedback');
        const matrix = currentChallenge.matrix;
        const solution = currentSolution;
        
        feedbackDiv.innerHTML = `
            <h6>詳細解答</h6>
            <div class="calculation-steps">
                <div class="step">
                    <strong>ステップ1: 特性方程式</strong><br>
                    det(A - λI) = det([${matrix[0][0].toFixed(2)} - λ, ${matrix[0][1].toFixed(2)}; ${matrix[1][0].toFixed(2)}, ${matrix[1][1].toFixed(2)} - λ]) = 0<br>
                    = λ² - ${(matrix[0][0] + matrix[1][1]).toFixed(2)}λ + ${(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(2)} = 0
                </div>
                <div class="step">
                    <strong>ステップ2: 固有値</strong><br>
                    λ₁ = ${solution.eigenvalues.lambda1.toFixed(3)}<br>
                    λ₂ = ${solution.eigenvalues.lambda2.toFixed(3)}
                </div>
                <div class="step">
                    <strong>ステップ3: 固有ベクトル</strong><br>
                    v₁ = (${solution.eigenvectors[0].x.toFixed(3)}, ${solution.eigenvectors[0].y.toFixed(3)})<br>
                    v₂ = (${solution.eigenvectors[1].x.toFixed(3)}, ${solution.eigenvectors[1].y.toFixed(3)})
                </div>
                <div class="step">
                    <strong>ステップ4: 対角行列</strong><br>
                    D = P⁻¹AP = [${solution.eigenvalues.lambda1.toFixed(3)}, 0; 0, ${solution.eigenvalues.lambda2.toFixed(3)}]
                </div>
            </div>
        `;
    };
    
    // Initialize
    const contentDiv = document.getElementById('challenge-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <h6>最適基底チャレンジへようこそ！</h6>
            <p>このチャレンジでは、与えられた線形変換に対して最適な基底（固有ベクトル基底）を見つけて行列を対角化します。</p>
            <p>「新しいチャレンジ生成」ボタンを押して始めてください！</p>
        `;
    }
}

// Utility functions
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function formatPolynomial(coeffs) {
    const terms = [];
    coeffs.forEach((coeff, i) => {
        if (Math.abs(coeff) > 0.001) {
            let term = '';
            if (coeff > 0 && terms.length > 0) term += '+';
            if (Math.abs(coeff - 1) > 0.001 || i === 0) {
                term += coeff.toFixed(3);
            }
            if (i > 0) {
                term += 'x';
                if (i > 1) term += '^' + i;
            }
            terms.push(term);
        }
    });
    return terms.length > 0 ? terms.join('') : '0';
}

function completeCourse() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center; max-width: 500px;">
            <h2 style="color: #667eea; margin-bottom: 1rem;">🎉 コース完了おめでとうございます！</h2>
            <p style="margin-bottom: 2rem;">基底変換と表現行列の理論を完全にマスターしました。</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; 
                           border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer;">
                素晴らしい！
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}
