
-- First, drop existing policies that depend on the columns we need to modify
DROP POLICY IF EXISTS "Users can view games they participate in" ON public.games;
DROP POLICY IF EXISTS "Users can create games" ON public.games;
DROP POLICY IF EXISTS "Users can update games they participate in" ON public.games;
DROP POLICY IF EXISTS "Users can view scores for their games" ON public.scores;
DROP POLICY IF EXISTS "Users can insert scores for their games" ON public.scores;

-- Enable realtime for the profiles table to track online users
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.profiles;

-- Create a table to track user presence/online status
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_presence table
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Create policies for user_presence table
CREATE POLICY "Users can view all online users" 
  ON public.user_presence 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own presence" 
  ON public.user_presence 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presence" 
  ON public.user_presence 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presence" 
  ON public.user_presence 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable realtime for user_presence table
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.user_presence;

-- Now we can safely modify the games table columns
-- First, update the existing columns to reference profiles instead of auth.users
ALTER TABLE public.games 
ALTER COLUMN team1_player1_id SET DATA TYPE UUID,
ALTER COLUMN team1_player2_id SET DATA TYPE UUID,
ALTER COLUMN team2_player1 SET DATA TYPE UUID,
ALTER COLUMN team2_player2 SET DATA TYPE UUID;

-- Rename columns for consistency
ALTER TABLE public.games 
RENAME COLUMN team2_player1 TO team2_player1_id;
ALTER TABLE public.games 
RENAME COLUMN team2_player2 TO team2_player2_id;

-- Add foreign key constraints to reference profiles
ALTER TABLE public.games 
ADD CONSTRAINT fk_team1_player1 FOREIGN KEY (team1_player1_id) REFERENCES public.profiles(id),
ADD CONSTRAINT fk_team1_player2 FOREIGN KEY (team1_player2_id) REFERENCES public.profiles(id),
ADD CONSTRAINT fk_team2_player1 FOREIGN KEY (team2_player1_id) REFERENCES public.profiles(id),
ADD CONSTRAINT fk_team2_player2 FOREIGN KEY (team2_player2_id) REFERENCES public.profiles(id);

-- Enable RLS on games table
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Recreate policies for games table with corrected column names
CREATE POLICY "Users can view games they participate in" 
  ON public.games 
  FOR SELECT 
  USING (
    team1_player1_id = auth.uid() OR 
    team1_player2_id = auth.uid() OR 
    team2_player1_id = auth.uid() OR 
    team2_player2_id = auth.uid()
  );

CREATE POLICY "Users can create games" 
  ON public.games 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update games they participate in" 
  ON public.games 
  FOR UPDATE 
  USING (
    team1_player1_id = auth.uid() OR 
    team1_player2_id = auth.uid() OR 
    team2_player1_id = auth.uid() OR 
    team2_player2_id = auth.uid()
  );

-- Recreate policies for scores table
CREATE POLICY "Users can view scores for their games" 
  ON public.scores 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = scores.game_id 
      AND (
        team1_player1_id = auth.uid() OR 
        team1_player2_id = auth.uid() OR 
        team2_player1_id = auth.uid() OR 
        team2_player2_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert scores for their games" 
  ON public.scores 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE games.id = scores.game_id 
      AND (
        team1_player1_id = auth.uid() OR 
        team1_player2_id = auth.uid() OR 
        team2_player1_id = auth.uid() OR 
        team2_player2_id = auth.uid()
      )
    )
  );
