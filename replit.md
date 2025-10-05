# Sistema de Gestión de Tickets/Soporte

## Overview
Full-stack ticket/support management system with webhook integration for n8n, manual ticket creation, glassmorphism UI, and hexagonal architecture backend.

## Recent Changes (October 2025)
- ✅ Implemented glassmorphism frontend with all core pages (login, dashboard, tickets, activity, settings)
- ✅ Created reusable React components with framer-motion animations
- ✅ Implemented hexagonal architecture backend with domain, application, and infrastructure layers
- ✅ Created REST API endpoints for tickets, messages, activity logs, and users
- ✅ Implemented webhook endpoints for n8n integration (inbound and test endpoints)
- ✅ Connected frontend to backend using React Query
- ✅ Using in-memory storage (can switch to Supabase database when configured)
- ✅ Implemented Redux Toolkit + RTK Query for advanced state management
- ✅ Added multi-language support (i18next) with Spanish and English translations
- ✅ Created language switcher component in navbar
- ✅ Confirmed Supabase database tables are created and ready
- ✅ **NEW**: Made TicketDetailPage fully dynamic with real-time data fetching
- ✅ **NEW**: Implemented message sending functionality with proper error handling
- ✅ **NEW**: Added loading and error states for ticket detail view
- ✅ **NEW**: Created CreateTicketForm with full validation and i18n support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query (React Query) for data fetching and caching
- Redux Toolkit + RTK Query for state management and API calls
- react-i18next for multi-language support (Spanish/English)
- Shadcn UI + Tailwind CSS for styling
- Framer Motion for animations
- Glassmorphism design aesthetic with dark mode support

### Backend
- Express.js server
- Hexagonal architecture (Domain → Application → Infrastructure)
- Drizzle ORM for database
- Zod for validation
- In-memory storage with interface for database repositories

### Database
- PostgreSQL via Supabase (schema ready, using in-memory for development)
- Tables: users, tickets, messages, activity_logs
- `activity_logs` rows capture the timeline of tickets (`ticket_id`, `actor`, `action`, `entity`, optional JSON `metadata`, timestamps)
- Drizzle migrations generated and ready

> **Importante:** la primera persona que inicia sesión se auto-crea como admin en la tabla `users`. El resto de usuarios deben existir en `users` (se vinculan por correo) para que la gestión y los logs funcionen correctamente.

## Project Architecture

### Backend Structure
```
server/
├── domain/
│   └── repositories/         # Repository interfaces (ports)
├── application/
│   └── usecases/            # Business logic
├── infrastructure/
│   └── repositories/        # Repository implementations
├── routes.ts                # API routes
├── container.ts             # Dependency injection
└── storage.ts               # In-memory storage implementation
```

### Frontend Structure
```
client/src/
├── pages/                   # Page components
├── components/              # Reusable components
├── store/                   # Redux store and RTK Query API
├── locales/                 # i18n translation files (es.json, en.json)
├── lib/                     # Utilities
├── i18n.ts                  # i18next configuration
└── App.tsx                  # Main app with routing
```

## API Endpoints

### Tickets
- `GET /api/tickets` - Get all tickets (with filters: status, priority, assigneeId, channel)
- `GET /api/tickets/:id` - Get ticket by ID with messages
- `POST /api/tickets` - Create new ticket
- `POST /api/tickets/:id/messages` - Add message to ticket
- `PATCH /api/tickets/:id/status` - Update ticket status

### Activity & Users
- `GET /api/activity` - Get activity logs
- `GET /api/users` - Get all users (requires admin role)
- `POST /api/users` - Create a new user (admin only)
- `PATCH /api/users/:id` - Update user name/email/role (admin only)

### Webhooks
- `POST /webhook/inbound` - Receive tickets from n8n (requires x-api-key header)
- `POST /webhook/test/inbound` - Create test ticket

## Configuration

### Environment Variables
- `DATABASE_URL` - Supabase/PostgreSQL connection string (optional, uses in-memory storage if not available)
- `WEBHOOK_API_KEY` - API key for webhook authentication (defaults to "dev_key_123")
- `SESSION_SECRET` - Session secret for authentication
- `PORT` - Server port (default: 5000)
- `SUPABASE_SERVICE_ROLE_KEY` - (opcional pero recomendado) clave service role para crear/actualizar usuarios desde el backend

## User Preferences
- Design: Glassmorphism aesthetic with smooth transitions and skeleton loading states
- Architecture: Hexagonal (ports & adapters) for backend
- State Management: Redux Toolkit + RTK Query for state management alongside React Query
- Language: Multi-language support (Spanish/English) with language switcher
- MVP Approach: Core features first, iterative improvements

## Next Steps
1. Extend translation coverage to all remaining pages and components
2. Implement outbound webhooks for sending responses back to n8n
3. Add real-time updates (polling every 15 seconds)
4. Add comprehensive testing for core features
5. Consider migrating more API calls from React Query to RTK Query for consistency
6. Switch to Supabase database for production (currently using in-memory storage for development)

## Notes
- Using in-memory storage for development; Supabase database tables are created and ready
- All database repository implementations are ready - just need to switch container.ts to use them
- Frontend components have `data-testid` attributes for testing
- Webhook authentication uses x-api-key header (configurable via WEBHOOK_API_KEY env var)
- Language preference persists in localStorage and survives page reloads
- LoginPage, Navbar, and ticket-related pages (list, detail, create) are fully translated
- TicketDetailPage fetches real data from `/api/tickets/:id` endpoint
- Message sending updates the ticket detail view automatically via cache invalidation
