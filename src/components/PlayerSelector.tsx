
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="text-sm text-gray-600">
          Selected: {selectedPlayers.length}/{maxPlayers}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-60 overflow-y-auto">
        {onlineUsers.map((user) => {
          const isSelected = selectedPlayers.includes(user.id);
          const canSelect = !isSelected && selectedPlayers.length < maxPlayers;
          
          return (
            <Button
              key={user.id}
              onClick={() => onPlayerSelect(user.id)}
              disabled={!canSelect && !isSelected}
              variant={isSelected ? "default" : "outline"}
              className="w-full justify-start h-auto p-3"
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium">
                    {user.full_name || user.email || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-green-600" />}
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </Button>
          );
        })}
        {onlineUsers.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No other players online
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerSelector;
