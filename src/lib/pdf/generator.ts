import PDFDocument from "pdfkit";
import { ResumeContentJSON } from "@/lib/ai/services";

export interface PDFGeneratorOptions {
  template?: "modern" | "classic" | "minimal";
  colorTheme?: string;
  fontSize?: number;
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export class ResumeGenerator {
  private doc: PDFKit.PDFDocument;
  private options: PDFGeneratorOptions;
  private currentY: number = 0;
  private pageWidth: number;
  private pageHeight: number;

  constructor(options: PDFGeneratorOptions = {}) {
    this.options = {
      template: "modern",
      colorTheme: "#2563eb",
      fontSize: 10,
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      ...options,
    };

    this.doc = new PDFDocument({
      size: "A4",
      margins: this.options.margins,
    });

    this.pageWidth = this.doc.page.width;
    this.pageHeight = this.doc.page.height;
    this.currentY = this.options.margins!.top;
  }

  async generatePDF(content: ResumeContentJSON): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];

        this.doc.on("data", (chunk) => chunks.push(chunk));
        this.doc.on("end", () => resolve(Buffer.concat(chunks)));

        // Generate PDF content
        this.addHeader(content.personalInfo);
        this.addSummary(content.summary);
        this.addExperience(content.experience);
        this.addEducation(content.education);
        this.addSkills(content.skills);

        if (content.projects && content.projects.length > 0) {
          this.addProjects(content.projects);
        }

        if (content.certifications && content.certifications.length > 0) {
          this.addCertifications(content.certifications);
        }

        this.doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(personalInfo: ResumeContentJSON["personalInfo"]) {
    // Name
    this.doc
      .fontSize(24)
      .fillColor("#000000")
      .font("Helvetica-Bold")
      .text(personalInfo.name, this.options.margins!.left, this.currentY);

    this.currentY += 35;

    // Contact information
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website,
    ].filter(Boolean);

    this.doc.fontSize(10).font("Helvetica").fillColor("#666666");

    const contactText = contactInfo.join(" | ");
    this.doc.text(contactText, this.options.margins!.left, this.currentY);

