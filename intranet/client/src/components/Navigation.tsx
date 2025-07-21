import { Button } from '@/components/ui/button';
import { Bell, LogOut, AlertTriangle, Building } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navigation() {
  const { user, logout } = useApp();

  const handleEmergencyTest = () => {
    // This will be used for testing emergency notifications
    setTimeout(() => {
      // Simulate emergency notification
      const mockNotification = {
        id: Date.now(),
        message: 'ATENÇÃO: Teste de notificação de emergência. Todos os funcionários devem estar cientes desta mensagem importante.',
        authorId: 1,
        isActive: true,
        createdAt: new Date(),
      };
      
      // Dispatch custom event for emergency modal
      window.dispatchEvent(new CustomEvent('emergency-notification', {
        detail: mockNotification
      }));
    }, 1000);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Building className="h-6 w-6 text-primary mr-3" />
            <span className="text-xl font-semibold text-gray-900">Portal Interno</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleEmergencyTest}
              variant="destructive"
              size="sm"
              className="bg-red-500 hover:bg-red-600"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Teste Emergência
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
