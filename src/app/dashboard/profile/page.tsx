"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PersonalInfoForm } from "@/components/profile/personal-info-form";
import { ExperienceForm } from "@/components/profile/experience-form";
import { EducationForm } from "@/components/profile/education-form";
import { SkillsForm } from "@/components/profile/skills-form";
import { ProjectsForm } from "@/components/profile/projects-form";
import { ResumeUpload } from "@/components/profile/resume-upload";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import {
  User,
  FileText,
  GraduationCap,
  Code,
  Award,
  Upload,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { calculateCompletion } from "@/utils/calculateCompleteion";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: session } = useSession();
  const { profile, setProfile, isLoading } = useProfile(session?.user?.id);
  const [completionStats, setCompletionStats] = useState({
    personal: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0,
    overall: 0,
  });

  const router = useRouter();

  // Update completion stats when profile changes
  React.useEffect(() => {
    if (profile) {
      setCompletionStats(calculateCompletion(profile));
    }
  }, [profile]);

  const tabs = [
    {
      id: "upload",
      label: "Upload Resume",
      icon: Upload,
      description: "Quick start by uploading your existing resume",
    },
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      description: "Basic contact information and profile details",
    },
    {
      id: "experience",
      label: "Experience",
      icon: FileText,
      description: "Work history and professional achievements",
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      description: "Educational background and qualifications",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code,
      description: "Technical skills and competencies",
    },
    {
      id: "projects",
      label: "Projects",
      icon: Award,
      description: "Portfolio projects and side work",
    },
  ];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Save profile to backend
  const saveProfile = async () => {
    try {
      const payload = {
        userId: session?.user?.id,
        data: {
          education: profile?.education,
          experience: profile?.experience,
          skills: profile?.skills?.technical,
          softSkills: profile?.skills?.soft,
          projects: profile?.projects,
          certifications: profile?.certifications,
        },
      };
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Profile saved! You can now create AI-powered resumes.");
        router.push("/dashboard");
      } else {
        toast.error("Failed to save profile: " + result.error);
      }
    } catch (error) {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Build your professional profile to create better resumes
          </p>
        </div>
        {/* Completion Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Badge
            variant={completionStats.overall === 100 ? "default" : "secondary"}
            className="text-sm px-4 py-2"
          >
            {completionStats.overall === 100 && (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {completionStats.overall}% Complete
          </Badge>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Completion</CardTitle>
          <CardDescription>
            Complete all sections to unlock AI-powered resume generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {tabs.slice(1).map((tab) => {
              const completion =
                completionStats[tab.id as keyof typeof completionStats];
              return (
                <div key={tab.id} className="text-center">
                  <div className="mb-2">
                    <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-2">
                      <tab.icon
                        className={`h-5 w-5 ${
                          completion === 100
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-medium">{tab.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {completion}%
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Profile Forms */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimateTabContent value="upload">
          <ResumeUpload
            onUploadComplete={(extractedData) => {
              setProfile({ ...profile, ...extractedData });
              toast.success("Resume uploaded and processed successfully!");
              setActiveTab("personal");
            }}
          />
        </AnimateTabContent>

        <AnimateTabContent value="personal">
          <PersonalInfoForm
            data={profile?.personalInfo}
            onUpdate={(data) => {
              setProfile({ ...profile, personalInfo: data });
            }}
            onNext={() => setActiveTab("experience")}
          />
        </AnimateTabContent>

        <AnimateTabContent value="experience">
          <ExperienceForm
            data={profile?.experience || []}
            onUpdate={(data) => {
              setProfile({ ...profile, experience: data });
            }}
            onNext={() => setActiveTab("education")}
            onPrevious={() => setActiveTab("personal")}
          />
        </AnimateTabContent>

        <AnimateTabContent value="education">
          <EducationForm
            data={profile?.education || []}
            onUpdate={(data) => {
              setProfile({ ...profile, education: data });
            }}
            onNext={() => setActiveTab("skills")}
            onPrevious={() => setActiveTab("experience")}
          />
        </AnimateTabContent>

        <AnimateTabContent value="skills">
          <SkillsForm
            data={profile?.skills}
            onUpdate={(data) => {
              setProfile({ ...profile, skills: data });
            }}
            onNext={() => setActiveTab("projects")}
            onPrevious={() => setActiveTab("education")}
          />
        </AnimateTabContent>

        <AnimateTabContent value="projects">
          <ProjectsForm
            data={profile?.projects || []}
            onUpdate={(data) => {
              setProfile({ ...profile, projects: data });
            }}
            onPrevious={() => setActiveTab("skills")}
            onComplete={saveProfile}
          />
        </AnimateTabContent>
      </Tabs>
    </div>
  );
}

function AnimateTabContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <TabsContent value={value} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </TabsContent>
  );
}
