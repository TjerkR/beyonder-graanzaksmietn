
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Trophy, LogOut, User } from 'lucide-react';
import GameSetup from './GameSetup';
import GameView from './GameView';

const MainMenu = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'menu' | 'setup' | 'game'>('menu');
  const [gameData, setGameData] = useState<{
    team1Player1: string;
    team1Player2: string;
    team2Player1: string;
    team2Player2: string;
  } | null>(null);

  const handleNewGame = () => {
    setCurrentView('setup');
  };

  const handleStartGame = (players: {
    team1Player1: string;
    team1Player2: string;
    team2Player1: string;
    team2Player2: string;
  }) => {
    setGameData(players);
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setGameData(null);
  };

  const handleScoreboard = () => {
    // TODO: Navigate to scoreboard
    console.log('Opening scoreboard...');
  };

  if (currentView === 'setup') {
    return <GameSetup onStartGame={handleStartGame} onBack={handleBackToMenu} />;
  }

  if (currentView === 'game' && gameData) {
    return <GameView players={gameData} onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-amber-800">
                Welcome, {user?.user_metadata?.full_name || 'Player'}!
              </h1>
              <p className="text-gray-600">Ready for some cornhole action?</p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Main title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-800 mb-4">
            🎯 The Cornhole Arena
          </h2>
          <p className="text-xl text-gray-600">
            Your ultimate cornhole competition platform
          </p>
        </div>

        {/* Menu options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleNewGame}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Play className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Start New Game</CardTitle>
              <CardDescription>
                Begin a new cornhole match and track your scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Let's Play!
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleScoreboard}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-purple-700">Scoreboard</CardTitle>
              <CardDescription>
                View past games, statistics, and leaderboards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Scores
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick stats section */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-600">0</div>
                  <div className="text-sm text-gray-600">Games Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
