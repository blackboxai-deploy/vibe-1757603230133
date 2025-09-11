'use client';

import { useState, useEffect } from 'react';
import GameCanvas from '@/components/cricket-game/GameCanvas';
import GameHUD from '@/components/cricket-game/GameHUD';
import GameMenu from '@/components/cricket-game/GameMenu';

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  highScore: number;
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    highScore: 0,
  });

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('beachCricketHighScore');
    if (savedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
  }, []);

  // Save high score when game ends
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > gameState.highScore) {
      localStorage.setItem('beachCricketHighScore', gameState.score.toString());
      setGameState(prev => ({ ...prev, highScore: gameState.score }));
    }
  }, [gameState.isGameOver, gameState.score, gameState.highScore]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      highScore: gameState.highScore,
    });
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const endGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isGameOver: true 
    }));
  };

  const updateScore = (runs: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + runs }));
  };

  const updateBalls = () => {
    setGameState(prev => {
      const newBalls = prev.balls + 1;
      const newOvers = newBalls >= 6 ? prev.overs + 1 : prev.overs;
      const ballsInOver = newBalls >= 6 ? 0 : newBalls;
      
      return {
        ...prev,
        balls: ballsInOver,
        overs: newOvers
      };
    });
  };

  const addWicket = () => {
    setGameState(prev => {
      const newWickets = prev.wickets + 1;
      if (newWickets >= 10) {
        return { ...prev, wickets: newWickets, isGameOver: true, isPlaying: false };
      }
      return { ...prev, wickets: newWickets };
    });
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-sky-300 via-blue-400 to-cyan-500 overflow-hidden">
      {/* Game Canvas - Full Screen */}
      <div className="absolute inset-0">
        <GameCanvas 
          gameState={gameState}
          onScoreUpdate={updateScore}
          onBallComplete={updateBalls}
          onWicket={addWicket}
          onGameOver={endGame}
        />
      </div>

      {/* Game HUD - Overlay */}
      {gameState.isPlaying && !gameState.isPaused && (
        <GameHUD 
          gameState={gameState}
          onPause={pauseGame}
          onHome={goHome}
        />
      )}

      {/* Game Menus - Overlay */}
      {(!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) && (
        <GameMenu
          gameState={gameState}
          onStart={startGame}
          onResume={pauseGame}
          onHome={goHome}
        />
      )}

      {/* Mobile-specific styles */}
      <style jsx global>{`
        body {
          touch-action: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}