# Citizen Complaints and Engagement System

This is a Next.js 15 application for a Citizen Complaints and Engagement System, built with Redux Toolkit, TypeScript, and Tailwind CSS.

## Features

- User Authentication (Registration and Login)
- Citizen Functionality (Submit Complaints, Discussions, Feedback)
- Government Admin Functionality (Manage Discussions, Groups, Announcements)
- Super Admin Functionality (Manage Users, Analytics, Reports)
- Role-based Access Control

## Tech Stack

- Next.js 15
- Redux Toolkit
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/citizen-complaints-system.git
cd citizen-complaints-system
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js App Router pages
- `/components` - Reusable UI components
- `/lib` - Utility functions and helpers
- `/redux` - Redux store, slices, and thunks
- `/types` - TypeScript interfaces and types
- `/middleware` - Authentication and route protection

## API Integration

This frontend application integrates with a backend API at `https://complaints-bk.vercel.app/api`. The API provides endpoints for authentication, complaints, discussions, users, groups, and more.

## Deployment

The application can be deployed to Vercel:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## License

This project is licensed under the MIT License.
