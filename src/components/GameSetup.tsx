
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Play } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (players: { team1Player1: string; team1Player2: string; team2Player1: string; team2Player2: string }) => void;
  onBack: () => void;
}

const GameSetup = ({ onStartGame, onBack }: GameSetupProps) => {
  const [team1Player1, setTeam1Player1] = useState('');
  const [team1Player2, setTeam1Player2] = useState('');
  const [team2Player1, setTeam2Player1] = useState('');
  const [team2Player2, setTeam2Player2] = useState('');

  const handleStartGame = () => {
    if (team1Player1 && team1Player2 && team2Player1 && team2Player2) {
      onStartGame({
        team1Player1,
        team1Player2,
        team2Player1,
        team2Player2
      });
    }
  };

  const isValid = team1Player1 && team1Player2 && team2Player1 && team2Player2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-3xl font-bold text-amber-800">Setup New Game</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Team 1 */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-700">Team 1</CardTitle>
              <CardDescription>Enter player names for Team 1</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="team1-player1">Player 1</Label>
                <Input
                  id="team1-player1"
                  placeholder="Enter player name"
                  value={team1Player1}
                  onChange={(e) => setTeam1Player1(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="team1-player2">Player 2</Label>
                <Input
                  id="team1-player2"
                  placeholder="Enter player name"
                  value={team1Player2}
                  onChange={(e) => setTeam1Player2(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Team 2 */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-700">Team 2</CardTitle>
              <CardDescription>Enter player names for Team 2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="team2-player1">Player 1</Label>
                <Input
                  id="team2-player1"
                  placeholder="Enter player name"
                  value={team2Player1}
                  onChange={(e) => setTeam2Player1(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="team2-player2">Player 2</Label>
                <Input
                  id="team2-player2"
                  placeholder="Enter player name"
                  value={team2Player2}
                  onChange={(e) => setTeam2Player2(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={handleStartGame}
            disabled={!isValid}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Game
          </Button>
          {!isValid && (
            <p className="text-sm text-gray-600 mt-2">
              Please enter all player names to start the game
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
