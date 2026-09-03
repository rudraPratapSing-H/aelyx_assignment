# 🏫 Mini School ERP System

> A full-stack, role-based School ERP built as a 24-hour take-home assignment for **Aelyx AI & Technology Solutions**.

The system manages three distinct user roles — **Admin**, **Teacher**, and **Student** — each with their own dashboard, permissions, and workflows. Admins manage all entities (staff, students, classes). Teachers mark daily attendance for their assigned classes. Students view their own attendance history and statistics.

---

## 🧱 Tech Stack & Justification

Every technology choice was made with a **strict 24-hour deadline** in mind, optimizing for development velocity without sacrificing code quality.

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) + shadcn/ui | Server Components provide fast data fetching for dashboard tables without needing extra API layers. shadcn/ui provides accessible, pre-built components to ensure a usable UI with handled error states, prioritizing speed. |
| **Backend** | Node.js, Express, TypeScript | Lightweight, flexible, and allows for rapid development of the required REST API and role-based middleware. |
| **Database & ORM** | PostgreSQL + Prisma | PostgreSQL perfectly handles the heavily relational data between students, classes, and teachers. Prisma ORM accelerates development with type-safe CRUD operations and an easily readable schema. |
| **Auth** | JWT (jsonwebtoken + jose) | Simple, stateless authentication via HTTP-only cookies with role-based access control baked into the middleware layer. |

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USER ||--o{ CLASS : "is in-charge of"
    CLASS ||--o{ STUDENT : "contains"
    STUDENT ||--o{ ATTENDANCE : "has daily records of"

    USER {
        string id PK
        string name
        string email
        string role
    }
    CLASS {
        string id PK
        string name
        string teacherId FK
    }
    STUDENT {
        string id PK
        string name
        string rollNumber
        string classId FK
    }
    ATTENDANCE {
        string id PK
        string date
        string status
        string studentId FK
    }
```

The schema enforces a `@@unique([studentId, date])` constraint on Attendance to prevent duplicate records for the same student on the same day.

---

## ⚡ Quick Start

> Get the project running locally in under 5 minutes.

### 1. Clone the Repository

```bash
git clone https://github.com/rudraPratapSing-H/aelyx_assignment.git
cd aelyx_assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in your PostgreSQL connection string:

```bash
cp .env.example .env
```

Your `.env` should contain:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-key"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 🔑 Test Credentials

Use these pre-seeded accounts to immediately test role-based access control:

| Role | Email | Password |
|---|---|---|
| **Admin** | `hr@aelyx.ai` | `123` |
| **Teacher** | `teacher3@gmail.com` | `123` |
| **Student** | `vaibhav@gmail.com` | `123` |

Each role is automatically redirected to their respective dashboard upon login:

- **Admin** → `/admin` (full CRUD over Students, Staff, Classes, Attendance)
- **Teacher** → `/teacher` (view assigned classes, mark daily attendance)
- **Student** → `/student` (personal attendance stats & day-by-day history)

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (dashboard)/        # Authenticated dashboard layout group
│   │   ├── admin/          # Admin portal
│   │   ├── teacher/        # Teacher portal
│   │   ├── student/        # Student portal
│   │   ├── students/       # Student management (CRUD)
│   │   ├── users/          # Staff management (CRUD)
│   │   ├── classes/        # Class management (CRUD)
│   │   └── attendance/     # Attendance summary & reports
│   ├── api/                # REST API endpoints
│   └── login/              # Public login page
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Sidebar, navigation
│   ├── auth/               # Login form
│   ├── students/           # Student table & forms
│   ├── users/              # Staff table & forms
│   ├── classes/            # Class table & forms
│   └── attendance/         # Attendance tables & modals
├── controllers/            # Request handling & validation
├── services/               # Business logic layer
├── repositories/           # Database access (Prisma)
├── middleware/              # Auth & role-based guards
└── lib/                    # Utilities & server-side data fetchers
```

### Visual Architecture

```mermaid
graph LR
    src[📂 src/] --> app[📂 app/]
    src --> comp[📂 components/]
    src --> ctrl[📂 controllers/]
    src --> serv[📂 services/]
    src --> repo[📂 repositories/]
    src --> mid[📂 middleware/]
    src --> lib[📂 lib/]

    %% App Router Directory
    app --> dash[📂 dash/]
    app --> api[📂 api/]
    app --> login[📂 login/]

    dash --> admin[📄 admin/]
    dash --> teacher[📄 teacher/]
    dash --> student[📄 student/]
    dash --> students[📄 students/]
    dash --> users[📄 users/]
    dash --> classes[📄 classes/]
    dash --> attendance[📄 attendance/]

    %% Components Directory
    comp --> ui[🎨 ui/]
    comp --> layout[🎨 layout/]
    comp --> auth[🎨 auth/]
    comp --> c_students[🎨 students/]
    comp --> c_users[🎨 users/]
    comp --> c_classes[🎨 classes/]
    comp --> c_attendance[🎨 attendance/]

    %% Styling
    style src fill:#2d3436,stroke:#b2bec3,stroke-width:2px,color:#fff
    style app fill:#0984e3,stroke:#74b9ff,stroke-width:2px,color:#fff
    style comp fill:#00b894,stroke:#55efc4,stroke-width:2px,color:#fff
```

---

## 📐 Assumptions & Scope

To deliver core end-to-end functionality within the 24-hour constraint, the following **intentional architectural trade-offs** were made:

- **Authentication:** Opted for a single JWT access token stored in an HTTP-only cookie instead of a dual access/refresh token architecture. This reduces complexity while still maintaining secure, stateless auth for the scope of this assignment.

- **Project Structure:** Used Next.js App Router colocation (grouping pages, components, and API routes by feature) instead of a strict Feature-Sliced Design. This maximized development velocity by keeping related code close together, reducing context-switching overhead.

- **Data Loading:** Dashboard tables fetch all records on the server side without pagination. This is acceptable for a demo dataset but would not scale to production volumes.

### Future Improvements

In a production environment, the following enhancements would be prioritized:

- **Robust Pagination** for all data tables (cursor-based with Prisma).
- **CSV Export** functionality for attendance sheets and student rosters.
- **Dual Token Auth** with refresh token rotation and token revocation.
- **Audit Logging** for all admin CRUD operations.
- **Unit & Integration Tests** with Jest and React Testing Library.

---

## 📄 License

This project was built as a take-home assignment and is not intended for production use.
