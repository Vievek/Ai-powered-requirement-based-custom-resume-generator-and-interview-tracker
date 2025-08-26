"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  GitBranch,
  Share2,
  Download,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { ShareProjectDialog } from "./share-project-dialog";
import { CreateBranchDialog } from "./create-branch-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface Branch {
  id: string;
  name: string;
  createdAt: Date;
  versions: any[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface WorkspaceHeaderProps {
  project: Project;
  branches: Branch[];
  currentBranch: string;
  onBranchChange: (branchId: string) => void;
  userId: string;
}

export function WorkspaceHeader({
  project,
  branches,
  currentBranch,
  onBranchChange,
  userId,
}: WorkspaceHeaderProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCreateBranchDialog, setShowCreateBranchDialog] = useState(false);

  const currentBranchData = branches.find((b) => b.id === currentBranch);
  const hasCommits =
    currentBranchData?.versions && currentBranchData.versions.length > 0;

  const handleDownloadPDF = async () => {
    if (!hasCommits) {
      toast.error("No content to download. Make some changes first.");
      return;
    }

    try {
      // TODO: Implement PDF generation
      toast.success("Downloading PDF... (Feature coming soon)");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCreateBranch = () => {
    setShowCreateBranchDialog(true);
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left - Project Info */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold leading-none">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {project.description}
              </p>
            )}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Branch Selector */}
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <Select value={currentBranch} onValueChange={onBranchChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex items-center space-x-2">
                      <span>{branch.name}</span>
                      {branch.name === "main" && (
                        <Badge variant="secondary" className="text-xs">
                          Main
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateBranch}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Badge */}
          {hasCommits && (
            <Badge variant="secondary" className="text-xs">
              {currentBranchData.versions.length} version
              {currentBranchData.versions.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/projects`}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>

          <Button size="sm" onClick={handleShare}>
            <Users className="h-4 w-4 mr-2" />
            Collaborate
          </Button>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareProjectDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        project={project}
        userId={userId}
      />

      {/* Create Branch Dialog */}
      <CreateBranchDialog
        open={showCreateBranchDialog}
        onOpenChange={setShowCreateBranchDialog}
        projectId={project.id}
        parentBranch={currentBranchData}
        userId={userId}
        onBranchCreated={(newBranch) => {
          onBranchChange(newBranch.id);
          setShowCreateBranchDialog(false);
        }}
      />
    </div>
  );
}
