import { format } from "date-fns";

export type ConversationTurn = {
  id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
};

export function ConversationThread({ turns }: { turns: ConversationTurn[] }) {
  if (turns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No messages in this thread yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {turns.map((t) => (
        <div key={t.id} className="space-y-2">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-sm text-white shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-100">
                Visitor · {format(new Date(t.created_at), "MMM d, h:mm a")}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{t.user_message}</p>
            </div>
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-muted/50 px-4 py-2.5 text-sm shadow-sm">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Assistant
            </p>
            <p className="mt-1 whitespace-pre-wrap text-foreground">
              {t.ai_response}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
