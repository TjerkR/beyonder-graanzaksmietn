
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Users, Loader2 } from 'lucide-react';
import { usePresence } from '@/hooks/usePresence';
import { useAuth } from '@/contexts/AuthContext';
import PlayerSelector from './PlayerSelector';

interface GameSetupProps {
  onStartGame: (players: { 
    team1Player1Id: string; 
    team1Player2Id: string; 
    team2Player1Id: string; 
    team2Player2Id: string;
    team1Player1Name: string;
    team1Player2Name: string;
    team2Player1Name: string;
    team2Player2Name: string;
  }) => void;
  onBack: () => void;
}

const GameSetup = ({ onStartGame, onBack }: GameSetupProps) => {
  const { user } = useAuth();
  const { onlineUsers, loading } = usePresence();
  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);

  const handleTeam1PlayerSelect = (playerId: string) => {
    if (team1Players.includes(playerId)) {
      setTeam1Players(team1Players.filter(id => id !== playerId));
    } else if (team1Players.length < 2) {
      setTeam1Players([...team1Players, playerId]);
    }
  };

  const handleTeam2PlayerSelect = (playerId: string) => {
    if (team2Players.includes(playerId)) {
      setTeam2Players(team2Players.filter(id => id !== playerId));
    } else if (team2Players.length < 2) {
      setTeam2Players([...team2Players, playerId]);
    }
  };

  const getPlayerName = (playerId: string) => {
    if (playerId === user?.id) return user?.user_metadata?.full_name || 'You';
    const player = onlineUsers.find(u => u.id === playerId);
    return player?.full_name || player?.email || 'Unknown Player';
  };

  const handleStartGame = () => {
    if (team1Players.length === 2 && team2Players.length === 2) {
      onStartGame({
        team1Player1Id: team1Players[0],
        team1Player2Id: team1Players[1],
        team2Player1Id: team2Players[0],
        team2Player2Id: team2Players[1],
        team1Player1Name: getPlayerName(team1Players[0]),
        team1Player2Name: getPlayerName(team1Players[1]),
        team2Player1Name: getPlayerName(team2Players[0]),
        team2Player2Name: getPlayerName(team2Players[1])
      });
    }
  };

  const isValid = team1Players.length === 2 && team2Players.length === 2;
  
  // Include current user in available players
  const currentUser = user ? {
    id: user.id,
    full_name: user.user_metadata?.full_name || null,
    email: user.email || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    is_online: true,
    last_seen: new Date().toISOString()
  } : null;

  const allAvailablePlayers = currentUser ? [currentUser, ...onlineUsers.filter(u => u.id !== user.id)] : onlineUsers;
  
  // Filter out already selected players from the other team
  const team1AvailablePlayers = allAvailablePlayers.filter(user => !team2Players.includes(user.id));
  const team2AvailablePlayers = allAvailablePlayers.filter(user => !team1Players.includes(user.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-purple-200">Loading online players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Setup Multiplayer Game</h1>
              <div className="flex items-center text-purple-300 mt-1">
                <Users className="h-4 w-4 mr-2" />
                <span>{allAvailablePlayers.length} players online</span>
              </div>
            </div>
          </div>
          
          {/* Beyonder Logo */}
          <div className="flex items-center">
            <img 
              src="https://beyonder.eu/storage/uploads/0184aeeb-1507-4a47-8e6e-c3076839cab0/logo-name.svg" 
              alt="Beyonder" 
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Team Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl border border-blue-400/30 p-1">
            <PlayerSelector
              onlineUsers={team1AvailablePlayers}
              selectedPlayers={team1Players}
              onPlayerSelect={handleTeam1PlayerSelect}
              maxPlayers={2}
              title="Team 1"
              description="Select 2 players for Team 1"
            />
          </div>

          <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-xl border border-red-400/30 p-1">
            <PlayerSelector
              onlineUsers={team2AvailablePlayers}
              selectedPlayers={team2Players}
              onPlayerSelect={handleTeam2PlayerSelect}
              maxPlayers={2}
              title="Team 2"
              description="Select 2 players for Team 2"
            />
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <Button
            onClick={handleStartGame}
            disabled={!isValid}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Play className="h-6 w-6 mr-3" />
            Start Multiplayer Game
          </Button>
          {!isValid && (
            <p className="text-purple-300 mt-4 text-sm">
              Please select 2 players for each team to start the game
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
