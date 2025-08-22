# Repository Rules

## CareerCraft AI - Resume Builder

This is a Next.js 15+ application with TypeScript for building ATS-optimized resumes with AI-powered features.

### Tech Stack

- **Framework**: Next.js 15+ (App Router) with TypeScript
- **UI**: shadcn/ui components with light/dark mode
- **Animation**: framer-motion
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Next-Auth (Google, LinkedIn)
- **AI**: Google Gemini 2.0 Flash
- **Testing**: Playwright

### Target Framework

targetFramework: Playwright

### Architecture

- Strict SOLID principles
- Server actions and API routes
- SSR for dashboard, ISR for analytics, CSR for interactive workspaces
- All data-fetching components use Suspense with component-specific Skeletons

### Key Features

- Git-like version control for resumes
- Real-time collaboration
- ATS optimization
- AI-powered resume generation
- Job application tracking
- Career gap analysis
