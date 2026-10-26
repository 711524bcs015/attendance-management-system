# MERN Student Attendance Management System

This workspace contains a full-stack MERN application for a Student Attendance Management System. It includes a Node/Express backend with MongoDB and a React (Vite) frontend. The project is scaffolded for development and demo purposes.

**Paths:**
- Backend: `backend/`
- Frontend: `frontend/`

**Quick Start (development)**

1. Ensure MongoDB is running locally or set `MONGO_URI` to your connection string.

2. Backend

```bash
cd c:/Users/Naveen N/Desktop/SAMS/attendance-management-system/backend
npm install
# create a .env from .env.example and set values
npm run seed    # seeds dev data (admin, faculty, students, subjects, attendance)
npm run dev
```

3. Frontend

```bash
cd c:/Users/Naveen N/Desktop/SAMS/attendance-management-system/frontend
npm install
npm run dev
```

Open the frontend (usually http://localhost:5173) and the backend (http://localhost:5000).

**Backend .env.example**

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/attendance_management
JWT_SECRET=your_secure_secret_key
CLIENT_URL=http://localhost:5173
```

**Seeded development credentials**

- Admin: `admin@example.com` / `Admin@123`
- Faculty sample: `alice@example.com` / `Faculty@123`, `bob@example.com` / `Faculty@123`
- Students: `student1@example.com` .. `student10@example.com` with password `Student@123`

These are development-only credentials. Change them before production.

**API Endpoints (summary)**

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

Students:
- GET    /api/students
- GET    /api/students/:id
- POST   /api/students
- PUT    /api/students/:id
- DELETE /api/students/:id

Faculty:
- GET    /api/faculty
- GET    /api/faculty/:id
- POST   /api/faculty
- PUT    /api/faculty/:id
- DELETE /api/faculty/:id

Subjects:
- GET    /api/subjects
- POST   /api/subjects
- PUT    /api/subjects/:id
- DELETE /api/subjects/:id

Departments:
- GET    /api/departments
- POST   /api/departments
- PUT    /api/departments/:id
- DELETE /api/departments/:id

Attendance:
- POST /api/attendance
- GET  /api/attendance
- GET  /api/attendance/student/:studentId
- GET  /api/attendance/subject/:subjectId
- PUT  /api/attendance/:id
- DELETE /api/attendance/:id

Dashboard:
- GET /api/dashboard/admin
- GET /api/dashboard/faculty
- GET /api/dashboard/student

All responses follow the shape:

```
{ success: boolean, message?: string, data?: any }
```

Authentication: provide `Authorization: Bearer <token>` header for protected endpoints.

**Frontend**

- Base API is configured in `frontend/src/services/api.js` (`http://localhost:5000/api`).
- Auth context is in `frontend/src/context/AuthContext.jsx`.
- Router is in `frontend/src/router/AppRouter.jsx` with protected role-based routes.

**Verification Checklist**

- [ ] MongoDB connection (backend logs show "MongoDB connected")
- [ ] Backend starts: `npm run dev` (no fatal errors)
- [ ] Seed script runs: `npm run seed` and creates admin/faculty/students
- [ ] Frontend starts: `npm run dev` and loads UI
- [ ] Login as admin returns JWT and user info
- [ ] Admin dashboard shows real counts from DB
- [ ] Create/edit/delete Students, Faculty, Subjects via API/UI
- [ ] Faculty can mark attendance; duplicate attendance prevented
- [ ] Student dashboard shows calculated attendance percentage
- [ ] Reports can export CSV with real data
- [ ] Protected routes reject invalid/absent tokens (401/403)

**Notes & Next Steps**

- UI: dashboards use basic Recharts placeholders currently; more styling and dark mode can be added.
- Validation: controllers include basic checks; could be upgraded with `express-validator` rules per-route.
- File uploads (profile images) can be enabled via Multer endpoints and frontend upload forms.
- PDF export: implemented client-side CSV download; for PDF consider `jsPDF` or server-side generation with `pdfkit`.
- Production: secure JWT secret, enable HTTPS, set proper CORS origins, and use environment-specific configs.

If you want, I can now:
- Run more UI polish (charts, responsive tweaks)
- Add input validation and better error messages
- Implement profile image uploads and storage
- Add server-side PDF export

Tell me which of the above you'd like next, or run the verification steps and share any errors you encounter. 
