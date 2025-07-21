import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, List, Grid3X3 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useApp } from "@/contexts/AppContext";
import type { Article } from "@shared/schema";

interface ArticleListProps {
  category?: string;
  title?: string;
}

type ViewMode = "list" | "cards";

export function ArticleList({ category, title }: ArticleListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: category ? ["/api/articles", category] : ["/api/articles"],
    queryFn: async () => {
      const url = category ? `/api/articles?category=${category}` : "/api/articles";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json() as Promise<Article[]>;
    },
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            Lista
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            <Grid3X3 className="h-4 w-4" />
            Cards
          </Button>
        </div>
      </div>

      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "cards" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {articles.map((article) => (
            <ArticleItem
              key={article.id}
              article={article}
              viewMode={viewMode}
              getCategoryLabel={getCategoryLabel}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ArticleItemProps {
  article: Article;
  viewMode: ViewMode;
  getCategoryLabel: (category: string) => string;
  getCategoryColor: (category: string) => string;
}

function ArticleItem({ article, viewMode, getCategoryLabel, getCategoryColor }: ArticleItemProps) {
  const { setCurrentPage } = useApp();
  const publishedDate = article.publishedAt || article.createdAt;

  const handleClick = () => {
    setCurrentPage(`article/${article.id}`);
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(article.category)}>
                  {getCategoryLabel(article.category)}
                </Badge>
                {publishedDate && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(publishedDate), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Autor ID: {article.authorId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={handleClick}>
      {article.coverUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.coverUrl}
            alt={article.coverAlt || article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(article.category)}>
            {getCategoryLabel(article.category)}
          </Badge>
          {publishedDate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(publishedDate), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Autor ID: {article.authorId}</span>
        </div>
      </CardContent>
    </Card>
  );
}