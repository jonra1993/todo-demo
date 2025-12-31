# Todo - Multi-Tenant Todo Application

A modern, multi-tenant todo list application built with Next.js, Supabase, and Refine v5. This application allows users to manage their personal todo lists in isolated, secure spaces.

## 🎯 Project Overview

Todo is a web application that enables users to create, manage, and organize their daily tasks and activities. The application features a multi-tenant architecture where each user has their own isolated workspace, ensuring data privacy and separation between different users.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Backend & Database**: [Supabase](https://supabase.com/) - Open source Firebase alternative
- **Data Provider**: [Refine v5](https://refine.dev/) - React-based framework for building admin panels and B2B applications
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager

## ✨ Features

- ✅ **User Authentication**: Secure email and password-based authentication
- ✅ **Multi-Tenant Architecture**: Each user has their own isolated workspace
- ✅ **Todo Management**: Create, read, update, and delete todo items
- ✅ **Modern UI**: Beautiful, responsive interface built with shadcn/ui
- ✅ **Type Safety**: Full TypeScript support throughout the application
- ✅ **Real-time Updates**: Powered by Supabase real-time capabilities

## 🎨 Design System

The application uses a custom green color palette:

- **Primary Green**: `#b1f8f2` - Light mint green
- **Secondary Green**: `#bcd39c` - Soft sage green
- **Accent Yellow**: `#fffc99` - Light yellow
- **Background**: `#eafdcf` - Pale green
- **Text/Dark**: `#8e8358` - Olive green

## 🌐 Internationalization

- **Code Language**: All code, comments, and documentation are written in English
- **UI Labels**: All user-facing labels and text are displayed in Spanish

## 🏗️ Architecture

### Multi-Tenant System

The application implements a multi-tenant architecture where:
- Each user has their own isolated data space
- User authentication ensures secure access to personal todos
- Data is separated at the database level using Row Level Security (RLS) policies in Supabase
- Users cannot access or view other users' todo items

### Project Structure

```
todo-demo/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components (shadcn/ui & Refine UI)
│   │   ├── providers/      # Refine providers (auth, data)
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions (Supabase clients)
│   ├── package.json        # Frontend dependencies
│   └── next.config.mjs     # Next.js configuration
├── supabase/               # Supabase configuration and migrations
│   └── config.toml         # Supabase local configuration
├── agent_docs/             # Development documentation and plans
│   └── poc-implementation-plan.md  # POC implementation plan
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm installed globally (`npm install -g pnpm`)
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-demo
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
pnpm install
```

4. Set up environment variables:
```bash
cp .env.example .env.local
```

5. Configure Supabase:
   - Create a new Supabase project
   - Add your Supabase URL and anon key to `frontend/.env.local`
   - Set up authentication providers (Email/Password)
   - Configure Row Level Security policies

6. Run the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### POC Development

For the frontend-only POC implementation, see the detailed plan in [`agent_docs/poc-implementation-plan.md`](./agent_docs/poc-implementation-plan.md).

The POC will:
- Use in-memory state management (no database connection)
- Simulate authentication with hardcoded users
- Implement full todo CRUD operations
- Include a dashboard with statistics
- Use Refine v5, shadcn/ui, and Tailwind CSS extensively

## 📝 Development Guidelines

- All code must be written in TypeScript
- Follow Next.js App Router conventions
- Use Refine v5 data provider patterns for data fetching
- Implement shadcn/ui components for UI elements
- Maintain Spanish labels for all user-facing text
- Ensure proper TypeScript types for all data structures

## 🔒 Security

- Authentication handled by Supabase Auth
- Row Level Security (RLS) policies enforce data isolation
- Secure API routes for server-side operations
- Environment variables for sensitive configuration

## 📦 Package Management

This project uses `pnpm` as the package manager. All commands should be run from the `frontend/` directory:

```bash
cd frontend
```

Common commands:

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all code follows TypeScript and project conventions
4. Submit a pull request

## 📄 License

See [LICENSE](LICENSE) file for details.
