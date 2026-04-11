# HELIX – Privacy-First Healthcare Ecosystem

HELIX is a **role-based healthcare platform** designed to give patients full control over their medical data, accelerate doctor workflows with AI summaries, and ensure pharmacy and medicine supply-chain integrity through QR codes and blockchain verification. Built with **Next.js** (App Router), **TypeScript**, and **Tailwind CSS**, HELIX unifies frontend and backend in a modular, full-stack architecture optimized for fast development. The system supports **five user roles** (Patient, Doctor, Hospital, Pharmacy, Vendor), each with a dedicated dashboard and permissions. In HELIX, patients upload their documents and explicitly grant access to hospitals; doctors see only AI-generated summaries; pharmacies scan secure QR prescriptions; and vendors register medicines on-chain for authenticity checks. This README summarizes the architecture, tech stack, role flows, and development setup of HELIX.

## Key Features & Pillars

- **Patient-Centric Data Control:** Patients upload medical files, set per-document access (hospital or private), and receive notifications whenever a hospital views their documents. Patients can also scan medicine QR codes to verify authenticity against blockchain-registered records.
- **AI-Enhanced Doctor Workflow:** Doctors never see raw patient files. Instead, they request AI-generated summaries of a patient’s history to make fast, informed decisions. Doctors create structured prescriptions (typed or uploaded) that generate secure QR codes for the patient.
- **Hospital Access & Audit:** Hospitals search patients by ID and access *only* the documents that the patient has explicitly allowed. Every access is logged and notifies the patient, providing a transparent audit trail.
- **Pharmacy QR Workflow:** Pharmacists scan the patient’s Prescription QR code to instantly retrieve medicine names, dosages, and instructions. Pharmacies can also scan medicine batch QR codes to verify authenticity from the on-chain registry.
- **Vendor Medicine Registration:** Vendors register medicine batches by submitting batch details. The system generates a cryptographic hash for each batch and stores it on Algorand blockchain (via Pera Wallet). Each batch gets a unique QR code for later verification.

These core pillars ensure **privacy**, **security**, and **trust** across the healthcare workflow, from patient data to prescription dispensing and medicine verification.

## Tech Stack

- **Frontend & Backend:** Next.js 16 (App Router), React, TypeScript  
- **Styling:** Tailwind CSS, shadcn/ui (customized to monochrome)  
- **Authentication:** Better Auth (session-based); **One Email = One Role**; role stored in database  
- **Database:** Supabase (PostgreSQL) with Prisma ORM for schema/migrations  
- **File Storage:** Cloudinary (for medical documents and images)  
- **AI Service:** Separate microservice (Python/Flask) for NLP summarization (handled by teammate)  
- **Blockchain:** Algorand (via Algorand SDK & Pera Wallet) for medicine authenticity hashing (initially mocked in DB, later on-chain)  
- **QR Handling:** `qrcode` generation for prescriptions and medicine; `html5-qrcode` (or similar) for scanning  
- **UI Interactions:** Framer Motion, GSAP + ScrollTrigger, Lenis for smooth animations and scroll effects (optional advanced enhancements)  

All core logic (authentication, API routes, role checks) resides within the Next.js app for simplicity and speed. The architecture avoids custom auth/JWT handling, microservices (aside from AI), and real-time sockets to streamline development.

## Project Structure

```
helix/
├── frontend/          # Next.js application (UI + API routes)
│   ├── app/           # App Router pages and layouts
│   │   ├── (auth)/    # Authentication flow (login, role select)
│   │   ├── patient/
│   │   ├── doctor/
│   │   ├── hospital/
│   │   ├── pharmacy/
│   │   ├── vendor/
│   │   ├── verify/    # Medicine verification page ([hash] route)
│   │   └── api/       # Next.js API routes
│   ├── components/    # Reusable UI components (using shadcn/ui)
│   ├── lib/           # Utility functions (e.g., auth helpers, API clients)
│   ├── services/      # Services (e.g., Cloudinary upload, Algorand interactions)
│   └── types/         # TypeScript types and interfaces
│
├── backend/           # (Optional) Separate API services, if needed
├── blockchain/        # Hash & verification logic for medicines
│   ├── generateHash.ts
│   ├── storeHash.ts
│   └── verifyHash.ts
├── aiml/              # AI/ML service (separate project handled by teammate)
└── docs/ARCHITECTURE.md
```

