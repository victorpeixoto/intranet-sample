import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { EmergencyModal } from "@/components/EmergencyModal";
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/Sidebar";
import { ChatManager } from "@/components/ChatManager";
import { LoginPage } from "@/pages/LoginPage";
import { Dashboard } from "@/pages/Dashboard";
import { AdminPanel } from "@/pages/AdminPanel";
import { NoticesPage } from "@/pages/NoticesPage";
import { NewsPage } from "@/pages/NewsPage";
import { OpportunitiesPage } from "@/pages/OpportunitiesPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { DocumentsPage } from "@/pages/DocumentsPage";
import { ChatPage } from "@/pages/ChatPage";
import { TicketsPage } from "@/pages/TicketsPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { ManageArticlePage } from "@/pages/ManageArticlePage";
import { useState, useEffect } from "react";
import type { EmergencyNotification } from "@shared/schema";

function MainLayout() {
  const { isLoggedIn, currentPage } = useApp();
  const [currentEmergencyNotification, setCurrentEmergencyNotification] = useState<EmergencyNotification | null>(null);

  useEffect(() => {
    const handleEmergencyNotification = (event: CustomEvent<EmergencyNotification>) => {
      setCurrentEmergencyNotification(event.detail);
    };

    window.addEventListener('emergency-notification', handleEmergencyNotification as EventListener);
    return () => {
      window.removeEventListener('emergency-notification', handleEmergencyNotification as EventListener);
    };
  }, []);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    // Check if current page is an article page
    if (currentPage.startsWith('article/')) {
      const articleId = currentPage.split('/')[1];
      return <ArticlePage articleId={articleId} />;
    }
    
    // Check if current page is manage article page
    if (currentPage.startsWith('manage-article')) {
      const parts = currentPage.split('/');
      const articleId = parts.length > 1 ? parts[1] : undefined;
      return <ManageArticlePage articleId={articleId} />;
    }
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <AdminPanel />;
      case 'notices':
        return <NoticesPage />;
      case 'news':
        return <NewsPage />;
      case 'opportunities':
        return <OpportunitiesPage />;
      case 'services':
        return <ServicesPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'chat':
        return <ChatPage />;
      case 'tickets':
        return <TicketsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
      </div>
      
      <EmergencyModal
        notification={currentEmergencyNotification}
        onClose={() => setCurrentEmergencyNotification(null)}
      />
      
      <ChatManager />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <MainLayout />
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
