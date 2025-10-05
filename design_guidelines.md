# Design Guidelines: Support Ticket Management System

## Design Approach

**Reference-Based with Glassmorphism**: Drawing inspiration from Linear's clean productivity patterns and Notion's information hierarchy, enhanced with modern glassmorphism aesthetic for a sophisticated, contemporary feel. The design balances utility with visual polish—essential for agents spending hours in the interface.

## Core Design Principles

- **Glass Clarity**: Frosted glass effects create depth without sacrificing readability
- **Information Density**: Support high data throughput while maintaining visual breathing room
- **Purposeful Motion**: Smooth transitions that aid comprehension, never distract
- **Trust Through Polish**: Enterprise-grade refinement signals reliability to business users

---

## Color Palette

### Light Mode
- **Primary**: 221 83% 53% (rich blue for CTAs, primary actions)
- **Secondary**: 250 90% 65% (purple accent for secondary elements, badges)
- **Success**: 142 71% 45% (status indicators, positive actions)
- **Warning**: 38 92% 50% (medium priority, alerts)
- **Danger**: 0 84% 60% (high priority, destructive actions)
- **Neutral**: 220 13% 18% (text, dark elements)
- **Muted**: 215 16% 47% (secondary text, borders)
- **Background**: 210 20% 98% (page background)
- **Surface**: 0 0% 100% (card backgrounds)
- **Glass**: 210 100% 97% / 40% (glassmorphism overlays with alpha)

### Dark Mode
- **Background**: 220 26% 7% (deep blue-black base)
- **Surface**: 220 23% 10% (card surfaces)
- **Glass**: 220 30% 15% / 60% (glass panels with higher opacity)
- **Neutral**: 210 20% 92% (text on dark)
- **Muted**: 215 20% 65% (secondary text)
- **Borders**: 220 20% 20% (subtle divisions)

---

## Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - body text, UI elements
- Accent: 'JetBrains Mono' (Google Fonts) - ticket IDs, technical data

**Scale**:
- **Headlines (H1)**: text-4xl font-bold (dashboard titles)
- **Section Headers (H2)**: text-2xl font-semibold (panel headers)
- **Subsections (H3)**: text-lg font-medium (ticket subjects)
- **Body**: text-base (messages, descriptions)
- **Small**: text-sm (metadata, timestamps)
- **Micro**: text-xs (labels, helper text)

**Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing (1-2): icon gaps, badge padding
- Component spacing (3-4): button padding, input gaps
- Section spacing (6-8): card padding, panel margins
- Major spacing (12-16): page margins, section dividers

**Grid System**:
- Dashboard: 12-column responsive grid
- Ticket list: Single column with horizontal sub-grid for metadata
- Ticket detail: 2/3 main thread, 1/3 sidebar (lg: breakpoint)

**Containers**:
- Max-width: 1400px for main content area
- Full-bleed glass panels extend to viewport edges
- Inner content maintains 1280px comfort zone

---

## Component Library

### Glassmorphism Implementation
- **Glass Cards**: `backdrop-blur-xl bg-glass border border-white/10 shadow-2xl`
- **Nested Glass**: Use reduced opacity (30%) for layered surfaces
- **Dark Mode Adjustment**: Increase backdrop-blur to `backdrop-blur-2xl` for better contrast

### Navigation
- **Top Bar**: Fixed glass panel with blur, contains logo, global search, profile dropdown
- **Sidebar**: Persistent glass navigation (collapsible on mobile) with icon + label items
- **Breadcrumbs**: Subtle text-sm with separator icons for deep navigation

### Ticket Components
- **Ticket Card**: Glass card with gradient border (varies by priority), shows ID (mono), subject, status badge, assignee avatar, timestamp
- **Status Badges**: Rounded-full with subtle glassmorphism, colored borders matching status
  - Open: blue glass
  - Pending Customer: amber glass
  - Pending Agent: purple glass
  - Closed: green glass
- **Priority Indicators**: Left border accent (3px) on ticket cards
  - Low: muted gray
  - Medium: warning amber
  - High: danger red

### Message Thread
- **Customer Messages**: Left-aligned, lighter glass background
- **Agent Messages**: Right-aligned, primary-tinted glass
- **System Messages**: Center-aligned, minimal style with icon
- **Timestamp**: Absolute positioned text-xs above each message group

### Forms & Inputs
- **Text Inputs**: Glass effect with subtle border, focus state adds glow ring
- **Textareas**: Expandable with drag handle, minimum 4 rows
- **Dropdowns**: Glass menu overlay with backdrop-blur-xl
- **File Upload**: Drag-and-drop zone with dashed glass border, preview thumbnails

