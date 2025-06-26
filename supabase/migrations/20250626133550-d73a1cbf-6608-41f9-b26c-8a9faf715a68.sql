
-- Create a table to store player statistics
CREATE TABLE public.player_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL,
  total_points INTEGER NOT NULL DEFAULT 0,
  games_won INTEGER NOT NULL DEFAULT 0,
  games_lost INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view all player stats (for leaderboards)
CREATE POLICY "Anyone can view player stats" 
  ON public.player_stats 
  FOR SELECT 
  USING (true);

-- Create policy that allows the system to insert/update stats
CREATE POLICY "System can manage player stats" 
  ON public.player_stats 
  FOR ALL 
  USING (true);

-- Create database function to update player statistics
CREATE OR REPLACE FUNCTION public.update_player_stats(
  player_id UUID,
  points_to_add INTEGER,
  games_won INTEGER,
  games_lost INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.player_stats (player_id, total_points, games_won, games_lost, updated_at)
  VALUES (player_id, points_to_add, games_won, games_lost, now())
  ON CONFLICT (player_id)
  DO UPDATE SET
    total_points = player_stats.total_points + points_to_add,
    games_won = player_stats.games_won + games_won,
    games_lost = player_stats.games_lost + games_lost,
    updated_at = now();
END;
$$;
