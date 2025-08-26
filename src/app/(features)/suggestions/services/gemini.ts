import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key with proper validation
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GOOGLE_AI_API_KEY is not set. Please add it to your .env.local file"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

export interface UserProfileData {
  education?: Array<{
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    honors?: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    start: string;
    end: string;
    description: string;
    achievements?: string[];
  }>;
  skills?: string[];
  projects?: Array<{
    name: string;
    description: string;
    techStack: string[];
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
    expiryDate?: string;
  }>;
  softSkills?: string[];
}

export interface ResumeContentJSON {
  header: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
    keywords: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    startYear: string;
    endYear: string;
    gpa?: string;
    honors?: string;
    relevantCoursework?: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages?: string[];
    tools?: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    techStack: string[];
    achievements: string[];
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
    expiryDate?: string;
  }>;
}

export interface ATSHealthCheck {
  score: number;
  issues: string[];
  suggestions: string[];
  keywordMatch: {
    matched: string[];
    missing: string[];
    matchPercentage: number;
  };
}

/**
 * Parse uploaded resume file and extract structured data
 */
export async function parseResumeFile(
  fileContent: string
): Promise<Partial<UserProfileData>> {
  try {
    const prompt = `
      Parse the following resume content and extract structured data. Return a JSON object with the following structure:
      {
        "education": [{"degree": "", "institution": "", "startYear": "", "endYear": "", "gpa": "", "honors": ""}],
        "experience": [{"title": "", "company": "", "start": "", "end": "", "description": "", "achievements": []}],
        "skills": ["skill1", "skill2"],
        "projects": [{"name": "", "description": "", "techStack": [], "url": "", "startDate": "", "endDate": ""}],
        "certifications": [{"name": "", "issuer": "", "date": "", "url": "", "expiryDate": ""}],
        "softSkills": ["skill1", "skill2"]
      }
      
      Resume content:
      ${fileContent}
      
      Please extract all relevant information and return only valid JSON without any markdown formatting.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean response and parse JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error parsing resume file:", error);
    throw new Error("Failed to parse resume file");
  }
}

/**
 * Generate tailored CV content based on job description
 */
export async function generateTailoredCV(
  profile: UserProfileData,
  jobDescription: string,
  userInfo: { name: string; email: string; phone?: string; location?: string }
): Promise<ResumeContentJSON> {
  try {
    const prompt = `
      Based on the following user profile and job description, generate an ATS-optimized, tailored resume in JSON format.
      
      User Profile:
      ${JSON.stringify(profile, null, 2)}
      
      User Contact Info:
      ${JSON.stringify(userInfo, null, 2)}
      
      Job Description:
      ${jobDescription}
      
      Instructions:
      1. Analyze the job description to identify key requirements, skills, and keywords
      2. Tailor the resume content to match the job requirements
      3. Use action verbs and quantify achievements where possible
      4. Incorporate relevant keywords naturally throughout the content
      5. Prioritize and reorganize content to highlight the most relevant experience
      6. Write compelling bullet points that demonstrate impact and results
      
      Return a JSON object with this exact structure:
      {
        "header": {"name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": ""},
        "summary": "2-3 sentences highlighting relevant experience and value proposition",
        "experience": [{"title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "", "achievements": [], "keywords": []}],
        "education": [{"degree": "", "institution": "", "location": "", "startYear": "", "endYear": "", "gpa": "", "honors": "", "relevantCoursework": []}],
        "skills": {"technical": [], "soft": [], "languages": [], "tools": []},
        "projects": [{"name": "", "description": "", "techStack": [], "achievements": [], "url": "", "startDate": "", "endDate": ""}],
        "certifications": [{"name": "", "issuer": "", "date": "", "url": "", "expiryDate": ""}]
      }
      
      Return only valid JSON without markdown formatting.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating tailored CV:", error);
    throw new Error("Failed to generate tailored CV");
  }
}

/**
 * Find relevant CVs using semantic similarity
 */
export async function findRelevantCVs(
  jobDescription: string,
  userProjects: Array<{ id: string; name: string; description?: string }>
): Promise<
  Array<{ id: string; name: string; score: number; reasoning: string }>
> {
  try {
    const prompt = `
      Analyze the following job description and rank the given resume projects by relevance.
      
      Job Description:
      ${jobDescription}
      
      Resume Projects:
      ${JSON.stringify(userProjects, null, 2)}
      
      For each project, analyze:
      1. How well the project aligns with the job requirements
      2. Relevant skills and technologies mentioned
      3. Industry or domain relevance
      4. Experience level match
      
      Return a JSON array with this structure:
      [
        {
          "id": "project-id",
          "name": "project-name", 
          "score": 85,
          "reasoning": "explanation of why this project is relevant"
        }
      ]
      
      Score from 0-100 where:
      - 90-100: Highly relevant, strong match
      - 70-89: Good match with some relevant aspects
      - 50-69: Moderate relevance
      - 30-49: Some relevance but not ideal
      - 0-29: Low relevance
      
      Return only valid JSON without markdown formatting.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    const scores = JSON.parse(cleanedText);

    // Sort by score descending
    return scores.sort((a: any, b: any) => b.score - a.score);
  } catch (error) {
    console.error("Error finding relevant CVs:", error);
    throw new Error("Failed to find relevant CVs");
  }
}

/**
 * Generate career suggestions based on profile and goals
 */
export async function generateCareerSuggestions(
  profile: UserProfileData,
  careerGoal: string
): Promise<
  Array<{
    type: "SKILL" | "COURSE" | "PROJECT" | "CERTIFICATION";
    description: string;
    reasoning: string;
    resourceLink?: string;
    priority: "high" | "medium" | "low";
  }>
> {
  try {
    const prompt = `
      Based on the user's profile and career goals, generate personalized career development suggestions.
      
      User Profile:
      ${JSON.stringify(profile, null, 2)}
      
      Career Goal:
      ${careerGoal}
      
      Analyze the gap between current profile and career goal to suggest:
      1. Skills to develop (technical and soft skills)
      2. Courses to take
      3. Projects to build
      4. Certifications to pursue
      
      For each suggestion, provide:
      - Clear description of what to do
      - Reasoning for why it's important
      - Priority level (high/medium/low)
      - Resource links where applicable
      
      Return a JSON array with this structure:
      [
        {
          "type": "SKILL|COURSE|PROJECT|CERTIFICATION",
          "description": "specific actionable suggestion",
          "reasoning": "why this is important for reaching the career goal",
          "resourceLink": "optional URL to helpful resource",
          "priority": "high|medium|low"
        }
      ]
      
      Provide 5-10 suggestions prioritized by impact. Return only valid JSON without markdown formatting.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating career suggestions:", error);
    throw new Error("Failed to generate career suggestions");
  }
}

/**
 * Analyze resume for ATS compliance and keyword matching
 */
export async function generateATSHealthCheck(
  cvContent: ResumeContentJSON,
  jobDescription: string
): Promise<ATSHealthCheck> {
  try {
    const prompt = `
      Analyze the following resume content for ATS (Applicant Tracking System) compliance and keyword matching against the job description.
      
      Resume Content:
      ${JSON.stringify(cvContent, null, 2)}
      
      Job Description:
      ${jobDescription}
      
      Analyze for:
      1. ATS Compliance Issues:
         - Complex formatting that ATS can't parse
         - Images, headers, footers
         - Non-standard section headings
         - Font and formatting issues
      
      2. Keyword Analysis:
         - Extract key requirements from job description
         - Check which keywords are present in resume
         - Identify missing important keywords
         - Calculate match percentage
      
      3. Content Quality:
         - Action verbs usage
         - Quantified achievements
         - Relevant experience highlighting
         - Skills alignment
      
      Return a JSON object with this structure:
      {
        "score": 85,
        "issues": ["list of specific ATS compliance issues"],
        "suggestions": ["actionable suggestions for improvement"],
        "keywordMatch": {
          "matched": ["keywords found in resume"],
          "missing": ["important keywords missing from resume"],
          "matchPercentage": 75
        }
      }
      
      Score from 0-100 based on overall ATS readiness and job match.
      Return only valid JSON without markdown formatting.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating ATS health check:", error);
    throw new Error("Failed to generate ATS health check");
  }
}
