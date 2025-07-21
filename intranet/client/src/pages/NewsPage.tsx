import { ArticleList } from "@/components/ArticleList";

export function NewsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">Últimas notícias da empresa</p>
      </div>
      
      <ArticleList category="news" title="Notícias" />
    </div>
  );
}
