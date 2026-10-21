# Perplexity Clone

A full-stack AI-powered search and conversational assistant built with React, Node.js, Express, LangChain, Google Gemini, and Tavily Search.

## Features
- 🔍 **Real-time Internet Search:** Uses Tavily API to fetch current web information.
- 🤖 **AI-Powered Answers:** Powered by Google Gemini via LangChain.
- 💬 **Conversational History:** Persistent multi-turn conversations saved to MongoDB.
- 📱 **Fully Responsive UI:** Seamless experience on mobile, tablet, and desktop with sliding drawer sidebar.
- 🔐 **Authentication:** JWT-based secure authentication with Gmail OAuth email verification.

## Tech Stack
- **Frontend:** React, Redux Toolkit, Tailwind CSS, Vite, React Markdown
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, LangChain, Nodemailer
- **APIs:** Google Gemini API, Tavily Search API

## Setup Instructions

### Backend
1. `cd Backend`
2. `npm install`
3. Configure `.env` based on `.env.example`:
   - `PORT=8000`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `TAVILY_API_KEY`
   - `GOOGLE_USER`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
4. `npm run dev`

### Frontend
1. `cd Frontend`
2. `npm install`
3. `npm run dev`
