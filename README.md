# Constellations of Purpose

Constellations of Purpose is a personal goal management tool that helps you visualize and achieve your dreams. Create goals, break them down into manageable tasks, and watch as your progress lights up the sky.

## Entry for the GitHub Copilot 1 Day coding challenge

## Prompt: New Beginnings

## Features

- Add and manage goals
- Break down goals into tasks
- Track task completion
- Visualize progress with completion percentages
- Onboarding flow for new users

## Getting Started

### Prerequisites

- Node.js (>= 12.5.0)
- npm or pnpm

### Installation

1. Clone the repository:

```sh
git clone https://github.com/JeffreyScottMartin/constellations-of-purpose.git

cd constellations-of-purpose
pnpm install
pnpm dev
pnpm build
pnpm start

├── .gitignore
├── .next/
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public/
├── README.md
├── src/
│   ├── app/
│   │   ├── goal/
│   │   │   └── [goal]/
│   │   │       └── page.tsx
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── ui/
│   │   ├── addGoalButton.tsx
│   │   └── TaskModal.tsx
├── tailwind.config.ts
└── tsconfig.json

Components
GoalsPage
The main page for managing goals. Displays a list of goals and allows users to add new goals.

GoalPage
The page for managing tasks within a specific goal. Allows users to add tasks and mark them as completed.

AddGoalButton
A button component for adding new goals.

TaskModal
A modal component for adding and updating tasks within a goal.

License
This project is licensed under the MIT License.
```
