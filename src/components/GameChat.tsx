
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle, X } from 'lucide-react';
import { useGameChat } from '@/hooks/useGameChat';
import { useAuth } from '@/contexts/AuthContext';

interface GameChatProps {
  gameId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

const GameChat = ({ gameId, isOpen, onToggle }: GameChatProps) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useGameChat(gameId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 bg-slate-800/95 border-slate-600 text-white shadow-xl z-50 backdrop-blur-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-300 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Game Chat
          </CardTitle>
          <Button
            onClick={onToggle}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64">
          {loading ? (
            <div className="text-center text-slate-400 py-4">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 py-4">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.user_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="text-xs text-slate-400 mb-1">
                        {message.user_name}
                      </div>
                    )}
                    <div className="text-sm">{message.message}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-600">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              maxLength={500}
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameChat;
