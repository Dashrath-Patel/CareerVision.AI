# CareerVision AI - Next.js Frontend

A modern, interactive frontend for the CareerVision AI platform built with Next.js, TypeScript, and Aceternity UI components.

## Features

- 🎯 **AI-Powered Career Prediction** - Multi-step form with intelligent career path recommendations
- 📊 **Skill Gap Analysis** - Interactive skill assessment with personalized learning recommendations  
- 🗺️ **Career Roadmaps** - Beautiful gallery of career paths with downloadable PDFs
- 🎨 **Modern UI** - Aceternity UI components with smooth animations and responsive design
- ⚡ **Performance** - Built with Next.js 15 and Turbopack for fast development

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Aceternity UI + Shadcn components
- **Animations**: Framer Motion
- **Icons**: Lucide React + Tabler Icons
- **State Management**: React hooks

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## API Integration

The frontend connects to a Django backend via REST APIs. Configure the backend URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
