import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobApplicationsTable } from "@/components/tracker/job-applications-table";
import { JobApplicationsHeader } from "@/components/tracker/job-applications-header";
import { JobApplicationsStats } from "@/components/tracker/job-applications-stats";
import { JobTrackerSkeleton } from "@/components/tracker/job-tracker-skeleton";

export default async function JobTrackerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <JobApplicationsHeader />

      <Suspense
        fallback={<div className="h-32 bg-muted rounded-lg animate-pulse" />}
      >
        <JobApplicationsStats userId={session.user.id} />
      </Suspense>

      <Suspense fallback={<JobTrackerSkeleton />}>
        <JobApplicationsTable userId={session.user.id} />
      </Suspense>
    </div>
  );
}
