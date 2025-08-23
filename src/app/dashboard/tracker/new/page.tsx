"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Building2,
  Briefcase,
  Calendar,
  FileText,
  ArrowLeft,
  Save,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface JobApplicationData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  status: "DRAFT" | "APPLIED" | "INTERVIEWING" | "REJECTED" | "OFFER";
  appliedDate?: string;
  projectId?: string;
  jobUrl?: string;
  salary?: string;
  location?: string;
  notes?: string;
}

export default function NewJobApplicationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<JobApplicationData>({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    status: "DRAFT",
    jobUrl: "",
    salary: "",
    location: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<JobApplicationData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Partial<JobApplicationData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Job application saved successfully!");
      router.push("/dashboard/tracker");
    } catch (error) {
      console.error("Failed to save job application:", error);
      toast.error("Failed to save job application");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (
    field: keyof JobApplicationData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Job Application
          </h1>
          <p className="text-muted-foreground">
            Track a new job opportunity and link it to your resume projects
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Details
              </CardTitle>
              <CardDescription>
                Basic information about the job opportunity
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Google, Microsoft, etc."
                      className="pl-10"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleFieldChange("companyName", e.target.value)
                      }
                      error={errors.companyName}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-sm text-destructive">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="jobTitle"
                      placeholder="Software Engineer, Product Manager, etc."
                      className="pl-10"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        handleFieldChange("jobTitle", e.target.value)
                      }
                      error={errors.jobTitle}
                    />
                  </div>
                  {errors.jobTitle && (
                    <p className="text-sm text-destructive">
                      {errors.jobTitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Application Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleFieldChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="OFFER">Offer Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Applied Date */}
                {formData.status !== "DRAFT" && (
                  <div className="space-y-2">
                    <Label htmlFor="appliedDate">Applied Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="appliedDate"
                        type="date"
                        className="pl-10"
                        value={formData.appliedDate || ""}
                        onChange={(e) =>
                          handleFieldChange("appliedDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Job URL */}
                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job Posting URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="jobUrl"
                      placeholder="https://company.com/jobs/123"
                      className="pl-10"
                      value={formData.jobUrl}
                      onChange={(e) =>
                        handleFieldChange("jobUrl", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="$120k - $150k"
                    value={formData.salary}
                    onChange={(e) =>
                      handleFieldChange("salary", e.target.value)
                    }
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA / Remote"
                    value={formData.location}
                    onChange={(e) =>
                      handleFieldChange("location", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Description
              </CardTitle>
              <CardDescription>
                Paste the job description to help with resume tailoring
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here..."
                  className="min-h-40"
                  value={formData.jobDescription}
                  onChange={(e) =>
                    handleFieldChange("jobDescription", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This will help our AI suggest relevant resume improvements and
                  keyword optimization
                </p>
              </div>

              {formData.jobDescription.length > 100 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      AI Analysis Available
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Once saved, you can generate tailored resumes and get ATS
                    optimization suggestions for this role.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Link Resume Project</CardTitle>
              <CardDescription>
                Associate this application with one of your resume projects
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <Select
                  value={formData.projectId || ""}
                  onValueChange={(value) =>
                    handleFieldChange("projectId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No project linked</SelectItem>
                    <SelectItem value="1">Software Engineer Resume</SelectItem>
                    <SelectItem value="2">Senior Developer Resume</SelectItem>
                    <SelectItem value="3">Full Stack Resume</SelectItem>
                  </SelectContent>
                </Select>

                <div className="text-xs text-muted-foreground">
                  <p>
                    💡 <strong>Tip:</strong> Link this application to a resume
                    project to:
                  </p>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>
                      Generate AI-tailored versions for this specific role
                    </li>
                    <li>
                      Track which resume version was used for this application
                    </li>
                    <li>
                      Get ATS optimization suggestions based on the job
                      description
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Personal notes, interview dates, contacts, etc.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Textarea
                placeholder="Add any additional notes about this application..."
                className="min-h-20"
                value={formData.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  // Save as draft logic
                  handleFieldChange("status", "DRAFT");
                  handleSubmit(e as any);
                }}
              >
                Save Draft
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Application
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
