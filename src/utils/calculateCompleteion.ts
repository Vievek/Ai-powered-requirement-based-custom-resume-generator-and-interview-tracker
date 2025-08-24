export function calculateCompletion(profileData: any) {
  const personal = profileData.personalInfo
    ? (Object.values(profileData.personalInfo).filter(Boolean).length / 6) * 100
    : 0;

  const experience = profileData.experience?.length > 0 ? 100 : 0;
  const education = profileData.education?.length > 0 ? 100 : 0;
  const skills = (profileData.skills?.technical?.length || 0) > 0 ? 100 : 0;
  const projects = profileData.projects?.length > 0 ? 100 : 0;

  const overall = (personal + experience + education + skills + projects) / 5;

  return {
    personal: Math.round(personal),
    experience: Math.round(experience),
    education: Math.round(education),
    skills: Math.round(skills),
    projects: Math.round(projects),
    overall: Math.round(overall),
  };
}
