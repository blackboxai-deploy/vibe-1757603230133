'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-300 to-cyan-400 flex items-center justify-center p-4">
      {/* Beach Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-yellow-200 to-transparent opacity-60"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-8 bg-green-600 rounded-full transform rotate-12 opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-12 bg-green-700 rounded-full transform -rotate-12 opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
              🏖️ Beach Cricket
            </CardTitle>
            <CardDescription className="text-lg text-gray-700">
              Swipe to hit sixes on the beach!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-orange-200 to-yellow-200 p-4 rounded-lg">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7193fca5-f96d-45ed-8fa8-33839ab5871b.png" 
                alt="Cricket player batting on sunny beach with ocean waves"
                className="w-full h-auto rounded-lg mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-sm text-gray-800 text-center font-medium">
                Play cricket like never before on a beautiful beach setting
              </p>
            </div>

            {!showInstructions ? (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold shadow-lg"
                  onClick={() => window.location.href = '/game'}
                >
                  🏏 Start Playing
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full py-4 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => setShowInstructions(true)}
                >
                  📖 How to Play
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-bold text-blue-900 mb-2">Swipe Controls:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⬅️➡️</span>
                      <span>Swipe left/right to aim your shot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⬆️</span>
                      <span>Swipe up for lofted shots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⬇️</span>
                      <span>Swipe down for ground shots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span>Swipe faster for more power!</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
                    onClick={() => window.location.href = '/game'}
                  >
                    🏏 Let's Play Cricket!
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-blue-600 hover:text-blue-800"
                    onClick={() => setShowInstructions(false)}
                  >
                    ← Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-white/80 text-sm">
          <p>🌊 Experience the thrill of beach cricket with intuitive swipe controls!</p>
        </div>
      </div>
    </div>
  );
}