import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Newspaper, Plus, Radio, Edit, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { Article } from '@shared/schema';

export function AdminPanel() {
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, setCurrentPage } = useApp();
  const { toast } = useToast();

  // Load articles for management
  const { data: articles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["/api/articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles");
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json() as Promise<Article[]>;
    },
  });

  const handleEmergencyNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyMessage.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/emergency-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: emergencyMessage,
          authorId: user.id,
          isActive: true
        })
      });

      if (response.ok) {
        const notification = await response.json();
        
        // Dispatch emergency notification event
        window.dispatchEvent(new CustomEvent('emergency-notification', {
          detail: notification
        }));

        toast({
          title: "Notificação enviada",
          description: "Notificação de emergência enviada para todos os usuários",
        });
        
        setEmergencyMessage('');
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar notificação de emergência",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsTitle,
          content: newsContent,
          authorId: user.id
        })
      });

      if (response.ok) {
        toast({
          title: "Notícia publicada",
          description: "Notícia publicada com sucesso",
        });
        
        setNewsTitle('');
        setNewsContent('');
      } else {
        throw new Error('Failed to create news');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao publicar notícia",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie notícias e envie notificações de emergência</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Notification Panel */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Notificação de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmergencyNotification} className="space-y-4">
              <div>
                <Label htmlFor="emergency-message">Mensagem</Label>
                <Textarea
                  id="emergency-message"
                  value={emergencyMessage}
                  onChange={(e) => setEmergencyMessage(e.target.value)}
                  placeholder="Digite a mensagem de emergência..."
                  rows={4}
                  className="focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !emergencyMessage.trim()}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <Radio className="h-4 w-4 mr-2" />
                Enviar Notificação de Emergência
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Article Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gerenciar Artigos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => setCurrentPage("manage-article")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Artigo
              </Button>
              
              {isLoadingArticles ? (
                <p className="text-muted-foreground text-center py-4">
                  Carregando artigos...
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Artigos Recentes ({articles?.length || 0})
                  </h4>
                  {articles && articles.length > 0 ? (
                    articles.slice(0, 5).map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {article.category} • {article.author}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentPage(`manage-article/${article.id}`)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum artigo encontrado
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* News Management (Legacy) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Criar Notícia Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div>
                <Label htmlFor="news-title">Título</Label>
                <Input
                  id="news-title"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Título da notícia"
                />
              </div>
              <div>
                <Label htmlFor="news-content">Conteúdo</Label>
                <Textarea
                  id="news-content"
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Conteúdo da notícia..."
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !newsTitle.trim() || !newsContent.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Publicar Notícia
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
