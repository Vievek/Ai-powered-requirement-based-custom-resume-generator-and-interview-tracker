# CareerCraft AI - ATS-Optimized Resume Builder

A complete, responsive SaaS web application for AI-powered, ATS-optimized resume building with job tracking, Git-like version control, and real-time collaboration.

## 🚀 Features

### Core Features

- **AI-Powered Resume Generation** - Google Gemini 2.0 Flash for tailored resumes
- **ATS Optimization** - Built-in ATS health checks and keyword optimization
- **Git-like Version Control** - Branch, commit, and merge resume versions
- **Real-time Collaboration** - Share and collaborate on resumes
- **Job Application Tracking** - Full CRUD job tracker with status management
- **Profile Management** - Comprehensive profile builder with resume upload
- **Template System** - Multiple ATS-compliant templates

### AI Services

- **Resume Parsing** - Extract data from uploaded resumes
- **Job Description Analysis** - Generate tailored resumes from JD
- **Career Suggestions** - Personalized skill gap analysis
- **ATS Health Check** - Comprehensive resume optimization analysis
- **Semantic Search** - Find relevant resume projects

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router) with TypeScript
- **UI**: shadcn/ui components with light/dark mode support
- **Animation**: Framer Motion for smooth interactions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, LinkedIn)
- **AI**: Google Gemini 2.0 Flash
- **PDF Generation**: PDFKit for ATS-compliant resumes
- **Testing**: Playwright for E2E testing

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key
- Google OAuth credentials

### Setup Steps

1. **Clone and install dependencies**

   ```bash
   git clone <your-repo>
   cd resume_generator
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:

   - `DATABASE_URL` - PostgreSQL connection string
   - `GOOGLE_GEMINI_API_KEY` - Your Gemini API key
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth credentials
   - `NEXTAUTH_SECRET` - Random secret for NextAuth

3. **Database Setup**

   ```bash
   npm run db:push          # Push schema to database
   npm run db:seed          # Seed default templates
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Visit `http://localhost:3000`
   - Sign in with Google to get started

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── workspace/        # Resume workspace components
│   ├── profile/          # Profile management components
│   ├── tracker/          # Job tracker components
│   └── suggestions/      # Career suggestions components
├── lib/                  # Utility libraries
│   ├── actions/         # Server actions
│   ├── ai/              # AI service functions
│   └── pdf/             # PDF generation
└── prisma/              # Database schema and migrations
```

## 🔑 Key Features Explained

### AI-Powered Resume Building

- Upload existing resumes for automatic data extraction
- Generate tailored resumes from job descriptions
- ATS optimization with health checks and suggestions
- Semantic search for relevant resume versions

### Git-like Version Control

- Create branches for different resume versions
- Commit changes with meaningful messages
- Track complete history of resume modifications
- Merge and revert capabilities

### Job Application Tracking

- Complete CRUD operations for job applications
- Link applications to specific resume versions
- Status tracking (Draft, Applied, Interviewing, etc.)
- Analytics and insights

### Collaboration Features

- Share resume projects with team members
- Role-based permissions (Viewer, Commenter, Editor)
- Real-time collaboration capabilities
- Comment and feedback system

## 🎯 Usage

### Creating Your First Resume

1. Complete your profile in `/dashboard/profile`
2. Create a new resume project in `/dashboard`
3. Use the AI-powered workspace to build your resume
4. Apply templates and optimize for ATS
5. Download as PDF or share with collaborators

### Job Application Tracking

1. Navigate to `/dashboard/tracker`
2. Add job applications with company and role details
3. Link applications to specific resume versions
4. Track application status and interview progress

### AI Features

1. **Resume Analysis**: Upload existing resumes for data extraction
2. **Job Matching**: Paste job descriptions for tailored resume generation
3. **Career Guidance**: Get personalized skill development suggestions
4. **ATS Optimization**: Run health checks for ATS compatibility

## 📊 Database Schema

The application uses a comprehensive schema supporting:

- User authentication and profiles
- Resume projects with Git-like versioning
- Job application tracking
- AI-powered career suggestions
- Collaboration and sharing

Key models:

- `User` - Authentication and profile data
- `ResumeProject` - Resume projects with branches
- `ResumeVersion` - Individual resume versions
- `JobApplication` - Job tracking with status
- `CareerSuggestion` - AI-generated career advice

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed default data
npm run db:studio    # Open Prisma Studio
```

### Key Development Notes

- All components support light/dark mode
- Server actions used for data mutations
- Suspense boundaries with custom skeletons
- Responsive design with mobile-first approach
- Type-safe API with TypeScript throughout

## 🚀 Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set up production database**

   - Configure PostgreSQL instance
   - Run migrations: `npm run db:push`
   - Seed templates: `npm run db:seed`

3. **Configure environment variables**

   - Set all required environment variables
   - Ensure secure secrets in production

4. **Deploy to your preferred platform**
   - Vercel, Netlify, or custom server
   - Ensure proper environment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js 15 and React 19
- UI components from shadcn/ui
- AI powered by Google Gemini
- Icons from Lucide React
- Database management with Prisma

---

**CareerCraft AI** - Empowering careers with AI-driven resume building and job tracking.
