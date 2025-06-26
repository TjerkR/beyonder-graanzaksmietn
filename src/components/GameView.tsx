
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';

interface GameViewProps {
  players: {
    team1Player1: string;
    team1Player2: string;
    team2Player1: string;
    team2Player2: string;
  };
  onBack: () => void;
}

const GameView = ({ players, onBack }: GameViewProps) => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-amber-800">Game in Progress</h1>
          </div>
          <div className="flex items-center text-amber-700">
            <Users className="h-5 w-5 mr-2" />
            <span className="text-lg font-semibold">4 Players</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Team 1 */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="text-center bg-blue-50">
              <CardTitle className="text-2xl text-blue-700">Team 1</CardTitle>
              <div className="text-4xl font-bold text-blue-800 mt-2">{team1Score}</div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-3 bg-blue-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-800">
                      {players.team1Player1}
                    </div>
                    <div className="text-sm text-blue-600">Player 1</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-3 bg-blue-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-800">
                      {players.team1Player2}
                    </div>
                    <div className="text-sm text-blue-600">Player 2</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team 2 */}
          <Card className="border-2 border-red-200">
            <CardHeader className="text-center bg-red-50">
              <CardTitle className="text-2xl text-red-700">Team 2</CardTitle>
              <div className="text-4xl font-bold text-red-800 mt-2">{team2Score}</div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-3 bg-red-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-800">
                      {players.team2Player1}
                    </div>
                    <div className="text-sm text-red-600">Player 1</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-3 bg-red-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-800">
                      {players.team2Player2}
                    </div>
                    <div className="text-sm text-red-600">Player 2</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Actions */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-lg font-semibold text-amber-800 mb-4">
                🎯 Cornhole Game Active
              </div>
              <p className="text-gray-600 mb-4">
                Game is ready to play! Score tracking and gameplay features coming soon.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Add Score
                </Button>
                <Button variant="outline" className="w-full">
                  End Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameView;
