"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GitCommit,
  Clock,
  User,
  Eye,
  RotateCcw,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { getCommitHistory } from "@/lib/actions/projects";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Commit {
  id: string;
  message: string;
  changes?: string;
  createdAt: Date;
  author: {
    id: string;
    name?: string;
    email: string;
    image?: string;
  };
  version: {
    id: string;
    updatedAt: Date;
  };
}

interface CommitHistoryProps {
  projectId: string;
  branchId: string;
  userId: string;
}

export function CommitHistory({
  projectId,
  branchId,
  userId,
}: CommitHistoryProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);

  useEffect(() => {
    const loadCommitHistory = async () => {
      if (!branchId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const history = await getCommitHistory(projectId, branchId);
        setCommits(history as Commit[]);
      } catch (error) {
        console.error("Failed to load commit history:", error);
        toast.error("Failed to load commit history");
      } finally {
        setIsLoading(false);
      }
    };

    loadCommitHistory();
  }, [projectId, branchId]);

  const handleViewCommit = (commit: Commit) => {
    setSelectedCommit(commit);
  };

  const handleRevertToCommit = async (commit: Commit) => {
    toast.success("Revert functionality coming soon!");
    // TODO: Implement revert functionality
  };

  const getAuthorInitials = (author: Commit["author"]) => {
    return (
      author.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() ||
      author.email[0]?.toUpperCase() ||
      "U"
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <GitCommit className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Commit History</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Track all changes made to this resume version
        </p>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : commits.length === 0 ? (
          <div className="text-center py-8">
            <GitCommit className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">No commits yet</p>
            <p className="text-xs text-muted-foreground">
              Make changes to your resume and commit them to see the history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map((commit, index) => (
              <div key={commit.id}>
                <div className="flex items-start space-x-3 group">
                  {/* Timeline dot */}
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    {index < commits.length - 1 && (
                      <div className="absolute left-0.5 top-4 w-0.5 h-12 bg-border" />
                    )}
                  </div>

                  {/* Commit content */}
                  <div className="flex-1 min-w-0">
                    <Card className="group-hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={commit.author.image || ""} />
                              <AvatarFallback className="text-xs">
                                {getAuthorInitials(commit.author)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {commit.author.name || "Unknown User"}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatDistanceToNow(
                                    new Date(commit.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Badge variant="outline" className="text-xs">
                            {commit.id.slice(0, 7)}
                          </Badge>
                        </div>

                        <p className="text-sm mb-3 text-foreground">
                          {commit.message}
                        </p>

                        {commit.changes && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {commit.changes}
                          </p>
                        )}

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleViewCommit(commit)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleRevertToCommit(commit)}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Revert
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {commits.length > 0 && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{commits.length}</div>
                <div className="text-xs text-muted-foreground">
                  Total Commits
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {new Set(commits.map((c) => c.author.id)).size}
                </div>
                <div className="text-xs text-muted-foreground">
                  Contributors
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Commit Detail Dialog */}
      <Dialog
        open={!!selectedCommit}
        onOpenChange={(open) => !open && setSelectedCommit(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Commit Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this commit
            </DialogDescription>
          </DialogHeader>

          {selectedCommit && (
            <div className="space-y-4">
              {/* Commit Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Author
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedCommit.author.image || ""} />
                      <AvatarFallback className="text-xs">
                        {getAuthorInitials(selectedCommit.author)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {selectedCommit.author.name}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Commit ID
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedCommit.id}</Badge>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Date
                  </label>
                  <div className="flex items-center space-x-1 mt-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(selectedCommit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Time
                  </label>
                  <div className="flex items-center space-x-1 mt-1 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(selectedCommit.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Commit Message */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Message
                </label>
                <p className="mt-1 text-sm">{selectedCommit.message}</p>
              </div>

              {/* Changes */}
              {selectedCommit.changes && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Changes
                  </label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedCommit.changes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleRevertToCommit(selectedCommit)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Revert to This Version
                </Button>
                <Button onClick={() => setSelectedCommit(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
