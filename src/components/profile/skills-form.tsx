"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Heart, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface Skills {
  technical: string[];
  soft: string[];
}

interface SkillsFormProps {
  data?: Skills;
  onUpdate: (data: Skills) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const POPULAR_TECHNICAL_SKILLS = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "Java",
  "C++",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "HTML/CSS",
  "Vue.js",
  "Angular",
  "Django",
  "Flask",
  "Express.js",
  "GraphQL",
  "REST APIs",
  "Redis",
  "Jenkins",
];

const POPULAR_SOFT_SKILLS = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Critical Thinking",
  "Adaptability",
  "Project Management",
  "Public Speaking",
  "Conflict Resolution",
  "Creativity",
  "Analytical Thinking",
  "Decision Making",
  "Collaboration",
  "Negotiation",
  "Mentoring",
];

export function SkillsForm({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: SkillsFormProps) {
  const [skills, setSkills] = useState<Skills>({
    technical: data?.technical || [],
    soft: data?.soft || [],
  });

  const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");

  const addTechnicalSkill = (skill: string) => {
    if (skill.trim() && !skills.technical.includes(skill.trim())) {
      const updatedSkills = {
        ...skills,
        technical: [...skills.technical, skill.trim()],
      };
      setSkills(updatedSkills);
      onUpdate(updatedSkills);
      setNewTechnicalSkill("");
    }
  };

  const addSoftSkill = (skill: string) => {
    if (skill.trim() && !skills.soft.includes(skill.trim())) {
      const updatedSkills = {
        ...skills,
        soft: [...skills.soft, skill.trim()],
      };
      setSkills(updatedSkills);
      onUpdate(updatedSkills);
      setNewSoftSkill("");
    }
  };

  const removeTechnicalSkill = (skillToRemove: string) => {
    const updatedSkills = {
      ...skills,
      technical: skills.technical.filter((skill) => skill !== skillToRemove),
    };
    setSkills(updatedSkills);
    onUpdate(updatedSkills);
  };

  const removeSoftSkill = (skillToRemove: string) => {
    const updatedSkills = {
      ...skills,
      soft: skills.soft.filter((skill) => skill !== skillToRemove),
    };
    setSkills(updatedSkills);
    onUpdate(updatedSkills);
  };

  const handleNext = () => {
    onUpdate(skills);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Technical Skills
          </CardTitle>
          <CardDescription>
            Add your technical skills, programming languages, frameworks, and
            tools
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Add Technical Skill */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., JavaScript, Python, React..."
              value={newTechnicalSkill}
              onChange={(e) => setNewTechnicalSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechnicalSkill(newTechnicalSkill);
                }
              }}
            />
            <Button
              onClick={() => addTechnicalSkill(newTechnicalSkill)}
              disabled={!newTechnicalSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Technical Skills */}
          {skills.technical.length > 0 && (
            <div>
              <Label className="text-sm font-medium">
                Your Technical Skills
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.technical.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge variant="secondary" className="pr-1">
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 text-muted-foreground hover:text-destructive"
                        onClick={() => removeTechnicalSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Technical Skills */}
          <div>
            <Label className="text-sm font-medium">
              Popular Technical Skills
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {POPULAR_TECHNICAL_SKILLS.filter(
                (skill) => !skills.technical.includes(skill)
              )
                .slice(0, 12)
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => addTechnicalSkill(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soft Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Soft Skills
          </CardTitle>
          <CardDescription>
            Add your interpersonal skills and personal attributes
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Add Soft Skill */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Communication, Leadership, Problem Solving..."
              value={newSoftSkill}
              onChange={(e) => setNewSoftSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSoftSkill(newSoftSkill);
                }
              }}
            />
            <Button
              onClick={() => addSoftSkill(newSoftSkill)}
              disabled={!newSoftSkill.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Soft Skills */}
          {skills.soft.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Your Soft Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.soft.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="pr-1 bg-pink-100 text-pink-800 border-pink-200"
                    >
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 text-muted-foreground hover:text-destructive"
                        onClick={() => removeSoftSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Soft Skills */}
          <div>
            <Label className="text-sm font-medium">Popular Soft Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {POPULAR_SOFT_SKILLS.filter(
                (skill) => !skills.soft.includes(skill)
              )
                .slice(0, 12)
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-pink-500 hover:text-white transition-colors"
                    onClick={() => addSoftSkill(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Summary */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Skills Summary</p>
              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <span>{skills.technical.length} Technical Skills</span>
                <span>{skills.soft.length} Soft Skills</span>
                <span>
                  {skills.technical.length + skills.soft.length} Total Skills
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tips:</strong> Include skills relevant to your target roles.
          Be honest about your skill level and focus on skills you can
          confidently discuss in an interview.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Education
        </Button>
        <Button onClick={handleNext}>Continue to Projects</Button>
      </div>
    </div>
  );
}
