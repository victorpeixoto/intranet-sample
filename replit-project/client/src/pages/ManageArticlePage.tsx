import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Article, InsertArticle } from "@shared/schema";

interface ManageArticlePageProps {
  articleId?: string;
}

export function ManageArticlePage({ articleId }: ManageArticlePageProps) {
  const { toast } = useToast();
  const { setCurrentPage, user } = useApp();
  const queryClient = useQueryClient();
  const isEditing = !!articleId;

  const [formData, setFormData] = useState<Omit<InsertArticle, 'authorId'>>({
    documentId: '',
    title: '',
    description: '',
    slug: '',
    category: 'news',
    coverUrl: '',
    coverAlt: '',
    content: '',
    body: '',
    publishedAt: new Date()
  });

  // Load existing article if editing
  const { isLoading: isLoadingArticle } = useQuery({
    queryKey: ["/api/articles", articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      const article = await response.json() as Article;
      
      setFormData({
        documentId: article.documentId,
        title: article.title,
        description: article.description,
        slug: article.slug,
        category: article.category,
        coverUrl: article.coverUrl || '',
        coverAlt: article.coverAlt || '',
        content: article.content || '',
        body: article.body || '',
        publishedAt: article.publishedAt || new Date()
      });
      
      return article;
    },
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      return await apiRequest("/api/articles", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Artigo criado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setCurrentPage("admin");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar artigo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      return await apiRequest(`/api/articles/${articleId}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Artigo atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      setCurrentPage("admin");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar artigo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }

    // Auto-generate document ID from title and category
    if ((field === 'title' || field === 'category') && !isEditing) {
      const cleanTitle = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const category = field === 'category' ? value : formData.category;
      const title = field === 'title' ? cleanTitle : formData.title;
      
      if (title && category) {
        const documentId = `${category}${Date.now()}-${title}`;
        setFormData(prev => ({
          ...prev,
          documentId: documentId
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    const dataToSubmit: InsertArticle = {
      ...formData,
      authorId: user.id,
    };

    if (isEditing) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isLoadingArticle;

  const getCategoryLabel = (category: string) => {
    const labels = {
      news: "Notícias",
      warnings: "Avisos",
      opportunities: "Oportunidades",
      services: "Serviços"
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentPage("admin")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Painel Admin
        </Button>
        
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Artigo" : "Criar Novo Artigo"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? "Edite as informações do artigo" : "Preencha os dados para criar um novo artigo"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Artigo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Digite o título do artigo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">Notícias</SelectItem>
                    <SelectItem value="warnings">Avisos</SelectItem>
                    <SelectItem value="opportunities">Oportunidades</SelectItem>
                    <SelectItem value="services">Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição/Subtítulo *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Breve descrição do artigo"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-amigavel-do-artigo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverUrl">URL da Capa</Label>
                <Input
                  id="coverUrl"
                  value={formData.coverUrl}
                  onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverAlt">Texto Alternativo da Capa</Label>
              <Input
                id="coverAlt"
                value={formData.coverAlt}
                onChange={(e) => handleInputChange('coverAlt', e.target.value)}
                placeholder="Descrição da imagem para acessibilidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Conteúdo do Artigo *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Conteúdo completo do artigo (HTML permitido)"
                rows={15}
                className="font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                Você pode usar HTML para formatação: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Atualizar Artigo" : "Criar Artigo"}
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentPage("admin")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}