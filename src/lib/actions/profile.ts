"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    throw new Error("Failed to load profile");
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    education?: any[];
    experience?: any[];
    skills?: string[];
    softSkills?: string[];
    projects?: any[];
    certifications?: any[];
  }
) {
  try {
    // Update or create user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        education: data.education,
        experience: data.experience,
        skills: data.skills,
        softSkills: data.softSkills,
        projects: data.projects,
        certifications: data.certifications,
        updatedAt: new Date(),
      },
      create: {
        userId,
        education: data.education,
        experience: data.experience,
        skills: data.skills || [],
        softSkills: data.softSkills || [],
        projects: data.projects,
        certifications: data.certifications,
      },
    });

    // Update user profile completion status
    await prisma.user.update({
      where: { id: userId },
      data: { profileCompleted: true },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return profile;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw new Error("Failed to update profile");
  }
}

export async function deleteUserProfile(userId: string) {
  try {
    await prisma.userProfile.delete({
      where: { userId },
    });

    // Update user profile completion status
    await prisma.user.update({
      where: { id: userId },
      data: { profileCompleted: false },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete user profile:", error);
    throw new Error("Failed to delete profile");
  }
}
