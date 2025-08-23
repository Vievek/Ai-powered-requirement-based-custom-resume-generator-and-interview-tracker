"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { JobDescriptionPanel } from "@/components/workspace/job-description-panel";
import { ResumeEditor } from "@/components/workspace/resume-editor";
import { CommitHistory } from "@/components/workspace/commit-history";
import { WorkspaceSkeleton } from "@/components/workspace/workspace-skeleton";
import { getProjectDetails, getProjectBranches } from "@/lib/actions/projects";
import { toast } from "sonner";

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  branches: Array<{
    id: string;
    name: string;
    createdAt: Date;
    versions: Array<{
      id: string;
      content: any;
      updatedAt: Date;
    }>;
  }>;
}

export default function ProjectWorkspacePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [currentBranch, setCurrentBranch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id as string;

  useEffect(() => {
    const loadProject = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const [projectDetails, branches] = await Promise.all([
          getProjectDetails(projectId),
          getProjectBranches(projectId),
        ]);

        if (!projectDetails) {
          setError("Project not found");
          return;
        }

        const projectData: ProjectData = {
          ...projectDetails,
          description: projectDetails.description ?? undefined,
          branches: branches || [],
        };

        setProject(projectData);

        // Set default branch (main or first available)
        const mainBranch =
          branches?.find((b) => b.name === "main") || branches?.[0];
        if (mainBranch) {
          setCurrentBranch(mainBranch.id);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        setError("Failed to load project");
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, session?.user?.id]);

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <p className="text-muted-foreground">
            The requested project could not be found.
          </p>
        </div>
      </div>
    );
  }

  const currentBranchData = project.branches.find(
    (b) => b.id === currentBranch
  );
  const currentVersion = currentBranchData?.versions?.[0];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <WorkspaceHeader
        project={project}
        branches={project.branches}
        currentBranch={currentBranch}
        onBranchChange={setCurrentBranch}
        userId={session?.user?.id || ""}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Job Description */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-80 border-r bg-background flex-shrink-0"
        >
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <JobDescriptionPanel
              projectId={projectId}
              currentBranch={currentBranchData}
              userId={session?.user?.id || ""}
            />
          </Suspense>
        </motion.div>

        {/* Main Panel - Resume Editor */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <Suspense fallback={<div className="p-4">Loading editor...</div>}>
            <ResumeEditor
              projectId={projectId}
              branchId={currentBranch}
              versionId={currentVersion?.id || ""}
              initialContent={currentVersion?.content || null}
              userId={session?.user?.id || ""}
            />
          </Suspense>
        </motion.div>

        {/* Right Panel - Commit History */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-80 border-l bg-background flex-shrink-0"
        >
          <Suspense fallback={<div className="p-4">Loading history...</div>}>
            <CommitHistory
              projectId={projectId}
              branchId={currentBranch}
              userId={session?.user?.id || ""}
            />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
