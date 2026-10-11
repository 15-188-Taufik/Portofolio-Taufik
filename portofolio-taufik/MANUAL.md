# Portfolio Application – Manual & Quickstart

## Overview
This repository is a **Next.js 16** portfolio site built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js**, and **Prisma**. It includes:
- A hero section with an interactive galaxy background (mouse & mobile swipe).
- Public project showcase (`/projects`).
- Admin dashboard (`/admin/dashboard`) for managing projects, CV, skills, and description.
- Authentication via **NextAuth** (credentials provider).

The manual below explains how to run, configure, and use the app.

---
## 1️⃣ Prerequisites
| Tool | Version |
|------|---------|
| **Node.js** | >= 20 |
| **npm** (or **yarn**) | latest |
| **Git** | any |
| **PostgreSQL** (or any Prisma‑supported DB) | >= 12 |
| **Vercel CLI** (optional) | latest |

Create a `.env` at the project root:
```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET="<random‑32‑byte‑string>"
NEXTAUTH_URL="http://localhost:3000"
RECAPTCHA_SECRET="<your‑recaptcha‑secret>"
```

---
## 2️⃣ Install & Build
```bash
# Clone (if not already)
git clone <repo‑url> portfolio && cd portfolio

# Install deps
npm ci

# Prisma generate + migrate
npx prisma generate
npx prisma migrate dev   # creates tables

# Start dev server
npm run dev   # → http://localhost:3000
```
The seed creates an admin user (`admin@example.com` / `admin123`). Edit `prisma/seed.ts` if needed.

---
## 3️⃣ Admin Login
1. Open `http://localhost:3000/portal-thn`.
2. Enter credentials + complete reCAPTCHA.
3. On success you are redirected to `/admin/dashboard`.
> A 10‑second client‑side timeout will show *"Waktu masuk habis (Timeout)…"* if the server does not answer.

---
## 4️⃣ Managing Projects
### Add
1. Click **"Tambah Project"** (+ button).
2. Fill title, description, repo URL, live demo URL, and upload an image.
3. Submit – the project appears on the public `/projects` page.
### Edit / Delete
- In the admin list each card has **Edit** (pencil) and **Delete** (trash) icons.
- Edit opens the same form pre‑filled; Delete asks for confirmation.

---
## 5️⃣ Updating CV, Skills & Hero Subtitle
All stored in the `Setting` table, edited via **Settings** panel (`/admin/dashboard/settings`).
- **CV URL** – button in the About section. Upload a new PDF to `public/documents/` and set the path (e.g., `/documents/new‑cv.pdf`).
- **Skills** – displayed as badges. Provide a comma‑separated list (e.g., `Next.js,React,TypeScript,Tailwind,Node.js,Prisma`).
- **Hero Subtitle** – text under the name; edit the *heroSubtitle* setting or leave blank to use the default.

---
## 6️⃣ Deploy to Vercel (optional)
```bash
npm i -g vercel
vercel login
vercel link   # or create a new project
vercel          # preview
vercel --prod   # production
```
Add the same env vars in Vercel → Settings → Environment Variables.

---
## 7️⃣ Clean Project Structure (post‑cleanup)
```
/ (root)
├─ .env
├─ .gitignore
├─ next.config.mjs
├─ tailwind.config.ts
├─ package.json
├─ prisma/
│   ├─ schema.prisma
│   └─ seed.ts
├─ public/
│   ├─ images/      # project pictures
│   └─ documents/   # CV PDFs
├─ src/
│   ├─ app/
│   │   ├─ layout.tsx
│   │   ├─ page.tsx          # Home (hero, about, projects)
│   │   ├─ portal-thn/       # login page
│   │   ├─ admin/            # dashboard & settings
│   │   └─ api/              # auth, upload, CRUD (Prisma)
│   ├─ components/          # UI components (Navbar, GalaxyWrapper, etc.)
│   ├─ lib/                 # auth helper, Prisma client
│   └─ proxy.ts              # Next.js 16 proxy protecting /admin/*
└─ README.md
```
All **unused files** have been removed; the remaining structure follows the Next.js 16 app‑router pattern.

---
## 8️⃣ FAQ & Troubleshooting
- **Login hangs** – verify `NEXTAUTH_SECRET` and DB connectivity. The client‑side timeout will now surface an error.
- **Image upload fails** – the upload API expects `multipart/form-data`. The admin UI already uses `FormData`.
- **Tailwind styles not applied** – after changing `tailwind.config.ts` restart `npm run dev`.
- **Orphaned images** – deleting a project does not auto‑remove the image file; clean `public/images` manually if needed.

---
## 9️⃣ Contributing
The repo is MIT‑licensed. Fork, push changes, and open a PR. Run `npm run lint && npm run format` before submitting.

---
*Enjoy showcasing your work!*
