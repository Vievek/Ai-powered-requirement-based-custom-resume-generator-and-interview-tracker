import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default ATS-compliant resume templates
  const templates = [
    {
      name: "Modern Professional",
      colorTheme: "#2563eb",
      layoutDetails: {
        type: "single-column",
        sections: [
          "header",
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
        ],
        fonts: {
          primary: "Inter",
          headings: "Inter",
          body: "Inter",
        },
        spacing: {
          section: 16,
          item: 8,
          line: 1.5,
        },
        colors: {
          primary: "#2563eb",
          text: "#1f2937",
          accent: "#6b7280",
        },
      },
      isAtsCompliant: true,
    },
    {
      name: "Classic Executive",
      colorTheme: "#000000",
      layoutDetails: {
        type: "single-column",
        sections: ["header", "summary", "experience", "education", "skills"],
        fonts: {
          primary: "Georgia",
          headings: "Georgia",
          body: "Georgia",
        },
        spacing: {
          section: 18,
          item: 10,
          line: 1.6,
        },
        colors: {
          primary: "#000000",
          text: "#1f2937",
          accent: "#4b5563",
        },
      },
      isAtsCompliant: true,
    },
    {
      name: "Minimal Clean",
      colorTheme: "#6b7280",
      layoutDetails: {
        type: "single-column",
        sections: ["header", "experience", "education", "skills", "projects"],
        fonts: {
          primary: "Arial",
          headings: "Arial",
          body: "Arial",
        },
        spacing: {
          section: 20,
          item: 12,
          line: 1.4,
        },
        colors: {
          primary: "#6b7280",
          text: "#111827",
          accent: "#9ca3af",
        },
      },
      isAtsCompliant: true,
    },
    {
      name: "Tech Professional",
      colorTheme: "#059669",
      layoutDetails: {
        type: "single-column",
        sections: [
          "header",
          "summary",
          "experience",
          "projects",
          "skills",
          "education",
        ],
        fonts: {
          primary: "Helvetica",
          headings: "Helvetica",
          body: "Helvetica",
        },
        spacing: {
          section: 16,
          item: 8,
          line: 1.5,
        },
        colors: {
          primary: "#059669",
          text: "#1f2937",
          accent: "#10b981",
        },
      },
      isAtsCompliant: true,
    },
  ];

  for (const template of templates) {
    await prisma.resumeTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }

  console.log("✅ Resume templates seeded successfully");

  // Create sample career suggestions types for reference
  const suggestionTypes = ["SKILL", "COURSE", "PROJECT", "CERTIFICATION"];
  console.log("📚 Available suggestion types:", suggestionTypes);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
