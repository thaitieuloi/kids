# Overview

Soroban Math is a Vietnamese educational application designed to help children develop mathematical skills using the traditional Soroban (Japanese abacus) method. The app features interactive math games with visual Soroban representations, multiple difficulty levels, and comprehensive learning analytics. It combines modern web technology with traditional calculation methods to create an engaging learning experience for young learners.

## Recent Changes (August 10, 2025)
- **React Native App Completed**: Successfully created a full React Native version of the web app in the `/mobile` folder
- **Complete Feature Parity**: All core features from web app ported to mobile including Soroban display, timer, settings, and results
- **Mobile-Optimized UI**: Redesigned all screens with native mobile patterns and touch-friendly interfaces
- **APK Build Ready**: Configured with Expo for easy APK generation and distribution

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript and follows a component-based architecture. The UI framework leverages Radix UI components styled with Tailwind CSS for a consistent design system. The application uses Wouter for client-side routing and React Query for state management and server communication. Key architectural decisions include:

- **Component Structure**: Modular components organized by feature (difficulty cards, Soroban display, timer, etc.)
- **State Management**: React Query handles server state while local component state manages UI interactions
- **Styling Strategy**: Tailwind CSS with CSS custom properties for theming and consistent visual design
- **Mobile Responsiveness**: Custom hooks and responsive design patterns ensure optimal mobile experience

## Backend Architecture
The server uses Express.js with TypeScript in an ESM module format. The architecture follows RESTful API principles with clear separation of concerns:

- **Route Handling**: Centralized route registration with proper error handling and request/response logging
- **Data Layer**: Abstract storage interface with in-memory implementation for game sessions and statistics
- **Game Logic**: Server-side math problem generation and session management
- **Validation**: Zod schemas for type-safe request/response validation

## Game Session Management
The application implements a session-based game flow where:
- Game settings determine problem difficulty and count
- Math problems are generated server-side based on difficulty level
- User progress is tracked with timing and accuracy metrics
- Results are aggregated into overall statistics

## Data Storage Solutions
Currently uses an in-memory storage implementation with a well-defined interface that can be easily replaced with a persistent database solution. The storage layer handles:
- Game session creation and management
- Math problem generation based on settings
- Performance statistics tracking and aggregation

## Visual Learning Components
The Soroban visualization system converts numbers into traditional abacus representations:
- Heaven beads (representing 5s) and earth beads (representing 1s)
- Configurable column count for different number ranges
- Real-time visual feedback during problem solving

## Audio and Accessibility Features
Comprehensive audio management system includes:
- Feedback sounds for correct/incorrect answers
- Transition sounds between questions
- Number reading capabilities for accessibility
- User-configurable audio preferences

# External Dependencies

## UI Framework and Components
- **Radix UI**: Comprehensive primitive component library for accessible UI elements
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Lucide React**: Icon library for consistent iconography

## State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Wouter**: Lightweight client-side routing

## Database and Persistence
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database platform
- **Zod**: TypeScript schema validation library

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundler for production builds

## Audio and Media
- **Web Audio API**: Native browser audio synthesis for feedback sounds
- **Web Speech API**: Text-to-speech functionality for number reading

## Validation and Type Safety
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries