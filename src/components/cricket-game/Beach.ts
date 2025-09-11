export class Beach {
  private width: number;
  private height: number;
  private waveOffset: number;
  private palmOffset: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.waveOffset = 0;
    this.palmOffset = 0;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.waveOffset += 0.02;
    this.palmOffset += 0.01;

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.5, '#87CEFA');
    skyGradient.addColorStop(1, '#B0E0E6');
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);

    // Ocean
    const oceanGradient = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
    oceanGradient.addColorStop(0, '#4682B4');
    oceanGradient.addColorStop(0.5, '#4169E1');
    oceanGradient.addColorStop(1, '#191970');
    
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, this.height * 0.6, this.width, this.height * 0.2);

    // Animated waves
    this.renderWaves(ctx);

    // Beach sand
    const sandGradient = ctx.createLinearGradient(0, this.height * 0.8, 0, this.height);
    sandGradient.addColorStop(0, '#F4E4BC');
    sandGradient.addColorStop(0.5, '#E6D3A3');
    sandGradient.addColorStop(1, '#D2B48C');
    
    ctx.fillStyle = sandGradient;
    ctx.fillRect(0, this.height * 0.8, this.width, this.height * 0.2);

    // Palm trees
    this.renderPalmTrees(ctx);

    // Clouds
    this.renderClouds(ctx);

    // Sun
    this.renderSun(ctx);

    // Sand texture details
    this.renderSandTexture(ctx);
  }

  private renderWaves(ctx: CanvasRenderingContext2D) {
    const waveY = this.height * 0.75;
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 3; i++) {
      const amplitude = 5 + i * 3;
      const frequency = 0.01 + i * 0.005;
      const offsetY = waveY + i * 10;
      
      ctx.beginPath();
      for (let x = 0; x < this.width; x += 5) {
        const y = offsetY + Math.sin(x * frequency + this.waveOffset + i) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }

  private renderPalmTrees(ctx: CanvasRenderingContext2D) {
    const trees = [
      { x: this.width * 0.05, scale: 1.2 },
      { x: this.width * 0.15, scale: 0.8 },
      { x: this.width * 0.85, scale: 1.0 },
      { x: this.width * 0.95, scale: 0.9 },
    ];

    trees.forEach(tree => {
      this.renderSinglePalmTree(ctx, tree.x, tree.scale);
    });
  }

  private renderSinglePalmTree(ctx: CanvasRenderingContext2D, x: number, scale: number) {
    const baseY = this.height * 0.8;
    const trunkHeight = 80 * scale;
    const swayOffset = Math.sin(this.palmOffset) * 10 * scale;

    // Trunk
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8 * scale;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + swayOffset / 2, baseY - trunkHeight / 2, x + swayOffset, baseY - trunkHeight);
    ctx.stroke();

    // Palm fronds
    const frondCount = 8;
    const frondLength = 40 * scale;
    
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3 * scale;
    
    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2;
      const bendOffset = Math.sin(this.palmOffset + i) * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(x + swayOffset, baseY - trunkHeight);
      
      const endX = x + swayOffset + Math.cos(angle + bendOffset) * frondLength;
      const endY = baseY - trunkHeight + Math.sin(angle + bendOffset) * frondLength;
      
      ctx.quadraticCurveTo(
        x + swayOffset + Math.cos(angle) * frondLength * 0.7,
        baseY - trunkHeight + Math.sin(angle) * frondLength * 0.7 - 5,
        endX,
        endY
      );
      ctx.stroke();
    }
  }

  private renderClouds(ctx: CanvasRenderingContext2D) {
    const clouds = [
      { x: this.width * 0.2, y: this.height * 0.15, size: 30 },
      { x: this.width * 0.7, y: this.height * 0.25, size: 25 },
      { x: this.width * 0.9, y: this.height * 0.1, size: 20 },
    ];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    clouds.forEach(cloud => {
      // Draw fluffy cloud shape with multiple circles
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const offsetX = (i - 2) * cloud.size * 0.3;
        const offsetY = Math.sin(i) * cloud.size * 0.2;
        ctx.arc(cloud.x + offsetX, cloud.y + offsetY, cloud.size * (0.8 + Math.sin(i) * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  private renderSun(ctx: CanvasRenderingContext2D) {
    const sunX = this.width * 0.85;
    const sunY = this.height * 0.15;
    const sunRadius = 40;

    // Sun glow
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 1.5);
    sunGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    sunGradient.addColorStop(0.7, 'rgba(255, 255, 0, 0.3)');
    sunGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    ctx.fillStyle = sunGradient;
    ctx.fillRect(sunX - sunRadius * 1.5, sunY - sunRadius * 1.5, sunRadius * 3, sunRadius * 3);

    // Sun body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sun rays
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const rayLength = 15;
      const startRadius = sunRadius + 5;
      
      ctx.beginPath();
      ctx.moveTo(
        sunX + Math.cos(angle) * startRadius,
        sunY + Math.sin(angle) * startRadius
      );
      ctx.lineTo(
        sunX + Math.cos(angle) * (startRadius + rayLength),
        sunY + Math.sin(angle) * (startRadius + rayLength)
      );
      ctx.stroke();
    }
  }

  private renderSandTexture(ctx: CanvasRenderingContext2D) {
    const sandY = this.height * 0.8;
    
    // Add some sand particles/texture
    ctx.fillStyle = 'rgba(210, 180, 140, 0.3)';
    
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width;
      const y = sandY + Math.random() * (this.height - sandY);
      const size = Math.random() * 2 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}