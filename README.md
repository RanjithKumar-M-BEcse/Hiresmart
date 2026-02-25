# HireSmart – Smart ATS Platform

A production-style React + Tailwind CSS frontend for an Applicant Tracking System (ATS), with recruiter, candidate, and public application flows.

---

## 🚀 Quick Start

```bash
npm install
npm start
```

Runs at **http://localhost:3000**.

---

## 📁 Project Structure

```
hiresmart/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── data/
│   │   ├── mockData.js
│   │   └── jobsStore.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── RecruiterSidebar.js
│   │   ├── CandidateSidebar.js
│   │   └── RouteGuards.js
│   └── pages/
│       ├── Login.js
│       ├── SelectPortal.js
│       ├── recruiter/
│       │   ├── CompleteProfile.js
│       │   ├── Dashboard.js
│       │   ├── CreateJob.js
│       │   └── JobDetail.js
│       ├── candidate/
│       │   ├── Dashboard.js
│       │   └── Analysis.js
│       └── apply/
│           └── ApplyJob.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🗺️ Routes

| Path | Page |
|------|------|
| `/` | Login |
| `/login` | Login |
| `/select-portal` | Portal Selection |
| `/recruiter/complete-profile` | Recruiter Profile Setup |
| `/recruiter/dashboard` | Recruiter Dashboard |
| `/recruiter/create-job` | Post a Job |
| `/recruiter/job/:id` | Job Details + Applicants |
| `/candidate/dashboard` | Candidate Dashboard |
| `/candidate/analysis` | Full ATS Report |
| `/apply/:publicId` | Public Resume/Application Form |

---

## ✨ Highlights

- Session-aware portal selection and profile-completion flow.
- Recruiter job lifecycle: create, publish shareable link, review applicants, close with shortlist logic.
- Candidate AI-style resume analysis UI with score ring, skill breakdown, and recommendations.
- Public white-label application page with PDF validation.

---

## 🧱 Tech Stack

- React 18
- React Router v6
- Tailwind CSS + PostCSS
- LocalStorage/sessionStorage for mock persistence
