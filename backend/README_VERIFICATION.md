Backend verification steps

Prerequisites
- Node 18+
- MongoDB (local or connection string)
- AWS creds if testing S3 uploads (set STORAGE_MODE=s3 and AWS_* env vars)

Install and run locally

```bash
cd backend
npm ci
npm run dev
```

Seed DB (creates `admin@example.com` / `Admin@123`)

```bash
npm run seed
```

Run smoke script (server must be running at :5000)

```bash
npm run smoke
```

Run tests (ensure `MONGO_URI` points to a test DB):

```bash
# set MONGO_URI in env before running
npm test -- --runInBand
```

S3 Upload test
- Set `STORAGE_MODE=s3`, `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Use route `POST /api/upload/s3` with `file` form field (requires auth)

If errors occur, copy the terminal output here and I'll help diagnose and patch.
