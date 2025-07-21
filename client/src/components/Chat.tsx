import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { ChatMessage, User } from '@shared/schema';

interface ChatProps {
  maxHeight?: string;
  showHeader?: boolean;
}

export function Chat({ maxHeight = "h-80", showHeader = true }: ChatProps) {
  const [messages, setMessages] = useState<(ChatMessage & { author?: User })[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { user } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data.data]);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setSocket(null);
    };
    
    // Fetch existing messages
    fetchMessages();
    
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    socket.send(JSON.stringify({
      type: 'chat_message',
      content: newMessage,
      authorId: user.id
    }));

    setNewMessage('');
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="flex flex-col h-full">
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="flex-1 flex flex-col p-3">
        <div className={`flex-1 overflow-y-auto space-y-3 mb-4 ${maxHeight}`}>
          {messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {message.author?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className="text-xs text-gray-500 ml-3">
                  {message.author?.name || 'Usuário'} - {formatTime(message.createdAt || '')}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!socket}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
