# Feature-Driven Architecture (FDA)

This directory implements Feature-Driven Architecture where each feature is self-contained with clear boundaries and separation of concerns.

## Directory Structure

```
src/features/
├── shared/                   # Shared utilities, components, and services
│   ├── components/          # Reusable UI components (shadcn/ui)
│   ├── hooks/               # Shared custom hooks
│   ├── services/            # Common business logic services
│   ├── types/               # Global type definitions
│   ├── utils/               # Helper functions and utilities
│   └── constants/           # Application constants
├── auth/                    # Authentication feature
│   ├── components/          # Auth-specific components
│   ├── hooks/               # Auth-related hooks
│   ├── services/            # Auth business logic
│   ├── types/               # Auth type definitions
│   └── index.ts             # Feature exports
├── dashboard/               # Dashboard overview feature
├── profile/                 # User profile management
├── resume/                  # Resume creation and editing
├── job-tracker/             # Job application tracking
├── suggestions/             # AI-powered suggestions
└── workspace/               # Resume workspace editor
```

## Feature Structure

Each feature follows this internal structure:

```
feature-name/
├── components/              # React components specific to this feature
│   ├── ui/                 # Feature-specific UI components
│   ├── forms/              # Form components
│   └── [ComponentName].tsx
├── hooks/                   # Custom hooks for this feature
│   └── use[HookName].ts
├── services/                # Business logic and API calls
│   ├── actions.ts          # Server actions
│   ├── api.ts              # Client-side API calls
│   └── validation.ts       # Validation schemas
├── types/                   # TypeScript type definitions
│   └── index.ts
├── utils/                   # Feature-specific utilities
│   └── helpers.ts
└── index.ts                 # Public API exports
```

## Principles

1. **Feature Isolation**: Each feature should be self-contained and not directly import from other features
2. **Shared Dependencies**: Common functionality goes in the `shared` feature
3. **Clear Boundaries**: Features communicate through well-defined interfaces
4. **Scalable**: Easy to add new features without affecting existing ones
5. **Maintainable**: Clear ownership and responsibility for each feature

## Import Rules

- ✅ Feature can import from `shared/`
- ✅ Feature can import from external packages
- ❌ Feature should NOT import from other features directly
- ✅ Use the feature's `index.ts` for public API exports

## Benefits

- **Improved Maintainability**: Clear boundaries make code easier to understand and modify
- **Better Team Collaboration**: Features can be owned by different team members
- **Reduced Coupling**: Features are loosely coupled through shared interfaces
- **Easier Testing**: Features can be tested in isolation
- **Scalable Architecture**: New features can be added without affecting existing ones
