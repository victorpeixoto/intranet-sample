import { ArticleList } from "@/components/ArticleList";

export function NoticesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">Comunicados importantes da empresa</p>
      </div>
      
      <ArticleList category="warnings" title="Avisos" />
    </div>
  );
}