- All backend logic (auth, data access, role checks) is implemented as Next.js **API routes** under `frontend/app/api/`. For example:
  - `api/auth/*` for authentication callbacks and role management
  - `api/patient/*`, `api/doctor/*`, `api/hospital/*`, etc., for role-specific endpoints
  - `api/verify/*` for prescription and medicine verification endpoints

- The **frontend** uses Next.js App Router. Key page directories correspond to roles: `/app/patient`, `/app/doctor`, etc. Each role’s dashboard and pages live under its folder.

- **Middleware** (in `middleware.ts`) enforces session-based role access. For example:
  ```ts
  // Example: protect doctor routes
  if (session.user.role !== "DOCTOR") {
    redirect("/unauthorized");
  }
  ```

- The **AI/ML service** is decoupled. HELIX sends document metadata to the AI service (via an API call) and later retrieves the generated summary to display in the doctor’s dashboard.

- **Blockchain module** is initially stubbed: medicine hashes are stored in the database. Later, you can integrate with Algorand to publish hashes on-chain using Algorand SDK and Pera Wallet for signing.

## Authentication & Roles

- **Better Auth** provides email/password login. After login, users select their role (Patient/Doctor/Hospital/Pharmacy/Vendor). The chosen role is **locked to the email**.
- Roles are stored in the database (e.g., `users` table has a `role` column).
- **Session-based auth**: Upon login, session cookies keep the user authenticated. No manual JWT management is needed.
- **One email = one role**: Users cannot switch roles after signing up. The role is used in middleware to guard routes.
- **Role-based redirects**: After login, users are redirected to their respective dashboard based on role.
- **Permissions**: Every API route checks the user’s session and role. For instance, only `role: "HOSPITAL"` can access hospital endpoints. This ensures security on the server side.

## Roles & Workflows

HELIX defines **five roles**, each with a distinct dashboard and capabilities:

- **Patient**  
  - **Actions:** Upload medical documents (lab reports, prescriptions, insurance papers, etc.), set document permissions (`access_hospital` flag), view notifications (when hospitals access shared docs), and verify medicines by scanning QR codes.  
  - **Data:** Sees personal document list with access badges (e.g., “Private” or “Shared with Hospital”). Manages file uploads via Cloudinary. Controls sharing via toggles.

- **Doctor**  
  - **Actions:** Search for a patient by ID (to pull up history), view AI-generated summaries of past documents/prescriptions, and create new prescriptions (by typing or uploading an image). When creating a prescription, doctor generates a secure QR code for the patient.  
  - **Data:** Sees summary “cheat sheets” (clean text) of patient history. Does *not* see raw patient files. Creates `Prescription` records in DB, which include structured medicine details.

- **Hospital**  
  - **Actions:** Search for patients by ID, view only the documents that the patient has marked as hospital-accessible, and open/view those documents. Each view triggers a log event and a notification to the patient.  
  - **Data:** Sees a filtered document list per patient. Cannot access private docs or any doctor notes. All accesses are logged (with timestamp, document ID).

- **Pharmacy**  
  - **Actions:** Scan a patient’s **Prescription QR** (e.g., via device camera or image upload) to retrieve the prescription details (medicine names, dosages, instructions). Scan **Medicine QR** to verify authenticity.  
  - **Data:** Receives prescription details from the API (no patient history). Medicine verification shows vendor/batch info from the blockchain/registry.

