"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile, getUserProfile } from "@/lib/actions/profile";

const profileSchema = z.object({
  education: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        institution: z.string().min(1, "Institution is required"),
        startYear: z.string().min(4, "Start year must be 4 digits"),
        endYear: z.string().min(4, "End year must be 4 digits"),
      })
    )
    .optional(),
  experience: z
    .array(
      z.object({
        title: z.string().min(1, "Job title is required"),
        company: z.string().min(1, "Company is required"),
        start: z.string().min(1, "Start date is required"),
        end: z.string().min(1, "End date is required"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  softSkills: z.array(z.string()).min(1, "At least one soft skill is required"),
  projects: z
    .array(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().min(1, "Description is required"),
        techStack: z.array(z.string()),
      })
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, "Certification name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        date: z.string().min(1, "Date is required"),
      })
    )
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
}

export function ProfileForm({ userId }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      education: [],
      experience: [],
      skills: [],
      softSkills: [],
      projects: [],
      certifications: [],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          form.reset({
            education: (profile.education as any[]) || [],
            experience: (profile.experience as any[]) || [],
            skills: profile.skills || [],
            softSkills: profile.softSkills || [],
            projects: (profile.projects as any[]) || [],
            certifications: (profile.certifications as any[]) || [],
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      }
    };

    loadProfile();
  }, [userId, form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateUserProfile(userId, data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const currentSkills = form.getValues("skills");
      if (!currentSkills.includes(skillInput.trim())) {
        form.setValue("skills", [...currentSkills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const addSoftSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && softSkillInput.trim()) {
      e.preventDefault();
      const currentSkills = form.getValues("softSkills");
      if (!currentSkills.includes(softSkillInput.trim())) {
        form.setValue("softSkills", [...currentSkills, softSkillInput.trim()]);
        setSoftSkillInput("");
      }
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((_, i) => i !== index)
    );
  };

  const removeSoftSkill = (index: number) => {
    const currentSkills = form.getValues("softSkills");
    form.setValue(
      "softSkills",
      currentSkills.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Education
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendEducation({
                    degree: "",
                    institution: "",
                    startYear: "",
                    endYear: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {educationFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeEducation(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Bachelor of Science" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="University of Technology"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.startYear`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2018" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.endYear`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2022" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Work Experience
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendExperience({
                    title: "",
                    company: "",
                    start: "",
                    end: "",
                    description: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experienceFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeExperience(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Software Engineer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tech Corp" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="month" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experience.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="month" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="skills-input">Add Skills (Press Enter)</Label>
              <Input
                id="skills-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="JavaScript, React, Python, etc."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {form.watch("skills").map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSkill(index)}
                  />
                </Badge>
              ))}
            </div>
            {form.formState.errors.skills && (
              <p className="text-sm text-destructive">
                {form.formState.errors.skills.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Soft Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle>Soft Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="soft-skills-input">
                Add Soft Skills (Press Enter)
              </Label>
              <Input
                id="soft-skills-input"
                value={softSkillInput}
                onChange={(e) => setSoftSkillInput(e.target.value)}
                onKeyDown={addSoftSkill}
                placeholder="Leadership, Communication, Problem Solving, etc."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {form.watch("softSkills").map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeSoftSkill(index)}
                  />
                </Badge>
              ))}
            </div>
            {form.formState.errors.softSkills && (
              <p className="text-sm text-destructive">
                {form.formState.errors.softSkills.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Projects
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendProject({ name: "", description: "", techStack: [] })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeProject(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E-commerce Platform" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe what you built and the impact it had..."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Certifications
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendCertification({ name: "", issuer: "", date: "" })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certificationFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeCertification(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <FormField
                  control={form.control}
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="AWS Certified Developer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certifications.${index}.issuer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Amazon Web Services" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certifications.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="month" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
