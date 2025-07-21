# Internal Company Portal

## Overview

This is a full-stack web application built as an internal company portal. It provides a centralized platform for employees to access company information, communicate with each other, and manage various administrative tasks. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Context API for global state (AppContext)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Real-time Communication**: WebSocket support for chat functionality
- **API Design**: RESTful API endpoints with JSON responses
- **Development**: Hot module replacement via Vite middleware

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver for PostgreSQL connections

## Key Components

### Authentication System
- Simple email/password authentication
- User roles (regular user vs admin)
- Session management without external libraries
- Context-based authentication state

### Core Features
1. **Dashboard** - Overview of company metrics and recent activity
2. **Notices** - Company-wide announcements with different priority levels
3. **News** - Internal news articles and updates
4. **Opportunities** - Job postings and internal opportunities
5. **Services** - Employee-offered services directory
6. **Documents** - File sharing and document management
7. **Chat** - Real-time messaging between employees
8. **Tickets** - IT support and help desk system
9. **Emergency Notifications** - Critical alerts with mandatory acknowledgment

### Admin Panel
- Emergency notification broadcasting
- Content creation for news and announcements
- User and system management capabilities

### Real-time Features
- WebSocket integration for live chat
- Emergency notification system with visual alerts
- Page blinking effect for critical notifications

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express routes handle business logic
3. **Database Operations**: Drizzle ORM executes SQL queries
4. **Response**: JSON data returned to client
5. **State Updates**: React Query updates component state
6. **Real-time Updates**: WebSocket connections for live features

### Database Schema
- **Users**: Employee accounts with admin flags
- **Notices**: Company announcements with types and priorities
- **News**: Internal news articles
- **Opportunities**: Job listings and career opportunities
- **Services**: Employee service offerings
- **Documents**: File metadata and sharing
- **Chat Messages**: Real-time messaging data
- **Tickets**: Support requests and IT tickets
- **Emergency Notifications**: Critical alerts system

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, Class Variance Authority
- **Utilities**: Date-fns for date formatting, clsx for conditional classes
- **Development**: Vite plugins for enhanced development experience

### Backend Dependencies
- **Server**: Express.js with middleware for JSON/URL parsing
- **Database**: Drizzle ORM with Neon serverless driver
- **WebSocket**: ws library for real-time communication
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Build Tools
- **TypeScript**: Type checking and compilation
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling for production
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with hot reloading
- **Database**: Development database via Drizzle migrations

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: ESBuild bundles to `dist/index.js`
- **Database**: Migrations applied via `drizzle-kit push`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Neon serverless PostgreSQL for scalable database hosting
- Single-container deployment with static file serving

The application uses a monorepo structure with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The real-time features and emergency notification system make it suitable for critical internal communications.