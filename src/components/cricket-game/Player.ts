export class Player {
  public x: number;
  public y: number;
  private initialX: number;
  private initialY: number;
  private type: 'batsman' | 'bowler';
  private animationState: 'idle' | 'swing' | 'bowl' | 'run';
  private animationTimer: number;
  private animationFrame: number;

  constructor(x: number, y: number, type: 'batsman' | 'bowler') {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.type = type;
    this.animationState = 'idle';
    this.animationTimer = 0;
    this.animationFrame = 0;
  }

  update() {
    // Update animation timers
    if (this.animationState !== 'idle') {
      this.animationTimer -= 16; // Assuming 60fps
      this.animationFrame++;
      
      if (this.animationTimer <= 0) {
        this.animationState = 'idle';
        this.animationFrame = 0;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.update();

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'batsman') {
      this.renderBatsman(ctx);
    } else {
      this.renderBowler(ctx);
    }

    ctx.restore();
  }

  swing() {
    this.animationState = 'swing';
    this.animationTimer = 500; // 0.5 seconds
    this.animationFrame = 0;
  }

  bowl() {
    this.animationState = 'bowl';
    this.animationTimer = 800; // 0.8 seconds
    this.animationFrame = 0;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.animationState = 'idle';
    this.animationTimer = 0;
    this.animationFrame = 0;
  }

  private renderBatsman(ctx: CanvasRenderingContext2D) {
    // Body
    ctx.fillStyle = '#FFE4B5'; // Skin tone
    ctx.fillRect(-8, -25, 16, 30);

    // Head
    ctx.beginPath();
    ctx.arc(0, -35, 10, 0, Math.PI * 2);
    ctx.fill();

    // Helmet
    ctx.fillStyle = '#000080';
    ctx.beginPath();
    ctx.arc(0, -35, 12, Math.PI, 0);
    ctx.fill();

    // Cricket uniform
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-10, -20, 20, 25);

    // Pads
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(-6, 5, 5, 20);
    ctx.fillRect(1, 5, 5, 20);

    // Cricket bat
    const batAngle = this.getBatAngle();
    ctx.save();
    ctx.rotate(batAngle);
    
    // Bat handle
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-2, -15, 4, 15);
    
    // Bat blade
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(-6, -25, 12, 15);
    
    ctx.restore();

    // Arms
    ctx.strokeStyle = '#FFE4B5';
    ctx.lineWidth = 4;
    
    const armOffset = this.animationState === 'swing' 
      ? Math.sin(this.animationFrame * 0.3) * 10 
      : 0;
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(-8, -15);
    ctx.lineTo(-15 + armOffset, -5);
    ctx.stroke();
    
    // Right arm
    ctx.beginPath();
    ctx.moveTo(8, -15);
    ctx.lineTo(15 + armOffset, -5);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(-4, 5);
    ctx.lineTo(-6, 25);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(4, 5);
    ctx.lineTo(6, 25);
    ctx.stroke();
  }

  private renderBowler(ctx: CanvasRenderingContext2D) {
    // Body
    ctx.fillStyle = '#FFE4B5'; // Skin tone
    ctx.fillRect(-8, -25, 16, 30);

    // Head
    ctx.beginPath();
    ctx.arc(0, -35, 10, 0, Math.PI * 2);
    ctx.fill();

    // Cricket cap
    ctx.fillStyle = '#006400';
    ctx.beginPath();
    ctx.arc(0, -35, 11, Math.PI, 0);
    ctx.fill();
    
    // Cap peak
    ctx.fillRect(-15, -35, 15, 3);

    // Cricket uniform
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-10, -20, 20, 25);

    // Arms - animated during bowling
    ctx.strokeStyle = '#FFE4B5';
    ctx.lineWidth = 4;
    
    const armAngle = this.getBowlArmAngle();
    
    // Bowling arm (right)
    ctx.save();
    ctx.rotate(armAngle);
    ctx.beginPath();
    ctx.moveTo(8, -15);
    ctx.lineTo(20, -10);
    ctx.stroke();
    ctx.restore();
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(-8, -15);
    ctx.lineTo(-12, -5);
    ctx.stroke();

    // Legs - animated during bowling
    const legOffset = this.animationState === 'bowl' 
      ? Math.sin(this.animationFrame * 0.2) * 5 
      : 0;
    
    ctx.beginPath();
    ctx.moveTo(-4, 5);
    ctx.lineTo(-6 + legOffset, 25);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(4, 5);
    ctx.lineTo(6 - legOffset, 25);
    ctx.stroke();

    // Cricket ball in hand during bowl animation
    if (this.animationState === 'bowl' && this.animationFrame < 30) {
      ctx.save();
      ctx.rotate(armAngle);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(22, -8, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private getBatAngle(): number {
    switch (this.animationState) {
      case 'swing':
        const swingProgress = 1 - (this.animationTimer / 500);
        return Math.sin(swingProgress * Math.PI) * 1.5 - 0.2;
      default:
        return -0.2; // Slight angle when idle
    }
  }

  private getBowlArmAngle(): number {
    switch (this.animationState) {
      case 'bowl':
        const bowlProgress = 1 - (this.animationTimer / 800);
        if (bowlProgress < 0.5) {
          // Wind up
          return -Math.PI/4 + (bowlProgress * 2) * Math.PI/2;
        } else {
          // Release and follow through
          return Math.PI/4 + ((bowlProgress - 0.5) * 2) * Math.PI/4;
        }
      default:
        return 0;
    }
  }
}