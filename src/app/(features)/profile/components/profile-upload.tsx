"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { parseResumeFile } from "@/lib/ai/services";
import { updateUserProfile } from "@/lib/actions/profile";

interface ProfileUploadProps {
  userId: string;
}

interface ParsedProfile {
  education?: any[];
  experience?: any[];
  skills?: string[];
  softSkills?: string[];
  projects?: any[];
  certifications?: any[];
}

export function ProfileUpload({ userId }: ProfileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "parsing" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      setUploadStatus("parsing");
      setUploadProgress(95);

      // Parse the resume file using AI
      const fileText = await file.text();
      const parsed = await parseResumeFile(fileText);

      setUploadProgress(100);
      setParsedData(parsed);
      setUploadStatus("success");

      toast.success(
        "Resume parsed successfully! Review the extracted data below."
      );
    } catch (err) {
      console.error("Upload/parsing error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse resume");
      setUploadStatus("error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/msword": [".doc"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    });

  const handleSaveParsedData = async () => {
    if (!parsedData) return;

    try {
      await updateUserProfile(userId, parsedData);
      toast.success("Profile updated with parsed resume data!");

      // Reset the component
      setUploadStatus("idle");
      setParsedData(null);
      setUploadProgress(0);
    } catch (err) {
      console.error("Failed to save parsed data:", err);
      toast.error("Failed to save parsed data");
    }
  };

  const handleReset = () => {
    setUploadStatus("idle");
    setParsedData(null);
    setUploadProgress(0);
    setError(null);
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading your resume...";
      case "parsing":
        return "AI is extracting information from your resume...";
      case "success":
        return "Resume parsed successfully!";
      case "error":
        return "Something went wrong";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadStatus === "idle" && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg">Drop your resume here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Drag & drop your resume here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supports PDF, DOC, and DOCX files up to 10MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {(uploadStatus === "uploading" || uploadStatus === "parsing") && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">
                  {getStatusMessage()}
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Error State */}
          {uploadStatus === "error" && error && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={handleReset} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* File Rejection Errors */}
          {fileRejections.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {fileRejections[0].errors[0].message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Parsed Data Preview */}
      {uploadStatus === "success" && parsedData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Extracted Information
            </CardTitle>
            <Button onClick={handleReset} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                AI has extracted the following information from your resume.
                Please review and make any necessary corrections before saving.
              </AlertDescription>
            </Alert>

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">
                  Education ({parsedData.education.length} items)
                </h3>
                <div className="space-y-2">
                  {parsedData.education.map((edu: any, index) => (
                    <div key={index} className="text-sm bg-muted p-3 rounded">
                      <div className="font-medium">
                        {edu.degree} from {edu.institution}
                      </div>
                      <div className="text-muted-foreground">
                        {edu.startYear} - {edu.endYear}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData.experience && parsedData.experience.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">
                  Work Experience ({parsedData.experience.length} items)
                </h3>
                <div className="space-y-2">
                  {parsedData.experience.map((exp: any, index) => (
                    <div key={index} className="text-sm bg-muted p-3 rounded">
                      <div className="font-medium">
                        {exp.title} at {exp.company}
                      </div>
                      <div className="text-muted-foreground">
                        {exp.start} - {exp.end}
                      </div>
                      {exp.description && (
                        <div className="mt-1 text-xs line-clamp-2">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">
                  Technical Skills ({parsedData.skills.length} items)
                </h3>
                <div className="flex flex-wrap gap-1">
                  {parsedData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {parsedData.softSkills && parsedData.softSkills.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">
                  Soft Skills ({parsedData.softSkills.length} items)
                </h3>
                <div className="flex flex-wrap gap-1">
                  {parsedData.softSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {parsedData.projects && parsedData.projects.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">
                  Projects ({parsedData.projects.length} items)
                </h3>
                <div className="space-y-2">
                  {parsedData.projects.map((project: any, index) => (
                    <div key={index} className="text-sm bg-muted p-3 rounded">
                      <div className="font-medium">{project.name}</div>
                      {project.description && (
                        <div className="mt-1 text-xs line-clamp-2">
                          {project.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {parsedData.certifications &&
              parsedData.certifications.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">
                    Certifications ({parsedData.certifications.length} items)
                  </h3>
                  <div className="space-y-2">
                    {parsedData.certifications.map((cert: any, index) => (
                      <div key={index} className="text-sm bg-muted p-3 rounded">
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-muted-foreground">
                          {cert.issuer} - {cert.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex space-x-4">
              <Button onClick={handleSaveParsedData} className="flex-1">
                Save to Profile
              </Button>
              <Button onClick={handleReset} variant="outline">
                Upload Different Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
