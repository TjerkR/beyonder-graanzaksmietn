
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  game_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export const useGameChat = (gameId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const sendMessage = async (message: string) => {
    if (!user || !gameId || !message.trim()) return false;

    console.log('Sending chat message:', { gameId, message });

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        game_id: gameId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        message: message.trim(),
      });

    if (error) {
      console.error('Error sending message:', error);
      return false;
    }

    return true;
  };

  const loadMessages = async () => {
    if (!gameId) return;

    console.log('Loading chat messages for game:', gameId);

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('game_id', gameId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
      return;
    }

    console.log('Loaded messages:', data);
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    loadMessages();

    // Set up real-time subscription for chat messages
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('New chat message received:', payload);
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  return {
    messages,
    loading,
    sendMessage
  };
};
