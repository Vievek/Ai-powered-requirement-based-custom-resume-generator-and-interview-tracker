import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create default ATS-compliant resume templates
  const templates = [
    {
      id: "template-modern-ats",
      name: "Modern ATS",
      colorTheme: "blue",
      layoutDetails: {
        sections: [
          { id: "header", order: 1, required: true },
          { id: "summary", order: 2, required: false },
          { id: "experience", order: 3, required: true },
          { id: "education", order: 4, required: true },
          { id: "skills", order: 5, required: true },
          { id: "projects", order: 6, required: false },
          { id: "certifications", order: 7, required: false },
        ],
        fonts: {
          heading: "Arial, sans-serif",
          body: "Arial, sans-serif",
        },
        spacing: {
          margin: "0.75in",
          sectionGap: "16px",
          itemGap: "8px",
        },
        formatting: {
          headerSize: "18px",
          bodySize: "11px",
          lineHeight: "1.4",
          colors: {
            primary: "#2563eb",
            secondary: "#64748b",
            text: "#1e293b",
          },
        },
      },
      isAtsCompliant: true,
    },
    {
      id: "template-classic-ats",
      name: "Classic ATS",
      colorTheme: "black",
      layoutDetails: {
        sections: [
          { id: "header", order: 1, required: true },
          { id: "objective", order: 2, required: false },
          { id: "experience", order: 3, required: true },
          { id: "education", order: 4, required: true },
          { id: "skills", order: 5, required: true },
          { id: "certifications", order: 6, required: false },
        ],
        fonts: {
          heading: "Times New Roman, serif",
          body: "Times New Roman, serif",
        },
        spacing: {
          margin: "1in",
          sectionGap: "12px",
          itemGap: "6px",
        },
        formatting: {
          headerSize: "16px",
          bodySize: "11px",
          lineHeight: "1.3",
          colors: {
            primary: "#000000",
            secondary: "#333333",
            text: "#000000",
          },
        },
      },
      isAtsCompliant: true,
    },
    {
      id: "template-minimal-ats",
      name: "Minimal ATS",
      colorTheme: "gray",
      layoutDetails: {
        sections: [
          { id: "header", order: 1, required: true },
          { id: "summary", order: 2, required: false },
          { id: "experience", order: 3, required: true },
          { id: "education", order: 4, required: true },
          { id: "skills", order: 5, required: true },
        ],
        fonts: {
          heading: "Calibri, sans-serif",
          body: "Calibri, sans-serif",
        },
        spacing: {
          margin: "0.75in",
          sectionGap: "20px",
          itemGap: "10px",
        },
        formatting: {
          headerSize: "16px",
          bodySize: "11px",
          lineHeight: "1.5",
          colors: {
            primary: "#374151",
            secondary: "#6b7280",
            text: "#111827",
          },
        },
      },
      isAtsCompliant: true,
    },
  ];

  for (const template of templates) {
    await prisma.resumeTemplate.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
