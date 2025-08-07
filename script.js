// Marvelous Learning Platform - JavaScript Functionality

// Mathematical computations and visualizations
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    svg: {
        fontCache: 'global'
    }
};

// Global variables
let canvas;
let currentMatrix = [[1.5, 0.5], [0.5, 1.5]];
let isAnimating = false;
let animationProgress = 0;
let gridSize = 20;
let gridLines = [];
let identityMatrix = [[1, 0], [0, 1]];
let animationSpeed = 0.02;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeVisualization();
    initializeSliders();
    calculateCurrentEigenvalues();
});

// Navigation functionality
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            
            // Update active navigation
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Initialize visualization if needed
            if (targetSection === 'visualization' && canvas) {
                redraw();
            }
        });
    });
}

// P5.js setup and visualization
function setup() {
    canvas = createCanvas(600, 450);
    canvas.parent('canvas-container');
    
    // Initialize grid lines
    initializeGrid();
    
    // Set initial colors and styles
    background(15, 15, 25);
    redraw();
}

function initializeGrid() {
    gridLines = [];
    let range = 12;
    let step = 1;
    
    // Vertical lines
    for (let x = -range; x <= range; x += step) {
        gridLines.push({
            type: 'vertical',
            value: x,
            points: []
        });
        for (let y = -range; y <= range; y += 0.5) {
            gridLines[gridLines.length - 1].points.push(createVector(x, y));
        }
    }
    
    // Horizontal lines
    for (let y = -range; y <= range; y += step) {
        gridLines.push({
            type: 'horizontal',
            value: y,
            points: []
        });
        for (let x = -range; x <= range; x += 0.5) {
            gridLines[gridLines.length - 1].points.push(createVector(x, y));
        }
    }
}

function draw() {
    background(15, 15, 25); // 3Blue1Brown style dark background
    translate(width/2, height/2);
    scale(gridSize);
    
    if (isAnimating) {
        animationProgress += animationSpeed;
        if (animationProgress >= 1) {
            animationProgress = 1;
            isAnimating = false;
        }
    }
    
    // Calculate interpolated matrix for smooth animation
    let displayMatrix = interpolateMatrix(identityMatrix, currentMatrix, animationProgress);
    
    // Draw grid
    drawAnimatedGrid(displayMatrix);
    
    // Draw basis vectors
    drawBasisVectors(displayMatrix);
    
    // Draw eigenspaces if they exist
    drawEigenspaces(displayMatrix);
    
    if (!isAnimating) {
        noLoop();
    }
}

function drawAnimatedGrid(matrix) {
    // Draw grid lines
    gridLines.forEach(line => {
        if (line.type === 'vertical' && Math.abs(line.value) <= 8) {
            stroke(70, 130, 180, 80); // Blue grid lines
            if (line.value === 0) {
                stroke(70, 130, 180, 160); // Brighter for y-axis
                strokeWeight(0.08);
            } else {
                strokeWeight(0.04);
            }
            
            noFill();
            beginShape();
            line.points.forEach(point => {
                let transformed = transformVector(point, matrix);
                vertex(transformed.x, transformed.y);
            });
            endShape();
        }
        
        if (line.type === 'horizontal' && Math.abs(line.value) <= 8) {
            stroke(70, 130, 180, 80);
            if (line.value === 0) {
                stroke(70, 130, 180, 160); // Brighter for x-axis
                strokeWeight(0.08);
            } else {
                strokeWeight(0.04);
            }
            
            noFill();
            beginShape();
            line.points.forEach(point => {
                let transformed = transformVector(point, matrix);
                vertex(transformed.x, transformed.y);
            });
            endShape();
        }
    });
}

function drawBasisVectors(matrix) {
    // i-hat (red) - x-axis basis vector
    let iHat = transformVector(createVector(1, 0), matrix);
    stroke(240, 80, 80);
    strokeWeight(0.15);
    drawVectorWithArrow(createVector(0, 0), iHat, color(240, 80, 80));
    
    // j-hat (green) - y-axis basis vector
    let jHat = transformVector(createVector(0, 1), matrix);
    stroke(80, 240, 80);
    strokeWeight(0.15);
    drawVectorWithArrow(createVector(0, 0), jHat, color(80, 240, 80));
    
    // Labels
    fill(240, 80, 80);
    textAlign(CENTER);
    textSize(0.4);
    text("î", iHat.x + 0.5, iHat.y + 0.2);
    
    fill(80, 240, 80);
    text("ĵ", jHat.x + 0.5, jHat.y + 0.2);
}

