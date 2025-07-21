import { ArticleList } from "@/components/ArticleList";

export function ServicesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">Serviços disponíveis para funcionários</p>
      </div>
      
      <ArticleList category="services" title="Serviços" />
    </div>
  );
}