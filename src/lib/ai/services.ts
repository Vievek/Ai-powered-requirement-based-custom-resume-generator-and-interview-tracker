import { GoogleGenerativeAI } from "@google/generative-ai";

// Define a simple UserProfile interface since it doesn't exist in Prisma
interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  industry?: string | null;
  experienceLevel?: string | null;
  skills?: string[];
  education?: any[];
  experience?: any[];
  projects?: any[];
  certifications?: any[];
  softSkills?: string[];
}

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export interface ResumeContentJSON {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    techStack: string[];
    url?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

export async function parseResumeFile(
  fileContent: string
): Promise<Partial<UserProfile>> {
  try {
    const prompt = `
    Parse the following resume content and extract structured data. Return a JSON object with the following structure:
    {
      "education": [{"degree": "", "institution": "", "startYear": "", "endYear": ""}],
      "experience": [{"title": "", "company": "", "start": "", "end": "", "description": ""}],
      "skills": ["skill1", "skill2"],
      "projects": [{"name": "", "description": "", "techStack": []}],
      "certifications": [{"name": "", "issuer": "", "date": ""}],
      "softSkills": ["communication", "leadership"]
    }

    Resume content:
    ${fileContent}
    
    Please extract only the data that is explicitly mentioned in the resume.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return parsedData;
  } catch (error) {
    console.error("Error parsing resume file:", error);
    // Return a minimal structure on error
    return {
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      softSkills: [],
    };
  }
}

export async function generateTailoredCV(
  profile: UserProfile,
  jobDescription: string
): Promise<ResumeContentJSON> {
  try {
    const prompt = `
    Create a tailored, ATS-optimized resume based on the user profile and job description.
    
    User Profile:
    - Education: ${JSON.stringify(profile.education)}
    - Experience: ${JSON.stringify(profile.experience)}
    - Skills: ${JSON.stringify(profile.skills)}
    - Projects: ${JSON.stringify(profile.projects)}
    - Certifications: ${JSON.stringify(profile.certifications)}
    - Soft Skills: ${JSON.stringify(profile.softSkills)}

    Job Description:
    ${jobDescription}

    Requirements:
    1. Tailor the resume to match the job requirements
    2. Include relevant keywords naturally
    3. Prioritize most relevant experience and skills
    4. Write ATS-friendly descriptions using bullet points
    5. Quantify achievements where possible
    6. Use action verbs
    7. Keep descriptions concise but impactful

    Return a JSON object with this exact structure:
    {
      "personalInfo": {
        "name": "Name from profile or generate",
        "email": "email@example.com",
        "phone": "+1234567890",
        "location": "City, State",
        "linkedin": "optional",
        "website": "optional"
      },
      "summary": "2-3 sentence professional summary tailored to the job",
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "startDate": "MM/YYYY",
          "endDate": "MM/YYYY or Present",
          "description": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "institution": "University Name",
          "startYear": "YYYY",
          "endYear": "YYYY",
          "gpa": "optional"
        }
      ],
      "skills": {
        "technical": ["skill1", "skill2"],
        "soft": ["skill1", "skill2"]
      },
      "projects": [
        {
          "name": "Project Name",
          "description": "Brief description highlighting relevant technologies and impact",
          "techStack": ["tech1", "tech2"],
          "url": "optional"
        }
      ],
      "certifications": [
        {
          "name": "Certification Name",
          "issuer": "Issuing Organization",
          "date": "MM/YYYY",
          "url": "optional"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }

    const tailoredCV = JSON.parse(jsonMatch[0]);
    return tailoredCV;
  } catch (error) {
    console.error("Error generating tailored CV:", error);
    throw new Error("Failed to generate tailored CV");
  }
}

export async function findRelevantCVs(
  jobDescription: string,
  userProjects: Array<{ id: string; name: string; description?: string }>
): Promise<Array<{ id: string; name: string; score: number }>> {
  try {
    const prompt = `
    Given a job description and a list of existing resume projects, score each project's relevance to the job (0-100).
    
    Job Description:
    ${jobDescription}

    Resume Projects:
    ${JSON.stringify(userProjects)}

    Return a JSON array with this structure:
    [
      {
        "id": "project_id",
        "name": "project_name",
        "score": 85
      }
    ]
    
    Score based on:
    - Relevance of skills mentioned
    - Industry alignment
    - Job level match
    - Technology stack overlap
    
    Only return projects with score > 50.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }

    const relevantCVs = JSON.parse(jsonMatch[0]);
    return relevantCVs.filter((cv: any) => cv.score > 50);
  } catch (error) {
    console.error("Error finding relevant CVs:", error);
    return [];
  }
}

export async function generateCareerSuggestions(
  profile: UserProfile,
  careerGoal: string
): Promise<
  Array<{
    type: "SKILL" | "COURSE" | "PROJECT" | "CERTIFICATION";
    description: string;
    reasoning: string;
    resourceLink?: string;
  }>
> {
  try {
    const prompt = `
    Based on the user's profile and career goal, generate personalized career development suggestions.
    
    User Profile:
    - Skills: ${JSON.stringify(profile.skills)}
    - Experience: ${JSON.stringify(profile.experience)}
    - Education: ${JSON.stringify(profile.education)}
    - Projects: ${JSON.stringify(profile.projects)}
    - Career Goal: ${careerGoal}

    Generate 5-8 actionable suggestions to help achieve the career goal.
    
    Return a JSON array with this structure:
    [
      {
        "type": "SKILL", // SKILL, COURSE, PROJECT, or CERTIFICATION
        "description": "Learn React.js and modern JavaScript frameworks",
        "reasoning": "React is mentioned in 70% of frontend job postings and aligns with your JavaScript experience",
        "resourceLink": "https://reactjs.org/tutorial"
      }
    ]
    
    Types:
    - SKILL: Technical or soft skills to develop
    - COURSE: Specific courses or training programs
    - PROJECT: Project ideas to build portfolio
    - CERTIFICATION: Industry certifications to pursue
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    return suggestions;
  } catch (error) {
    console.error("Error generating career suggestions:", error);
    return [];
  }
}

export async function generateATSHealthCheck(
  cvContent: ResumeContentJSON,
  jobDescription?: string
): Promise<{
  score: number;
  issues: string[];
  suggestions: string[];
  categories: {
    formatting: { score: number; issues: string[]; suggestions: string[] };
    keywords: { score: number; issues: string[]; suggestions: string[] };
    structure: { score: number; issues: string[]; suggestions: string[] };
    content: { score: number; issues: string[]; suggestions: string[] };
  };
}> {
  try {
    const prompt = `
    Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a detailed health check.
    
    Resume Content:
    ${JSON.stringify(cvContent, null, 2)}
    
    ${jobDescription ? `Job Description: ${jobDescription}` : ""}
    
    Provide a comprehensive ATS analysis with:
    1. Overall score (0-100)
    2. Category-specific scores and feedback
    3. Specific issues found
    4. Actionable suggestions
    
    Return JSON with this exact structure:
    {
      "score": 85,
      "issues": ["Overall issues array"],
      "suggestions": ["Overall suggestions array"],
      "categories": {
        "formatting": {
          "score": 90,
          "issues": ["Specific formatting issues"],
          "suggestions": ["Specific formatting suggestions"]
        },
        "keywords": {
          "score": 75,
          "issues": ["Keyword optimization issues"],
          "suggestions": ["Keyword suggestions"]
        },
        "structure": {
          "score": 95,
          "issues": ["Structure issues"],
          "suggestions": ["Structure suggestions"]
        },
        "content": {
          "score": 80,
          "issues": ["Content issues"],
          "suggestions": ["Content suggestions"]
        }
      }
    }
    
    Check for:
    - Standard section headings
    - Bullet points usage
    - Quantifiable achievements
    - Keyword density and relevance
    - ATS-friendly formatting
    - Contact information completeness
    - Skills section optimization
    - Experience descriptions quality
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }

    const healthCheck = JSON.parse(jsonMatch[0]);
    return healthCheck;
  } catch (error) {
    console.error("Error generating ATS health check:", error);
    // Return default health check on error
    return {
      score: 70,
      issues: ["Unable to analyze resume at this time"],
      suggestions: ["Please try again later"],
      categories: {
        formatting: {
          score: 70,
          issues: ["Could not analyze formatting"],
          suggestions: ["Ensure consistent formatting throughout"],
        },
        keywords: {
          score: 70,
          issues: ["Could not analyze keywords"],
          suggestions: ["Include relevant industry keywords"],
        },
        structure: {
          score: 70,
          issues: ["Could not analyze structure"],
          suggestions: ["Use standard resume sections"],
        },
        content: {
          score: 70,
          issues: ["Could not analyze content"],
          suggestions: ["Include quantifiable achievements"],
        },
      },
    };
  }
}

export async function generateCommitMessage(
  oldContent: ResumeContentJSON,
  newContent: ResumeContentJSON
): Promise<{ message: string; changes: string }> {
  try {
    const prompt = `
    Compare the old and new resume content and generate a git-style commit message and summary of changes.
    
    Old Content:
    ${JSON.stringify(oldContent, null, 2)}
    
    New Content:
    ${JSON.stringify(newContent, null, 2)}
    
    Generate:
    1. A concise commit message (under 50 characters)
    2. A detailed summary of what changed
    
    Return JSON:
    {
      "message": "Add new project experience",
      "changes": "Added new project 'E-commerce Platform' with React and Node.js. Updated skills section to include TypeScript."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        message: "Update resume content",
        changes: "Resume content has been updated",
      };
    }

    const commitInfo = JSON.parse(jsonMatch[0]);
    return commitInfo;
  } catch (error) {
    console.error("Error generating commit message:", error);
    return {
      message: "Update resume content",
      changes: "Resume content has been updated",
    };
  }
}
