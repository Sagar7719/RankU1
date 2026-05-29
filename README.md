# RankU1 Unified Project Workspace

This is the unified root workspace for the RankU1 application.

## Directory Structure
- `/server` - Express.js backend API
- `/adminPanel` - React frontend for the Control Center
- `/testSeries` - React frontend for the User Portal

## How to Run the Project
We have configured a root `package.json` with `concurrently` so you can start all three applications simultaneously from this root directory.

1. Ensure you have installed dependencies in all folders (you can run `npm run install:all` to do this automatically).
2. Install root dependencies: `npm install`
3. Start the entire project:
```bash
npm run dev
```

This single command will spin up:
- The backend server on port 5000
- The Admin Panel on port 5173
- The Test Series app on port 5174 (or whatever your Vite config specifies)
