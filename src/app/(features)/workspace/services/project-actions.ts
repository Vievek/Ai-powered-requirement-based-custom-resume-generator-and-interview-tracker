"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ResumeContentJSON } from "@/lib/ai/services";
import { generateCommitMessage } from "@/lib/ai/services";

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new Error("Project name is required");
  }

  try {
    // Create project with main branch
    const project = await prisma.resumeProject.create({
      data: {
        name,
        description,
        userId: session.user.id,
        branches: {
          create: {
            name: "main",
            createdById: session.user.id,
          },
        },
      },
      include: {
        branches: true,
      },
    });

    const mainBranch = project.branches[0];

    // Create initial version
    const defaultTemplate = await prisma.resumeTemplate.findFirst({
      where: { isAtsCompliant: true },
    });

    if (defaultTemplate) {
      await prisma.resumeVersion.create({
        data: {
          branchId: mainBranch.id,
          templateId: defaultTemplate.id,
          content: {
            personalInfo: {
              name: session.user.name || "",
              email: session.user.email || "",
              phone: "",
              location: "",
            },
            summary: "",
            experience: [],
            education: [],
            skills: {
              technical: [],
              soft: [],
            },
            projects: [],
            certifications: [],
          },
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, projectId: project.id };
  } catch (error) {
    console.error("Failed to create project:", error);
    throw new Error("Failed to create project");
  }
}

export async function getProject(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const project = await prisma.resumeProject.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          {
            collaborators: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        branches: {
          include: {
            versions: {
              orderBy: { updatedAt: "desc" },
              take: 1,
              include: {
                template: true,
                commit: {
                  include: {
                    author: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  } catch (error) {
    console.error("Failed to get project:", error);
    throw new Error("Failed to get project");
  }
}

export async function updateResumeContent(
  projectId: string,
  branchId: string,
  content: ResumeContentJSON,
  commitMessage?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Get current version
    const currentVersion = await prisma.resumeVersion.findFirst({
      where: { branchId },
      orderBy: { updatedAt: "desc" },
    });

    if (!currentVersion) {
      throw new Error("No version found for this branch");
    }

    // Generate commit message if not provided
    let finalCommitMessage = commitMessage;
    let changes = "";

    if (!commitMessage && currentVersion.content) {
      try {
        const commitInfo = await generateCommitMessage(
          currentVersion.content as unknown as ResumeContentJSON,
          content
        );
        finalCommitMessage = commitInfo.message;
        changes = commitInfo.changes;
      } catch (error) {
        finalCommitMessage = "Update resume content";
        changes = "Resume content has been updated";
      }
    }

    // Update the version
    const updatedVersion = await prisma.resumeVersion.update({
      where: { id: currentVersion.id },
      data: {
        content: content as any,
        updatedAt: new Date(),
      },
    });

    // Create commit
    await prisma.resumeCommit.create({
      data: {
        versionId: updatedVersion.id,
        message: finalCommitMessage || "Update resume content",
        changes,
        authorId: session.user.id,
      },
    });

    revalidatePath(`/dashboard/workspace/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update resume content:", error);
    throw new Error("Failed to update resume content");
  }
}

export async function createBranch(
  projectId: string,
  branchName: string,
  fromBranchId: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the source branch's latest version
    const sourceVersion = await prisma.resumeVersion.findFirst({
      where: { branchId: fromBranchId },
      orderBy: { updatedAt: "desc" },
      include: { template: true },
    });

    if (!sourceVersion) {
      throw new Error("Source branch has no versions");
    }

    // Create new branch
    const newBranch = await prisma.branch.create({
      data: {
        name: branchName,
        projectId,
        parentBranchId: fromBranchId,
        createdById: session.user.id,
      },
    });

    // Copy the latest version to the new branch
    await prisma.resumeVersion.create({
      data: {
        branchId: newBranch.id,
        templateId: sourceVersion.templateId,
        content: sourceVersion.content as any,
      },
    });

    revalidatePath(`/dashboard/workspace/${projectId}`);
    return { success: true, branchId: newBranch.id };
  } catch (error) {
    console.error("Failed to create branch:", error);
    throw new Error("Failed to create branch");
  }
}

export async function getCommitHistory(projectId: string, branchId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const commits = await prisma.resumeCommit.findMany({
      where: {
        version: {
          branchId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        version: {
          select: {
            id: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return commits;
  } catch (error) {
    console.error("Failed to get commit history:", error);
    throw new Error("Failed to get commit history");
  }
}

export async function shareProject(
  projectId: string,
  email: string,
  accessLevel: "VIEWER" | "COMMENTER" | "EDITOR"
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Find the user to share with
    const userToShare = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToShare) {
      throw new Error("User not found");
    }

    // Check if already shared
    const existingShare = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToShare.id,
        },
      },
    });

    if (existingShare) {
      // Update access level
      await prisma.projectCollaborator.update({
        where: {
          projectId_userId: {
            projectId,
            userId: userToShare.id,
          },
        },
        data: { accessLevel },
      });
    } else {
      // Create new share
      await prisma.projectCollaborator.create({
        data: {
          projectId,
          userId: userToShare.id,
          accessLevel,
          sharedById: session.user.id,
        },
      });
    }

    revalidatePath(`/dashboard/workspace/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to share project:", error);
    throw new Error("Failed to share project");
  }
}

export async function deleteProject(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Check ownership
    const project = await prisma.resumeProject.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      throw new Error("Project not found or unauthorized");
    }

    await prisma.resumeProject.delete({
      where: { id: projectId },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Failed to delete project");
  }
}

export async function duplicateProject(projectId: string, newName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const originalProject = await prisma.resumeProject.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          {
            collaborators: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        branches: {
          include: {
            versions: {
              orderBy: { updatedAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!originalProject) {
      throw new Error("Original project not found");
    }

    // Create new project
    const newProject = await prisma.resumeProject.create({
      data: {
        name: newName,
        description: originalProject.description,
        userId: session.user.id,
      },
    });

    // Duplicate main branch and its latest version
    const mainBranch = originalProject.branches.find((b) => b.name === "main");
    if (mainBranch && mainBranch.versions.length > 0) {
      const newBranch = await prisma.branch.create({
        data: {
          name: "main",
          projectId: newProject.id,
          createdById: session.user.id,
        },
      });

      const latestVersion = mainBranch.versions[0];
      await prisma.resumeVersion.create({
        data: {
          branchId: newBranch.id,
          templateId: latestVersion.templateId,
          content: latestVersion.content as any,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, projectId: newProject.id };
  } catch (error) {
    console.error("Failed to duplicate project:", error);
    throw new Error("Failed to duplicate project");
  }
}

// Additional exports for workspace components
export async function getProjectDetails(projectId: string) {
  return await getProject(projectId);
}

export async function getProjectBranches(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const branches = await prisma.branch.findMany({
      where: {
        project: {
          id: projectId,
          OR: [
            { userId: session.user.id },
            {
              collaborators: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          ],
        },
      },
      include: {
        versions: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          include: {
            template: true,
            commit: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return branches;
  } catch (error) {
    console.error("Failed to get project branches:", error);
    throw new Error("Failed to get project branches");
  }
}

export async function getUserResumeProjects() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const projects = await prisma.resumeProject.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          {
            collaborators: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return projects;
  } catch (error) {
    console.error("Failed to get user resume projects:", error);
    throw new Error("Failed to get user resume projects");
  }
}

export async function saveResumeVersion(
  projectId: string,
  branchId: string,
  content: ResumeContentJSON
) {
  return await updateResumeContent(projectId, branchId, content);
}

export async function createCommit(
  projectId: string,
  branchId: string,
  message: string,
  content: ResumeContentJSON
) {
  return await updateResumeContent(projectId, branchId, content, message);
}
