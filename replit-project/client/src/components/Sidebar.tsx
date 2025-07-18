import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { 
  Home, 
  Megaphone, 
  Newspaper, 
  Briefcase, 
  Store, 
  Download, 
  MessageCircle, 
  Headphones, 
  Settings 
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notices', label: 'Avisos', icon: Megaphone },
  { id: 'news', label: 'Notícias', icon: Newspaper },
  { id: 'opportunities', label: 'Oportunidades', icon: Briefcase },
  { id: 'services', label: 'Serviços', icon: Store },
  { id: 'documents', label: 'Documentos', icon: Download },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'tickets', label: 'Chamados', icon: Headphones },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, isAdmin } = useApp();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </button>
          );
        })}
        
        {isAdmin && (
          <div className="border-t border-gray-200 mt-4 pt-4">
            <button
              onClick={() => setCurrentPage('admin')}
              className={cn(
                "w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                currentPage === 'admin'
                  ? "bg-purple-100 text-purple-700"
                  : "text-purple-700 hover:bg-purple-50"
              )}
            >
              <Settings className="mr-3 h-4 w-4" />
              Administração
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
