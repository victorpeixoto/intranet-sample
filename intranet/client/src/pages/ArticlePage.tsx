import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useApp } from "@/contexts/AppContext";
import type { Article } from "@shared/schema";

interface ArticlePageProps {
  articleId: string;
}

export function ArticlePage({ articleId }: ArticlePageProps) {
  const { setCurrentPage } = useApp();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/articles", articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      return response.json() as Promise<Article>;
    },
    enabled: !!articleId,
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      news: "Notícias",
      warnings: "Avisos",
      opportunities: "Oportunidades",
      services: "Serviços"
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      news: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      warnings: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      opportunities: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      services: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const handleBack = () => {
    if (!article) return;
    
    // Navigate back to the appropriate category page
    const categoryPages = {
      news: "news",
      warnings: "notices",
      opportunities: "opportunities",
      services: "services"
    };
    
    const targetPage = categoryPages[article.category as keyof typeof categoryPages] || "dashboard";
    setCurrentPage(targetPage);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Artigo não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => setCurrentPage("dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publishedDate = article.publishedAt || article.createdAt;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Article content */}
      <article className="space-y-6">
        {/* Cover image */}
        {article.coverUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={article.coverUrl}
              alt={article.coverAlt || article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={getCategoryColor(article.category)}>
              {getCategoryLabel(article.category)}
            </Badge>
            {publishedDate && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(publishedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
          
          {article.description && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Autor ID: {article.authorId}</span>
          </div>
        </header>

        {/* Article body */}
        {article.body && (
          <Card>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none p-8">
              <div 
                dangerouslySetInnerHTML={{ __html: article.body }}
                className="leading-relaxed"
              />
            </CardContent>
          </Card>
        )}

        {/* Footer with metadata */}
        <footer className="border-t pt-6">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>ID do documento: {article.documentId}</span>
            {article.slug && <span>Slug: {article.slug}</span>}
            {article.updatedAt && (
              <span>
                Atualizado em: {format(new Date(article.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}