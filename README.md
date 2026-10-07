# Campus Lost & Found — Team Nexus

A full-stack, automated lost and found management platform designed for college campuses. The system pairs reported lost and found items via an automated weighted matching engine to eliminate unorganized communication channels and manual notice boards.

## Key Features
- **Proactive 100-Point Matching Engine:** Evaluates category (30 pts), title/description tokens (30 pts), campus location (20 pts), and date proximity (20 pts).
- **Automated Match Alerts:** Instantly surfaces high-confidence matches upon report submission.
- **Full Lifecycle Handling:** Facilitates active item searching, category filtering, and status updates to "Returned".
- **Responsive Web Interface:** Built using React, Vite, and Tailwind CSS.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)

## Project Structure
- `backend/` — Express server, MongoDB schemas, and weighted matching logic.
- `frontend/` — React single-page application and responsive UI components.

## Running Locally

### Backend Setup
```bash
cd backend
npm install
node server.js