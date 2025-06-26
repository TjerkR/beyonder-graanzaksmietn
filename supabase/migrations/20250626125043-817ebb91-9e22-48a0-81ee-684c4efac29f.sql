
-- Create a table for multiplayer games
CREATE TABLE public.multiplayer_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES auth.users NOT NULL,
  team1_player1_id UUID NOT NULL,
  team1_player2_id UUID NOT NULL,
  team2_player1_id UUID NOT NULL,
  team2_player2_id UUID NOT NULL,
  team1_player1_name TEXT NOT NULL,
  team1_player2_name TEXT NOT NULL,
  team2_player1_name TEXT NOT NULL,
  team2_player2_name TEXT NOT NULL,
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.multiplayer_games ENABLE ROW LEVEL SECURITY;

-- Create policy for players to view games they are part of
CREATE POLICY "Players can view their games" 
  ON public.multiplayer_games 
  FOR SELECT 
  USING (
    auth.uid() = team1_player1_id OR 
    auth.uid() = team1_player2_id OR 
    auth.uid() = team2_player1_id OR 
    auth.uid() = team2_player2_id
  );

-- Create policy for host to create games
CREATE POLICY "Host can create games" 
  ON public.multiplayer_games 
  FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

-- Create policy for players to update game scores
CREATE POLICY "Players can update game scores" 
  ON public.multiplayer_games 
  FOR UPDATE 
  USING (
    auth.uid() = team1_player1_id OR 
    auth.uid() = team1_player2_id OR 
    auth.uid() = team2_player1_id OR 
    auth.uid() = team2_player2_id
  );

-- Enable realtime for multiplayer games
ALTER TABLE public.multiplayer_games REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_games;
