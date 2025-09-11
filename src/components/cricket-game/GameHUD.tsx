'use client';

import { GameState } from '@/app/game/page';
import { Button } from '@/components/ui/button';

interface GameHUDProps {
  gameState: GameState;
  onPause: () => void;
  onHome: () => void;
}

export default function GameHUD({ gameState, onPause, onHome }: GameHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar - Score and Game Stats */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/30 to-transparent pointer-events-none">
        <div className="flex justify-between items-center text-white">
          {/* Score Section */}
          <div className="bg-black/40 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-300">
              {gameState.score}
            </div>
            <div className="text-sm opacity-80">RUNS</div>
          </div>

          {/* Overs and Wickets */}
          <div className="bg-black/40 rounded-lg px-4 py-2 backdrop-blur-sm text-center">
            <div className="text-lg font-semibold">
              {gameState.overs}.{gameState.balls}
            </div>
            <div className="text-sm opacity-80">OVERS</div>
          </div>

          <div className="bg-black/40 rounded-lg px-4 py-2 backdrop-blur-sm text-center">
            <div className="text-lg font-semibold text-red-400">
              {gameState.wickets}/10
            </div>
            <div className="text-sm opacity-80">WICKETS</div>
          </div>
        </div>
      </div>

      {/* Control Buttons - Top Right */}
      <div className="absolute top-4 right-4 space-y-2 pointer-events-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onPause}
          className="bg-black/40 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          ⏸️ Pause
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onHome}
          className="bg-black/40 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          🏠 Home
        </Button>
      </div>

      {/* High Score Display */}
      {gameState.highScore > 0 && (
        <div className="absolute top-20 left-4">
          <div className="bg-black/30 rounded-lg px-3 py-1 backdrop-blur-sm text-white text-sm">
            <span className="opacity-70">High Score: </span>
            <span className="font-semibold text-yellow-300">{gameState.highScore}</span>
          </div>
        </div>
      )}

      {/* Power Meter (Visual feedback for swipe detection) */}
      <div className="absolute bottom-20 left-4">
        <div className="bg-black/40 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-white text-sm mb-2 opacity-80">Power</div>
          <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-100"
              style={{ width: '0%' }} // This would be dynamic based on swipe power
            />
          </div>
        </div>
      </div>

      {/* Scoring Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 text-white text-sm">
          <div className="bg-green-600/80 rounded px-2 py-1 backdrop-blur-sm">1</div>
          <div className="bg-blue-600/80 rounded px-2 py-1 backdrop-blur-sm">2</div>
          <div className="bg-orange-600/80 rounded px-2 py-1 backdrop-blur-sm">4</div>
          <div className="bg-purple-600/80 rounded px-2 py-1 backdrop-blur-sm">6</div>
        </div>
        <div className="text-white text-xs text-center mt-1 opacity-70">
          Possible Scores
        </div>
      </div>

      {/* Game Mode Info */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-black/30 rounded-lg px-3 py-1 backdrop-blur-sm text-white text-sm">
          <span className="opacity-70">Mode: </span>
          <span className="font-semibold">Beach Cricket</span>
        </div>
      </div>

      {/* Achievement/Milestone Notifications */}
      {gameState.score > 0 && gameState.score % 50 === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-xl font-bold shadow-lg animate-bounce">
            🎉 {gameState.score} Runs!
          </div>
        </div>
      )}

      {/* Progressive Target Info */}
      <div className="absolute top-32 right-4">
        <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm text-white text-sm">
          <div className="opacity-70 mb-1">Next Target</div>
          <div className="font-semibold">
            {Math.ceil((gameState.score + 1) / 50) * 50} runs
          </div>
        </div>
      </div>

      {/* Ball Count Visualization */}
      <div className="absolute bottom-32 right-4">
        <div className="bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
          <div className="text-white text-xs opacity-70 mb-1">This Over</div>
          <div className="flex space-x-1">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < gameState.balls 
                    ? 'bg-yellow-400' 
                    : 'bg-gray-500/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}