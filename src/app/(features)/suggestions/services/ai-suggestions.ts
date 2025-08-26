import { GoogleGenerativeAI } from "@google/generative-ai";

// Define a simple UserProfile interface
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

if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
  throw new Error("NEXT_PUBLIC_GOOGLE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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

export async function analyzeSkillGaps(
  profile: UserProfile,
  targetRole: string
): Promise<{
  criticalGaps: string[];
  niceToHave: string[];
  suggestions: Array<{
    skill: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    resourceLinks: string[];
  }>;
}> {
  try {
    const prompt = `
    Analyze the skill gaps between the user's current profile and their target role.
    
    User Profile:
    - Current Skills: ${JSON.stringify(profile.skills)}
    - Experience: ${JSON.stringify(profile.experience)}
    - Education: ${JSON.stringify(profile.education)}
    
    Target Role: ${targetRole}
    
    Return a JSON object with this structure:
    {
      "criticalGaps": ["skill1", "skill2"],
      "niceToHave": ["skill3", "skill4"],
      "suggestions": [
        {
          "skill": "Python",
          "priority": "HIGH",
          "resourceLinks": ["https://python.org", "https://codecademy.com/python"]
        }
      ]
    }
    
    Analyze what skills are commonly required for the target role and identify gaps.
    Prioritize based on job market demand and career progression importance.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from AI response");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error("Error analyzing skill gaps:", error);
    return {
      criticalGaps: [],
      niceToHave: [],
      suggestions: [],
    };
  }
}
