import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Lightbulb, Target, CheckCircle, Clock } from "lucide-react";

interface SuggestionsStatsProps {
  userId: string;
}

export async function SuggestionsStats({ userId }: SuggestionsStatsProps) {
  const [stats, completedCount, inProgressCount] = await Promise.all([
    prisma.careerSuggestion.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.careerSuggestion.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),
    prisma.careerSuggestion.count({
      where: {
        userId,
        status: "IN_PROGRESS",
      },
    }),
  ]);

  const totalSuggestions = stats.reduce(
    (sum, stat) => sum + stat._count.status,
    0
  );
  const pendingCount =
    stats.find((s) => s.status === "PENDING")?._count.status || 0;

  const completionRate =
    totalSuggestions > 0
      ? Math.round((completedCount / totalSuggestions) * 100)
      : 0;

  const statsData = [
    {
      title: "Total Suggestions",
      value: totalSuggestions,
      icon: Lightbulb,
      description: "AI-generated recommendations",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      icon: Clock,
      description: "Currently working on",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle,
      description: "Successfully implemented",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: Target,
      description: "Overall progress",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className={`border-l-4 border-l-current ${stat.color}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
