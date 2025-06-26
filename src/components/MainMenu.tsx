
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Trophy, LogOut, User, Settings, BarChart3 } from 'lucide-react';
import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import GameSetup from './GameSetup';
import GameView from './GameView';

const MainMenu = () => {
  const { user, signOut } = useAuth();
  const { currentGame, loading: gameLoading } = useMultiplayerGame();
  const [currentView, setCurrentView] = useState<'menu' | 'setup' | 'game'>('menu');
  const [gameData, setGameData] = useState<{
    team1Player1Id: string;
    team1Player2Id: string;
    team2Player1Id: string;
    team2Player2Id: string;
    team1Player1Name: string;
    team1Player2Name: string;
    team2Player1Name: string;
    team2Player2Name: string;
  } | null>(null);

  // Check if user has an active game and redirect accordingly
  useEffect(() => {
    if (currentGame && currentView === 'menu') {
      console.log('User has active game, redirecting from main menu');
      const gameData = {
        team1Player1Id: currentGame.team1_player1_id,
        team1Player2Id: currentGame.team1_player2_id,
        team2Player1Id: currentGame.team2_player1_id,
        team2Player2Id: currentGame.team2_player2_id,
        team1Player1Name: currentGame.team1_player1_name,
        team1Player2Name: currentGame.team1_player2_name,
        team2Player1Name: currentGame.team2_player1_name,
        team2Player2Name: currentGame.team2_player2_name,
      };
      setGameData(gameData);
      setCurrentView('game');
    }
  }, [currentGame, currentView]);

  const handleNewGame = () => {
    setCurrentView('setup');
  };

  const handleStartGame = (players: {
    team1Player1Id: string;
    team1Player2Id: string;
    team2Player1Id: string;
    team2Player2Id: string;
    team1Player1Name: string;
    team1Player2Name: string;
    team2Player1Name: string;
    team2Player2Name: string;
  }) => {
    setGameData(players);
    setCurrentView('game');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setGameData(null);
  };

  const handleScoreboard = () => {
    console.log('Opening scoreboard...');
  };

  if (currentView === 'setup') {
    return <GameSetup onStartGame={handleStartGame} onBack={handleBackToMenu} />;
  }

  if (currentView === 'game' && gameData) {
    return <GameView players={gameData} onBack={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-slate-600/5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                {/* Beyonder Logo */}
                <img 
                  src="https://beyonder.eu/storage/uploads/0184aeeb-1507-4a47-8e6e-c3076839cab0/logo-name.svg" 
                  alt="Beyonder" 
                  className="h-8 w-auto"
                />
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      Cornhole Arena
                    </h1>
                    <p className="text-sm text-slate-600">Professional Competition Platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {user?.user_metadata?.full_name || 'Professional Player'}
                    </div>
                    <div className="text-xs text-slate-500">Tournament Ready</div>
                  </div>
                </div>
                
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="text-slate-600 hover:text-slate-800 border-slate-300 hover:border-slate-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Welcome Back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Champion'}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Your professional cornhole competition platform with enterprise-grade features, 
              real-time analytics, and seamless remote gameplay experience.
            </p>
            {currentGame && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                <p className="text-green-800 font-medium">
                  🎮 You have an active multiplayer game! Click "Start Tournament" to rejoin.
                </p>
              </div>
            )}
          </div>

          {/* Action Cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card 
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1" 
              onClick={handleNewGame}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Play className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 mb-2">Start Tournament</CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Launch a new professional cornhole match with live scoring and camera feeds
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg">
                  {currentGame ? 'Rejoin Active Game' : 'Initialize Competition'}
                </Button>
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-500">HD live feeds • Real-time scoring • Cloud sync</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1" 
              onClick={handleScoreboard}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 mb-2">Analytics Hub</CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Access comprehensive statistics, leaderboards, and performance analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  View Performance Data
                </Button>
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-500">Advanced metrics • Historical data • Insights</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Dashboard */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  Performance Dashboard
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Real-time performance metrics and tournament statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <div className="text-4xl font-bold text-blue-700 mb-2">0</div>
                    <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Tournaments</div>
                    <div className="text-xs text-slate-500 mt-1">Completed</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <div className="text-4xl font-bold text-green-700 mb-2">0</div>
                    <div className="text-sm font-semibold text-green-600 uppercase tracking-wide">Victories</div>
                    <div className="text-xs text-slate-500 mt-1">Win Rate</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <div className="text-4xl font-bold text-purple-700 mb-2">0</div>
                    <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Best Score</div>
                    <div className="text-xs text-slate-500 mt-1">Personal Record</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                    <div className="text-4xl font-bold text-amber-700 mb-2">0</div>
                    <div className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Ranking</div>
                    <div className="text-xs text-slate-500 mt-1">Global Position</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
