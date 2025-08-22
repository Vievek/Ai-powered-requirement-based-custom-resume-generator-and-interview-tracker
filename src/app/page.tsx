import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingNavbar } from "@/components/landing/navbar";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If user is already signed in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
    </main>
  );
}
