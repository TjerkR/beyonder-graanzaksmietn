
-- Create a table for chat messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.multiplayer_games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for players to view chat messages in their games
CREATE POLICY "Players can view chat messages in their games" 
  ON public.chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.multiplayer_games 
      WHERE id = chat_messages.game_id 
      AND (
        auth.uid() = team1_player1_id OR 
        auth.uid() = team1_player2_id OR 
        auth.uid() = team2_player1_id OR 
        auth.uid() = team2_player2_id
      )
    )
  );

-- Create policy for players to send chat messages in their games
CREATE POLICY "Players can send chat messages in their games" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.multiplayer_games 
      WHERE id = chat_messages.game_id 
      AND (
        auth.uid() = team1_player1_id OR 
        auth.uid() = team1_player2_id OR 
        auth.uid() = team2_player1_id OR 
        auth.uid() = team2_player2_id
      )
    )
  );

-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