    this.currentY += 30;
    this.addSeparator();
  }

  private addSummary(summary: string) {
    if (!summary) return;

    this.addSectionHeader("PROFESSIONAL SUMMARY");

    this.doc
      .fontSize(this.options.fontSize!)
      .font("Helvetica")
      .fillColor("#000000")
      .text(summary, this.options.margins!.left, this.currentY, {
        align: "justify",
        width:
          this.pageWidth -
          this.options.margins!.left -
          this.options.margins!.right,
      });

    this.currentY +=
      this.doc.heightOfString(summary, {
        width:
          this.pageWidth -
          this.options.margins!.left -
          this.options.margins!.right,
      }) + 15;
  }

  private addExperience(experience: ResumeContentJSON["experience"]) {
    if (experience.length === 0) return;

    this.addSectionHeader("WORK EXPERIENCE");

    experience.forEach((job, index) => {
      // Check if we need a new page
      if (this.currentY > this.pageHeight - 200) {
        this.doc.addPage();
        this.currentY = this.options.margins!.top;
      }

      // Job title and company
      this.doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(job.title, this.options.margins!.left, this.currentY);

      this.currentY += 15;

      // Company and dates
      const dateText = `${job.startDate} - ${job.endDate}`;
      this.doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor(this.options.colorTheme!)
        .text(job.company, this.options.margins!.left, this.currentY);

      this.doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          dateText,
          this.pageWidth - this.options.margins!.right - 100,
          this.currentY,
          {
            align: "right",
            width: 100,
          }
        );

      this.currentY += 18;

      // Job description
      job.description.forEach((bullet) => {
        this.doc
          .fontSize(this.options.fontSize!)
          .font("Helvetica")
          .fillColor("#000000")
          .text(`• ${bullet}`, this.options.margins!.left + 15, this.currentY, {
            width:
              this.pageWidth -
              this.options.margins!.left -
              this.options.margins!.right -
              15,
          });

        this.currentY +=
          this.doc.heightOfString(`• ${bullet}`, {
            width:
              this.pageWidth -
              this.options.margins!.left -
              this.options.margins!.right -
              15,
          }) + 3;
      });

      if (index < experience.length - 1) {
        this.currentY += 10;
      }
    });

    this.currentY += 10;
  }

  private addEducation(education: ResumeContentJSON["education"]) {
    if (education.length === 0) return;

    this.addSectionHeader("EDUCATION");

    education.forEach((edu, index) => {
      // Degree
      this.doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(edu.degree, this.options.margins!.left, this.currentY);

      this.currentY += 15;

      // Institution and dates
      const dateText = `${edu.startYear} - ${edu.endYear}`;
      this.doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(this.options.colorTheme!)
        .text(edu.institution, this.options.margins!.left, this.currentY);

      this.doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          dateText,
          this.pageWidth - this.options.margins!.right - 100,
          this.currentY,
          {
            align: "right",
            width: 100,
          }
        );

      this.currentY += 15;

      // GPA if available
      if (edu.gpa) {
        this.doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#666666")
          .text(`GPA: ${edu.gpa}`, this.options.margins!.left, this.currentY);

        this.currentY += 12;
      }

      if (index < education.length - 1) {
        this.currentY += 5;
      }
    });

    this.currentY += 10;
  }

  private addSkills(skills: ResumeContentJSON["skills"]) {
    if (!skills.technical.length && !skills.soft.length) return;

    this.addSectionHeader("SKILLS");

    if (skills.technical.length > 0) {
      this.doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Technical Skills:", this.options.margins!.left, this.currentY);

      this.currentY += 12;

      const technicalSkillsText = skills.technical.join(" • ");
      this.doc
        .fontSize(this.options.fontSize!)
        .font("Helvetica")
        .fillColor("#000000")
        .text(technicalSkillsText, this.options.margins!.left, this.currentY, {
          width:
            this.pageWidth -
            this.options.margins!.left -
            this.options.margins!.right,
        });

      this.currentY +=
        this.doc.heightOfString(technicalSkillsText, {
          width:
            this.pageWidth -
            this.options.margins!.left -
            this.options.margins!.right,
        }) + 8;
    }

    if (skills.soft.length > 0) {
      this.doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Soft Skills:", this.options.margins!.left, this.currentY);

      this.currentY += 12;

      const softSkillsText = skills.soft.join(" • ");
      this.doc
        .fontSize(this.options.fontSize!)
        .font("Helvetica")
        .fillColor("#000000")
        .text(softSkillsText, this.options.margins!.left, this.currentY, {
          width:
            this.pageWidth -
            this.options.margins!.left -
            this.options.margins!.right,
        });

      this.currentY +=
        this.doc.heightOfString(softSkillsText, {
          width:
            this.pageWidth -
            this.options.margins!.left -
            this.options.margins!.right,
        }) + 10;
    }
  }

  private addProjects(projects: NonNullable<ResumeContentJSON["projects"]>) {
    this.addSectionHeader("PROJECTS");

    projects.forEach((project, index) => {
      // Project name
      this.doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(project.name, this.options.margins!.left, this.currentY);

      if (project.url) {
        this.doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor(this.options.colorTheme!)
          .text(
            project.url,
            this.pageWidth - this.options.margins!.right - 150,
            this.currentY,
            {
              align: "right",
              width: 150,
            }
          );
      }

      this.currentY += 15;

      // Description
      this.doc
        .fontSize(this.options.fontSize!)
        .font("Helvetica")
        .fillColor("#000000")
        .text(project.description, this.options.margins!.left, this.currentY, {
          width:
            this.pageWidth -
            this.options.margins!.left -
            this.options.margins!.right,
        });

      this.currentY +=
        this.doc.heightOfString(project.description, {
          width:
            this.pageWidth -
            this.options.margins!.left -
            this.options.margins!.right,
        }) + 8;

      // Tech stack
      if (project.techStack.length > 0) {
        const techStackText = `Technologies: ${project.techStack.join(", ")}`;
        this.doc
          .fontSize(9)
          .font("Helvetica-Oblique")
          .fillColor("#666666")
          .text(techStackText, this.options.margins!.left, this.currentY);

        this.currentY += 15;
      }

      if (index < projects.length - 1) {
        this.currentY += 5;
      }
    });

    this.currentY += 10;
  }

  private addCertifications(
    certifications: NonNullable<ResumeContentJSON["certifications"]>
  ) {
    this.addSectionHeader("CERTIFICATIONS");

    certifications.forEach((cert, index) => {
      this.doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(cert.name, this.options.margins!.left, this.currentY);

      this.doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          cert.date,
          this.pageWidth - this.options.margins!.right - 80,
          this.currentY,
          {
            align: "right",
            width: 80,
          }
        );

      this.currentY += 12;

      this.doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(this.options.colorTheme!)
        .text(cert.issuer, this.options.margins!.left, this.currentY);

      this.currentY += 15;

      if (index < certifications.length - 1) {
        this.currentY += 3;
      }
    });
  }

  private addSectionHeader(title: string) {
    this.doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor(this.options.colorTheme!)
      .text(title, this.options.margins!.left, this.currentY);

    this.currentY += 20;
    this.addSeparator();
  }

  private addSeparator() {
    this.doc
      .strokeColor(this.options.colorTheme!)
      .lineWidth(1)
      .moveTo(this.options.margins!.left, this.currentY)
      .lineTo(this.pageWidth - this.options.margins!.right, this.currentY)
      .stroke();

    this.currentY += 15;
  }
}

export async function generateResumePDF(
  content: ResumeContentJSON,
  options?: PDFGeneratorOptions,
  fileName?: string
): Promise<{ buffer: Buffer; fileName: string }> {
  const generator = new ResumeGenerator(options);
  const buffer = await generator.generatePDF(content);

  const defaultFileName =
    fileName || `${content.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;

  return {
    buffer,
    fileName: defaultFileName,
  };
}