### Buttons
- **Primary**: Solid primary color, white text, subtle shadow, hover: brightness increase
- **Secondary**: Glass with primary border, primary text, hover: filled
- **Outline**: Transparent with border, hover: subtle glass fill
- **Ghost**: No background until hover, then subtle glass
- **Icon Buttons**: Square glass (40x40), centered icon, hover: scale(1.05)

### Data Display
- **Tables**: Glass headers, alternating row tint (subtle), hover: row highlight
- **Metric Cards**: Glass panels with large number (text-4xl font-bold), label below, optional sparkline or mini chart
- **Charts**: Use recharts with glassmorphism tooltip overlays, muted grid lines

### Overlays
- **Modals**: Full-screen glass overlay (backdrop-blur-md), centered card (max-w-2xl)
- **Sidesheets**: Slide from right, glass surface, overlay rest of screen
- **Toasts**: Top-right glass notifications with auto-dismiss, icon + message + action

---

## Animations & Transitions

### Skeleton Loading States
- **Pulse Animation**: Subtle shimmer effect on glass surfaces
- **Progressive Load**: Content fades in (opacity 0 → 1, 200ms) as data arrives
- **Skeleton Cards**: Match final card dimensions, pulse animation on glass

### Page Transitions
- **Route Changes**: 150ms fade + slight vertical translate (5px)
- **Modal Entry**: Scale from 0.95 → 1 with fade, 200ms ease-out
- **Sidebar Toggle**: 250ms slide with easing
- **Button Interactions**: 100ms scale(0.98) on active, 200ms all other states

### Micro-Interactions
- **Hover States**: 150ms ease for all hover effects
- **Status Changes**: 300ms color transition with subtle pulse
- **Badge Appearance**: Scale from 0.9 → 1 with fade
- **Avatar Load**: Fade in when image loaded

**Critical**: All transitions use `ease-out` or `ease-in-out` for natural feel. No bouncy animations in data interfaces.

---

## Layout Specifications

### Dashboard
- **Hero Metrics**: Grid of 4 metric cards (glass), prominent numbers
- **Activity Stream**: Center column, chronological glass cards with icons
- **Quick Actions**: Right sidebar, glass panel with common tasks
- **Charts Section**: 2-column grid (lg:), line chart (MTPR trend) + bar chart (SLA compliance)

### Ticket List
- **Filters Bar**: Sticky glass top bar with chips for status, priority, channel, assignee
- **Search**: Prominent glass input with magnifying glass icon, real-time filtering
- **List View**: Stacked glass cards, skeleton states during load, infinite scroll or pagination
- **Empty State**: Centered illustration + message in glass panel

### Ticket Detail
- **Main Thread**: Left 2/3, messages stack chronologically, auto-scroll to bottom
- **Reply Box**: Sticky bottom, glass with template dropdown, attachment button, send with "final" toggle
- **Sidebar**: Right 1/3, glass sections for customer info, ticket metadata, context snippets, activity log
- **Actions Bar**: Top of detail, glass with priority/status dropdowns, assign button

### Settings
- **Tab Navigation**: Glass pills for Branding, Users, SLA, Webhooks
- **Form Sections**: Stacked glass cards, clear section headers
- **Color Picker**: Visual preview of theme changes in real-time
- **Webhook Test**: Glass panel with input fields, "Test Connection" button, response preview

### Recent Activity Log
- **Timeline View**: Vertical line with glass cards attached, icons indicate action type
- **Filters**: Date range, action type, user filter at top
- **Activity Items**: Show actor avatar, action description, timestamp, related entity link

---

## Images

**Hero Images**: This is an enterprise B2B application—no decorative hero images. Focus on data density and utility.

**User Avatars**: Circular (32px default, 40px in headers, 24px in lists), fallback to initials with gradient background

**Empty States**: Use minimal line illustrations (not photos) for empty ticket lists, no assignments, etc.

**Customer Context**: If customer provides product photos (device images for repair shop), show thumbnails (60x60) in sidebar with lightbox on click

---

## Accessibility & Polish

- **Focus States**: 2px ring with primary color, offset by 2px
- **Keyboard Navigation**: Full keyboard support, visible focus indicators
- **Loading States**: Skeleton screens for all async content, never blank views
- **Error States**: Glass alert panels with error icon, actionable message, retry option
- **Success Feedback**: Subtle toast notifications for completed actions
- **Dark Mode Toggle**: Smooth theme transition (300ms) preserving glass effects

---

## Execution Notes

- Glass effects require careful opacity tuning: too transparent = illegible, too opaque = loses effect
- Test all text on glass backgrounds for WCAG AA contrast (4.5:1)
- Use `will-change: transform` sparingly only on animated elements to avoid performance issues
- Prioritize perceived performance: show skeleton → partial data → full data
- Every interactive element must have hover, focus, and active states defined