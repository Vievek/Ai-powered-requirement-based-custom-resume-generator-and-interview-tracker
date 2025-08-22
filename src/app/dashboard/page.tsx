import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  DashboardStatsLoading,
  RecentProjectsLoading,
  RecentApplicationsLoading,
} from "@/components/dashboard/dashboard-skeleton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <DashboardHeader user={session.user} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<DashboardStatsLoading />}>
          <DashboardStats userId={session.user.id} />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<RecentProjectsLoading />}>
            <RecentProjects userId={session.user.id} />
          </Suspense>

          <Suspense fallback={<RecentApplicationsLoading />}>
            <RecentApplications userId={session.user.id} />
          </Suspense>
        </div>

        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
