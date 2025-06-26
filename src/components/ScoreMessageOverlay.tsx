
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreMessageOverlayProps {
  score: number;
  team: 'team1' | 'team2';
  show: boolean;
  onHide: () => void;
}

const scoreImages = {
  0: "/lovable-uploads/0d8b6b84-c7b2-4dbb-b8f1-98a5f69c4b73.png",
  1: "/lovable-uploads/5aa5dd4c-5cd2-46ac-9f2b-8ef3d4de5dd6.png",
  2: "/lovable-uploads/2ee5ee2d-efda-4b67-8b72-6e5e4a95e993.png",
  3: "/lovable-uploads/f02ee90a-71dd-4080-aa21-4b21b1eda5a8.png",
  4: "/lovable-uploads/3e34ca85-bbe6-41c7-bb19-5e0a81c6b47b.png",
  5: "/lovable-uploads/6d46b988-4062-4fb3-8eaa-d43e8d9e9a9e.png",
  6: "/lovable-uploads/b24a9fb8-7f49-47a4-a4c5-6d2ab1d05a2a.png",
  7: "/lovable-uploads/68d3baba-f7a6-4b2f-bab7-ccf0e3fc4dd3.png",
  8: "/lovable-uploads/7a0825b8-8cad-47b3-a346-b3c30b7f44b7.png",
  9: "/lovable-uploads/b02e6b32-3b7a-4a7b-b5e4-b3c30b7f44b7.png",
  10: "/lovable-uploads/41a2754e-6fe2-4d19-a369-f97d5ac0d925.png",
  11: "/lovable-uploads/5aa5dd4c-5cd2-46ac-9f2b-8ef3d4de5dd6.png", // Using image 1 as placeholder for 11
  12: "/lovable-uploads/4256c128-83c6-4935-9fed-af67dbee0e1d.png"
};

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

  const imageUrl = scoreImages[score as keyof typeof scoreImages];
  const teamColor = team === 'team1' ? 'from-blue-600 to-blue-800' : 'from-purple-600 to-purple-800';
  const teamBorder = team === 'team1' ? 'border-blue-500' : 'border-purple-500';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className={`bg-gradient-to-br ${teamColor} border-2 ${teamBorder} backdrop-blur-sm max-w-lg mx-4 transform transition-all duration-300 ${visible ? 'scale-100' : 'scale-95'}`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <img 
              src={imageUrl} 
              alt={`${score} points`}
              className="w-full h-auto max-w-md mx-auto rounded-lg shadow-lg"
            />
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
