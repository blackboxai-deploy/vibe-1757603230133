'use client';

import { useRef, useEffect, useCallback } from 'react';
import { GameState } from '@/app/game/page';
import { GameEngine } from './GameEngine';
import SwipeControls from './SwipeControls';

interface GameCanvasProps {
  gameState: GameState;
  onScoreUpdate: (runs: number) => void;
  onBallComplete: () => void;
  onWicket: () => void;
  onGameOver: () => void;
}

export default function GameCanvas({ 
  gameState, 
  onScoreUpdate, 
  onBallComplete, 
  onWicket, 
  onGameOver 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to full screen
    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(
      ctx,
      window.innerWidth,
      window.innerHeight,
      {
        onScoreUpdate,
        onBallComplete,
        onWicket,
        onGameOver,
      }
    );

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onScoreUpdate, onBallComplete, onWicket, onGameOver]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameEngineRef.current || !gameState.isPlaying || gameState.isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    gameEngineRef.current.update();
    gameEngineRef.current.render();

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused]);

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoop();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameLoop]);

  // Handle swipe input
  const handleSwipe = (direction: { x: number; y: number }, power: number) => {
    if (!gameEngineRef.current || !gameState.isPlaying || gameState.isPaused) return;
    
    gameEngineRef.current.handleBat(direction, power);
  };

  // Reset game engine when game restarts
  useEffect(() => {
    if (gameState.isPlaying && gameEngineRef.current) {
      gameEngineRef.current.reset();
    }
  }, [gameState.isPlaying]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none"
        style={{ touchAction: 'none' }}
      />
      
      {gameState.isPlaying && !gameState.isPaused && (
        <SwipeControls
          onSwipe={handleSwipe}
          className="absolute inset-0"
        />
      )}

      {/* Loading screen while game initializes */}
      {!gameEngineRef.current && (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">
            Loading Beach Cricket...
          </div>
        </div>
      )}
    </div>
  );
}