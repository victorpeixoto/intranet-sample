import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Search, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { User } from '@shared/schema';

interface ChatSidebarProps {
  onContactSelect: (contact: User) => void;
  selectedContact?: User | null;
}

export function ChatSidebar({ onContactSelect, selectedContact }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<User[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<User[]>([]);
  const { user } = useApp();

  // Mock contacts data - em produção viria da API
  useEffect(() => {
    const mockContacts: User[] = [
      {
        id: 2,
        email: "maria.silva@empresa.com",
        name: "Maria Silva",
        isAdmin: false,
        password: "",
        createdAt: new Date()
      },
      {
        id: 3,
        email: "joao.santos@empresa.com",
        name: "João Santos",
        isAdmin: false,
        password: "",
        createdAt: new Date()
      },
      {
        id: 4,
        email: "ana.costa@empresa.com",
        name: "Ana Costa",
        isAdmin: true,
        password: "",
        createdAt: new Date()
      },
      {
        id: 5,
        email: "carlos.oliveira@empresa.com",
        name: "Carlos Oliveira",
        isAdmin: false,
        password: "",
        createdAt: new Date()
      },
      {
        id: 6,
        email: "patricia.lima@empresa.com",
        name: "Patrícia Lima",
        isAdmin: false,
        password: "",
        createdAt: new Date()
      },
      {
        id: 7,
        email: "rodrigo.alves@empresa.com",
        name: "Rodrigo Alves",
        isAdmin: false,
        password: "",
        createdAt: new Date()
      },
      {
        id: 8,
        email: "fernanda.rocha@empresa.com",
        name: "Fernanda Rocha",
        isAdmin: false,
        password: "",
        createdAt: new Date()
      }
    ];
    
    // Remove o usuário atual da lista
    const filteredMockContacts = mockContacts.filter(contact => contact.id !== user?.id);
    setContacts(filteredMockContacts);
    setFilteredContacts(filteredMockContacts);
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const handleContactClick = (contact: User) => {
    onContactSelect(contact);
    setIsOpen(false);
  };

  const getOnlineStatus = () => {
    // Simula status online aleatório
    return Math.random() > 0.5;
  };

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contatos da Empresa
              </SheetTitle>
            </SheetHeader>
            
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Pesquisar contatos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
              <div className="p-4 space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Nenhum contato encontrado' : 'Nenhum contato disponível'}
                  </div>
                ) : (
                  filteredContacts.map((contact) => {
                    const isOnline = getOnlineStatus();
                    const isSelected = selectedContact?.id === contact.id;
                    
                    return (
                      <div
                        key={contact.id}
                        onClick={() => handleContactClick(contact)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                          isSelected ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-white">
                              {contact.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {contact.name}
                            </p>
                            {contact.isAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {contact.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <div className={`h-2 w-2 rounded-full mr-2 ${
                              isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-xs text-gray-500">
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}