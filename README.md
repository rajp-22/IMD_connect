# MeghSetu — India Meteorological Department (IMD)
### Centralized Digital Learning Management & Organizational Capacity Building Portal
**Ministry of Earth Sciences (MoES), Government of India**

---

## 📌 1. Project Overview

**MeghSetu** is a production-quality, centralized Learning Management and Organizational Capacity Building portal custom-tailored for the **India Meteorological Department (IMD)**. Designed in accordance with government digital design principles, the platform unifies training administration, operational weather forecasting competencies, scientific curriculum management, and multi-tier evaluation.

### Core Roles:
1. **Trainee (Learners / Scientific Assistants / Forecasters)**:
   - Personalized learning dashboard with real-time course progress tracking.
   - Comprehensive professional profile (scientific education, field experience, meteorological skills).
   - Automated skill gap analysis comparing individual proficiencies against operational benchmarks.
   - Interactive MCQ certification assessments with instant grading and explanations.
   - Verifiable digital certificates with official IMD seal, print/PDF export, and verification IDs.
   - Course quality feedback submissions.
   - Institutional announcements and pre-monsoon circulars.

2. **Trainer (Faculty / Senior Meteorologists / NWP Scientists)**:
   - Command center displaying enrolled officers, completion ratios, and assessment scores.
   - 7-step course authoring wizard (Course Info → Modules → Lessons → Resources → Assessment → Preview → Publish).
   - Teaching resource library (lecture slides, radar guides, NetCDF notebooks).
   - Live trainee roster monitoring individual progress and exam results.
   - Faculty competency ratings and feedback reviews.

3. **Admin (Directorate General of Meteorology / Central Training Division)**:
   - High-level analytics dashboard powered by Recharts (monthly participation trends, user distributions, competency averages).
   - Pending registration approval workflow (mandatory administrator sanction before platform access).
   - Complete user cadre management (role assignments, deactivation, profile audits).
   - **Trainer Competency Matching System**: Transparent, deterministic matching engine ranking verified instructors for specialized subject assignments.
   - Broadcast circular and announcement publishing engine.
   - Full oversight of courses, assessments, and issued certificates.

---

## 🛠️ 2. Tech Stack

- **Framework**: Next.js 15+ (App Router, Server & Client Components, Route Handlers)
- **Language**: TypeScript (Strict typing across all models, interfaces, and APIs)
- **Styling**: Tailwind CSS (Tailwind v4 with official Indian Government navy/slate/gold palette)
- **Database & ODM**: MongoDB with Mongoose (Clean schema layer with resilient local JSON persistence fallback for instant zero-config evaluation)
- **Authentication**: Secure JWT tokens in HTTP-only cookies, password hashing with bcryptjs, and role-based route authorization
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Monthly enrollment trends, cadre distribution, competency benchmarks)
- **Celebration & UX**: Canvas Confetti on assessment passing

---

## 🏛️ 3. Architecture & Project Structure

