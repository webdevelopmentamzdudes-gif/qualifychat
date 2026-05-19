import { KnowledgeManager } from "@/components/dashboard/knowledge-manager";

export default function KnowledgeBasePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Knowledge base</h1>
        <p className="mt-2 text-muted-foreground">
          Upload price lists, brochures, and SOP manuals. Your chatbot uses these
          documents together with your business profile — it never invents facts
          beyond what you provide.
        </p>
        <ul className="mt-4 list-inside list-disc text-sm text-muted-foreground">
          <li>Supported: PDF, DOCX, TXT, Markdown (max 10 MB each)</li>
          <li>Toggle documents on/off without deleting them</li>
          <li>Edit extracted text or replace files anytime</li>
        </ul>
      </div>
      <KnowledgeManager />
    </div>
  );
}
