
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-amber-800">Loading online players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-amber-800">Setup Multiplayer Game</h1>
            <div className="flex items-center text-amber-700 mt-1">
              <Users className="h-4 w-4 mr-2" />
              <span>{allAvailablePlayers.length} players online</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PlayerSelector
            onlineUsers={team1AvailablePlayers}
            selectedPlayers={team1Players}
            onPlayerSelect={handleTeam1PlayerSelect}
            maxPlayers={2}
            title="Team 1"
            description="Select 2 players for Team 1"
          />

          <PlayerSelector
            onlineUsers={team2AvailablePlayers}
            selectedPlayers={team2Players}
            onPlayerSelect={handleTeam2PlayerSelect}
            maxPlayers={2}
            title="Team 2"
            description="Select 2 players for Team 2"
          />
        </div>

        <div className="text-center">
          <Button
            onClick={handleStartGame}
            disabled={!isValid}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Multiplayer Game
          </Button>
          {!isValid && (
            <p className="text-sm text-gray-600 mt-2">
              Please select 2 players for each team to start the game
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