```text
IMD/
├── app/
│   ├── (auth)/
│   │   ├── login/               # Sign-in with role demo autofill buttons
│   │   └── register/            # New officer registration (pending approval)
│   ├── trainee/
│   │   ├── dashboard/           # Trainee personalized overview & metrics
│   │   ├── profile/             # Personal, academic, and scientific profile
│   │   ├── courses/             # My Learning (active & completed courses)
│   │   ├── assessments/         # Formal MCQ examinations with live runner
│   │   ├── certificates/        # Issued digital certificates & PDF export
│   │   ├── competencies/        # Competency mapping & skill gap engine
│   │   ├── feedback/            # Course quality ratings & reviews
│   │   └── announcements/       # IMD circulars and workshop bulletins
│   ├── trainer/
│   │   ├── dashboard/           # Faculty command center & trainee roster
│   │   ├── profile/             # Faculty profile & verified competencies
│   │   ├── courses/
│   │   │   └── create/          # 7-Step Course Creation Studio
│   │   ├── library/             # Teaching slide decks, PDFs & videos
│   │   ├── assessments/         # Question bank & rubric management
│   │   ├── trainees/            # Officer directory with scores & status
│   │   ├── competencies/        # Trainer Competency Matching Engine
│   │   └── feedback/            # Aggregated trainee evaluations
│   ├── admin/
│   │   ├── dashboard/           # Recharts analytics & pending approvals
│   │   ├── users/               # Approve, reject, change role, deactivate
│   │   ├── trainees/            # Trainee directory
│   │   ├── trainers/            # Faculty directory
│   │   ├── courses/             # Course catalog oversight
│   │   ├── assessments/         # Examination benchmarks
│   │   ├── certificates/        # Central verifiable certificate registry
│   │   ├── competencies/        # Competencies & Trainer Matching
│   │   ├── announcements/       # Broadcast communication authoring
│   │   ├── analytics/           # Longitudinal performance charts
│   │   └── settings/            # Data layer controls & re-seed tool
│   ├── courses/
│   │   ├── page.tsx             # Public course catalog with category filters
│   │   └── [id]/page.tsx        # Interactive classroom & lesson player
│   ├── api/
│   │   ├── auth/                # login, register, logout, me
│   │   ├── courses/             # CRUD courses and lesson tracking
│   │   ├── enrollments/         # enroll, lesson completion progress
│   │   ├── assessments/         # author, submit with automatic grading
│   │   ├── certificates/        # query and verify certificates
│   │   ├── competencies/        # trainee competency scores
│   │   ├── skill-gaps/          # gap calculations and recommended courses
│   │   ├── trainer-matching/    # transparent competency match calculation
│   │   ├── admin/               # dashboard metrics, user updates
│   │   ├── announcements/       # get, post broadcast communications
│   │   ├── feedback/            # submit, get course reviews
│   │   ├── trainees/profile/    # trainee profile CRUD
│   │   ├── trainers/profile/    # trainer profile CRUD
│   │   └── seed/                # database re-seed endpoint
│   ├── globals.css              # Government theme & print styles
│   └── layout.tsx               # Root layout & official metadata
├── components/
│   ├── Header.tsx               # Official header with tricolor strip & demo switcher
│   ├── Sidebar.tsx              # Role-specific navigation sidebar
│   ├── PrototypeDisclaimer.tsx  # Mandatory disclaimer badge
│   ├── CourseCard.tsx           # Course card with progress and badges
│   ├── CoursePlayer.tsx         # Classroom with lesson player & syllabus
│   ├── AssessmentRunner.tsx     # MCQ test runner with timer & explanation breakdown
│   ├── CertificateView.tsx      # Framed digital certificate with print/PDF export
│   ├── SkillGapVisualizer.tsx   # Current vs Required dual-bar comparison & recommendations
│   ├── TrainerMatchingTool.tsx  # Deterministic Trainer Competency Matcher
│   ├── AdminCharts.tsx          # Recharts visualizations
│   └── PendingUsersTable.tsx    # Live approval/rejection table
├── lib/
│   ├── db.ts                    # Mongoose connection with resilient fallback
│   ├── auth.ts                  # JWT signing, verification, and cookie helpers
│   ├── types.ts                 # Full TypeScript interfaces
│   ├── models/                  # Mongoose schemas (User, Course, Assessment, etc.)
│   ├── data-service.ts          # Unified database access layer
│   └── seed-data.ts             # Realistic prototype courses, MCQs, and users
├── .env.example
├── .env.local
└── package.json
```

---

## 🔑 4. Demo Accounts & Credentials

The portal is seeded out-of-the-box with three verified demonstration accounts:

| Role | Name | Official Email | Password |
|---|---|---|---|
| **Admin** | Dr. M. Mohapatra (DG) | `admin@capacityconnect.demo` | `Password123!` |
| **Trainer** | Dr. Rajesh Sharma (NWP) | `trainer@capacityconnect.demo` | `Password123!` |
| **Trainee** | Pooja Iyer (RMC Mumbai) | `trainee@capacityconnect.demo` | `Password123!` |

> **Single-Click Sign In**: On the login page (`/login`) or through the **Demo Switcher** in the top navigation bar, you can click on any role button to sign in directly without typing!

---

## ⚡ 5. Installation & Development

### Prerequisites:
- Node.js 18+ (Node 20+ recommended)
- npm or yarn

### Setup Instructions:

1. **Clone/Navigate to the repository**:
   ```bash
   cd c:/Users/nirma/Desktop/IMD
   ```

