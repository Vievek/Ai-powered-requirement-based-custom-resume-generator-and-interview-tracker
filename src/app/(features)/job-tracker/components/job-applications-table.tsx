import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Building2, Calendar, Eye, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface JobApplicationsTableProps {
  userId: string;
}

const statusColors = {
  DRAFT: "secondary",
  APPLIED: "blue",
  INTERVIEWING: "yellow",
  REJECTED: "destructive",
  OFFER: "green",
} as const;

const statusLabels = {
  DRAFT: "Draft",
  APPLIED: "Applied",
  INTERVIEWING: "Interview",
  REJECTED: "Rejected",
  OFFER: "Offer",
};

export async function JobApplicationsTable({
  userId,
}: JobApplicationsTableProps) {
  const applications = await prisma.jobApplication.findMany({
    where: { userId },
    include: {
      project: {
        select: { name: true },
      },
      version: {
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start tracking your job applications to get insights and stay
            organized
          </p>
          <Button asChild>
            <Link href="/dashboard/tracker/new">
              Add Your First Application
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company & Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Resume Used</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id} className="group">
                <TableCell>
                  <div>
                    <div className="font-medium">{application.jobTitle}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="h-3 w-3 mr-1" />
                      {application.companyName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusColors[application.status] as any}
                    className="text-xs"
                  >
                    {statusLabels[application.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {application.appliedDate ? (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {application.appliedDate.toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Not applied
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {application.project ? (
                    <Link
                      href={`/dashboard/projects/${application.project}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {application.project.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No resume linked
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(application.updatedAt, {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link href={`/dashboard/tracker/${application.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
