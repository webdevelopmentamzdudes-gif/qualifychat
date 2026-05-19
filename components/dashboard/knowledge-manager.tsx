"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  Pencil,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

type KnowledgeDoc = {
  id: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  chunk_count: number;
  status: string;
  error_message: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function statusBadge(status: string) {
  switch (status) {
    case "ready":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15">
          Ready
        </Badge>
      );
    case "processing":
      return <Badge variant="secondary">Processing…</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function KnowledgeManager() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editDoc, setEditDoc] = useState<KnowledgeDoc | null>(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setDocuments(data.documents ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success(`Uploaded ${data.uploaded?.length ?? 0} file(s)`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function toggleEnabled(doc: KnowledgeDoc) {
    try {
      const res = await fetch(`/api/knowledge/${doc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_enabled: !doc.is_enabled }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    }
  }

  async function deleteDoc(doc: KnowledgeDoc) {
    if (!confirm(`Delete "${doc.file_name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/knowledge/${doc.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      toast.success("Document deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function reprocess(doc: KnowledgeDoc) {
    try {
      toast.message("Re-processing document…");
      const res = await fetch(`/api/knowledge/${doc.id}/reprocess`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reprocess failed");
      toast.success("Document re-processed");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reprocess failed");
    }
  }

  async function replaceFile(doc: KnowledgeDoc, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      toast.message("Replacing file…");
      const res = await fetch(`/api/knowledge/${doc.id}/replace`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Replace failed");
      toast.success("File replaced and re-indexed");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Replace failed");
    }
  }

  async function openEdit(doc: KnowledgeDoc) {
    try {
      const res = await fetch(`/api/knowledge/${doc.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load text");
      setEditDoc(doc);
      setEditText(data.document?.extracted_text ?? "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load text");
    }
  }

  async function saveEdit() {
    if (!editDoc) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/knowledge/${editDoc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extracted_text: editText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      toast.success("Text updated and re-indexed for the chatbot");
      setEditDoc(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-dashed shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="size-5 text-primary" aria-hidden />
            Upload documents
          </CardTitle>
          <CardDescription>
            PDF, DOCX, TXT, or Markdown — up to 10 MB each. The chatbot uses
            these alongside your Business Profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 transition-colors hover:border-primary/40 hover:bg-accent/50">
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,text/markdown"
              onChange={(e) => void onUpload(e)}
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="size-10 animate-spin text-primary" />
            ) : (
              <Upload className="size-10 text-muted-foreground" />
            )}
            <p className="mt-4 text-sm font-medium">
              {uploading ? "Processing…" : "Click or drag files here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Multiple files supported
            </p>
          </label>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Your documents</CardTitle>
          <CardDescription>
            Enable/disable, edit text, replace files, or delete. Only enabled +
            ready docs are used in chat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center text-sm text-muted-foreground">
              <FileText className="mb-3 size-10 opacity-40" />
              No documents yet — upload a price list or SOP manual above.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <p className="truncate font-medium">{doc.file_name}</p>
                      {statusBadge(doc.status)}
                      {!doc.is_enabled ? (
                        <Badge variant="outline">Disabled</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBytes(doc.file_size_bytes)} · {doc.chunk_count}{" "}
                      chunks ·{" "}
                      {format(new Date(doc.created_at), "MMM d, yyyy")}
                    </p>
                    {doc.status === "failed" && doc.error_message ? (
                      <p className="mt-1 text-xs text-destructive">
                        {doc.error_message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void toggleEnabled(doc)}
                      title={doc.is_enabled ? "Disable" : "Enable"}
                    >
                      {doc.is_enabled ? (
                        <ToggleRight className="size-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="size-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void openEdit(doc)}
                      disabled={doc.status === "processing"}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void reprocess(doc)}
                      disabled={doc.status === "processing"}
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void replaceFile(doc, f);
                          e.target.value = "";
                        }}
                      />
                      <span
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )}
                      >
                        Replace
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void deleteDoc(doc)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editDoc} onOpenChange={(o) => !o && setEditDoc(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit extracted text</DialogTitle>
            <DialogDescription>
              Fix OCR mistakes or add notes. Saving will re-chunk and re-embed
              for the chatbot.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={16}
            className="font-mono text-sm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDoc(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => void saveEdit()}
              disabled={savingEdit}
              className="bg-brand-gradient text-white"
            >
              {savingEdit ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Save & re-index
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