- **Vendor**  
  - **Actions:** Register new medicine batches by entering details (name, batch number, manufacturer, expiry, quantity, etc.). The system generates a cryptographic hash of the batch data and stores it in the verification layer. A QR code for the batch is created for distribution.  
  - **Data:** Only sees vendor’s own medicine records. Each registered batch has on-chain hash (or DB record) and a QR that links to verification.

## Database Schema (Simplified)

The core database tables (via Supabase/Postgres) include:

- **Users:** `id, email, role` (one of Patient, Doctor, Hospital, Pharmacy, Vendor)  
- **Documents:** `id, patient_id, file_url, type, access_hospital (boolean), created_at` – Patient-uploaded medical files.  
- **AI_Summaries:** `id, patient_id, document_id, summary_text, created_at` – Summaries generated by the AI service.  
- **Prescriptions:** `id, patient_id, doctor_id, medicines_json, created_at` – Structured prescription data (patient ID, doctor ID, array of medicines with dose/instructions).  
- **Notifications:** `id, patient_id, message, read (bool), created_at` – Events for patient (e.g., “Hospital accessed your lab report on 2023-03-10”).  
- **AccessLogs:** `id, patient_id, hospital_id, document_id, accessed_at` – Audit logs for hospital document views.  
- **Medicine_Verification:** `hash, vendor_id, medicine_name, batch, expiry, timestamp, status` – Authenticity records (hashes, batch info, registration time, etc.).

Supabase/Prisma migrations should set up these tables with appropriate foreign keys and indexes. The `access_hospital` flag on `Documents` controls if hospitals can see a file.

## API Routes

All API endpoints live under `frontend/app/api/`. Key routes include:

- **Authentication:** `/api/auth/*` – Sign up, login, session callbacks (Better Auth integration).  
- **Patient:** `/api/patient/uploads` (GET/POST patient documents), `/api/patient/notifications` (GET notifications), `/api/patient/verify` (POST to verify medicine QR).  
- **Doctor:** `/api/doctor/summaries` (POST patient ID to fetch AI summaries), `/api/doctor/prescriptions` (GET/POST prescriptions).  
- **Hospital:** `/api/hospital/patients/:id/documents` (GET allowed docs by patient ID), `/api/hospital/access` (POST to log/view access).  
- **Pharmacy:** `/api/pharmacy/prescription/:id` (GET prescription details by QR), `/api/pharmacy/verify/:hash` (GET medicine authenticity by QR hash).  
- **Vendor:** `/api/vendor/register` (POST new medicine batch, generate hash/QR).  
- **Verify:** `/api/verify/:hash` – Public endpoint to verify medicine authenticity by hash.

Each route checks the authenticated user’s role. For example, only requests with `session.user.role === "HOSPITAL"` can query `/api/hospital/*`. This enforcement is done via Next.js middleware or checks at the top of each handler.

## QR & Blockchain Integration

- **Prescription QR:** When a doctor creates a prescription, the system assigns it a unique ID and generates a QR code (embedding the endpoint `/api/pharmacy/prescription/:id`). The QR is shown to the patient on-screen.
- **Medicine QR:** Each medicine batch registered by a Vendor results in a QR code (embedding a hash or URL like `/api/verify/:hash`). This QR goes on the packaging.
- **Blockchain (Algorand):** Initially, a vendor’s medicine hash is stored in the database. For production, we integrate with Algorand:
  - Vendors connect via Pera Wallet in the browser (Algorand Wallet SDK).
  - When registering a batch, compute a SHA-256 hash of the batch data.
  - Use Algorand SDK (`algosdk`) to send a transaction (no-token transfer) that records the hash as metadata or to a smart contract.
  - On verification, the backend checks Algorand ledger to confirm the hash exists and matches vendor.
  - Pharmacists or patients scan the QR → backend reads the hash → queries the blockchain → returns authenticity status (`Genuine`, `Not Found`, `Expired`, etc.) and vendor info.
- **Hackathon Strategy:** Start with hash storage in the database (quick mock). Once working, connect the real blockchain: use Algorand for immutable storage of hashes.

