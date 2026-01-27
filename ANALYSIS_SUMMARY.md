# Portfolio - Frontend/Backend Integration Summary
## Updated: 2026-01-27

---

## ✅ COMPLETED CHANGES

### 1. Port Configuration
- **Backend**: Runs on port `4000` (updated in `package.json`)
- **Frontend**: Runs on port `3000` (Next.js default)

### 2. Environment Variables

**Frontend `.env`:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
RESEND_API_KEY=  # For contact form emails
```

**Backend `.env`:**
```env
MONGODB_URI=     # Your MongoDB connection string
JWT_SECRET=      # Secret for JWT authentication
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. API Integration

Created `frontend/src/lib/api.ts` with:
- `fetchProjects()` - Fetches all projects from `/api/projects`
- `fetchBlogs()` - Fetches all blogs from `/api/blogs`
- `fetchCertifications()` - Fetches all certifications from `/api/certifications`

### 4. Updated Components

| Component | Changes |
|-----------|---------|
| `components/sections/projects.tsx` | Now fetches from backend API with loading states |
| `app/projects/page.tsx` | Now fetches from backend API with image carousel |
| `app/blog/page.tsx` | Now fetches from backend API with blog cards |
| `next.config.mjs` | Added Cloudinary and other image domains |

---

## 🔗 FRONTEND-BACKEND API MAPPING

### Active APIs Used by Frontend:

| Frontend Component | Backend Endpoint | Purpose |
|-------------------|------------------|---------|
| Projects Section (Home) | `GET /api/projects` | Display projects grid |
| Projects Page | `GET /api/projects` | Display projects list |
| Blog Page | `GET /api/blogs` | Display blog posts |

### Backend APIs NOT Used (by design):

| Endpoint | Reason |
|----------|--------|
| `/api/guestbook` | User requested to skip |
| `/api/analytics` | User requested to skip |
| `/api/certifications` | No certifications page in frontend |
| `/api/auth/*` | Admin panel only |
| `/api/upload` | Admin panel only |

---

## 🚀 HOW TO RUN

### Terminal 1 - Backend (Port 4000):
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend (Port 3000):
```bash
cd frontend
npm install
npm run dev
```

### Access:
- **Frontend**: http://localhost:3000
- **Backend Admin**: http://localhost:4000/admin

---

## 📝 BACKEND DATA STRUCTURE

### Project Model:
```typescript
{
  title: string;           // Project name
  slug: string;            // URL-friendly identifier
  description: string;     // Short description
  projectMarkdown?: string; // Rich content (optional)
  tags: string[];          // Categories/technologies
  liveUrl?: string;        // Live demo link
  githubUrl?: string;      // GitHub repository
  images?: [{              // Screenshots
    url: string;
    caption?: string;
    showOnProject?: boolean;
  }];
  active: boolean;         // Show/hide
  featured: boolean;       // Highlight project
  priority: number;        // Display order (lower = first)
}
```

### Blog Model:
```typescript
{
  title: string;
  slug: string;
  description: string;
  tags: string[];
  link?: string;           // External blog link
  image?: string;          // Cover image
  active: boolean;
  featured: boolean;
}
```

---

## ⚠️ STILL NEED TO CONFIGURE

1. **MongoDB**: Add your `MONGODB_URI` to backend `.env`
2. **Cloudinary**: Add your Cloudinary credentials for image uploads
3. **Resend API**: Add `RESEND_API_KEY` for contact form emails
4. **Personal Info**: Update `config.ts` with your real:
   - Email address
   - Social media links
   - Resume link
   - Profile photo

---

## 📁 FILES MODIFIED/CREATED

### New Files:
- `frontend/src/lib/api.ts` - API service layer

### Modified Files:
- `frontend/.env` - Backend URL config
- `backend/.env` - Port and credentials
- `backend/package.json` - Port 4000 scripts
- `frontend/next.config.mjs` - Image domains
- `frontend/src/components/sections/projects.tsx` - API integration
- `frontend/src/app/projects/page.tsx` - API integration
- `frontend/src/app/blog/page.tsx` - API integration
- `frontend/src/types/index.ts` - Type definitions
