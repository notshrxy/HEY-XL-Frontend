# HEY-XL Frontend 🎨

This repository contains the **Frontend** (User Interface) for **HEY-XL**, the Voice-Controlled Excel Assistant.

## ❓ Frequently Asked Questions

### 1. Why is this a separate repository?
To make deployment easier!
*   **Vercel** (where this site is hosted) loves static/React sites.
*   By keeping the frontend separate, we can deploy it to the cloud in seconds.
*   The **Backend** (Voice Engine) is complex and runs locally on your machine, so it doesn't need to be in this cloud repository.

### 2. Where is the Backend?
The backend is the "Voice Engine" that processes your speech and edits Excel files.
*   It is distributed as a **Downloadable Zip** (HEY-XL Voice Engine.zip).
*   Users run the backend locally on their computers.

### 3. How do they talk to each other?
*   **Frontend (This Repo):** Runs in your browser (e.g., `https://HEY-XL.vercel.app`) - This is a sample url.
*   **Backend (Local):** Runs on your computer (e.g., `http://127.0.0.1:8000`).
*   The frontend sends requests to `localhost:8000` to trigger voice commands. This is why you must allow "Insecure Content" or "Mixed Content" in your browser settings if you see a connection error.

---

## 🛠️ Development & Deployment

### How to Deploy this to Vercel
1.  **Fork/Clone** this repository.
2.  Log in to **[Vercel](https://vercel.com)**.
3.  Click **"Add New Project"** and select this repository.
4.  Vercel will detect it's a **Vite** project.
5.  Click **Deploy**.
6.  🎉 Your site is live!

### How to Run Locally (for editing)
1.  Clone the repo:
    ```bash
    git clone https://github.com/your-username/HEY-XL-Frontend.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the dev server:
    ```bash
    npm run dev
    ```

---

## 🔗 Configuration
The connection to the backend is defined in `src/components/Demo.tsx`:
Keep the below ref to 8000 for server-side, else, change to match deployed backend url.

```typescript
// Points to the local python server
const LIVE_PREVIEW_BASE = "http://127.0.0.1:8000";
```

If you ever change the port of your backend, update this line.