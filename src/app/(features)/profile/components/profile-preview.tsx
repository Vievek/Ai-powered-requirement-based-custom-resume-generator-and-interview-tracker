"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  FolderOpen,
  Download,
  Edit,
} from "lucide-react";
import { getUserProfile } from "@/lib/actions/profile";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ProfilePreviewProps {
  userId: string;
}

interface UserProfile {
  education?: any[];
  experience?: any[];
  skills?: string[];
  softSkills?: string[];
  projects?: any[];
  certifications?: any[];
}

export function ProfilePreview({ userId }: ProfilePreviewProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile(userId);
        setProfile(
          userProfile
            ? {
                education: userProfile.education as any[],
                experience: userProfile.experience as any[],
                skills: userProfile.skills,
                softSkills: userProfile.softSkills,
                projects: userProfile.projects as any[],
                certifications: userProfile.certifications as any[],
              }
            : null
        );
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">No profile data found</p>
        <Button asChild>
          <Link href="/dashboard/profile?tab=profile">
            Complete Your Profile
          </Link>
        </Button>
      </div>
    );
  }

  const user = session?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex space-x-2 mt-4">
                <Button asChild size="sm">
                  <Link href="/dashboard/profile?tab=profile">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.education.map((edu: any, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </div>
                  <Badge variant="outline">
                    {edu.startYear} - {edu.endYear}
                  </Badge>
                </div>
                {index < profile.education!.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {profile.experience && profile.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.experience.map((exp: any, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                  </div>
                  <Badge variant="outline">
                    {exp.start} - {exp.end}
                  </Badge>
                </div>
                {exp.description && (
                  <p className="text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                )}
                {index < profile.experience!.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      {(profile.skills && profile.skills.length > 0) ||
      (profile.softSkills && profile.softSkills.length > 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.softSkills && profile.softSkills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.softSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Projects Section */}
      {profile.projects && profile.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.projects.map((project: any, index) => (
              <div key={index}>
                <h3 className="font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techStack.map(
                      (tech: string, techIndex: number) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      )
                    )}
                  </div>
                )}
                {index < profile.projects!.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications Section */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.certifications.map((cert: any, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <Badge variant="outline">{cert.date}</Badge>
                </div>
                {index < profile.certifications!.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!profile.education || profile.education.length === 0) &&
        (!profile.experience || profile.experience.length === 0) &&
        (!profile.skills || profile.skills.length === 0) &&
        (!profile.projects || profile.projects.length === 0) &&
        (!profile.certifications || profile.certifications.length === 0) && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Complete Your Profile
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your education, experience, and skills to get better resume
                suggestions
              </p>
              <Button asChild>
                <Link href="/dashboard/profile?tab=profile">
                  Complete Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
