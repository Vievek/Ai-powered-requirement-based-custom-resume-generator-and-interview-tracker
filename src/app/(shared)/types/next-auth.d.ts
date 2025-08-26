import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profileCompleted?: boolean;
      careerGoal?: string | null;
    };
  }

  interface User {
    id: string;
    profileCompleted?: boolean;
    careerGoal?: string | null;
  }
}
