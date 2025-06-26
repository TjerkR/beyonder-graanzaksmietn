
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Check } from 'lucide-react';
import { OnlineUser } from '@/hooks/usePresence';

interface PlayerSelectorProps {
  onlineUsers: OnlineUser[];
  selectedPlayers: string[];
  onPlayerSelect: (playerId: string) => void;
  maxPlayers: number;
  title: string;
  description: string;
}

const PlayerSelector = ({ 
  onlineUsers, 
  selectedPlayers, 
  onPlayerSelect, 
  maxPlayers, 
  title, 
  description 
}: PlayerSelectorProps) => {
  return (
    <Card className="bg-slate-800/90 border-slate-600 text-white h-full">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
        <CardDescription className="text-slate-300">{description}</CardDescription>
        <div className="text-sm text-purple-300 font-medium">
          Selected: {selectedPlayers.length}/{maxPlayers}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {onlineUsers.map((user) => {
          const isSelected = selectedPlayers.includes(user.id);
          const canSelect = !isSelected && selectedPlayers.length < maxPlayers;
          
          return (
            <Button
              key={user.id}
              onClick={() => onPlayerSelect(user.id)}
              disabled={!canSelect && !isSelected}
              variant={isSelected ? "default" : "outline"}
              className={`w-full justify-start h-auto p-4 transition-all duration-200 ${
                isSelected 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none" 
                  : "bg-slate-700/50 border-slate-500 text-slate-200 hover:bg-slate-600/70 hover:border-purple-400"
              }`}
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-10 w-10 border-2 border-slate-500">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="bg-slate-600 text-slate-200">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-base">
                    {user.full_name || user.email || 'Anonymous'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {user.email}
                  </div>
                </div>
                {isSelected && <Check className="h-5 w-5 text-green-400" />}
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
              </div>
            </Button>
          );
        })}
        {onlineUsers.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No other players online</p>
            <p className="text-sm">Players will appear here when they join</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerSelector;
