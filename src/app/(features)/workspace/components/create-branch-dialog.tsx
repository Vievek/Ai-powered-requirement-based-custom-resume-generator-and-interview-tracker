"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Loader2, Plus } from "lucide-react";
import { createBranch } from "@/lib/actions/projects";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  createdAt: Date;
  versions: any[];
}

interface CreateBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  parentBranch?: Branch;
  userId: string;
  onBranchCreated: (branch: Branch) => void;
}

export function CreateBranchDialog({
  open,
  onOpenChange,
  projectId,
  parentBranch,
  userId,
  onBranchCreated,
}: CreateBranchDialogProps) {
  const [branchName, setBranchName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!branchName.trim()) {
      toast.error("Please enter a branch name");
      return;
    }

    // Validate branch name
    const validBranchName = /^[a-zA-Z0-9_-]+$/.test(branchName);
    if (!validBranchName) {
      toast.error(
        "Branch name can only contain letters, numbers, underscores, and hyphens"
      );
      return;
    }

    if (!parentBranch) {
      toast.error("No parent branch selected");
      return;
    }

    setIsCreating(true);
    try {
      const newBranch = await createBranch(
        projectId,
        branchName.trim(),
        parentBranch.id
      );

      toast.success(`Branch "${branchName}" created successfully`);
      setBranchName("");
      // Create minimal branch object for callback
      const branchObj: Branch = {
        id: newBranch.branchId,
        name: branchName.trim(),
        createdAt: new Date(),
        versions: [],
      };
      onBranchCreated(branchObj);
      onOpenChange(false);
    } catch (error) {
      console.error("Create branch error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create branch"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isCreating) {
      handleCreate();
    }
  };

  const generateSuggestions = () => {
    const suggestions = [
      "feature-new-template",
      "update-experience",
      "job-specific",
      "skills-enhancement",
      "design-update",
    ];
    return suggestions;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Create New Branch
          </DialogTitle>
          <DialogDescription>
            Create a new branch to work on different versions of your resume
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Parent Branch Info */}
          {parentBranch && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Branch from:</span>
                <Badge variant="outline">{parentBranch.name}</Badge>
                {parentBranch.versions.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({parentBranch.versions.length} version
                    {parentBranch.versions.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Branch Name Input */}
          <div className="grid gap-2">
            <Label htmlFor="branch-name">Branch Name</Label>
            <Input
              id="branch-name"
              placeholder="feature-job-application"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={50}
            />
            <div className="text-xs text-muted-foreground">
              Use letters, numbers, underscores, and hyphens only
            </div>
          </div>

          {/* Name Suggestions */}
          <div>
            <Label className="text-xs text-muted-foreground">
              Suggestions:
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {generateSuggestions().map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setBranchName(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating || !branchName.trim()}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Create Branch
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <strong>Pro tip:</strong> Create branches for different purposes like
          specific job applications, template experiments, or major content
          updates. This helps you maintain multiple versions without losing
          work.
        </div>
      </DialogContent>
    </Dialog>
  );
}
