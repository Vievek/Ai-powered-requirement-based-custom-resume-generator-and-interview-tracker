import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateResumePDF } from "@/lib/pdf/generator";
import type { ResumeContentJSON } from "@/lib/ai/services";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; versionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, versionId } = await params;

    // Get the resume version with authorization check
    const version = await prisma.resumeVersion.findFirst({
      where: {
        id: versionId,
        branch: {
          project: {
            OR: [
              { userId: session.user.id },
              {
                collaborators: {
                  some: {
                    userId: session.user.id,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        branch: {
          include: {
            project: {
              select: {
                name: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        template: true,
      },
    });

    if (!version) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Extract template options from URL search params
    const { searchParams } = new URL(request.url);
    const template =
      (searchParams.get("template") as "modern" | "classic" | "minimal") ||
      "modern";
    const colorTheme = searchParams.get("color") || version.template.colorTheme;

    // Generate PDF
    const content = version.content as unknown as ResumeContentJSON;
    const userName =
      content.personalInfo.name || version.branch.project.user.name || "Resume";
    const projectName = version.branch.project.name;
    const fileName = `${userName}_${projectName}_Resume.pdf`;

    const { buffer } = await generateResumePDF(
      content,
      {
        template,
        colorTheme,
        fontSize: 10,
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      },
      fileName
    );

    // Return PDF as response
    return new NextResponse(buffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; versionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, versionId } = await params;
    const body = await request.json();
    const { template, colorTheme, fontSize, margins } = body;

    // Get the resume version with authorization check
    const version = await prisma.resumeVersion.findFirst({
      where: {
        id: versionId,
        branch: {
          project: {
            OR: [
              { userId: session.user.id },
              {
                collaborators: {
                  some: {
                    userId: session.user.id,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        branch: {
          include: {
            project: {
              select: {
                name: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        template: true,
      },
    });

    if (!version) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Generate PDF with custom options
    const content = version.content as unknown as ResumeContentJSON;
    const userName =
      content.personalInfo.name || version.branch.project.user.name || "Resume";
    const projectName = version.branch.project.name;
    const fileName = `${userName}_${projectName}_Resume.pdf`;

    const { buffer } = await generateResumePDF(
      content,
      {
        template,
        colorTheme,
        fontSize,
        margins,
      },
      fileName
    );

    // Return PDF as base64 for preview or download
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      success: true,
      fileName,
      data: base64,
      mimeType: "application/pdf",
    });
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