## AI/ML Integration

- The AI service (not part of this repo) handles OCR and summarization of patient documents. It runs separately (e.g., a Python/Flask microservice).
- **Workflow:** Patient uploads a document → file URL is saved in DB → optionally, the app sends a request to AI service with the URL → AI returns a text summary → app stores the summary in `AI_Summaries` table.
- **Doctor view:** The doctor requests summaries by patient ID. The app retrieves pre-generated summaries from the DB. There is no real-time processing on the UI; the doctor sees only cached summary text.
- Since the AI is asynchronous, prescription creation or other flows do **not** block on AI processing. The UI can show “Summary processing” if needed, or simply not show a summary until ready.

## UI/UX & Design Notes

- **Monochrome Brutalist Style:** Black-and-white design only (no colors except grayscale).  
- **Clean, clinical aesthetic:** Heavy use of whitespace, strong borders, clear typography (fonts like Inter or SF Pro).  
- **Component-driven:** Use [shadcn/ui](https://ui.shadcn.com/) components (Button, Card, Table, etc.), restyled for dark themes with white text and subtle grayscale borders.  
- **Navigation:** Role-based dashboards with side nav or top nav. Clear labels like “Patient Dashboard” etc.  
- **Feedback:** Use TailwindCSS for hover/focus states (e.g., white-on-black inversion, subtle opacity shifts).  
- **Animations:** Light use of Framer Motion or GSAP for page transitions, card reveals, ensuring a smooth, premium feel. Avoid any flashy or colorful effects.  
- **Responsive:** Layout stacks on mobile (e.g., sidebar becomes a hamburger menu, cards stack vertically). Ensure touch targets and focus states for accessibility.  
- **Accessibility:** High contrast, semantic HTML, keyboard navigation, aria-labels on interactive elements. Healthcare data demands strict accessibility.  

These guidelines ensure a **trustworthy**, **medical-grade** interface. While not directly part of the code, they inform the CSS and component library customizations.

## Setup and Development

1. **Prerequisites:** Node.js (v18+), npm/yarn, Supabase account (or local Postgres), Cloudinary account.  
2. **Clone the Repo:**  
   ```bash
   git clone https://github.com/your-org/helix.git
   cd helix/frontend
   ```
3. **Environment Variables:** Create a `.env.local` file in `frontend/` with keys for:
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or use Supabase CLI with `supabase.toml`)
   - `DATABASE_URL` (if using Prisma migrations with local Postgres)
   - `CLOUDINARY_URL` (Cloudinary config URL or separate CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, etc.)
   - `BETTER_AUTH_*` (if using Better Auth; e.g. `BETTER_AUTH_API_URL`, `BETTER_AUTH_PROJECT_ID`)
   - `ALGOD_API_URL` & `ALGOD_API_KEY` (if connecting to Algorand testnet or mainnet; may not be needed for initial mock)
   - Any other keys (e.g., email SMTP for auth, but Better Auth may handle email out-of-band).
4. **Install Dependencies:**  
   ```bash
   cd frontend
   npm install
   ```
5. **Initialize Database:**  
   - With Supabase: set up project and run SQL migrations to create tables (or use Prisma if configured).  
   - Example Prisma workflow:  
     ```bash
     npx prisma migrate dev --name init
     npx prisma db push
     ```
6. **Run Dev Servers:**  
   - **Frontend (Next.js):**  
     ```bash
     npm run dev
     ```  
     Opens at http://localhost:3000 by default.  
   - **AI Service (optional):** Ensure the separate Python AI service is running on its designated port and accessible via the API.
   - **Algorand (optional):** If testing on Algorand, ensure the indexer/client is set up or use Algod API endpoints.

7. **Role Creation:** On first sign-up, a user must choose a role. Ensure that the roles (PATIENT, DOCTOR, HOSPITAL, PHARMACY, VENDOR) are consistent strings in code and database. The signup flow should prevent using an existing email with a different role.

