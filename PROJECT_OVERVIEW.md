# Build Buddy - Student Project Collaboration Platform

A full-stack web application connecting students with active projects. Students can discover projects, apply based on their skills, while project owners can manage teams and review applications.

## Features Implemented

### Core Features
- **User Authentication**: Email/password signup and login with role-based access (student, project_owner)
- **Project Discovery**: Browse projects with beautiful card-based layout
- **Advanced Search & Filters**: Search by title, domain, skills; filter by domain and status; sort by newest, progress, or popularity
- **Project Management**: Create, view, and manage projects with detailed information
- **Application System**: Students can apply to projects; owners can accept/reject applications
- **Real-time Updates**: Automatic slot tracking and progress visualization
- **Responsive Design**: Mobile-friendly dark theme interface

### AI Features (Edge Functions)
- **AI Project Description Generator**: Generate detailed project descriptions from simple ideas
- **AI Skill Match Calculator**: Calculate compatibility between student skills and project requirements
- **AI Task Breakdown**: Generate project roadmaps, milestones, and task recommendations

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Lucide React for icons
- Supabase client for database and auth

### Backend
- Supabase (PostgreSQL database)
- Supabase Auth for authentication
- Supabase Edge Functions (Deno) for AI features
- Row Level Security (RLS) policies

### Database Schema
- `profiles`: User profiles with roles and experience levels
- `skills`: Available skills
- `user_skills`: Many-to-many relationship for user skills
- `projects`: Project information and metadata
- `project_skills`: Many-to-many relationship for project requirements
- `project_members`: Team membership and application tracking

## Getting Started

1. The application is already configured with Supabase
2. Run `npm install` to install dependencies
3. The dev server will start automatically
4. Sign up as a project owner to create projects
5. Sign up as a student to browse and apply to projects

## AI Edge Functions

Three Edge Functions are deployed:

1. **ai-describe-project**: Generates comprehensive project descriptions
   - Endpoint: `/functions/v1/ai-describe-project`
   - Input: `{ idea: string }`

2. **ai-match-skills**: Calculates skill match percentage
   - Endpoint: `/functions/v1/ai-match-skills`
   - Input: `{ projectSkills: string[], studentSkills: string[] }`

3. **ai-task-breakdown**: Generates project roadmaps
   - Endpoint: `/functions/v1/ai-task-breakdown`
   - Input: `{ description: string, duration?: string }`

## Application Flow

1. **Project Owners**:
   - Sign up with project_owner role
   - Create projects with title, description, domain, skills, and slots
   - Use AI helper to generate project descriptions
   - Review student applications
   - Accept/reject applicants
   - Track project progress

2. **Students**:
   - Sign up with student role
   - Browse available projects
   - Use search and filters to find matching projects
   - View detailed project information
   - Apply to join projects
   - Track application status

## Security

- All tables have Row Level Security enabled
- Users can only update their own profiles
- Project owners can only modify their own projects
- Students can apply to any open project
- Only project owners can accept/reject applications
- Authentication required for all operations

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx
│   ├── CreateProjectModal.tsx
│   ├── Filters.tsx
│   ├── Navbar.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectDetailModal.tsx
│   ├── SearchBar.tsx
│   └── AIProjectHelper.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── lib/                 # Utilities and config
│   ├── ai-helpers.ts
│   ├── database.types.ts
│   └── supabase.ts
├── App.tsx             # Main application
└── main.tsx            # Entry point

supabase/
└── functions/          # Edge Functions
    ├── ai-describe-project/
    ├── ai-match-skills/
    └── ai-task-breakdown/
```

## Sample Projects

See `seed-instructions.md` for examples of projects to create for testing.
