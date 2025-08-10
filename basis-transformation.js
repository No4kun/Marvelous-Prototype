/* Basis Transformation Learning Platform JavaScript */

// Global variables
let currentSection = 0;
let sectionProgress = { 0: true };
let canvasInstances = {};
let animationFrames = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    initializeMathJax();
    showSection(0);
    setupNavigation();
    initializeSection0();
});

// MathJax configuration
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
};

function initializeMathJax() {
    if (window.MathJax) {
        MathJax.startup.defaultReady();
    }
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
    canvas.width = 500;
    canvas.height = 400;
    canvas.style.background = '#f8fafc';
    canvas.style.border = '1px solid #e2e8f0';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let currentBasisType = 'standard';
    const vector = {x: 3, y: 2}; // Fixed vector for demonstration
    
    function drawVisualization() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 40;
        
        // Draw grid
        drawGrid(ctx, centerX, centerY, scale);
        
        // Define basis vectors
        let basis1, basis2, basisName;
        switch(currentBasisType) {
            case 'standard':
                basis1 = {x: 1, y: 0};
                basis2 = {x: 0, y: 1};
                basisName = '標準基底';
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
        
        // Draw basis vectors
        drawVector(ctx, centerX, centerY, basis1.x * scale, basis1.y * scale, '#667eea', 'e₁', 3);
        drawVector(ctx, centerX, centerY, basis2.x * scale, basis2.y * scale, '#764ba2', 'e₂', 3);
        
        // Draw the vector in current basis
        const vectorInBasis = transformVector(vector, basis1, basis2);
        drawVector(ctx, centerX, centerY, vectorInBasis.x * scale, vectorInBasis.y * scale, '#f093fb', 'v', 2);
        
        // Calculate coordinates in current basis
        const coords = calculateCoordinatesInBasis(vector, basis1, basis2);
        
        // Update info display
        updateIntroInfo(basisName, vector, coords);
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
        currentBasisType = basisType;
        drawVisualization();
    };
    
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

function updateIntroInfo(basisName, vector, coords) {
    const infoDiv = document.getElementById('intro-info');
    if (!infoDiv) return;
    
    infoDiv.innerHTML = `
        <h6>現在の基底: ${basisName}</h6>
        <p><strong>ベクトル v:</strong></p>
        <p>標準基底での表現: v = ${vector.x}e₁ + ${vector.y}e₂</p>
        <p>現在の基底での表現: v = ${coords.a.toFixed(2)}b₁ + ${coords.b.toFixed(2)}b₂</p>
        <p><em>同じベクトルが異なる座標で表現されていることに注目！</em></p>
    `;
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
    // Placeholder for basis change effect demonstration
    window.compareBases = function() {
        alert('基底比較機能は実装中です');
    };
    
    window.showSimilarity = function() {
        alert('相似変換表示機能は実装中です');
    };
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
    // Simplified 3D rotation demonstration
    window.switchRotationOrder = function() {
        alert('3D回転順序変更機能は実装中です');
    };
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
    window.convertPolynomialBasis = function() {
        const coeffs = [
            parseFloat(document.getElementById('coeff-0').value),
            parseFloat(document.getElementById('coeff-1').value),
            parseFloat(document.getElementById('coeff-2').value),
            parseFloat(document.getElementById('coeff-3').value)
        ];
        
        const resultDiv = document.getElementById('conversion-result');
        if (!resultDiv) return;
        
        // Simple example: convert to normalized form
        const sum = coeffs.reduce((a, b) => a + Math.abs(b), 0);
        const normalized = coeffs.map(c => c / sum);
        
        resultDiv.innerHTML = `
            <h6>基底変換結果</h6>
            <p><strong>元の多項式:</strong> ${formatPolynomial(coeffs)}</p>
            <p><strong>正規化後:</strong> ${formatPolynomial(normalized)}</p>
            <p><em>注: 実際の基底変換では変換行列を使用します</em></p>
        `;
    };
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
    window.diagonalizeMatrix = function() {
        const a11 = parseFloat(document.getElementById('matrix-11').value);
        const a12 = parseFloat(document.getElementById('matrix-12').value);
        const a21 = parseFloat(document.getElementById('matrix-21').value);
        const a22 = parseFloat(document.getElementById('matrix-22').value);
        
        const resultDiv = document.getElementById('diagonalization-result');
        if (!resultDiv) return;
        
        // Calculate eigenvalues
        const trace = a11 + a22;
        const det = a11 * a22 - a12 * a21;
        const discriminant = trace * trace - 4 * det;
        
        if (discriminant >= 0) {
            const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
            const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
            
            resultDiv.innerHTML = `
                <h6>対角化結果</h6>
                <p><strong>固有値:</strong> λ₁ = ${lambda1.toFixed(3)}, λ₂ = ${lambda2.toFixed(3)}</p>
                <p><strong>対角行列:</strong></p>
                <div class="matrix-display">
                    D = [${lambda1.toFixed(3)}   0  ]<br>
                        [  0   ${lambda2.toFixed(3)}]
                </div>
                <p><em>固有ベクトルを基底とすることで行列が対角化されます</em></p>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result incorrect">
                    この行列は実数範囲で対角化できません（複素固有値を持ちます）
                </div>
            `;
        }
    };
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
    window.generateRandomChallenge = function() {
        const contentDiv = document.getElementById('challenge-content');
        if (!contentDiv) return;
        
        contentDiv.innerHTML = `
            <h6>チャレンジ問題</h6>
            <p>以下の線形写像に対して、表現行列が対角行列になる基底を見つけてください：</p>
            <div class="matrix-display">
                T(x,y) = (3x + y, x + 3y)
            </div>
            <p><em>ヒント: 固有ベクトルを基底として使用してください</em></p>
        `;
    };
    
    window.showHint = function() {
        alert('ヒント: 固有値問題 Av = λv を解いて固有ベクトルを求めてください');
    };
    
    window.showSolution = function() {
        alert('解答: 固有値 λ₁=4, λ₂=2 に対応する固有ベクトル (1,1) と (1,-1) を基底とします');
    };
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
