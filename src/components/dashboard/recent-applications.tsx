import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Building2, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface RecentApplicationsProps {
  userId: string;
}

const statusColors = {
  DRAFT: "secondary",
  APPLIED: "blue",
  INTERVIEWING: "yellow",
  REJECTED: "destructive",
  OFFER: "green",
} as const;

export async function RecentApplications({ userId }: RecentApplicationsProps) {
  const applications = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      project: {
        select: { name: true },
      },
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Recent Applications
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/tracker">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              No job applications tracked yet
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/tracker">Start Tracking</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">{application.jobTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      at {application.companyName}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(application.updatedAt, {
                          addSuffix: true,
                        })}
                      </span>
                      {application.project && (
                        <span>Using: {application.project.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={statusColors[application.status] as any}
                    className="text-xs"
                  >
                    {application.status.replace("_", " ")}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/tracker/${application.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
