"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { regenerateLeadSummary } from "@/app/actions/leads";
import { toast } from "sonner";

type Props = {
  leadId: string;
  initialSummary: string;
};

function looksLikeOldLogSummary(text: string) {
  return /Latest:\s*User:/i.test(text) || /\|\s*Assistant:/.test(text);
}

export function LeadSummarySection({ leadId, initialSummary }: Props) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);

  const showRefresh =
    !summary.trim() || looksLikeOldLogSummary(summary);

  async function handleRefresh() {
    setLoading(true);
    try {
      const result = await regenerateLeadSummary(leadId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.summary) {
        setSummary(result.summary);
        toast.success("Summary updated");
      }
    } catch {
      toast.error("Could not refresh summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 shadow-sm dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-violet-950/10">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Conversation overview
          </CardTitle>
          <CardDescription className="mt-1.5">
            AI-written summary of what the visitor and chatbot discussed — not
            the full transcript.
          </CardDescription>
        </div>
        {showRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleRefresh}
            className="shrink-0"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {loading ? "Generating…" : "Generate summary"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {summary.trim() ? (
          <p className="text-sm leading-relaxed text-foreground">{summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No summary yet. When the visitor chats again, or you click Generate
            summary, AI will describe what was discussed here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
