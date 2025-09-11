import { Beach } from './Beach';
import { Player } from './Player';
import { Ball } from './Ball';

export interface GameCallbacks {
  onScoreUpdate: (runs: number) => void;
  onBallComplete: () => void;
  onWicket: () => void;
  onGameOver: () => void;
}

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private callbacks: GameCallbacks;

  private beach: Beach;
  private batsman: Player;
  private bowler: Player;
  private ball: Ball;

  private gameState: {
    ballInPlay: boolean;
    waitingForNextBall: boolean;
    ballDelivered: boolean;
    lastRunsScored: number;
    showScorePopup: boolean;
    scorePopupTimer: number;
  };

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, callbacks: GameCallbacks) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.callbacks = callbacks;

    // Initialize game objects
    this.beach = new Beach(width, height);
    this.batsman = new Player(width * 0.7, height * 0.8, 'batsman');
    this.bowler = new Player(width * 0.3, height * 0.8, 'bowler');
    this.ball = new Ball(width * 0.3, height * 0.75);

    this.gameState = {
      ballInPlay: false,
      waitingForNextBall: false,
      ballDelivered: false,
      lastRunsScored: 0,
      showScorePopup: false,
      scorePopupTimer: 0,
    };

    this.startNextBall();
  }

  update() {
    // Update ball physics
    if (this.gameState.ballInPlay) {
      this.ball.update();

      // Check if ball has settled or gone out of bounds
      if (this.ball.hasSettled() || this.ball.isOutOfBounds(this.width, this.height)) {
        this.endCurrentBall();
      }
    }

    // Update score popup timer
    if (this.gameState.showScorePopup) {
      this.gameState.scorePopupTimer -= 16; // Assuming 60fps
      if (this.gameState.scorePopupTimer <= 0) {
        this.gameState.showScorePopup = false;
      }
    }

    // Auto-deliver next ball after delay
    if (this.gameState.waitingForNextBall) {
      setTimeout(() => {
        this.startNextBall();
      }, 2000);
      this.gameState.waitingForNextBall = false;
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render beach background
    this.beach.render(this.ctx);

    // Render cricket pitch
    this.renderPitch();

    // Render players
    this.batsman.render(this.ctx);
    this.bowler.render(this.ctx);

    // Render ball
    this.ball.render(this.ctx);

    // Render fielders (simplified dots)
    this.renderFielders();

    // Render score popup
    if (this.gameState.showScorePopup) {
      this.renderScorePopup();
    }

    // Render batting area indicator
    if (!this.gameState.ballInPlay && !this.gameState.waitingForNextBall) {
      this.renderBattingIndicator();
    }
  }

  handleBat(direction: { x: number; y: number }, power: number) {
    if (!this.gameState.ballDelivered || this.gameState.ballInPlay) return;

    // Calculate shot power and direction
    const shotPower = Math.min(power * 2, 100);
    const shotAngle = Math.atan2(direction.y, direction.x);

    // Apply shot to ball
    this.ball.hitBall(shotAngle, shotPower, this.batsman.x, this.batsman.y);
    
    // Animate batsman swing
    this.batsman.swing();

    this.gameState.ballInPlay = true;
    this.gameState.ballDelivered = false;
  }

  reset() {
    // Reset all game objects
    this.ball.reset(this.width * 0.3, this.height * 0.75);
    this.batsman.reset();
    this.bowler.reset();

    this.gameState = {
      ballInPlay: false,
      waitingForNextBall: false,
      ballDelivered: false,
      lastRunsScored: 0,
      showScorePopup: false,
      scorePopupTimer: 0,
    };

    this.startNextBall();
  }

  private startNextBall() {
    if (this.gameState.waitingForNextBall) return;

    // Reset ball position
    this.ball.reset(this.bowler.x, this.bowler.y - 20);

    // Bowler animation
    this.bowler.bowl();

    // Deliver ball after short delay
    setTimeout(() => {
      this.ball.bowlToTarget(this.batsman.x, this.batsman.y, this.width, this.height);
      this.gameState.ballDelivered = true;
    }, 800);
  }

  private endCurrentBall() {
    this.gameState.ballInPlay = false;

    // Calculate runs based on ball position
    const runs = this.calculateRuns();
    this.gameState.lastRunsScored = runs;

    if (runs > 0) {
      this.callbacks.onScoreUpdate(runs);
      this.showScorePopup(runs);
    } else {
      // Check for wicket conditions
      if (this.isWicket()) {
        this.callbacks.onWicket();
        this.showScorePopup(-1); // -1 indicates wicket
      }
    }

    this.callbacks.onBallComplete();
    this.gameState.waitingForNextBall = true;
  }

  private calculateRuns(): number {
    const ballX = this.ball.x;
    const ballY = this.ball.y;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Distance from center
    const distance = Math.sqrt(
      Math.pow(ballX - centerX, 2) + Math.pow(ballY - centerY, 2)
    );

    // Boundary detection
    if (distance > this.width * 0.4) return 6; // Six
    if (distance > this.width * 0.3) return 4; // Four
    if (distance > this.width * 0.2) return 2; // Two
    if (distance > this.width * 0.1) return 1; // Single

    return 0; // Dot ball
  }

  private isWicket(): boolean {
    // Simple wicket logic - if ball is very close to batsman without being hit properly
    const distance = Math.sqrt(
      Math.pow(this.ball.x - this.batsman.x, 2) + 
      Math.pow(this.ball.y - this.batsman.y, 2)
    );
    
    return distance < 30 && this.ball.velocity.x === 0 && this.ball.velocity.y === 0;
  }

  private renderPitch() {
    const pitchWidth = this.width * 0.6;
    const pitchHeight = this.height * 0.4;
    const pitchX = (this.width - pitchWidth) / 2;
    const pitchY = this.height * 0.4;

    // Pitch background (lighter sand)
    this.ctx.fillStyle = '#F4E4BC';
    this.ctx.fillRect(pitchX, pitchY, pitchWidth, pitchHeight);

    // Pitch lines
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(pitchX, pitchY, pitchWidth, pitchHeight);

    // Wickets
    this.ctx.fillStyle = '#8B4513';
    // Batsman wickets
    this.ctx.fillRect(this.batsman.x - 2, this.batsman.y + 10, 4, 20);
    // Bowler wickets  
    this.ctx.fillRect(this.bowler.x - 2, this.bowler.y + 10, 4, 20);
  }

  private renderFielders() {
    const fielderPositions = [
      { x: this.width * 0.1, y: this.height * 0.3 },
      { x: this.width * 0.9, y: this.height * 0.3 },
      { x: this.width * 0.2, y: this.height * 0.6 },
      { x: this.width * 0.8, y: this.height * 0.6 },
      { x: this.width * 0.5, y: this.height * 0.2 },
    ];

    this.ctx.fillStyle = '#FF6B6B';
    fielderPositions.forEach(pos => {
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  private renderScorePopup() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.ctx.save();
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    if (this.gameState.lastRunsScored === -1) {
      this.ctx.fillStyle = '#FF4444';
      this.ctx.fillText('WICKET!', centerX, centerY);
    } else if (this.gameState.lastRunsScored === 6) {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.fillText('SIX!', centerX, centerY);
    } else if (this.gameState.lastRunsScored === 4) {
      this.ctx.fillStyle = '#FFA500';
      this.ctx.fillText('FOUR!', centerX, centerY);
    } else if (this.gameState.lastRunsScored > 0) {
      this.ctx.fillStyle = '#00AA00';
      this.ctx.fillText(`${this.gameState.lastRunsScored}`, centerX, centerY);
    }

    this.ctx.restore();
  }

  private renderBattingIndicator() {
    const batsmanX = this.batsman.x;
    const batsmanY = this.batsman.y;

    // Pulsing circle around batsman
    const pulseRadius = 40 + Math.sin(Date.now() * 0.01) * 10;
    
    this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(batsmanX, batsmanY, pulseRadius, 0, 2 * Math.PI);
    this.ctx.stroke();

    // Swipe instruction
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Swipe to hit!', batsmanX, batsmanY - 60);
  }

  private showScorePopup(runs: number) {
    this.gameState.lastRunsScored = runs;
    this.gameState.showScorePopup = true;
    this.gameState.scorePopupTimer = 2000; // 2 seconds
  }
}