function drawVectorWithArrow(start, end, col) {
    push();
    stroke(col);
    line(start.x, start.y, end.x, end.y);
    
    // Arrow head
    push();
    translate(end.x, end.y);
    let angle = atan2(end.y - start.y, end.x - start.x);
    rotate(angle);
    
    fill(col);
    noStroke();
    triangle(0, 0, -0.4, -0.15, -0.4, 0.15);
    pop();
    pop();
}

function drawEigenspaces(matrix) {
    let eigenInfo = calculateEigenvalues([[matrix[0][0], matrix[0][1]], [matrix[1][0], matrix[1][1]]]);
    
    if (eigenInfo.eigenvalues.length > 0 && typeof eigenInfo.eigenvalues[0] === 'number') {
        eigenInfo.eigenvectors.forEach((ev, i) => {
            if (ev && !isNaN(ev.x) && !isNaN(ev.y)) {
                // Draw eigenspace line
                stroke(255, 220, 100, 120);
                strokeWeight(0.08);
                let scale = 15;
                line(-ev.x * scale, -ev.y * scale, ev.x * scale, ev.y * scale);
                
                // Draw eigenvector
                stroke(255, 220, 100, 200);
                strokeWeight(0.2);
                let eigenVectorScale = eigenInfo.eigenvalues[i] > 0 ? Math.abs(eigenInfo.eigenvalues[i]) : 1;
                let eigenVector = createVector(ev.x * eigenVectorScale * 2, ev.y * eigenVectorScale * 2);
                drawVectorWithArrow(createVector(0, 0), eigenVector, color(255, 220, 100));
                
                // Label
                fill(255, 220, 100);
                textAlign(CENTER);
                textSize(0.3);
                text(`λ${i+1}=${eigenInfo.eigenvalues[i].toFixed(2)}`, ev.x * 3, ev.y * 3 - 0.3);
            }
        });
    }
}

function interpolateMatrix(matrixA, matrixB, t) {
    return [
        [lerp(matrixA[0][0], matrixB[0][0], t), lerp(matrixA[0][1], matrixB[0][1], t)],
        [lerp(matrixA[1][0], matrixB[1][0], t), lerp(matrixA[1][1], matrixB[1][1], t)]
    ];
}

function transformVector(v, matrix) {
    let x = matrix[0][0] * v.x + matrix[0][1] * v.y;
    let y = matrix[1][0] * v.x + matrix[1][1] * v.y;
    return createVector(x, y);
}

// Slider initialization
function initializeSliders() {
    const sliders = ['a11', 'a12', 'a21', 'a22'];
    
    sliders.forEach(id => {
        const slider = document.getElementById(id + '-slider');
        const valueSpan = document.getElementById(id + '-value');
        
        slider.addEventListener('input', function() {
            valueSpan.textContent = this.value;
            updateMatrix();
        });
    });
}

function updateMatrix() {
    currentMatrix[0][0] = parseFloat(document.getElementById('a11-slider').value);
    currentMatrix[0][1] = parseFloat(document.getElementById('a12-slider').value);
    currentMatrix[1][0] = parseFloat(document.getElementById('a21-slider').value);
    currentMatrix[1][1] = parseFloat(document.getElementById('a22-slider').value);
    
    calculateCurrentEigenvalues();
    if (canvas) {
        loop();
        setTimeout(() => noLoop(), 100);
    }
}

// Matrix calculations
function calculateEigenvalues(matrix) {
    let a = matrix[0][0];
    let b = matrix[0][1];
    let c = matrix[1][0];
    let d = matrix[1][1];
    
    // Characteristic polynomial: λ² - (a+d)λ + (ad-bc) = 0
    let trace = a + d;
    let det = a * d - b * c;
    
    let discriminant = trace * trace - 4 * det;
    
    let eigenvalues = [];
    let eigenvectors = [];
    
    if (discriminant >= 0) {
        let lambda1 = (trace + Math.sqrt(discriminant)) / 2;
        let lambda2 = (trace - Math.sqrt(discriminant)) / 2;
        
        eigenvalues = [lambda1, lambda2];
        
        // Calculate eigenvectors
        eigenvalues.forEach(lambda => {
            let ev = calculateEigenvector(matrix, lambda);
            eigenvectors.push(ev);
        });
    } else {
        // Complex eigenvalues
        let real = trace / 2;
        let imag = Math.sqrt(-discriminant) / 2;
        eigenvalues = [
            { real: real, imag: imag },
            { real: real, imag: -imag }
        ];
    }
    
    return { eigenvalues, eigenvectors };
}

