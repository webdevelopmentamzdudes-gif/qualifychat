import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function PublicChatbotPage({
  params,
  searchParams,
}: {
  params: { businessId: string };
  searchParams: { embed?: string };
}) {
  const embed = searchParams.embed === "1";

  if (embed) {
    return (
      <div className="h-screen w-screen bg-transparent p-2">
        <ChatInterface businessId={params.businessId} embed />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 -z-10 bg-mesh" aria-hidden />
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Build your own →
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-lg">
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              QualifyChat
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              Chat with our team assistant
            </h1>
          </div>
          <ChatInterface businessId={params.businessId} />
        </div>
      </main>
    </div>
  );
}
