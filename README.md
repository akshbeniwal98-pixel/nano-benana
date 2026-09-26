# PromptCare.online 🍌

A production-ready full-stack AI image prompt repository and in-app image studio inspired by **Faymas.in** with a **Pinterest-style masonry layout**, real **OpenAI DALL-E 3** generation, and an instant **Pollinations Flux (Free Tier)** fallback.

Designed for immediate deployment on **Render.com** (Native Node.js Web Service) and GitHub.

---

## 🏗️ Architecture & Technology Stack

- **Backend Runtime**: Node.js (v18+) with native ES Modules (`"type": "module"`).
- **Web Framework**: Express.js with CORS security headers and JSON body parsing.
- **AI Image Generation**:
  - **OpenAI DALL-E 3**: Full high-resolution generation via official `openai` SDK when `OPENAI_API_KEY` is provided.
  - **Pollinations Flux / Stable Diffusion Fallback**: Robust, keyless fallback so the app works **immediately on Render's free tier with zero setup**.
- **Frontend**: High-performance vanilla HTML5 + Tailwind CSS (via CDN) + Fetch API, served directly as static files from `/public`.
- **Client Persistence**: `localStorage` caching for user-generated images, custom favorites, and theme preferences.
- **Deployment Target**: Render Web Service (`node server.js`).

---

## 📁 Repository Structure

```
promptcare-online/
├── server.js               # Production Express server (CORS, static host & /api/generate-image)
├── package.json            # Node.js manifest with ES Modules & engines defined
├── .gitignore              # Ignores node_modules, .env, and system cache
├── README.md               # Deployment and architecture documentation
└── public/                 # Static frontend served by Express
    ├── index.html          # Pinterest-style UI & In-App Studio Modal
    └── app.js              # Fetch client, masonry rendering & LocalStorage cache
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone or Download the Repository
```bash
git clone https://github.com/your-username/promptcare-online.git
cd promptcare-online
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```
> *Note: If `OPENAI_API_KEY` is left blank or omitted, the application automatically uses the free Pollinations Flux engine with zero downtime.*

### 4. Start the Server
```bash
npm start
```
Open [http://localhost:5000](http://localhost:5000) (or the port specified) in your browser.

---

## 🌐 Deploying to Render.com (Step-by-Step)

### Step 1: Push to GitHub
1. Initialize a new Git repository:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit for promptcare.online"
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `promptcare-online`.
3. Link and push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/promptcare-online.git
   git push -u origin main
   ```

---

### Step 2: Create a Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New +"** -> **"Web Service"**.
2. Connect your GitHub account and select your `promptcare-online` repository.
3. Configure the service settings:
   - **Name**: `promptcare-online`
   - **Region**: Nearest to your users (e.g., `Singapore`, `Frankfurt`, or `Oregon`)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

---

### Step 3: Configure Environment Variables on Render
Under the **Environment Variables** section in Render, add:
| Key | Value | Description |
|---|---|---|
| `NODE_VERSION` | `18.20.0` or `20.x` | Ensures modern Node.js runtime |
| `OPENAI_API_KEY` | `sk-...` | *(Optional)* OpenAI key for DALL-E 3 |

Click **"Create Web Service"**. Render will automatically clone, run `npm install`, and launch `node server.js`.

---

### Step 4: Verify Deployment & Health Check
Once deployed, Render provides a URL (e.g., `https://promptcare-online.onrender.com`).
- **Web App**: Visit `https://promptcare-online.onrender.com`
- **Health Check**: Visit `https://promptcare-online.onrender.com/health` to confirm `{ "status": "ok" }`.

---

### Step 5: Connect Custom Domain (`promptcare.online`)
1. In your Render Web Service dashboard, navigate to **Settings** -> **Custom Domains**.
2. Click **"Add Custom Domain"** and enter `promptcare.online` and `www.promptcare.online`.
3. In your DNS provider (e.g. Cloudflare, Namecheap, GoDaddy):
   - Add a **CNAME** record pointing `www` to your Render service hostname.
   - Add an **A / ALIAS** record pointing `@` to the Render IP address shown on your dashboard.
4. Render provisions a **free auto-renewing SSL certificate** automatically.

---

## 📡 Backend API Reference

### 1. Healthcheck
- **Endpoint**: `GET /health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "promptcare-online",
    "uptime": 142,
    "timestamp": "2026-09-26T12:00:00.000Z"
  }
  ```

### 2. Generate Image
- **Endpoint**: `POST /api/generate-image`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "prompt": "3D portrait of a boy on a futuristic throne with glowing cyan angel wings, name 'AKSH' on obsidian wall",
    "size": "9:16",
    "style": "3d-neon"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "imageUrl": "https://...",
    "revisedPrompt": "...",
    "provider": "OpenAI DALL-E 3" 
  }
  ```

---

## 📄 License
MIT License. Created for **PromptCare.online**.
