# TutorMe – Interactive Learning Platform (Grades 2–10)

A modern, dual-theme educational web app built with **Next.js 15** + Tailwind CSS.  
Ready to deploy on **Vercel**.

## Features

- Dual themes: **Kid Mode** (bright & playful) ↔ **Professional Mode**
- Multi-user login (Parent + unlimited children, grade selection)
- Grade-based content for Math, Reading, Grammar & English (grades 2–10)
- **AI Tutor** – chat that uses your OpenAI key
- **AI Reading Coach** – microphone + accuracy / WPM / mistake feedback
- **Document Scanner** – upload photo → extract text → generate worksheets
- **Games** – Number Race, Fraction Pizza, Word Match, Grammar Fixer, Vocab Blast, Sentence Builder (all playable)
- **Adventure Mode** – interactive multi-subject quest
- **High-Frequency Words** manager (add, paste list, mark mastered)
- Parent analytics dashboard with time charts, alerts & AI insights
- Fully responsive (phone, tablet, desktop)

---

## Deploy to Vercel via GitHub (Recommended)

### Step 1 – Create a new GitHub repository
1. Go to https://github.com/new
2. Name it something like `kidlearn`
3. Leave it **empty** (do **not** add a README or .gitignore)
4. Click **Create repository**

### Step 2 – Upload this project
**Option A – Using GitHub website (easiest)**
1. On your new empty repo page, click **uploading an existing file**
2. Drag and drop **all the files and folders** from this `kidlearn` folder
3. Commit the changes

**Option B – Using Git (command line)**
```bash
cd kidlearn
git init
git add .
git commit -m "Initial commit - TutorMe"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kidlearn.git
git push -u origin main
```

### Step 3 – Deploy on Vercel
1. Go to https://vercel.com and sign in (use your GitHub account)
2. Click **Add New… → Project**
3. Import the `kidlearn` repository
4. Leave all settings as default (Framework Preset should detect Next.js)
5. Click **Deploy**

In about 1 minute you will get a live URL like `https://kidlearn-xxx.vercel.app`

No environment variables are required for the demo.  
Users paste their own OpenAI key inside the app (Settings page).

---

## Run Locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
src/
├── app/
│   ├── login/           # Multi-user login + add children
│   ├── dashboard/       # Dual-theme main hub
│   ├── learn/           # Grade-based subjects
│   ├── ai-tutor/        # OpenAI chat tutor
│   ├── reading-coach/   # Speech reading practice
│   ├── scanner/         # Document → worksheet generator
│   ├── games/           # All playable games
│   ├── adventure/       # Interactive quest
│   ├── words/           # High-frequency word manager
│   ├── parent/          # Parent analytics
│   └── settings/        # OpenAI key + toggles
├── components/
│   ├── dashboard/       # Kid + Pro dashboards
│   └── theme-*          # Theme system
└── lib/
    ├── auth-context.tsx # Simple multi-user auth
    └── mock-data.ts     # Grade content + sample data
```

---

## Notes

- Auth and progress are stored in the browser (localStorage) for this demo.
- For a production version you would add Clerk/NextAuth + a real database (Supabase / Vercel Postgres).
- The AI Tutor and Scanner call OpenAI from the browser when a key is provided.

Built for kids who love learning. Have fun!
