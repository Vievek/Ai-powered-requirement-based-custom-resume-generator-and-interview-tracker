import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Briefcase, Clock, CheckCircle, TrendingUp } from "lucide-react";

interface JobApplicationsStatsProps {
  userId: string;
}

export async function JobApplicationsStats({
  userId,
}: JobApplicationsStatsProps) {
  const [stats, interviewCount, recentActivity] = await Promise.all([
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.jobApplication.count({
      where: {
        userId,
        status: "INTERVIEWING",
      },
    }),
    prisma.jobApplication.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ]);

  const totalApplications = stats.reduce(
    (sum, stat) => sum + stat._count.status,
    0
  );
  const appliedCount =
    stats.find((s) => s.status === "APPLIED")?._count.status || 0;
  const offerCount =
    stats.find((s) => s.status === "OFFER")?._count.status || 0;

  const responseRate =
    totalApplications > 0
      ? Math.round(((interviewCount + offerCount) / totalApplications) * 100)
      : 0;

  const statsData = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: Briefcase,
      description: `${appliedCount} submitted this month`,
      trend: "+12%",
    },
    {
      title: "Pending Applications",
      value: appliedCount,
      icon: Clock,
      description: "Awaiting response",
      trend: "+3%",
    },
    {
      title: "Interview Invites",
      value: interviewCount,
      icon: CheckCircle,
      description: "Active interviews",
      trend: "+25%",
    },
    {
      title: "Response Rate",
      value: `${responseRate}%`,
      icon: TrendingUp,
      description: "Interview + offer rate",
      trend: "+5%",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{stat.description}</span>
              <span className="text-green-600">({stat.trend})</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
