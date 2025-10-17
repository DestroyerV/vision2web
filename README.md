# Vision2Web 🚀

![Vision2Web Banner](public/logo.svg)

**Build stunning websites by chatting with AI. No coding required.**

Vision2Web is an AI-powered web development platform that transforms natural language conversations into fully functional Next.js applications. Simply describe what you want to build, and our intelligent multi-agent system will generate, preview, and iterate on your web projects in real-time.

## ✨ Features

- 🤖 **AI-Powered Development** - Chat with AI to build complete web applications
- ⚡ **Real-Time Preview** - See your changes instantly in isolated sandboxed environments
- 🎨 **Beautiful UI Components** - Pre-configured Shadcn UI and Tailwind CSS
- 🔄 **Iterative Development** - Refine and modify projects through conversation
- 🔐 **Secure Authentication** - Clerk integration for user management
- 💾 **Project Management** - Save, organize, and revisit your projects
- 📊 **Usage Tracking** - Monitor your API usage and credits
- 🏗️ **E2B Sandboxes** - Safe, isolated execution environments for code

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router and Turbopack
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Agents:** [Inngest](https://www.inngest.com/) + [@inngest/agent-kit](https://www.inngest.com/ai)
- **Sandboxing:** [E2B Code Interpreter](https://e2b.dev/)
- **API Layer:** [tRPC](https://trpc.io/)
- **State Management:** [TanStack Query](https://tanstack.com/query)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Code Linting:** [Biome](https://biomejs.dev/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (`npm install -g pnpm`)
- PostgreSQL database
- Clerk account for authentication
- E2B API key for sandboxing
- Inngest account for agent workflows

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DestroyerV/vision2web.git
cd vibe-code
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vision2web"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# E2B Sandboxing
E2B_API_KEY=your_e2b_api_key

# Inngest
INNGEST_SIGNING_KEY=your_inngest_signing_key
INNGEST_EVENT_KEY=your_inngest_event_key
```

4. **Set up the database**

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

5. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
vision2web/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma      # Prisma schema definition
│   └── migrations/        # Database migration files
├── public/                # Static assets
├── sandbox-templates/     # E2B sandbox configurations
│   └── nextjs/           # Next.js sandbox template
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (home)/       # Home page group
│   │   ├── api/          # API routes (tRPC, Inngest)
│   │   └── projects/     # Project management pages
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Shadcn UI components
│   │   └── code-view/   # Code preview components
│   ├── hooks/           # Custom React hooks
│   ├── inngest/         # AI agent workflows
│   │   ├── client.ts    # Inngest client setup
│   │   ├── functions.ts # Agent function definitions
│   │   └── util.ts      # Helper utilities
│   ├── lib/             # Utility libraries
│   ├── modules/         # Feature modules
│   │   ├── home/       # Home page features
│   │   ├── messages/   # Message handling
│   │   ├── projects/   # Project management
│   │   └── usage/      # Usage tracking
│   ├── trpc/            # tRPC setup and routers
│   ├── middleware.ts    # Next.js middleware
│   ├── prompt.ts        # AI prompt templates
│   └── types.ts         # TypeScript type definitions
└── ...config files
```

## 🤖 How It Works

1. **User Input**: Describe your desired web application in natural language
2. **AI Processing**: Multi-agent system powered by Inngest processes your request
3. **Code Generation**: AI generates Next.js components with Tailwind CSS styling
4. **Sandboxed Execution**: Code runs in an isolated E2B sandbox environment
5. **Real-Time Preview**: View your application instantly with hot reload
6. **Iteration**: Chat to refine, modify, or add features to your project
7. **Project Persistence**: Save your work and return to it anytime

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
