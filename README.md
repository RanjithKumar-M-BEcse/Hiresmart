# HireSmart – Smart ATS Platform

A complete production-style React + Tailwind CSS frontend for an Applicant Tracking System (ATS).

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies (React, Tailwind, React Router)
npm install

# 2. Start the dev server
npm start
```

Opens at **http://localhost:3000**

---

## 📁 Folder Structure

```
hiresmart/
├── public/
│   └── index.html                         # Google Fonts (Sora + DM Sans)
├── src/
│   ├── App.js                             # BrowserRouter + all routes
│   ├── index.js                           # ReactDOM entry
│   ├── index.css                          # Tailwind directives + component layer
│   ├── data/
│   │   └── mockData.js                    # All mock jobs, applicants, stats
│   ├── components/
│   │   ├── RecruiterSidebar.js            # Sticky sidebar for recruiter views
│   │   ├── CandidateSidebar.js            # Sticky sidebar for candidate views
│   │   └── Navbar.js                      # Top bar with title + date
│   └── pages/
│       ├── Login.js                       # "/"
│       ├── SelectRole.js                  # "/select-role"
│       ├── recruiter/
│       │   ├── Dashboard.js               # "/recruiter/dashboard"
│       │   ├── CreateJob.js               # "/recruiter/create-job"
│       │   └── JobDetails.js              # "/recruiter/job/:id"
│       ├── public/
│       │   └── PublicJob.js               # "/public/job/:id"
│       └── candidate/
│           ├── Dashboard.js               # "/candidate/dashboard"
│           └── Analysis.js               # "/candidate/analysis"
├── tailwind.config.js                     # Custom fonts, colors, animations
├── postcss.config.js                      # Tailwind + autoprefixer
└── package.json
```

---

## 🗺️ Routes

| Path | Page |
|------|------|
| `/` | Login |
| `/select-role` | Role Selection |
| `/recruiter/dashboard` | Recruiter Dashboard |
| `/recruiter/create-job` | Post a Job |
| `/recruiter/job/:id` | Job Details + Applicants |
| `/public/job/:id` | Public Resume Upload + ATS score |
| `/candidate/dashboard` | Candidate Dashboard |
| `/candidate/analysis` | Full ATS Report |

---

## ✨ Features

**Recruiter Side**
- 📊 Stats: Total Jobs, Applicants, Shortlisted, Offer Rate
- 📋 Job table with department, counts, posted date
- ✍️ Create Job form with live keyword preview
- 🔗 Auto-generated public job link with copy button
- 👥 Applicant cards sorted by AI match %, with matched/missing keywords

**Candidate Side**
- ☁️ Drag-and-drop PDF resume upload
- 🎯 ATS score ring chart with skill breakdown bars
- ✅ Matched vs ✗ Missing skills display
- 💡 Actionable improvement suggestions

**Public Job Page**
- Resume upload with PDF validation
- Mock ATS analysis with instant results
- Shortlisted / Rejected status display

---

## 🎨 Design System

- **Fonts**: Sora (display) + DM Sans (body)
- **Colors**: Brand blue `#2563eb`, Emerald green, Amber, Slate grays
- **Components**: `.card`, `.btn-primary`, `.btn-secondary`, `.badge-*`, `.form-input`, `.sidebar-link`
- **Animations**: `animate-fade-up`, `animate-fade-up-2/3/4`, progress bar transitions
