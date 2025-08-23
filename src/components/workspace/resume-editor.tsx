"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Save,
  GitCommit,
  Eye,
  Palette,
  Zap,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Settings,
  Loader2,
} from "lucide-react";
import { EditorToolbar } from "./editor-toolbar";
import { TemplateSelector } from "./template-selector";
import { ATSHealthCheck } from "./ats-health-check";
import { toast } from "sonner";
import { saveResumeVersion, createCommit } from "@/lib/actions/projects";
import { debounce } from "lodash";
import type { ResumeContentJSON } from "@/lib/ai/services";

interface ResumeEditorProps {
  projectId: string;
  branchId: string;
  versionId: string;
  initialContent: any;
  userId: string;
}

interface ResumeSection {
  id: string;
  type:
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications";
  title: string;
  content: any;
  order: number;
}

interface ResumeContent {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: any[];
  education: any[];
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: any[];
  certifications: any[];
}

const defaultResumeContent: ResumeContent = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
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
};

// Convert ResumeContent to ResumeContentJSON
const convertToResumeContentJSON = (
  content: ResumeContent
): ResumeContentJSON => {
  return {
    personalInfo: {
      name: content.personal.name,
      email: content.personal.email,
      phone: content.personal.phone,
      location: content.personal.location,
      linkedin: content.personal.linkedin,
      website: content.personal.portfolio,
    },
    summary: content.summary,
    experience: content.experience.map((exp: any) => ({
      title: exp.title || "",
      company: exp.company || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: Array.isArray(exp.description)
        ? exp.description
        : [exp.description || ""],
    })),
    education: content.education.map((edu: any) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      startYear: edu.startDate || "",
      endYear: edu.endDate || "",
      gpa: edu.gpa,
    })),
    skills: {
      technical: content.skills.technical,
      soft: content.skills.soft,
    },
    projects: content.projects.map((proj: any) => ({
      name: proj.name || "",
      description: proj.description || "",
      techStack: proj.technologies || [],
      url: proj.url,
    })),
    certifications: content.certifications.map((cert: any) => ({
      name: cert.name || "",
      issuer: cert.issuer || "",
      date: cert.date || "",
    })),
  };
};

export function ResumeEditor({
  projectId,
  branchId,
  versionId,
  initialContent,
  userId,
}: ResumeEditorProps) {
  const [content, setContent] = useState<ResumeContent>(
    initialContent || defaultResumeContent
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showATSCheck, setShowATSCheck] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content.summary || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent((prev) => ({
        ...prev,
        summary: html,
      }));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce(async (newContent: any) => {
      await handleSave(newContent, false);
    }, 2000),
    [projectId, branchId, versionId]
  );

  useEffect(() => {
    debouncedSave(content);
  }, [content, debouncedSave]);

  const handleSave = async (saveContent = content, showToast = true) => {
    setIsSaving(true);
    try {
      await saveResumeVersion(
        projectId,
        branchId,
        convertToResumeContentJSON(saveContent)
      );
      setLastSaved(new Date());
      if (showToast) {
        toast.success("Resume saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      if (showToast) {
        toast.error("Failed to save resume");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast.error("Please enter a commit message");
      return;
    }

    try {
      await handleSave(content, false); // Save first
      await createCommit(
        projectId,
        branchId,
        commitMessage,
        convertToResumeContentJSON(content)
      );
      setShowCommitDialog(false);
      setCommitMessage("");
      toast.success("Changes committed successfully!");
    } catch (error) {
      console.error("Commit error:", error);
      toast.error("Failed to commit changes");
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    setContent((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Editor Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreviewMode ? "outline" : "default"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? (
                <Settings className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
            >
              <Palette className="h-4 w-4 mr-2" />
              Template
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowATSCheck(true)}
            >
              <Zap className="h-4 w-4 mr-2" />
              ATS Check
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved {lastSaved.toLocaleTimeString()}
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave()}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button size="sm" onClick={() => setShowCommitDialog(true)}>
              <GitCommit className="h-4 w-4 mr-2" />
              Commit
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {isPreviewMode ? (
            <div className="resume-preview bg-white p-8 shadow-lg border rounded-lg">
              {/* Resume Preview */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="text-center border-b pb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {content.personal.name || "Your Name"}
                  </h1>
                  <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-2">
                    {content.personal.email && (
                      <span>{content.personal.email}</span>
                    )}
                    {content.personal.phone && <span>•</span>}
                    {content.personal.phone && (
                      <span>{content.personal.phone}</span>
                    )}
                    {content.personal.location && <span>•</span>}
                    {content.personal.location && (
                      <span>{content.personal.location}</span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {content.summary && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2">
                      Professional Summary
                    </h2>
                    <div
                      className="mt-3 text-gray-700"
                      dangerouslySetInnerHTML={{ __html: content.summary }}
                    />
                  </div>
                )}

                {/* Experience */}
                {content.experience.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2">
                      Work Experience
                    </h2>
                    <div className="space-y-4 mt-3">
                      {content.experience.map((exp: any) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {exp.title}
                              </h3>
                              <p className="text-gray-700">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-600">
                              {exp.startDate} -{" "}
                              {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>
                          {exp.description && (
                            <div
                              className="mt-2 text-gray-700 text-sm"
                              dangerouslySetInnerHTML={{
                                __html: exp.description,
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Personal Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={content.personal.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                  />
                  <Input
                    placeholder="Email Address"
                    value={content.personal.email}
                    onChange={(e) =>
                      updatePersonalInfo("email", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Phone Number"
                    value={content.personal.phone}
                    onChange={(e) =>
                      updatePersonalInfo("phone", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Location"
                    value={content.personal.location}
                    onChange={(e) =>
                      updatePersonalInfo("location", e.target.value)
                    }
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={content.personal.linkedin}
                    onChange={(e) =>
                      updatePersonalInfo("linkedin", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Portfolio URL"
                    value={content.personal.portfolio}
                    onChange={(e) =>
                      updatePersonalInfo("portfolio", e.target.value)
                    }
                  />
                </CardContent>
              </Card>

              {/* Professional Summary Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <EditorContent editor={editor} />
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Work Experience
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.experience.map((exp: any, index: number) => (
                    <div
                      key={exp.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Experience {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) =>
                            updateExperience(exp.id, "title", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(exp.id, "company", e.target.value)
                          }
                        />
                        <Input
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, "endDate", e.target.value)
                          }
                          disabled={exp.current}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "current",
                              e.target.checked
                            )
                          }
                        />
                        <label className="text-sm">Current Position</label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Commit Dialog */}
      <Dialog open={showCommitDialog} onOpenChange={setShowCommitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commit Changes</DialogTitle>
            <DialogDescription>
              Save your current changes with a descriptive message for version
              history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="e.g., Updated work experience section"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCommitDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCommit}>Commit Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Selector Dialog */}
      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
      />

      {/* ATS Health Check Dialog */}
      <ATSHealthCheck
        open={showATSCheck}
        onOpenChange={setShowATSCheck}
        content={content}
        projectId={projectId}
      />
    </div>
  );
}
