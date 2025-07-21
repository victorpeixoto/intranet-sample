import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Minimize2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { User } from '@shared/schema';

interface PrivateMessage {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  senderName: string;
  timestamp: Date;
}

interface PrivateChatProps {
  contact: User;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized?: boolean;
}

export function PrivateChat({ contact, onClose, onMinimize, isMinimized = false }: PrivateChatProps) {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages para demonstração
  useEffect(() => {
    const mockMessages: PrivateMessage[] = [
      {
        id: 1,
        content: "Oi! Como você está?",
        senderId: contact.id,
        receiverId: user?.id || 0,
        senderName: contact.name,
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutos atrás
      },
      {
        id: 2,
        content: "Olá! Estou bem, obrigado. E você?",
        senderId: user?.id || 0,
        receiverId: contact.id,
        senderName: user?.name || '',
        timestamp: new Date(Date.now() - 1000 * 60 * 3) // 3 minutos atrás
      },
      {
        id: 3,
        content: "Também estou bem! Você pode me ajudar com aquele relatório?",
        senderId: contact.id,
        receiverId: user?.id || 0,
        senderName: contact.name,
        timestamp: new Date(Date.now() - 1000 * 60 * 1) // 1 minuto atrás
      }
    ];
    setMessages(mockMessages);
  }, [contact, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: PrivateMessage = {
      id: Date.now(),
      content: newMessage,
      senderId: user.id,
      receiverId: contact.id,
      senderName: user.name,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isMinimized) {
    return (
      <div 
        onClick={onMinimize}
        className="fixed bottom-4 right-20 w-60 bg-white border rounded-t-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow z-40"
      >
        <div className="p-3 border-b bg-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-white text-primary text-xs">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">{contact.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="p-3 text-sm text-gray-600">
          Clique para expandir o chat
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-20 w-80 h-96 flex flex-col shadow-xl z-40">
      <CardHeader className="pb-2 bg-primary text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white text-primary">
                {contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{contact.name}</CardTitle>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-xs opacity-90">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((message) => {
              const isFromUser = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isFromUser ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        isFromUser
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      isFromUser ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 text-sm"
            />
            <Button type="submit" size="sm" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}