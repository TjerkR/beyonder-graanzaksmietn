
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreMessageOverlayProps {
  score: number;
  team: 'team1' | 'team2';
  show: boolean;
  onHide: () => void;
}

const ScoreMessageOverlay = ({ score, team, show, onHide }: ScoreMessageOverlayProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onHide(), 300); // Wait for fade out animation
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  const teamColor = team === 'team1' ? 'from-blue-600 to-blue-800' : 'from-purple-600 to-purple-800';
  const teamBorder = team === 'team1' ? 'border-blue-500' : 'border-purple-500';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className={`bg-gradient-to-br ${teamColor} border-2 ${teamBorder} backdrop-blur-sm max-w-lg mx-4 transform transition-all duration-300 ${visible ? 'scale-100' : 'scale-95'}`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <div className="text-6xl font-bold text-white drop-shadow-lg">
                {score}
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {score === 0 ? 'Miss!' : `${score} Point${score !== 1 ? 's' : ''}!`}
          </div>
          <div className="text-lg text-white/80 mb-4">
            {score === 3 ? 'Hole in One!' : score === 1 ? 'Nice Shot!' : score === 0 ? 'Better luck next time!' : 'Great throw!'}
          </div>
          <div className="mt-6 text-sm text-white/70">
            Team {team === 'team1' ? '1' : '2'} • Message disappears in 3 seconds
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreMessageOverlay;
