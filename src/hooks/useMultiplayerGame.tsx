
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MultiplayerGame {
  id: string;
  host_id: string;
  team1_player1_id: string;
  team1_player2_id: string;
  team2_player1_id: string;
  team2_player2_id: string;
  team1_player1_name: string;
  team1_player2_name: string;
  team2_player1_name: string;
  team2_player2_name: string;
  team1_score: number;
  team2_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useMultiplayerGame = () => {
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState<MultiplayerGame | null>(null);
  const [loading, setLoading] = useState(true);

  const createGame = async (players: {
    team1Player1Id: string;
    team1Player2Id: string;
    team2Player1Id: string;
    team2Player2Id: string;
    team1Player1Name: string;
    team1Player2Name: string;
    team2Player1Name: string;
    team2Player2Name: string;
  }) => {
    if (!user) return null;

    console.log('Creating multiplayer game with players:', players);

    const { data, error } = await supabase
      .from('multiplayer_games')
      .insert({
        host_id: user.id,
        team1_player1_id: players.team1Player1Id,
        team1_player2_id: players.team1Player2Id,
        team2_player1_id: players.team2Player1Id,
        team2_player2_id: players.team2Player2Id,
        team1_player1_name: players.team1Player1Name,
        team1_player2_name: players.team1Player2Name,
        team2_player1_name: players.team2Player1Name,
        team2_player2_name: players.team2Player2Name,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      return null;
    }

    console.log('Game created successfully:', data);
    return data;
  };

  const updateScore = async (gameId: string, team: 'team1' | 'team2', newScore: number) => {
    if (!user || !currentGame) return false;

    // Check if user can control this team's score
    const canControlTeam1 = currentGame.team1_player1_id === user.id || currentGame.team1_player2_id === user.id;
    const canControlTeam2 = currentGame.team2_player1_id === user.id || currentGame.team2_player2_id === user.id;

    if ((team === 'team1' && !canControlTeam1) || (team === 'team2' && !canControlTeam2)) {
      console.log('User cannot control this team\'s score');
      return false;
    }

    const updateData = team === 'team1' 
      ? { team1_score: newScore, updated_at: new Date().toISOString() }
      : { team2_score: newScore, updated_at: new Date().toISOString() };

    const { error } = await supabase
      .from('multiplayer_games')
      .update(updateData)
      .eq('id', gameId);

    if (error) {
      console.error('Error updating score:', error);
      return false;
    }

    return true;
  };

  const endGame = async (gameId: string) => {
    if (!user || !currentGame) return false;

    const { error } = await supabase
      .from('multiplayer_games')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', gameId);

    if (error) {
      console.error('Error ending game:', error);
      return false;
    }

    // Clear the current game
    setCurrentGame(null);
    return true;
  };

  const checkForActiveGame = async () => {
    if (!user) return;

    console.log('Checking for active game for user:', user.id);

    const { data, error } = await supabase
      .from('multiplayer_games')
      .select('*')
      .eq('status', 'active')
      .or(`team1_player1_id.eq.${user.id},team1_player2_id.eq.${user.id},team2_player1_id.eq.${user.id},team2_player2_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error checking for active game:', error);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      console.log('Found active game:', data[0]);
      setCurrentGame(data[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    checkForActiveGame();

    // Set up real-time subscription
    const channel = supabase
      .channel('multiplayer-games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'multiplayer_games'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const game = payload.new as MultiplayerGame;
            
            // Check if current user is part of this game
            const isPlayerInGame = 
              game.team1_player1_id === user.id ||
              game.team1_player2_id === user.id ||
              game.team2_player1_id === user.id ||
              game.team2_player2_id === user.id;

            if (isPlayerInGame && game.status === 'active') {
              console.log('User is part of this game, updating current game');
              setCurrentGame(game);
            } else if (isPlayerInGame && game.status === 'completed') {
              console.log('Game completed, clearing current game');
              setCurrentGame(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    currentGame,
    loading,
    createGame,
    updateScore,
    endGame,
    checkForActiveGame
  };
};
