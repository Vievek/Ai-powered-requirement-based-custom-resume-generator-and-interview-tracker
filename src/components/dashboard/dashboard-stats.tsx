import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { FileText, Briefcase, Target, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  userId: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const [projectsCount, applicationsCount, pendingSuggestions] =
    await Promise.all([
      prisma.resumeProject.count({ where: { userId } }),
      prisma.jobApplication.count({ where: { userId } }),
      prisma.careerSuggestion.count({
        where: {
          userId,
          status: "PENDING",
        },
      }),
    ]);

  const stats = [
    {
      title: "Resume Projects",
      value: projectsCount,
      icon: FileText,
      description: "Active projects",
      trend: "+12%",
    },
    {
      title: "Applications",
      value: applicationsCount,
      icon: Briefcase,
      description: "Job applications",
      trend: "+8%",
    },
    {
      title: "Suggestions",
      value: pendingSuggestions,
      icon: Target,
      description: "Career improvements",
      trend: "New",
    },
    {
      title: "Success Rate",
      value: "73%",
      icon: TrendingUp,
      description: "Interview rate",
      trend: "+5%",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={stat.title}>
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
    </>
  );
}
