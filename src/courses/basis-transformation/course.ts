// Basis Transformation Course - TypeScript Implementation

import type { Vector2D, Matrix2x2, Point2D } from '../../types/index.js';
import { MathUtils, AnimationUtils } from '../../shared/utils.js';

export class BasisTransformationCourse {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private currentSection: number = 0;
  private isAnimating: boolean = false;
  private animationFrame: number = 0;

  // Basis vectors
  private standardBasis: Vector2D[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];

  private customBasis: Vector2D[] = [
    { x: 2, y: 1 },
    { x: 1, y: 2 }
  ];

  // Transformation matrices
  private transformationMatrix: Matrix2x2 = {
    a: 1.5, b: 0.5,
    c: 0.3, d: 1.2
  };

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupCanvas();
    this.setupNavigation();
    this.setupControls();
    this.loadProgress();
    this.showSection(0);
  }

  private setupCanvas(): void {
    this.canvas = document.getElementById('transformation-canvas') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    this.ctx = ctx;
    this.canvas.width = 600;
    this.canvas.height = 400;

    // Setup canvas interactions
    this.setupCanvasInteractions();
  }

  private setupCanvasInteractions(): void {
    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    this.canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to canvas coordinates
    const canvasPoint = this.screenToCanvas({ x, y });
    console.log('Clicked at:', canvasPoint);

    // Handle interactions based on current section
    this.handleSectionInteraction(canvasPoint);
  }

  private handleCanvasMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update cursor based on hover state
    this.updateCursor({ x, y });
  }

  private updateCursor(point: Point2D): void {
    // Change cursor when hovering over interactive elements
    const canvasPoint = this.screenToCanvas(point);
    const isOverBasisVector = this.isPointNearBasisVector(canvasPoint);
    
    this.canvas.style.cursor = isOverBasisVector ? 'pointer' : 'default';
  }

  private isPointNearBasisVector(point: Point2D): boolean {
    const threshold = 20;
    const basisVectors = this.getCurrentBasisVectors();
    
    return basisVectors.some(vector => {
      const screenPoint = this.canvasToScreen(vector);
      return MathUtils.distance(point.x, point.y, screenPoint.x, screenPoint.y) < threshold;
    });
  }

  private getCurrentBasisVectors(): Vector2D[] {
    return this.currentSection <= 1 ? this.standardBasis : this.customBasis;
  }

  private setupNavigation(): void {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.showSection(index);
      });
    });

    // Progress tracking
    this.updateProgress();
  }

  private setupControls(): void {
    // Matrix input controls
    this.setupMatrixControls();
    
    // Animation controls
    this.setupAnimationControls();
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetTransformation());
    }
  }

  private setupMatrixControls(): void {
    const matrixInputs = ['a', 'b', 'c', 'd'];
    
    matrixInputs.forEach(param => {
      const input = document.getElementById(`matrix-${param}`) as HTMLInputElement;
      if (input) {
        input.addEventListener('input', () => {
          this.updateTransformationMatrix();
          this.redrawCanvas();
        });
      }
    });
  }

  private setupAnimationControls(): void {
    const playBtn = document.getElementById('play-animation');
    const pauseBtn = document.getElementById('pause-animation');
    const speedSlider = document.getElementById('animation-speed') as HTMLInputElement;

    if (playBtn) {
      playBtn.addEventListener('click', () => this.startAnimation());
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.pauseAnimation());
    }

    if (speedSlider) {
      speedSlider.addEventListener('input', () => {
        this.updateAnimationSpeed(parseFloat(speedSlider.value));
      });
    }
  }

  public showSection(sectionIndex: number): void {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      (section as HTMLElement).style.display = 'none';
    });

    // Show target section
    const targetSection = document.getElementById(`section-${sectionIndex}`);
    if (targetSection) {
      targetSection.style.display = 'block';
    }

    // Update navigation
    this.updateNavigation(sectionIndex);

    // Update current section
    this.currentSection = sectionIndex;

    // Render appropriate visualization
    this.renderSection(sectionIndex);

    // Update progress
    this.updateProgress();
  }

  private updateNavigation(activeIndex: number): void {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach((button, index) => {
      button.classList.toggle('active', index === activeIndex);
    });
  }

  private renderSection(sectionIndex: number): void {
    switch (sectionIndex) {
      case 0:
        this.renderIntroduction();
        break;
      case 1:
        this.renderBasisConcept();
        break;
      case 2:
        this.renderBasisTransformation();
        break;
      case 3:
        this.renderMatrixRepresentation();
        break;
      case 4:
        this.renderComposition();
        break;
      case 5:
        this.renderPolynomialSpace();
        break;
      case 6:
        this.renderExercises();
        break;
      default:
        this.renderIntroduction();
    }
  }

  private renderIntroduction(): void {
    this.clearCanvas();
    this.drawGrid();
    this.drawStandardBasis();
    this.drawSampleVector({ x: 3, y: 2 });
    this.addCanvasLabel('基底変換の基本概念', { x: 10, y: 30 });
  }

  private renderBasisConcept(): void {
    this.clearCanvas();
    this.drawGrid();
    this.drawStandardBasis();
    this.drawCustomBasis();
    this.highlightBasisVectors();
  }

  private renderBasisTransformation(): void {
    this.clearCanvas();
    this.drawGrid();
    this.animateBasisTransformation();
  }

  private renderMatrixRepresentation(): void {
    this.clearCanvas();
    this.drawGrid();
    this.drawTransformationMatrix();
    this.showMatrixEquation();
  }

  private renderComposition(): void {
    this.clearCanvas();
    this.drawGrid();
    this.demonstrateComposition();
  }

  private renderPolynomialSpace(): void {
    this.clearCanvas();
    this.drawPolynomialBasis();
    this.showPolynomialTransformation();
  }

  private renderExercises(): void {
    this.clearCanvas();
    this.setupInteractiveExercise();
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid(): void {
    const { ctx, canvas } = this;
    const gridSize = 40;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw axes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
  }

  private drawStandardBasis(): void {
    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    
    if (this.standardBasis[0] && this.standardBasis[1]) {
      this.drawVector(this.standardBasis[0], center, '#ff6b6b', 'e₁');
      this.drawVector(this.standardBasis[1], center, '#4ecdc4', 'e₂');
    }
  }

  private drawCustomBasis(): void {
    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    
    if (this.customBasis[0] && this.customBasis[1]) {
      this.drawVector(this.customBasis[0], center, '#45b7d1', 'v₁');
      this.drawVector(this.customBasis[1], center, '#96ceb4', 'v₂');
    }
  }

  private drawVector(
    vector: Vector2D, 
    origin: Point2D, 
    color: string, 
    label: string
  ): void {
    const scale = 40; // pixels per unit
    const endX = origin.x + vector.x * scale;
    const endY = origin.y - vector.y * scale; // Flip Y for screen coordinates

    // Draw vector line
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Draw arrowhead
    this.drawArrowhead({ x: endX, y: endY }, vector, color);

    // Draw label
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(label, endX + 10, endY - 10);
  }

  private drawArrowhead(tip: Point2D, direction: Vector2D, color: string): void {
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;
    
    const angle = Math.atan2(-direction.y, direction.x); // Flip Y
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(tip.x, tip.y);
    this.ctx.lineTo(
      tip.x - arrowLength * Math.cos(angle - arrowAngle),
      tip.y + arrowLength * Math.sin(angle - arrowAngle)
    );
    this.ctx.lineTo(
      tip.x - arrowLength * Math.cos(angle + arrowAngle),
      tip.y + arrowLength * Math.sin(angle + arrowAngle)
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawSampleVector(vector: Vector2D): void {
    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.drawVector(vector, center, '#ffa726', 'v');
  }

  private highlightBasisVectors(): void {
    // Add glow effect to basis vectors
    this.ctx.shadowColor = '#fff';
    this.ctx.shadowBlur = 10;
    this.drawStandardBasis();
    this.drawCustomBasis();
    this.ctx.shadowBlur = 0;
  }

  private animateBasisTransformation(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = AnimationUtils.easing.easeInOut(progress);

      this.clearCanvas();
      this.drawGrid();

      // Interpolate between standard and custom basis
      const interpolatedBasis = this.standardBasis.map((standardVec, i) => {
        const customVec = this.customBasis[i];
        if (!customVec) return standardVec;
        
        return {
          x: MathUtils.lerp(standardVec.x, customVec.x, easedProgress),
          y: MathUtils.lerp(standardVec.y, customVec.y, easedProgress)
        };
      });

      const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
      
      if (interpolatedBasis[0] && interpolatedBasis[1]) {
        this.drawVector(interpolatedBasis[0], center, '#ff6b6b', 'e₁→v₁');
        this.drawVector(interpolatedBasis[1], center, '#4ecdc4', 'e₂→v₂');
      }

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };

    animate();
  }

  private drawTransformationMatrix(): void {
    const { a, b, c, d } = this.transformationMatrix;
    
    // Apply transformation to standard basis vectors
    const transformedE1 = { x: a, y: c };
    const transformedE2 = { x: b, y: d };

    const center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    
    // Draw original basis (faded)
    this.ctx.globalAlpha = 0.3;
    this.drawStandardBasis();
    this.ctx.globalAlpha = 1.0;

    // Draw transformed basis
    this.drawVector(transformedE1, center, '#e74c3c', 'T(e₁)');
    this.drawVector(transformedE2, center, '#3498db', 'T(e₂)');
  }

  private showMatrixEquation(): void {
    // This would integrate with MathJax to show the matrix equation
    const equation = `
      \\begin{bmatrix} 
        ${this.transformationMatrix.a} & ${this.transformationMatrix.b} \\\\
        ${this.transformationMatrix.c} & ${this.transformationMatrix.d}
      \\end{bmatrix}
    `;
    
    this.updateMathJaxElement('matrix-equation', equation);
  }

  private updateMathJaxElement(elementId: string, equation: string): void {
    const element = document.getElementById(elementId);
    if (element && window.MathJax) {
      element.innerHTML = `\\[${equation}\\]`;
      window.MathJax.typesetPromise([element]);
    }
  }

  private demonstrateComposition(): void {
    // Show composition of transformations
    const firstMatrix = { a: 1.5, b: 0, c: 0, d: 1.5 }; // Scaling
    const secondMatrix = { a: 0, b: -1, c: 1, d: 0 }; // Rotation

    // Show step-by-step composition
    this.animateComposition(firstMatrix, secondMatrix);
  }

  private animateComposition(first: Matrix2x2, second: Matrix2x2): void {
    // Implementation of composition animation
    console.log('Animating composition:', first, second);
  }

  private drawPolynomialBasis(): void {
    // Draw polynomial basis functions
    const functions = ['1', 'x', 'x²', 'x³'];
    
    // This would draw the polynomial functions
    console.log('Drawing polynomial basis:', functions);
  }

  private showPolynomialTransformation(): void {
    // Show how polynomial basis transforms
    console.log('Showing polynomial transformation');
  }

  private setupInteractiveExercise(): void {
    // Setup interactive exercises
    this.addCanvasLabel('インタラクティブな演習', { x: 10, y: 30 });
    this.addCanvasLabel('ベクトルをクリックして変換してみてください', { x: 10, y: 60 });
  }

  private addCanvasLabel(text: string, position: Point2D): void {
    this.ctx.fillStyle = '#333';
    this.ctx.font = '18px Arial';
    this.ctx.fillText(text, position.x, position.y);
  }

  private handleSectionInteraction(point: Point2D): void {
    switch (this.currentSection) {
      case 6: // Exercises
        this.handleExerciseInteraction(point);
        break;
      default:
        break;
    }
  }

  private handleExerciseInteraction(point: Point2D): void {
    // Handle exercise interactions
    console.log('Exercise interaction at:', point);
  }

  private updateTransformationMatrix(): void {
    const getValue = (id: string): number => {
      const input = document.getElementById(id) as HTMLInputElement;
      return parseFloat(input.value) || 0;
    };

    this.transformationMatrix = {
      a: getValue('matrix-a'),
      b: getValue('matrix-b'),
      c: getValue('matrix-c'),
      d: getValue('matrix-d')
    };
  }

  private redrawCanvas(): void {
    this.renderSection(this.currentSection);
  }

  private startAnimation(): void {
    this.isAnimating = true;
    this.animateBasisTransformation();
  }

  private pauseAnimation(): void {
    this.isAnimating = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private updateAnimationSpeed(speed: number): void {
    // Update animation speed
    console.log('Animation speed updated to:', speed);
  }

  private resetTransformation(): void {
    this.transformationMatrix = { a: 1, b: 0, c: 0, d: 1 };
    this.updateMatrixInputs();
    this.redrawCanvas();
  }

  private updateMatrixInputs(): void {
    const { a, b, c, d } = this.transformationMatrix;
    
    (document.getElementById('matrix-a') as HTMLInputElement).value = a.toString();
    (document.getElementById('matrix-b') as HTMLInputElement).value = b.toString();
    (document.getElementById('matrix-c') as HTMLInputElement).value = c.toString();
    (document.getElementById('matrix-d') as HTMLInputElement).value = d.toString();
  }

  private updateProgress(): void {
    const progressFill = document.getElementById('progress-fill') as HTMLElement;
    const progressCount = document.getElementById('progress-count') as HTMLElement;
    
    if (progressFill && progressCount) {
      const progress = ((this.currentSection + 1) / 7) * 100;
      progressFill.style.width = `${progress}%`;
      progressCount.textContent = (this.currentSection + 1).toString();
    }
  }

  private loadProgress(): void {
    const savedProgress = localStorage.getItem('basis_transformation_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        this.currentSection = parseInt(progress.section) || 0;
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }

  private saveProgress(): void {
    const progressData = {
      section: this.currentSection,
      timestamp: Date.now()
    };
    
    localStorage.setItem('basis_transformation_progress', JSON.stringify(progressData));
  }

  private screenToCanvas(point: Point2D): Point2D {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: point.x - rect.left,
      y: point.y - rect.top
    };
  }

  private canvasToScreen(point: Point2D): Point2D {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: point.x + rect.left,
      y: point.y + rect.top
    };
  }

  // Public methods for external access
  public nextSection(): void {
    if (this.currentSection < 6) {
      this.showSection(this.currentSection + 1);
    }
  }

  public previousSection(): void {
    if (this.currentSection > 0) {
      this.showSection(this.currentSection - 1);
    }
  }

  public getCurrentSection(): number {
    return this.currentSection;
  }

  public destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.saveProgress();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const course = new BasisTransformationCourse();
  
  // Make available globally for debugging
  (window as any).basisTransformationCourse = course;
});

export default BasisTransformationCourse;
