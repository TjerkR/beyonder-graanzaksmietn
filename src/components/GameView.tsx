import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, Camera, CameraOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import { supabase } from '@/integrations/supabase/client';
import GameChat from './GameChat';
import ScoreMessageOverlay from './ScoreMessageOverlay';
import VictoryScreen from './VictoryScreen';

interface GameViewProps {
  players: {
    team1Player1Id: string;
    team1Player2Id: string;
    team2Player1Id: string;
    team2Player2Id: string;
    team1Player1Name: string;
    team1Player2Name: string;
    team2Player1Name: string;
    team2Player2Name: string;
  };
  onBack: () => void;
}

const GameView = ({ players, onBack }: GameViewProps) => {
  const { user } = useAuth();
  const { currentGame, updateScore, endGame } = useMultiplayerGame();
  const [camera1Active, setCamera1Active] = useState(true);
  const [camera2Active, setCamera2Active] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [showScoreMessage, setShowScoreMessage] = useState(false);
  const [scoreMessageData, setScoreMessageData] = useState<{
    score: number;
    team: 'team1' | 'team2';
  } | null>(null);
  const [isEndingGame, setIsEndingGame] = useState(false);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const [winningTeam, setWinningTeam] = useState<'team1' | 'team2' | null>(null);

  // Use scores from the current game if available, otherwise use local state
  const team1Score = currentGame?.team1_score || 0;
  const team2Score = currentGame?.team2_score || 0;

  // Determine which team the current user can control
  const canControlTeam1 = user && (
    currentGame?.team1_player1_id === user.id || 
    currentGame?.team1_player2_id === user.id
  );
  const canControlTeam2 = user && (
    currentGame?.team2_player1_id === user.id || 
    currentGame?.team2_player2_id === user.id
  );

  // Check if either team has reached 21 points
  const gameCanEnd = team1Score >= 21 || team2Score >= 21;

  const handleScoreChange = async (team: 'team1' | 'team2', scoreToAdd: string) => {
    if (!currentGame) return;

    const pointsToAdd = parseInt(scoreToAdd);
    const currentTeamScore = team === 'team1' ? team1Score : team2Score;
    const newScore = currentTeamScore + pointsToAdd;
    
    console.log(`Adding ${pointsToAdd} points to ${team}. New total: ${newScore}`);
    
    const success = await updateScore(currentGame.id, team, newScore);
    if (!success) {
      console.error('Failed to update score');
      return;
    }

    // Show message overlay if user is part of the team that scored
    const isUserInTeam = (team === 'team1' && canControlTeam1) || (team === 'team2' && canControlTeam2);
    if (isUserInTeam) {
      setScoreMessageData({ score: pointsToAdd, team });
      setShowScoreMessage(true);
    }
  };

  const handleEndGame = async () => {
    if (!currentGame || !user || isEndingGame) return;

    setIsEndingGame(true);
    
    try {
      // Determine winning team
      const team1Won = team1Score > team2Score;
      const team2Won = team2Score > team1Score;
      
      // Update player statistics using the database function
      const updates = [];
      
      // Team 1 players
      updates.push(
        supabase.rpc('update_player_stats', {
          player_id: currentGame.team1_player1_id,
          points_to_add: team1Score,
          games_won: team1Won ? 1 : 0,
          games_lost: team2Won ? 1 : 0
        })
      );
      
      updates.push(
        supabase.rpc('update_player_stats', {
          player_id: currentGame.team1_player2_id,
          points_to_add: team1Score,
          games_won: team1Won ? 1 : 0,
          games_lost: team2Won ? 1 : 0
        })
      );
      
      // Team 2 players
      updates.push(
        supabase.rpc('update_player_stats', {
          player_id: currentGame.team2_player1_id,
          points_to_add: team2Score,
          games_won: team2Won ? 1 : 0,
          games_lost: team1Won ? 1 : 0
        })
      );
      
      updates.push(
        supabase.rpc('update_player_stats', {
          player_id: currentGame.team2_player2_id,
          points_to_add: team2Score,
          games_won: team2Won ? 1 : 0,
          games_lost: team1Won ? 1 : 0
        })
      );

      // Execute all updates
      await Promise.all(updates);

      // End the game
      await endGame(currentGame.id);

      // Navigate back to main menu
      onBack();
    } catch (error) {
      console.error('Error ending game:', error);
      setIsEndingGame(false);
    }
  };

  // Generate score options from 0 to 12
  const scoreOptions = Array.from({ length: 13 }, (_, i) => i);

  useEffect(() => {
    console.log('GameView mounted with current game:', currentGame);
    console.log('User can control team1:', canControlTeam1);
    console.log('User can control team2:', canControlTeam2);
  }, [currentGame, canControlTeam1, canControlTeam2]);

  // Check if either team has reached 21 points and show victory screen
  useEffect(() => {
    if (team1Score >= 21 && !showVictoryScreen) {
      setWinningTeam('team1');
      setShowVictoryScreen(true);
    } else if (team2Score >= 21 && !showVictoryScreen) {
      setWinningTeam('team2');
      setShowVictoryScreen(true);
    }
  }, [team1Score, team2Score, showVictoryScreen]);

  const handleVictoryClose = () => {
    setShowVictoryScreen(false);
    setWinningTeam(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            {/* Beyonder Logo */}
            <img 
              src="https://beyonder.eu/storage/uploads/0184aeeb-1507-4a47-8e6e-c3076839cab0/logo-name.svg" 
              alt="Beyonder" 
              className="h-8 w-auto brightness-0 invert"
            />
            
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cornhole Arena
              </h1>
              <p className="text-slate-400 text-sm">Multiplayer Competition</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Users className="h-5 w-5" />
            <span className="font-medium">4 Players Connected</span>
          </div>
        </div>

        {/* Live Camera Feeds */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-b border-slate-700">
              <CardTitle className="text-blue-300 flex items-center justify-center text-lg">
                <Camera className="h-5 w-5 mr-2" />
                Team 1 Board
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center">
                {camera1Active ? (
                  <div className="text-center">
                    <div className="w-40 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg shadow-2xl mb-4 relative border border-amber-500/20">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full border-4 border-white shadow-lg"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-green-400 font-medium">Live Feed</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <CameraOff className="h-12 w-12 mx-auto mb-3" />
                    <p className="font-medium">Camera Offline</p>
                  </div>
                )}
                <Button
                  onClick={() => setCamera1Active(!camera1Active)}
                  variant="outline"
                  size="sm"
                  className="absolute top-3 right-3 bg-slate-900/80 border-slate-600 text-white hover:bg-slate-800"
                >
                  {camera1Active ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-slate-700">
              <CardTitle className="text-purple-300 flex items-center justify-center text-lg">
                <Camera className="h-5 w-5 mr-2" />
                Team 2 Board
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center">
                {camera2Active ? (
                  <div className="text-center">
                    <div className="w-40 h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg shadow-2xl mb-4 relative border border-amber-500/20">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full border-4 border-white shadow-lg"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm text-green-400 font-medium">Live Feed</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <CameraOff className="h-12 w-12 mx-auto mb-3" />
                    <p className="font-medium">Camera Offline</p>
                  </div>
                )}
                <Button
                  onClick={() => setCamera2Active(!camera2Active)}
                  variant="outline"
                  size="sm"
                  className="absolute top-3 right-3 bg-slate-900/80 border-slate-600 text-white hover:bg-slate-800"
                >
                  {camera2Active ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams and Scores */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Team 1 */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-b border-slate-700">
              <CardTitle className="text-2xl text-blue-300">Team 1</CardTitle>
              <div className="text-5xl font-bold text-white mt-4 font-mono">{team1Score}</div>
              {canControlTeam1 && (
                <div className="text-sm text-green-400 font-medium">You can control this team's score</div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-200">
                      {players.team1Player1Name}
                    </div>
                    <div className="text-sm text-slate-400">Player 1</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-200">
                      {players.team1Player2Name}
                    </div>
                    <div className="text-sm text-slate-400">Player 2</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Select 
                  onValueChange={(value) => handleScoreChange('team1', value)}
                  disabled={!canControlTeam1}
                >
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Add points" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {scoreOptions.map((score) => (
                      <SelectItem 
                        key={score} 
                        value={score.toString()}
                        className="text-white hover:bg-slate-700"
                      >
                        +{score} points
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Team 2 */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-slate-700">
              <CardTitle className="text-2xl text-purple-300">Team 2</CardTitle>
              <div className="text-5xl font-bold text-white mt-4 font-mono">{team2Score}</div>
              {canControlTeam2 && (
                <div className="text-sm text-green-400 font-medium">You can control this team's score</div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-200">
                      {players.team2Player1Name}
                    </div>
                    <div className="text-sm text-slate-400">Player 1</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-200">
                      {players.team2Player2Name}
                    </div>
                    <div className="text-sm text-slate-400">Player 2</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Select 
                  onValueChange={(value) => handleScoreChange('team2', value)}
                  disabled={!canControlTeam2}
                >
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Add points" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {scoreOptions.map((score) => (
                      <SelectItem 
                        key={score} 
                        value={score.toString()}
                        className="text-white hover:bg-slate-700"
                      >
                        +{score} points
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-semibold text-white mb-2">
                🎯 Multiplayer Cornhole Match
              </div>
              <p className="text-slate-400 mb-6 text-sm">
                Live camera feeds connected • Real-time scoring • {gameCanEnd ? 'Game can be ended!' : 'First team to 21 wins!'}
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                >
                  Reset Scores
                </Button>
                <Button 
                  onClick={handleEndGame}
                  disabled={!gameCanEnd || isEndingGame}
                  className={`${gameCanEnd ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white disabled:opacity-50`}
                >
                  {isEndingGame ? 'Ending Game...' : 'End Game'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Component */}
      <GameChat 
        gameId={currentGame?.id || null}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />

      {/* Score Message Overlay */}
      {scoreMessageData && (
        <ScoreMessageOverlay
          score={scoreMessageData.score}
          team={scoreMessageData.team}
          show={showScoreMessage}
          onHide={() => {
            setShowScoreMessage(false);
            setScoreMessageData(null);
          }}
        />
      )}

      {/* Victory Screen */}
      {winningTeam && (
        <VictoryScreen
          show={showVictoryScreen}
          winningTeam={winningTeam}
          onClose={handleVictoryClose}
        />
      )}
    </div>
  );
};

export default GameView;
