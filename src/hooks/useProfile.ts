import { useState, useEffect } from "react";

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    // Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockProfile = {
      id: "1",
      personalInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        website: "johndoe.dev",
      },
      experience: [
        {
          id: "1",
          title: "Senior Software Engineer",
          company: "Tech Corp",
          startDate: "2022-01",
          endDate: "Present",
          description:
            "Led development of scalable web applications using React and Node.js. Improved system performance by 40%.",
          current: true,
        },
      ],
      education: [
        {
          id: "1",
          degree: "Bachelor of Computer Science",
          institution: "University of California, Berkeley",
          startYear: "2018",
          endYear: "2022",
          gpa: "3.8",
        },
      ],
      skills: {
        technical: ["JavaScript", "React", "Node.js", "Python", "PostgreSQL"],
        soft: ["Leadership", "Communication", "Problem Solving"],
      },
      projects: [
        {
          id: "1",
          name: "E-commerce Platform",
          description:
            "Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL",
          techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
          url: "https://github.com/johndoe/ecommerce",
        },
      ],
      certifications: [
        {
          id: "1",
          name: "AWS Solutions Architect",
          issuer: "Amazon Web Services",
          date: "2023-06",
          url: "https://aws.amazon.com/certification/",
        },
      ],
    };
    setProfile(mockProfile);
    setIsLoading(false);
  };

  return { profile, setProfile, isLoading };
}
