"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyEmbedButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setDone(false), 2000);
    } catch {
      toast.error("Could not copy — select and copy manually.");
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void copy()}>
      <Copy className="size-4" aria-hidden />
      {done ? "Copied" : label}
    </Button>
  );
}
