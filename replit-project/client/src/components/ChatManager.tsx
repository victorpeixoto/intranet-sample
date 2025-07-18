import { useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { PrivateChat } from './PrivateChat';
import type { User } from '@shared/schema';

interface ActiveChat {
  contact: User;
  isMinimized: boolean;
}

export function ChatManager() {
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);

  const handleContactSelect = (contact: User) => {
    // Verifica se já existe um chat com este contato
    const existingChatIndex = activeChats.findIndex(chat => chat.contact.id === contact.id);
    
    if (existingChatIndex !== -1) {
      // Se existe, expande o chat
      setActiveChats(prev => 
        prev.map((chat, index) => 
          index === existingChatIndex ? { ...chat, isMinimized: false } : chat
        )
      );
    } else {
      // Se não existe, cria novo chat
      setActiveChats(prev => [...prev, { contact, isMinimized: false }]);
    }
  };

  const handleChatClose = (contactId: number) => {
    setActiveChats(prev => prev.filter(chat => chat.contact.id !== contactId));
  };

  const handleChatMinimize = (contactId: number) => {
    setActiveChats(prev => 
      prev.map(chat => 
        chat.contact.id === contactId 
          ? { ...chat, isMinimized: !chat.isMinimized } 
          : chat
      )
    );
  };

  const getSelectedContact = () => {
    const expandedChat = activeChats.find(chat => !chat.isMinimized);
    return expandedChat?.contact || null;
  };

  return (
    <>
      <ChatSidebar 
        onContactSelect={handleContactSelect}
        selectedContact={getSelectedContact()}
      />
      
      {/* Renderiza todos os chats ativos */}
      {activeChats.map((chat, index) => (
        <div
          key={chat.contact.id}
          style={{
            right: `${80 + (index * 320)}px` // Posiciona chats lado a lado
          }}
          className="fixed bottom-4 z-40"
        >
          <PrivateChat
            contact={chat.contact}
            isMinimized={chat.isMinimized}
            onClose={() => handleChatClose(chat.contact.id)}
            onMinimize={() => handleChatMinimize(chat.contact.id)}
          />
        </div>
      ))}
    </>
  );
}