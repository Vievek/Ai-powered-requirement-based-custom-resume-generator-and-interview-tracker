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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Mail,
  Eye,
  MessageSquare,
  Edit,
  X,
  Loader2,
} from "lucide-react";
import { shareProject } from "@/lib/actions/projects";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  collaborators?: Array<{
    id: string;
    userId: string;
    accessLevel: string;
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
  }>;
}

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  userId: string;
}

const accessLevels = [
  {
    value: "VIEWER",
    label: "Viewer",
    description: "Can view the resume",
    icon: Eye,
  },
  {
    value: "COMMENTER",
    label: "Commenter",
    description: "Can view and add comments",
    icon: MessageSquare,
  },
  {
    value: "EDITOR",
    label: "Editor",
    description: "Can view, comment, and edit",
    icon: Edit,
  },
];

export function ShareProjectDialog({
  open,
  onOpenChange,
  project,
  userId,
}: ShareProjectDialogProps) {
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState<
    "VIEWER" | "COMMENTER" | "EDITOR"
  >("VIEWER");
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSharing(true);
    try {
      await shareProject(project.id, email, accessLevel);
      toast.success(`Project shared with ${email}`);
      setEmail("");
      setAccessLevel("VIEWER");
      // The dialog will remain open to show the updated collaborators list
    } catch (error) {
      console.error("Share error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to share project"
      );
    } finally {
      setIsSharing(false);
    }
  };

  const getAccessLevelBadge = (level: string) => {
    const config = accessLevels.find((al) => al.value === level);
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share "{project.name}"
          </DialogTitle>
          <DialogDescription>
            Invite others to collaborate on this resume project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Form */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="access">Access Level</Label>
                  <Select
                    value={accessLevel}
                    onValueChange={(value: any) => setAccessLevel(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map((level) => {
                        const Icon = level.icon;
                        return (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{level.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {level.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full"
                >
                  {isSharing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Mail className="mr-2 h-4 w-4" />
                  Share Project
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Collaborators */}
          {project.collaborators && project.collaborators.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Current Collaborators</h3>
              <div className="space-y-3">
                {project.collaborators.map((collaborator) => {
                  const user = collaborator.user;
                  const initials =
                    user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || user.email[0]?.toUpperCase();

                  return (
                    <div
                      key={collaborator.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || ""}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name || "Unknown User"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getAccessLevelBadge(collaborator.accessLevel)}
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Public Link (Future Feature) */}
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Public sharing links coming soon</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
