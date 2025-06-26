
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreMessageOverlayProps {
  score: number;
  team: 'team1' | 'team2';
  show: boolean;
  onHide: () => void;
}

const scoreImages = {
  0: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/0%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMCBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ2ODA4LCJleHAiOjE3ODI0ODI4MDh9.RCj5pQ-cpRLxw-wDY80nOHtyb9hrPVEGyfLWqMsoKIk",
  1: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/1%20point.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMSBwb2ludC5wbmciLCJpYXQiOjE3NTA5NDY5MTAsImV4cCI6MTc4MjQ4MjkxMH0.dmtdE3aVAc9KlAifJZ3CvT81EizuV3RagOXUFMIFuas",
  2: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/2%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMiBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDA2LCJleHAiOjE3ODI0ODMwMDZ9.t_s_IGtwavSaWvwGoUZYUoIuTUIHDTQtsIMw5YoDvuM",
  3: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/3%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMyBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDMyLCJleHAiOjE3ODI0ODMwMzJ9.po3mc3LdyfANUoKQOdyIJHUXk0xLPJ_516ida3GahCA",
  4: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/3%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMyBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDMyLCJleHAiOjE3ODI0ODMwMzJ9.po3mc3LdyfANUoKQOdyIJHUXk0xLPJ_516ida3GahCA",
  5: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/5%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvNSBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDU1LCJleHAiOjE3ODI0ODMwNTV9.0GoaOK8154zwXCkyT8giBlAwVqR66S8UXlFkJqK8PaY",
  6: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/6%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvNiBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDY1LCJleHAiOjE3ODI0ODMwNjV9.fgn80Cu8e6QqpRzbcGI77Iq7S2K46fFrxvbFezr4S-A",
  7: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/7%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvNyBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDc3LCJleHAiOjE3ODI0ODMwNzd9.CQRfo0KY3r4Z0WOf3aRFizMrbPoCy_PnT6dS8Rf_kbg",
  8: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/7%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvNyBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDc3LCJleHAiOjE3ODI0ODMwNzd9.CQRfo0KY3r4Z0WOf3aRFizMrbPoCy_PnT6dS8Rf_kbg",
  9: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/7%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvNyBwb2ludHMucG5nIiwiaWF0IjoxNzUwOTQ3MDc3LCJleHAiOjE3ODI0ODMwNzd9.CQRfo0KY3r4Z0WOf3aRFizMrbPoCy_PnT6dS8Rf_kbg",
  10: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/10%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMTAgcG9pbnRzLnBuZyIsImlhdCI6MTc1MDk0NjkyNCwiZXhwIjoxNzgyNDgyOTI0fQ.UynG0JJVofNLNYG-1pg8GMN5j0AL66jSn5iPdQsEg9s",
  11: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/10%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMTAgcG9pbnRzLnBuZyIsImlhdCI6MTc1MDk0NjkyNCwiZXhwIjoxNzgyNDgyOTI0fQ.UynG0JJVofNLNYG-1pg8GMN5j0AL66jSn5iPdQsEg9s",
  12: "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/score-images/12%20points.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9zY29yZS1pbWFnZXMvMTIgcG9pbnRzLnBuZyIsImlhdCI6MTc1MDk0Njk5MCwiZXhwIjoxNzgyNDgyOTkwfQ.JVVomZtoNEIC1VKRBbDyvU5yCUJrfiX23an-YxfeVNM"
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
