
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreMessageOverlayProps {
  score: number;
  team: 'team1' | 'team2';
  show: boolean;
  onHide: () => void;
}

const scoreMessages = {
  0: {
    title: "0 points! That was absolutely horrible!",
    subtitle: "A complete disaster. Let's never speak of it again."
  },
  1: {
    title: "1 point! Yikes, that was bad.",
    subtitle: "Cringeworthy and hard to watch. Serious rework needed."
  },
  2: {
    title: "2 points! That really missed the mark.",
    subtitle: "Intent was there, but the result? Not even close."
  },
  3: {
    title: "3 points! Hmm… not great.",
    subtitle: "Some effort, but overall just disappointing."
  },
  4: {
    title: "4 points! Well, that didn't go as planned.",
    subtitle: "There were glimpses of promise, but it fizzled out."
  },
  5: {
    title: "5 points! Meh, it was okay I guess.",
    subtitle: "Mediocre at best — no offense, but no applause either."
  },
  6: {
    title: "6 points! Alright, not bad.",
    subtitle: "Perfectly average. Neither thrilling nor upsetting."
  },
  7: {
    title: "7 points! Hey, that was decent!",
    subtitle: "Solid work. You're onto something."
  },
  8: {
    title: "8 points! Now we're talking!",
    subtitle: "Things are clicking — this is getting really good."
  },
  9: {
    title: "9 points! That was actually really good!",
    subtitle: "Genuinely impressive. People took notice."
  },
  10: {
    title: "10 points! Wow, that was fantastic!",
    subtitle: "You crushed it. Big energy, big results."
  },
  11: {
    title: "11 points! Outstanding performance!",
    subtitle: "Nearly perfect execution. You're at the top of your game."
  },
  12: {
    title: "12 points! Amazing! The whole world loves you!",
    subtitle: "Legendary. The kind of success that echoes through time."
  }
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

  const message = scoreMessages[score as keyof typeof scoreMessages];
  const teamColor = team === 'team1' ? 'from-blue-600 to-blue-800' : 'from-purple-600 to-purple-800';
  const teamBorder = team === 'team1' ? 'border-blue-500' : 'border-purple-500';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className={`bg-gradient-to-br ${teamColor} border-2 ${teamBorder} backdrop-blur-sm max-w-md mx-4 transform transition-all duration-300 ${visible ? 'scale-100' : 'scale-95'}`}>
        <CardContent className="p-8 text-center">
          <div className="text-2xl font-bold text-white mb-4">
            {message.title}
          </div>
          <div className="text-lg text-white/90">
            {message.subtitle}
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
