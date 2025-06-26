
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Camera, CameraOff, Plus, Minus } from 'lucide-react';

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
  const [camera1Active, setCamera1Active] = useState(true);
  const [camera2Active, setCamera2Active] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
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
              <p className="text-slate-400 text-sm">Remote Competition</p>
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
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-200">
                      {players.team1Player1}
                    </div>
                    <div className="text-sm text-slate-400">Player 1</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-200">
                      {players.team1Player2}
                    </div>
                    <div className="text-sm text-slate-400">Player 2</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  onClick={() => setTeam1Score(Math.max(0, team1Score - 1))}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setTeam1Score(team1Score + 1)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team 2 */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-slate-700">
              <CardTitle className="text-2xl text-purple-300">Team 2</CardTitle>
              <div className="text-5xl font-bold text-white mt-4 font-mono">{team2Score}</div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-200">
                      {players.team2Player1}
                    </div>
                    <div className="text-sm text-slate-400">Player 1</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-200">
                      {players.team2Player2}
                    </div>
                    <div className="text-sm text-slate-400">Player 2</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  onClick={() => setTeam2Score(Math.max(0, team2Score - 1))}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setTeam2Score(team2Score + 1)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-semibold text-white mb-2">
                🎯 Remote Cornhole Match
              </div>
              <p className="text-slate-400 mb-6 text-sm">
                Live camera feeds connected • Real-time scoring
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                >
                  Reset Scores
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
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