8. **Testing:** Write API and component tests to verify role protections. For example, attempt to access `/patient/upload` as a non-patient user and expect a redirect. Test QR scanning functionality with sample QR codes.

## Running & Deploying

- **Local Testing:** Use browser dev tools to simulate each role. For QR scanning, use test images or devices.
- **Deployment:** 
  - The Next.js app can be deployed on platforms like Vercel or Netlify. Ensure environment variables are set in the deployment environment.
  - If using Supabase, deploy the database there. Cloudinary is cloud-hosted.
  - Algorand integration: deploy to Algorand TestNet/MainNet. The Pera Wallet Connect requires an HTTPS context; ensure the deployed app has an SSL certificate.
- **Blockchain Setup:** For production, create Algorand smart contract or asset if needed. Update the `blockchain/` scripts with real Algorand logic.
- **AI Service:** Deploy separately (e.g., Heroku or any cloud with Python). Update the Next.js API to call the hosted AI endpoint.

## Security & Permissions

- **Middleware Guards:** All protected pages and API routes use Next.js middleware to check `session.user.role`. Example guard in `middleware.ts`:
  ```ts
  import { withAuth } from "next-auth/middleware";

  export default withAuth(
    function middleware(req) {
      const { role } = req.nextauth.token;
      // Redirect logic based on route and role
    },
    {
      callbacks: {
        authorized: ({ token }) => {
          // Allow if token exists and user has a role
          return !!token?.role;
        },
      },
    }
  );
  ```
- **Server-Side Checks:** Never trust frontend input. On each API endpoint, verify the session role and associated IDs (e.g., a hospital can only query documents if `session.user.hospitalId` matches the patient’s permission).
- **Input Validation:** Sanitize all inputs (document uploads, text fields). Use TypeScript types and Zod or similar for API payload validation.
- **Encryption:** All data in transit should use HTTPS (especially QR scanning results). Store sensitive data (like document URLs) securely.
- **Access Logging:** Store logs of who accessed what (especially hospital/doc viewing events). Notify patients of each access.
- **Rate Limiting:** Consider basic rate limiting on APIs to prevent abuse (especially for login and QR verification endpoints).
- **Environment Secrets:** Do not expose any API keys or secrets in the frontend. All keys for Algorand, Supabase, etc., should be loaded from server-side environment variables.

## Development Roadmap

This project was built as a hackathon over four days. Key milestones were:

1. **Day 1 – Authentication & Role System:** Set up Better Auth, session management, and middleware. Build the login and role selection flow. Create basic dashboards stubs for each role.
2. **Day 2 – Patient & Doctor Core Flows:** Implement Patient document upload (with Cloudinary) and hospital access toggle. Implement Doctor prescription creation (typed form & image upload) and QR generation.
3. **Day 3 – Hospital & Pharmacy:** Build Hospital’s patient search and document access pages with logging/notifications. Build Pharmacy’s QR scanning interfaces for prescriptions and medicine verification.
4. **Day 4 – Vendor & Verification:** Build Vendor’s medicine registration and QR generation (mock blockchain). Create the public Verification page (`/verify/[hash]`) that displays authenticity results. Polish UI/UX and fix bugs.

Future work includes integrating the real Algorand blockchain, refining AI summary processing, and adding real-time notifications or chat between roles.

## Summary

HELIX is a **next-generation healthcare OS** connecting patients, doctors, hospitals, pharmacies, and vendors in a secure, modular system. It enforces **patient data ownership**, enables **AI-assisted insights**, and provides **cryptographic trust** in medicine supply. The system’s architecture favors speed and simplicity (Next.js fullstack, session auth, modular folders) while ensuring strict role-based access control and end-to-end traceability. All code is written in TypeScript with clear separation of concerns, ready for scaling beyond the hackathon proof-of-concept.

Feel free to explore the code and adapt the architecture for your own healthcare or data-sharing projects. Questions or contributions are welcome – just make sure to maintain the privacy-first, multi-role principles that make HELIX unique.

