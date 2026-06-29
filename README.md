# ATS Resume Builder

An elegant, modern, and highly-responsive Resume Builder that helps you bypass Applicant Tracking Systems (ATS) while presenting a visually stunning document to recruiters.

![Resume Builder Banner](https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200)

## 🚀 Features
- **Real-Time Live Preview**: Watch your resume compile instantly alongside the editor.
- **ATS-Optimized Export**: Generates parser-friendly PDFs that ensure formatting passes automated bot screens.
- **Intelligent Templates**: Includes Modern, Classic, and Minimal templates dynamically colored and mapped.
- **Secure Authentication**: Session-based user persistence securely stores your generated resumes so you can come back and edit them later.
- **Fully Responsive**: Perfectly formatted for all devices, from 320px mobile screens to ultra-wide 1600px desktop monitors.
- **Premium UI**: Crafted using Framer Motion and TailwindCSS for slick micro-animations, glassmorphism, and seamless dark/light modes.

---

## 🛠️ Tech Stack
### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Vanilla Tokens
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL / SQLite (SQLAlchemy ORM)
- **Authentication**: JWT Access & Refresh Tokens
- **PDF Generation**: Weasyprint / wkhtmltopdf

---

## 💻 Local Development

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Set your environment variables by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Unix/macOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Ensure PDF Generation libraries are installed on your OS (e.g., `wkhtmltopdf`).
6. Run the server: `uvicorn main:app --reload`
7. The API will run on `http://127.0.0.1:8000`

---

## 🌐 Deployment Guide

### Deploying the Frontend (Vercel)
The frontend is perfectly structured for immediate deployment on Vercel.

1. **Push your code to GitHub**: Ensure the repository is uploaded to GitHub.
2. **Log into Vercel**: Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. **Import Repository**: Select this repository from your GitHub.
4. **Configure Project**:
   - **Framework Preset**: Next.js (Vercel auto-detects this).
   - **Root Directory**: `frontend`
5. **Environment Variables**:
   Add the API endpoint for your deployed backend. If you haven't deployed your backend yet, leave it blank (it will fall back to localhost, but won't work live).
   - `NEXT_PUBLIC_API_URL` = `https://your-live-backend-url.com`
6. **Deploy**: Click "Deploy". Vercel will handle the rest! Your app will be live with a free `.vercel.app` domain.

### Deploying the Backend (Render / Railway)
To make your application fully functional on the internet, your FastAPI backend must be deployed. We recommend **Render** or **Railway** for Python backends.

#### Option A: Render.com (Recommended & Free Tier)
1. Log into [Render.com](https://render.com) and click **"New Web Service"**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt` (If using wkhtmltopdf, you may need a Dockerfile or a Render `render.yaml` environment to install system dependencies).
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   Add necessary variables like `DATABASE_URL` (if using PostgreSQL), `SECRET_KEY`, etc.
5. Deploy the service.
6. Once live, take the provided URL (e.g., `https://ats-resume-api.onrender.com`) and update your Vercel `NEXT_PUBLIC_API_URL` environment variable.

#### Option B: Railway.app
1. Log into [Railway.app](https://railway.app).
2. Create a "New Project" -> "Deploy from GitHub repo".
3. Configure your root directory to `backend`. Railway will automatically detect the `requirements.txt` and install Python.
4. Set the Start Command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Under the "Variables" tab, define your `SECRET_KEY` and connection strings.
6. Generate a domain name in the "Settings" tab and attach it to your Vercel frontend.

---

## 🔑 Best Practices for Live Production
1. **CORS Origins**: Ensure your backend `main.py` explicitly allows requests from your deployed Vercel domain in its `CORSMiddleware`.
2. **Secure Cookies / Tokens**: For maximum security in production, migrate from `sessionStorage` to HTTP-Only Secure Cookies for authentication tokens.
3. **Database Migration**: Do not use local SQLite in production (Render ephemeral disks will delete it). Set up a managed PostgreSQL database (Render provides a free PostgreSQL tier).

*Built with passion by Muhammad Shariq.*