2. **Environment Variables**:
   Create or verify `.env.local`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/meghsetu
   JWT_SECRET=meghsetu_super_secret_jwt_key_sih_2026_imd_secure_token_987654321
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
   *(Note: If a local or remote MongoDB instance is reachable at `MONGODB_URI`, Mongoose manages connections automatically. If MongoDB is not running locally, the built-in resilient data layer automatically persists all operations to `.data/store.json` so you can test 100% of features without database setup headaches!)*

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the Portal in your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 6. Complete End-to-End Demonstration Workflow

### Workflow 1: New Officer Registration & Admin Approval
1. Go to `/register` and register a new Trainee or Trainer (e.g., `Suresh Kumar`, `suresh@imd.gov.in`).
2. Notice the application status is set to **Pending Approval**.
3. Sign in as Admin (`admin@capacityconnect.demo`).
4. On the **Admin Dashboard**, locate the **Pending Personnel Registrations** table.
5. Click **Approve**. The applicant is immediately granted full access to the portal!

### Workflow 2: Trainer Course Creation
1. Sign in as Trainer (`trainer@capacityconnect.demo`).
2. Navigate to **Create Course** (`/trainer/courses/create`).
3. Follow the 7-step wizard:
   - **Step 1**: Enter course title, category, domain, duration, and description.
   - **Step 2**: Add modules (e.g., *Radar Principles*, *Nowcasting*).
   - **Step 3**: Add lessons with durations and lecture notes.
   - **Step 4**: Attach resources (PDFs, PPT presentations with local fallback).
   - **Step 5**: Author MCQ assessment questions with options, correct answer, and explanation.
   - **Step 6**: Preview the full course syllabus.
   - **Step 7**: Click **Confirm & Publish Course**.
4. The course and assessment are saved to the database and immediately appear in the catalog!

### Workflow 3: Trainee Learning, Assessment & Digital Certificate
1. Sign in as Trainee (`trainee@capacityconnect.demo`).
2. Open **Courses** or click **Continue Learning** on the Trainee Dashboard.
3. Open *Weather Forecasting Fundamentals* or *Satellite Meteorology*.
4. Read lessons and click **Mark as Complete** — progress bar dynamically advances in the database.
5. Click **Take Evaluation Assessment**.
6. Answer the timed MCQ questions and click **Submit Assessment**.
7. View automatic grading results with pass/fail status and detailed question explanations.
8. If passed (>= 60%), celebratory confetti triggers and the **Official Digital Certificate** is generated!
9. Click **View Digital Certificate** or **Print / Save PDF** to inspect the framed credential with the official IMD seal.

### Workflow 4: Competency Mapping & Skill Gap Identification
1. Go to **Competencies** (`/trainee/competencies`).
2. Inspect the 7 core meteorological domains (Meteorology, Weather Forecasting, Data Analysis, Python, Satellite Meteorology, Climate Science, NWP).
3. Review the dual-bar comparison: **Current Score vs Required Benchmark**.
4. Observe identified skill gaps (e.g. *Weather Forecasting: Current 45%, Required 75%, Gap 30%*).
5. See real targeted course recommendations mapped directly from database competencies.
6. When the trainee completes a course in that domain, their competency score increases and the skill gap decreases in real time!

### Workflow 5: Trainer Competency Matching Engine
1. Go to **Trainer Competencies** or **Admin > Competencies** (`/admin/competencies`).
2. Under **Trainer Competency Matching System**, check required competencies (e.g. *Meteorology*, *Weather Forecasting*, *Data Analysis*).
3. The engine transparently calculates the exact percentage match (e.g. 100%, 67%, 33%) and details which prerequisites each trainer meets (✓) or lacks (✗), avoiding false "black-box AI" claims.

---

## 🛡️ 7. Security & Compliance

- **Role-Based Authorization**: Protected layouts and API route guards for Trainee, Trainer, and Admin.
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **HTTP-Only Cookies**: Prevents client-side XSS token theft.
- **Input Validation**: Server-side validation of inputs, scores, and status transitions.
- **Prototype Disclaimer**: Prominently displayed: *“Prototype Demo Content — Not Official IMD Material.”*

---

Developed for the **India Meteorological Department (IMD)**, Ministry of Earth Sciences, Government of India.
