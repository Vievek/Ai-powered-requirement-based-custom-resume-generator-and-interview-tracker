import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SuggestionsHeader } from "@/components/suggestions/suggestions-header";
import { SuggestionsList } from "@/components/suggestions/suggestions-list";
import { SuggestionsStats } from "@/components/suggestions/suggestions-stats";
import { SuggestionsSkeleton } from "@/components/suggestions/suggestions-skeleton";

export default async function SuggestionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <SuggestionsHeader userId={session.user.id} />

      <Suspense
        fallback={<div className="h-32 bg-muted rounded-lg animate-pulse" />}
      >
        <SuggestionsStats userId={session.user.id} />
      </Suspense>

      <Suspense fallback={<SuggestionsSkeleton />}>
        <SuggestionsList userId={session.user.id} />
      </Suspense>
    </div>
  );
}