function calculateEigenvector(matrix, eigenvalue) {
    let a = matrix[0][0] - eigenvalue;
    let b = matrix[0][1];
    let c = matrix[1][0];
    let d = matrix[1][1] - eigenvalue;
    
    // Solve (A - λI)v = 0
    if (Math.abs(b) > 1e-10) {
        // Use first row: ax + by = 0 → y = -ax/b
        let x = 1;
        let y = -a / b;
        let norm = Math.sqrt(x * x + y * y);
        return { x: x / norm, y: y / norm };
    } else if (Math.abs(c) > 1e-10) {
        // Use second row: cx + dy = 0 → y = -cx/d
        let x = 1;
        let y = -c / d;
        let norm = Math.sqrt(x * x + y * y);
        return { x: x / norm, y: y / norm };
    } else {
        // Special case - return null for degenerate case
        return null;
    }
}

function calculateCurrentEigenvalues() {
    let eigenInfo = calculateEigenvalues(currentMatrix);
    
    let resultHtml = '<h5>現在の行列:</h5>';
    resultHtml += `<div class="math-center">\\[\\begin{pmatrix} ${currentMatrix[0][0]} & ${currentMatrix[0][1]} \\\\ ${currentMatrix[1][0]} & ${currentMatrix[1][1]} \\end{pmatrix}\\]</div>`;
    
    resultHtml += '<h5>固有値:</h5>';
    if (eigenInfo.eigenvalues.length > 0 && typeof eigenInfo.eigenvalues[0] === 'number') {
        resultHtml += `<p>λ₁ = ${eigenInfo.eigenvalues[0].toFixed(3)}, λ₂ = ${eigenInfo.eigenvalues[1].toFixed(3)}</p>`;
        
        resultHtml += '<h5>固有ベクトル:</h5>';
        eigenInfo.eigenvectors.forEach((ev, i) => {
            if (ev) {
                resultHtml += `<p>v₍${i+1}₎ = (${ev.x.toFixed(3)}, ${ev.y.toFixed(3)})</p>`;
            }
        });
    } else if (eigenInfo.eigenvalues.length > 0) {
        resultHtml += `<p>複素固有値: ${eigenInfo.eigenvalues[0].real.toFixed(3)} ± ${eigenInfo.eigenvalues[0].imag.toFixed(3)}i</p>`;
        resultHtml += '<p>この行列は回転成分を含んでいます。</p>';
    }
    
    document.getElementById('current-eigeninfo').innerHTML = resultHtml;
    
    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById('current-eigeninfo')]);
    }
}

// Animation functions
function animateTransformation() {
    if (!canvas) return;
    
    animationProgress = 0;
    isAnimating = true;
    loop();
}

function resetVisualization() {
    // Reset sliders
    document.getElementById('a11-slider').value = 1.5;
    document.getElementById('a12-slider').value = 0.5;
    document.getElementById('a21-slider').value = 0.5;
    document.getElementById('a22-slider').value = 1.5;
    
    // Update displays
    document.getElementById('a11-value').textContent = '1.5';
    document.getElementById('a12-value').textContent = '0.5';
    document.getElementById('a21-value').textContent = '0.5';
    document.getElementById('a22-value').textContent = '1.5';
    
    updateMatrix();
    
    // Reset animation
    animationProgress = 0;
    isAnimating = false;
    redraw();
}

