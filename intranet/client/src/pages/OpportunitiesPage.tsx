import { ArticleList } from "@/components/ArticleList";

export function OpportunitiesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">Vagas e oportunidades internas disponíveis</p>
      </div>
      
      <ArticleList category="opportunities" title="Oportunidades" />
    </div>
  );
}