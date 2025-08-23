"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { parseResumeFile } from "@/lib/ai/services";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeUploadProps {
  onUploadComplete: (extractedData: any) => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(10);

    try {
      // Simulate file upload progress
      setUploadProgress(30);

      // Read file content
      const text = await readFileAsText(file);
      setUploadProgress(60);

      // Parse with AI
      const extracted = await parseResumeFile(text);
      setUploadProgress(90);

      setExtractedData(extracted);
      setUploadProgress(100);

      toast.success("Resume processed successfully!");
    } catch (error) {
      console.error("Failed to process resume:", error);
      toast.error("Failed to process resume. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      await processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "text/plain": [".txt"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    });

  const handleConfirm = () => {
    if (extractedData) {
      onUploadComplete(extractedData);
    }
  };

  const handleRestart = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setUploadProgress(0);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Existing Resume
          </CardTitle>
          <CardDescription>
            Upload your current resume to automatically extract and populate
            your profile information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your resume file, or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[".PDF", ".DOC", ".DOCX", ".TXT"].map((format) => (
                  <Badge key={format} variant="secondary">
                    {format}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">
                        Processing your resume...
                      </p>
                      <p className="text-sm text-blue-700">
                        Our AI is extracting information from your resume
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </motion.div>
              ) : extractedData ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">
                        Resume processed successfully!
                      </p>
                      <p className="text-sm text-green-700">
                        Review the extracted information below
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRestart}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Extracted Data Preview */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Extracted Information:</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {extractedData.experience &&
                        extractedData.experience.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">
                                Experience
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {extractedData.experience.length} job
                                {extractedData.experience.length !== 1
                                  ? "s"
                                  : ""}{" "}
                                found
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {extractedData.experience[0]?.title} at{" "}
                                {extractedData.experience[0]?.company}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                      {extractedData.education &&
                        extractedData.education.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">
                                Education
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {extractedData.education.length} degree
                                {extractedData.education.length !== 1
                                  ? "s"
                                  : ""}{" "}
                                found
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {extractedData.education[0]?.degree} from{" "}
                                {extractedData.education[0]?.institution}
                              </p>
                            </CardContent>
                          </Card>
                        )}

                      {extractedData.skills &&
                        extractedData.skills.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {extractedData.skills.length} skill
                                {extractedData.skills.length !== 1 ? "s" : ""}{" "}
                                found
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {extractedData.skills
                                  .slice(0, 3)
                                  .map((skill: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                {extractedData.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{extractedData.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                      {extractedData.projects &&
                        extractedData.projects.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">
                                Projects
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {extractedData.projects.length} project
                                {extractedData.projects.length !== 1 ? "s" : ""}{" "}
                                found
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {extractedData.projects[0]?.name}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleRestart}>
                      Upload Different Resume
                    </Button>
                    <Button onClick={handleConfirm}>
                      Use This Information
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg"
                >
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">
                      Failed to process resume
                    </p>
                    <p className="text-sm text-red-700">
                      Please try uploading a different file or fill out the form
                      manually
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRestart}>
                    Try Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* File Rejection Errors */}
          {fileRejections.length > 0 && (
            <div className="space-y-2">
              {fileRejections.map(({ file, errors }) => (
                <div
                  key={file.name}
                  className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {file.name}
                    </p>
                    {errors.map((error) => (
                      <p key={error.code} className="text-xs text-red-700">
                        {error.code === "file-too-large" &&
                          "File is too large (max 10MB)"}
                        {error.code === "file-invalid-type" &&
                          "Invalid file type (PDF, DOC, DOCX, TXT only)"}
                        {error.code === "too-many-files" &&
                          "Only one file allowed"}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Note:</strong> Your resume is processed securely
              and is not stored on our servers. The extracted information is
              only used to pre-populate your profile form.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
