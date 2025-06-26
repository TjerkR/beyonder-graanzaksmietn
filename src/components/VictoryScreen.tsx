
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface VictoryScreenProps {
  show: boolean;
  winningTeam: 'team1' | 'team2';
  onClose: () => void;
}

const VictoryScreen = ({ show, winningTeam, onClose }: VictoryScreenProps) => {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    if (show) {
      setVideoEnded(false);
    }
  }, [show]);

  if (!show) return null;

  const videoUrl = "https://zqierduvidlvcdxkpiba.supabase.co/storage/v1/object/sign/beyonder-graansmiet-bucket/Win%20screen.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNDQxNGMxMi00Zjg1LTQ0MTAtOTViZS0yMGQwODdkMThlZjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiZXlvbmRlci1ncmFhbnNtaWV0LWJ1Y2tldC9XaW4gc2NyZWVuLm1wNCIsImlhdCI6MTc1MDk0NTg2OCwiZXhwIjoxNzUxODA5ODY4fQ.VSK0SIjU5Vcpkw9Tcp0dny-D7zJfvGTkfKam-PE-vfI";

  const teamColor = winningTeam === 'team1' ? 'from-blue-600 to-blue-800' : 'from-purple-600 to-purple-800';

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Victory message overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className={`bg-gradient-to-r ${teamColor} px-8 py-4 rounded-lg shadow-2xl border-2 border-white/20 backdrop-blur-sm`}>
          <h1 className="text-4xl font-bold text-white text-center">
            🎉 Team {winningTeam === 'team1' ? '1' : '2'} Wins! 🎉
          </h1>
          <p className="text-white/80 text-center mt-2">Congratulations on reaching 21 points!</p>
        </div>
      </div>

      {/* Video player */}
      <video
        className="w-full h-full object-contain"
        autoPlay
        onEnded={() => setVideoEnded(true)}
        onError={(e) => {
          console.error('Video failed to load:', e);
          setVideoEnded(true);
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback message if video fails or ends */}
      {videoEnded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className={`bg-gradient-to-r ${teamColor} p-12 rounded-2xl shadow-2xl border-2 border-white/20 text-center max-w-lg mx-4`}>
            <h1 className="text-5xl font-bold text-white mb-4">
              🏆 Victory! 🏆
            </h1>
            <h2 className="text-3xl font-semibold text-white mb-6">
              Team {winningTeam === 'team1' ? '1' : '2'} Wins!
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Congratulations on an amazing game!
            </p>
            <Button
              onClick={onClose}
              className="bg-white text-slate-900 hover:bg-white/90 font-semibold px-8 py-3 text-lg"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VictoryScreen;
