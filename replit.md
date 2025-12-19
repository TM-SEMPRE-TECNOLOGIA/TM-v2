# MAFFENG CMMS - Maintenance Management System

## Overview

MAFFENG is a Computerized Maintenance Management System (CMMS) designed for managing preventive maintenance and work orders. The application is a Portuguese-language system built for maintenance teams to track equipment, manage service orders, coordinate technicians, and generate reports.

## User Roles

The system supports three user roles with distinct access levels:

### Gerente (Manager) - Paulo Silva
- Full administrative access to all system features
- Dashboard with metrics and analytics
- Team management, import functionality, reports
- Access to all work orders across all contracts
- Balanço das Preventivas (financial balance page)

### Elaboradores (Report Writers) - Thiago, Danilo, Felipe, Davi
- Responsible for updating and managing assigned work orders
- Access to personal O.S list ("Minhas O.S")
- Agenda and scheduling functionality
- Edit work order details, status, and technical information

### Administradores de Contratos (Contract Admins) - Alexandre, João Victor, Laura
- Fill in approved values (valorAprovado) after budget submission
- Filter work orders by contract
- Access to Balanço das Preventivas for financial tracking
- View/edit values for O.S in their scope

### Técnicos (Technicians) - Fellipe, Ulisses, Alexandro, Vanderlan, Sidney, Mendes, Glaicon, Ueliton, Flávio
- **DO NOT ACCESS THE SYSTEM** - listed only for assignment/tracking purposes
- Selected during O.S creation to assign field work
- Tracked in reports and balance calculations

## User Preferences

Preferred communication style: Simple, everyday language (Portuguese - Brazilian).

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
- `/components` - Main feature components (Dashboard, WorkOrders, TeamList, Reports, BalancoPreventivas, etc.)
- `/components/ui` - Reusable UI primitives from shadcn/ui
- `/components/figma` - Figma-specific helper components

### State Management
- **Zustand**: Global state management for reactive data updates
- Store located in `/lib/store.ts` with typed state and actions
- Components consume state reactively using `useOSStore` hook
- Prepared for future Supabase integration with async actions

### Routing Pattern
- Single-page application with tab-based navigation
- Active tab state controls content rendering via switch statement in App.tsx
- Sidebar navigation with collapsible state
- Role-based navigation (different menu items per user role)

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

## Key Data Structures

### OrdemServico (Work Order)
```typescript
interface OrdemServico {
  id: string;
  os: string;                    // Work order number
  prefixo: string;               // Equipment prefix
  agencia: string;               // Branch/location
  contrato: string;              // Contract name
  vencimento: string;            // Due date
  situacao: OSStatus;            // Current status
  elaborador: string | null;     // Report writer name
  elaboradorId: string | null;   // Report writer ID (for filtering)
  tecnico: string | null;        // Technician name
  tecnicoId: string | null;      // Technician ID (for filtering)
  valorOrcado: number | null;    // Budgeted value
  valorAprovado: number | null;  // Approved value (filled by contract admin)
  dataAprovacao: string | null;  // Approval date
  aprovadoPor: string | null;    // Approved by
  // ... other fields
}
```

### OSStatus (Work Order Status)
- 'Fornecedor Acionado' - Supplier contacted
- 'Em Levantamento' - In assessment
- 'Em Elaboração' - In preparation
- 'Em Orçamento' - In budgeting
- 'Concluída' - Completed
- 'Com Dificuldade' - With difficulty
- 'Mudança de Contrato' - Contract change

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
- **xlsx**: Excel file parsing for intelligent O.S import

### Data Storage
- Currently uses in-memory state via Zustand (no backend/database yet)
- Data structures prepared for future Supabase integration
- Excel/CSV import functionality with intelligent column detection and normalization
- Toast notifications for import feedback (useToast hook)

## Recent Changes

### December 2024 (Latest)
- **WorkOrders**: Full CRUD with "Nova O.S" modal, status filters, table/card view toggle
- **WorkOrderDetails**: Complete editing with status, values, technician/elaborador assignment, difficulty logging
- **AgendaAndChecklist**: Functional calendar with month navigation, real O.S data by due date, day selection
- **BalancoPreventivas**: CSV export buttons for contracts, technicians, and elaboradores
- **Reports**: Real O.S data with comprehensive filters (date, contract, status, technician, elaborador), CSV export
- **TeamList**: Displays USERS and TECNICOS with statistics cards and "Add Member" modal
- **DifficultyLog**: Uses real dificuldades from O.S with search functionality
- **Notifications**: Dynamic notifications based on O.S due dates and recent difficulties
- All components now consume real data from Zustand store with reactive updates

### December 2024 (Earlier)
- Restructured user roles: Manager, Elaborador, Contract Admin (Technicians don't access system)
- Added TECNICOS list in types.ts for technician assignment
- Created BalancoPreventivas page with financial analysis by contract, technician, and elaborador
- Updated Login component with expandable user groups
- Added valorOrcado, dataAprovacao, aprovadoPor fields to OrdemServico
- Fixed SelectItem empty value bug (Radix UI requirement - using "__none__" placeholder)
- Implemented elaboradorId/tecnicoId matching for intelligent import
