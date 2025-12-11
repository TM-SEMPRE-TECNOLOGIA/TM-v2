# MAFFENG CMMS - Maintenance Management System

## Overview

MAFFENG is a Computerized Maintenance Management System (CMMS) designed for managing preventive maintenance and work orders. The application is a Portuguese-language system built for maintenance teams to track equipment, manage service orders, coordinate technicians, and generate reports.

The system supports two user roles:
- **Manager (Gerente)**: Full access to team management, metrics, reports, and system settings
- **Technician (Técnico)**: Access to assigned work orders, personal agenda, and task checklists

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react
- **Styling**: Tailwind CSS v4 (using @tailwindcss/vite plugin)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Component Structure
The application follows a feature-based component organization:
- `/components` - Main feature components (Dashboard, WorkOrders, TeamList, Reports, etc.)
- `/components/ui` - Reusable UI primitives from shadcn/ui
- `/components/figma` - Figma-specific helper components

### State Management
- Local React state with useState hooks
- No external state management library currently implemented
- User authentication state managed at App.tsx level with role-based routing

### Routing Pattern
- Single-page application with tab-based navigation
- Active tab state controls content rendering via switch statement in App.tsx
- Sidebar navigation with collapsible state

### Design Patterns
- Component composition using Radix UI primitives
- Utility-first CSS with Tailwind
- Class variance authority (CVA) for component variants
- cn() utility function for conditional class merging

### Path Aliases
- `@/*` maps to project root
- `@assets/*` maps to `/attached_assets`

### Development Server
- Runs on port 5000
- Configured for Replit hosting with allowedHosts for .replit.dev, .repl.co, and .replit.app domains

## External Dependencies

### UI Libraries
- **Radix UI**: Complete primitive library including dialog, dropdown, tabs, select, checkbox, etc.
- **shadcn/ui**: Pre-styled components built on Radix primitives
- **Recharts**: Chart library for metrics and analytics displays
- **Embla Carousel**: Carousel functionality
- **Vaul**: Drawer component
- **Sonner**: Toast notifications
- **cmdk**: Command palette functionality
- **react-day-picker**: Date picker with date-fns integration

### Form Handling
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **input-otp**: OTP input component

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional class string construction
- **tailwind-merge**: Tailwind class deduplication
- **class-variance-authority**: Component variant management

### Data Storage
- Currently uses mock data (no backend/database integration)
- Data structures prepared for future API integration with work orders, team members, contracts, and equipment