'use client';

import { GameState } from '@/app/game/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GameMenuProps {
  gameState: GameState;
  onStart: () => void;
  onResume: () => void;
  onHome: () => void;
}

export default function GameMenu({ gameState, onStart, onResume, onHome }: GameMenuProps) {
  // Start Menu
  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
        <Card className="bg-white/95 backdrop-blur-md max-w-md w-full mx-4 shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900 mb-2">
              🏏 Beach Cricket
            </CardTitle>
            <CardDescription className="text-lg">
              Ready to play cricket on the beach?
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-lg">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ec014164-2c4f-480d-b5cf-5b625e36085b.png" 
                alt="Beach cricket setup with palm trees and ocean view"
                className="w-full h-auto rounded mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-sm text-gray-700 text-center">
                Swipe to control your shots and score runs!
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={onStart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold shadow-lg"
              >
                🚀 Start Game
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onHome}
                className="w-full py-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                ← Back to Menu
              </Button>
            </div>

            {gameState.highScore > 0 && (
              <div className="text-center bg-yellow-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Your Best Score</p>
                <p className="text-2xl font-bold text-yellow-600">{gameState.highScore}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pause Menu
  if (gameState.isPaused) {
    return (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
        <Card className="bg-white/95 backdrop-blur-md max-w-sm w-full mx-4 shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-blue-900">Game Paused</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {gameState.score}
              </div>
              <div className="text-sm text-gray-600">Current Score</div>
              
              <div className="flex justify-center gap-4 mt-3 text-sm">
                <div>
                  <span className="font-medium">{gameState.overs}.{gameState.balls}</span>
                  <div className="text-xs text-gray-500">Overs</div>
                </div>
                <div>
                  <span className="font-medium text-red-500">{gameState.wickets}/10</span>
                  <div className="text-xs text-gray-500">Wickets</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={onResume}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                ▶️ Resume Game
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onHome}
                className="w-full py-3 border-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                🏠 End Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game Over Menu
  if (gameState.isGameOver) {
    const isNewHighScore = gameState.score > gameState.highScore;
    
    return (
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
        <Card className="bg-white/95 backdrop-blur-md max-w-md w-full mx-4 shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900 mb-2">
              {isNewHighScore ? '🎉 New High Score!' : '🏏 Game Over'}
            </CardTitle>
            <CardDescription>
              {gameState.wickets >= 10 ? 'All out!' : 'Great innings!'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Final Score */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {gameState.score}
              </div>
              <div className="text-sm text-gray-600">Final Score</div>
              
              <div className="flex justify-center gap-6 mt-3">
                <div className="text-center">
                  <div className="font-medium">{gameState.overs}.{gameState.balls}</div>
                  <div className="text-xs text-gray-500">Overs</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-red-500">{gameState.wickets}</div>
                  <div className="text-xs text-gray-500">Wickets</div>
                </div>
              </div>
            </div>

            {/* High Score Display */}
            {!isNewHighScore && gameState.highScore > 0 && (
              <div className="text-center bg-yellow-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">High Score</p>
                <p className="text-2xl font-bold text-yellow-600">{gameState.highScore}</p>
              </div>
            )}

            {/* Performance Summary */}
            <div className="bg-gray-100 p-3 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Performance</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Strike Rate:</span>
                  <span className="font-medium ml-2">
                    {gameState.overs > 0 || gameState.balls > 0 
                      ? Math.round((gameState.score / (gameState.overs * 6 + gameState.balls)) * 100) 
                      : 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Balls Faced:</span>
                  <span className="font-medium ml-2">{gameState.overs * 6 + gameState.balls}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={onStart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
              >
                🔄 Play Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onHome}
                className="w-full py-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                🏠 Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}