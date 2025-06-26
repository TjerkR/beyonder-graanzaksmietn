
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnlineUser {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_online: boolean;
  last_seen: string;
}

export const usePresence = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const updatePresence = async () => {
      // Upsert current user's presence
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          is_online: true,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    };

    const fetchOnlineUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          user_presence!inner(
            is_online,
            last_seen
          )
        `)
        .eq('user_presence.is_online', true);

      if (!error && data) {
        const users = data.map(profile => ({
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          is_online: true,
          last_seen: profile.user_presence[0]?.last_seen || new Date().toISOString()
        }));
        setOnlineUsers(users);
      }
      setLoading(false);
    };

    // Update presence immediately
    updatePresence();
    fetchOnlineUsers();

    // Set up realtime subscription
    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        () => {
          fetchOnlineUsers();
        }
      )
      .subscribe();

    // Update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    // Cleanup function
    return () => {
      // Mark user as offline
      supabase
        .from('user_presence')
        .update({
          is_online: false,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { onlineUsers, loading };
};