// Matrix input calculation
function calculateEigenvaluesFromInput() {
    let a11 = parseFloat(document.getElementById('a11').value);
    let a12 = parseFloat(document.getElementById('a12').value);
    let a21 = parseFloat(document.getElementById('a21').value);
    let a22 = parseFloat(document.getElementById('a22').value);
    
    // 入力値の検証
    if (isNaN(a11) || isNaN(a12) || isNaN(a21) || isNaN(a22)) {
        document.getElementById('eigenvalue-result').innerHTML = '<p style="color: red;">すべての値を正しく入力してください。</p>';
        return;
    }
    
    let matrix = [[a11, a12], [a21, a22]];
    let eigenInfo = calculateEigenvalues(matrix);
    
    let resultHtml = '<div class="calculation-steps">';
    
    // ステップ1: 行列の表示
    resultHtml += '<div class="step">';
    resultHtml += '<h5>ステップ1: 与えられた行列</h5>';
    resultHtml += `<div class="math-center">\\[A = \\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}\\]</div>`;
    resultHtml += '</div>';
    
    // ステップ2: 特性行列の構築
    resultHtml += '<div class="step">';
    resultHtml += '<h5>ステップ2: 特性行列 A - λI の構築</h5>';
    resultHtml += `<div class="math-center">\\[A - \\lambda I = \\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix} - \\lambda \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} ${a11} - \\lambda & ${a12} \\\\ ${a21} & ${a22} - \\lambda \\end{pmatrix}\\]</div>`;
    resultHtml += '</div>';
    
    // ステップ3: 特性方程式
    let trace = a11 + a22;
    let det = a11 * a22 - a12 * a21;
    let discriminant = trace * trace - 4 * det;
    
    resultHtml += '<div class="step">';
    resultHtml += '<h5>ステップ3: 特性方程式 det(A - λI) = 0</h5>';
    resultHtml += `<div class="math-center">\\[\\det\\begin{pmatrix} ${a11} - \\lambda & ${a12} \\\\ ${a21} & ${a22} - \\lambda \\end{pmatrix} = (${a11} - \\lambda)(${a22} - \\lambda) - (${a12})(${a21}) = 0\\]</div>`;
    resultHtml += `<div class="math-center">\\[\\lambda^2 - ${trace}\\lambda + ${det.toFixed(4)} = 0\\]</div>`;
    resultHtml += `<p><strong>跡 (trace):</strong> tr(A) = ${a11} + ${a22} = ${trace}</p>`;
    resultHtml += `<p><strong>行列式 (determinant):</strong> det(A) = ${a11} × ${a22} - ${a12} × ${a21} = ${det.toFixed(4)}</p>`;
    resultHtml += `<p><strong>判別式:</strong> Δ = ${trace}² - 4 × ${det.toFixed(4)} = ${discriminant.toFixed(4)}</p>`;
    resultHtml += '</div>';
    
    if (eigenInfo.eigenvalues.length > 0 && typeof eigenInfo.eigenvalues[0] === 'number') {
        // ステップ4: 固有値の解
        resultHtml += '<div class="step">';
        resultHtml += '<h5>ステップ4: 固有値の計算</h5>';
        resultHtml += `<div class="math-center">\\[\\lambda = \\frac{${trace} \\pm \\sqrt{${discriminant.toFixed(4)}}}{2} = \\frac{${trace} \\pm ${Math.sqrt(discriminant).toFixed(4)}}{2}\\]</div>`;
        resultHtml += `<div class="eigenvalue-results">`;
        resultHtml += `<p><strong>λ₁ = ${eigenInfo.eigenvalues[0].toFixed(4)}</strong></p>`;
        resultHtml += `<p><strong>λ₂ = ${eigenInfo.eigenvalues[1].toFixed(4)}</strong></p>`;
        resultHtml += '</div>';
        resultHtml += '</div>';
        
        // ステップ5: 固有ベクトルの計算
        resultHtml += '<div class="step">';
        resultHtml += '<h5>ステップ5: 固有ベクトルの計算</h5>';
        eigenInfo.eigenvectors.forEach((ev, i) => {
            if (ev) {
                let lambda = eigenInfo.eigenvalues[i];
                resultHtml += `<p><strong>λ${i+1} = ${lambda.toFixed(4)} に対して:</strong></p>`;
                resultHtml += `<div class="math-center">\\[(A - ${lambda.toFixed(4)}I)\\mathbf{v} = \\mathbf{0}\\]</div>`;
                resultHtml += `<div class="math-center">\\[\\begin{pmatrix} ${(a11-lambda).toFixed(3)} & ${a12} \\\\ ${a21} & ${(a22-lambda).toFixed(3)} \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}\\]</div>`;
                resultHtml += `<p><strong>固有ベクトル:</strong> v₍${i+1}₎ = (${ev.x.toFixed(4)}, ${ev.y.toFixed(4)})</p>`;
            }
        });
        resultHtml += '</div>';
        
        // 幾何学的解釈
        resultHtml += '<div class="step interpretation">';
        resultHtml += '<h5>🎯 幾何学的解釈</h5>';
        if (eigenInfo.eigenvalues[0] > 0 && eigenInfo.eigenvalues[1] > 0) {
            resultHtml += '<p><strong>変換の性質:</strong> 両固有値が正 → 各固有方向に拡大変換</p>';
        } else if (eigenInfo.eigenvalues[0] < 0 && eigenInfo.eigenvalues[1] < 0) {
            resultHtml += '<p><strong>変換の性質:</strong> 両固有値が負 → 拡大＋原点対称変換</p>';
        } else {
            resultHtml += '<p><strong>変換の性質:</strong> 固有値の符号が異なる → 双曲的変換（鞍点型）</p>';
        }
        resultHtml += `<p><strong>面積の変化:</strong> det(A) = ${det.toFixed(4)} → 面積は ${Math.abs(det).toFixed(4)} 倍になる</p>`;
        resultHtml += '</div>';
        
    } else if (eigenInfo.eigenvalues.length > 0) {
        resultHtml += '<div class="step">';
        resultHtml += '<h5>ステップ4: 複素固有値</h5>';
        resultHtml += `<div class="math-center">\\[\\lambda = ${eigenInfo.eigenvalues[0].real.toFixed(4)} \\pm ${eigenInfo.eigenvalues[0].imag.toFixed(4)}i\\]</div>`;
        resultHtml += '<div class="step interpretation">';
        resultHtml += '<h5>🎯 幾何学的解釈</h5>';
        resultHtml += '<p><strong>変換の性質:</strong> この行列は回転成分を含む変換です。</p>';
        resultHtml += '<p>実部は拡大率、虚部は回転の強さを表します。</p>';
        resultHtml += '</div>';
        resultHtml += '</div>';
    }
    
    resultHtml += '</div>'; // Close calculation-steps
    
    document.getElementById('eigenvalue-result').innerHTML = resultHtml;
    
    // Re-render MathJax
    if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById('eigenvalue-result')]);
    }
}

