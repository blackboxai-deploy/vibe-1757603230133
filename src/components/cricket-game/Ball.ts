export class Ball {
  public x: number;
  public y: number;
  public velocity: { x: number; y: number };
  public acceleration: { x: number; y: number };
  private initialX: number;
  private initialY: number;
  private radius: number;
  private bounceCount: number;
  private isSettled: boolean;
  private trail: Array<{ x: number; y: number; opacity: number }>;
  private maxTrailLength: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.radius = 4;
    this.bounceCount = 0;
    this.isSettled = false;
    this.trail = [];
    this.maxTrailLength = 15;
  }

  update() {
    if (this.isSettled) return;

    // Apply gravity
    this.acceleration.y = 0.3;
    
    // Apply air resistance
    this.acceleration.x = -this.velocity.x * 0.01;

    // Update velocity
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    // Update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Ground collision (simplified)
    if (this.y > window.innerHeight * 0.85 - this.radius) {
      this.y = window.innerHeight * 0.85 - this.radius;
      this.velocity.y = -this.velocity.y * 0.6; // Bounce with energy loss
      this.velocity.x *= 0.8; // Friction
      this.bounceCount++;

      // Stop bouncing after a few bounces with low velocity
      if (this.bounceCount > 3 && Math.abs(this.velocity.y) < 2) {
        this.velocity.y = 0;
        this.velocity.x *= 0.9;
      }
    }

    // Check if ball has settled
    if (Math.abs(this.velocity.x) < 0.5 && Math.abs(this.velocity.y) < 0.5 && this.bounceCount > 0) {
      this.isSettled = true;
    }

    // Update trail
    this.updateTrail();
  }

  render(ctx: CanvasRenderingContext2D) {
    // Render trail
    this.renderTrail(ctx);

    // Render ball shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(this.x + 2, window.innerHeight * 0.85, this.radius + 1, this.radius * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Render ball
    const ballGradient = ctx.createRadialGradient(
      this.x - 2, this.y - 2, 0,
      this.x, this.y, this.radius
    );
    ballGradient.addColorStop(0, '#FF6B6B');
    ballGradient.addColorStop(0.7, '#FF4444');
    ballGradient.addColorStop(1, '#CC0000');

    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Ball seam (cricket ball characteristic)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI);
    ctx.stroke();

    // Ball shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x - 1, this.y - 1, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  hitBall(angle: number, power: number, batsmanX: number, batsmanY: number) {
    // Calculate initial velocity based on angle and power
    const maxSpeed = 25;
    const speed = power * maxSpeed;

    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    // Add some upward trajectory for realistic shots
    if (this.velocity.y > -5) {
      this.velocity.y -= 8;
    }

    // Position ball slightly in front of batsman
    this.x = batsmanX + Math.cos(angle) * 20;
    this.y = batsmanY + Math.sin(angle) * 20;

    this.bounceCount = 0;
    this.isSettled = false;
    this.trail = [];
  }

  bowlToTarget(targetX: number, targetY: number, screenWidth: number, screenHeight: number) {
    // Calculate trajectory to batsman
    const deltaX = targetX - this.x;
    const deltaY = targetY - this.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Bowling speed (moderate pace)
    const bowlSpeed = 12;
    const timeToReach = distance / bowlSpeed;

    this.velocity.x = deltaX / timeToReach;
    this.velocity.y = deltaY / timeToReach;

    // Add slight variations for realism
    this.velocity.x += (Math.random() - 0.5) * 2;
    this.velocity.y += (Math.random() - 0.5) * 2;

    this.bounceCount = 0;
    this.isSettled = false;
    this.trail = [];
  }

  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.bounceCount = 0;
    this.isSettled = false;
    this.trail = [];
  }

  hasSettled(): boolean {
    return this.isSettled;
  }

  isOutOfBounds(screenWidth: number, screenHeight: number): boolean {
    return (
      this.x < -50 ||
      this.x > screenWidth + 50 ||
      this.y > screenHeight + 50
    );
  }

  private updateTrail() {
    // Add current position to trail
    this.trail.push({
      x: this.x,
      y: this.y,
      opacity: 1.0
    });

    // Remove old trail points
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Update trail opacity
    this.trail.forEach((point, index) => {
      point.opacity = (index + 1) / this.trail.length * 0.6;
    });
  }

  private renderTrail(ctx: CanvasRenderingContext2D) {
    if (this.trail.length < 2) return;

    for (let i = 0; i < this.trail.length - 1; i++) {
      const current = this.trail[i];
      const next = this.trail[i + 1];

      ctx.strokeStyle = `rgba(255, 107, 107, ${current.opacity})`;
      ctx.lineWidth = (current.opacity * 3) + 1;
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  // Getter methods for game logic
  getDistance(x: number, y: number): number {
    return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
  }

  getSpeed(): number {
    return Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
  }

  isMoving(): boolean {
    return this.getSpeed() > 1;
  }
}