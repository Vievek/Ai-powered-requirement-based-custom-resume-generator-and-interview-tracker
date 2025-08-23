"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobApplication(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const companyName = formData.get("companyName") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const jobDescription = formData.get("jobDescription") as string;
  const status = formData.get("status") as
    | "DRAFT"
    | "APPLIED"
    | "INTERVIEWING"
    | "REJECTED"
    | "OFFER";
  const appliedDate = formData.get("appliedDate") as string;
  const projectId = formData.get("projectId") as string;

  if (!companyName || !jobTitle) {
    throw new Error("Company name and job title are required");
  }

  try {
    await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        companyName,
        jobTitle,
        jobDescription,
        status: status || "DRAFT",
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        projectId: projectId || null,
      },
    });

    revalidatePath("/dashboard/tracker");
    redirect("/dashboard/tracker");
  } catch (error) {
    console.error("Failed to create job application:", error);
    throw new Error("Failed to create job application");
  }
}

export async function updateJobApplication(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const companyName = formData.get("companyName") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const jobDescription = formData.get("jobDescription") as string;
  const status = formData.get("status") as
    | "DRAFT"
    | "APPLIED"
    | "INTERVIEWING"
    | "REJECTED"
    | "OFFER";
  const appliedDate = formData.get("appliedDate") as string;

  try {
    await prisma.jobApplication.update({
      where: {
        id,
        userId: session.user.id, // Ensure user owns the application
      },
      data: {
        companyName,
        jobTitle,
        jobDescription,
        status,
        appliedDate: appliedDate ? new Date(appliedDate) : null,
      },
    });

    revalidatePath("/dashboard/tracker");
    return { success: true };
  } catch (error) {
    console.error("Failed to update job application:", error);
    throw new Error("Failed to update job application");
  }
}

export async function deleteJobApplication(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.jobApplication.delete({
      where: {
        id,
        userId: session.user.id, // Ensure user owns the application
      },
    });

    revalidatePath("/dashboard/tracker");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete job application:", error);
    throw new Error("Failed to delete job application");
  }
}