// Solution toggle functionality
function toggleSolution(problemNumber) {
    const solution = document.getElementById(`solution-${problemNumber}`);
    solution.classList.toggle('show');
    
    // Re-render MathJax for solutions
    if (window.MathJax && solution.classList.contains('show')) {
        MathJax.typesetPromise([solution]);
    }
}

// Check answer functionality for multiple choice questions
function checkAnswer(questionNumber, correctAnswer) {
    const selectedAnswer = document.querySelector(`input[name="q${questionNumber}"]:checked`);
    const feedback = document.getElementById(`feedback-${questionNumber}`);
    
    if (!selectedAnswer) {
        feedback.innerHTML = '<p style="color: orange;">⚠️ 選択肢を選んでください。</p>';
        feedback.className = 'feedback show';
        return;
    }
    
    const userAnswer = selectedAnswer.value;
    
    if (userAnswer === correctAnswer) {
        feedback.innerHTML = '<p style="color: green;">✅ 正解です！素晴らしい理解です。</p>';
        feedback.className = 'feedback show correct';
        
        // Disable further selection for this question
        const allChoices = document.querySelectorAll(`input[name="q${questionNumber}"]`);
        allChoices.forEach(choice => choice.disabled = true);
    } else {
        feedback.innerHTML = '<p style="color: red;">❌ 不正解です。もう一度考えてみてください。</p>';
        feedback.className = 'feedback show incorrect';
    }
}

// Utility functions
function redraw() {
    if (canvas) {
        animationProgress = 1; // Show final state
        
        background(15, 15, 25);
        push();
        translate(width/2, height/2);
        scale(gridSize);
        
        // Draw grid in final state
        drawAnimatedGrid(currentMatrix);
        
        // Draw basis vectors in final state
        drawBasisVectors(currentMatrix);
        
        // Draw eigenspaces
        drawEigenspaces(currentMatrix);
        
        pop();
    }
}

// Initialize visualization when page loads
function initializeVisualization() {
    // This will be called by p5.js setup function
    console.log('Visualization initialized');
}
