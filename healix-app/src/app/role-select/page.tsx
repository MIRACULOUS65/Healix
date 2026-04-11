"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  User,
  Stethoscope,
  Building2,
  Pill,
  Package,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import type { Role } from "@/types";
import Link from "next/link";

const ROLES: {
  id: Role;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  canDo: string[];
}[] = [
  {
    id: "PATIENT",
    icon: User,
    title: "Patient",
    subtitle: "Medical Data Owner",
    description:
      "Upload and manage your medical documents. Set per-file hospital access. Verify medicine authenticity.",
    canDo: [
      "Upload medical documents",
      "Control hospital access per file",
      "Receive access notifications",
      "Verify medicine authenticity",
    ],
  },
  {
    id: "DOCTOR",
    icon: Stethoscope,
    title: "Doctor",
    subtitle: "Prescription Authority",
    description:
      "Create structured prescriptions. Review AI-generated patient summaries. Generate prescription QR codes.",
    canDo: [
      "Create typed prescriptions",
      "Upload prescription images",
      "View AI patient summaries",
      "Generate prescription QRs",
    ],
  },
  {
    id: "HOSPITAL",
    icon: Building2,
    title: "Hospital",
    subtitle: "Controlled Access",
    description:
      "Search patients by ID and view only the documents they have explicitly shared with you.",
    canDo: [
      "Search patients by ID",
      "View patient-approved documents",
      "Trigger access notifications",
      "Review access audit trail",
    ],
  },
  {
    id: "PHARMACY",
    icon: Pill,
    title: "Pharmacy",
    subtitle: "Prescription Desk",
    description:
      "Scan prescription QR codes to view medicine instructions. Verify medicine batch authenticity.",
    canDo: [
      "Scan prescription QR codes",
      "View medicine instructions",
      "Verify medicine authenticity",
      "Check vendor batch records",
    ],
  },
  {
    id: "VENDOR",
    icon: Package,
    title: "Vendor",
    subtitle: "Supply Chain Registry",
    description:
      "Register medicine batches and generate verification QR codes backed by cryptographic hashes.",
    canDo: [
      "Register medicine batches",
      "Generate batch hashes",
      "Create verification QRs",
      "Manage authenticity records",
    ],
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);

  const handleContinue = () => {
    if (selected === "HOSPITAL") {
      router.push("/role-select/hospital");
    } else if (selected) {
      router.push(`/login?role=${selected}`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          HEALIX
        </Link>
        <p className="text-xs text-white/30 tracking-widest uppercase">
          Role Selection
        </p>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs text-white/40 tracking-widest uppercase mb-3">
            Step 1 of 2
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-3">
            Select your access role
          </h1>
          <p className="text-white/40 text-sm max-w-md">
            One email is bound to exactly one role. Your role determines
            everything you can see and do within Healix.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-5 gap-px bg-white/10 mb-8">
          {ROLES.map(({ id, icon: Icon, title, subtitle, description, canDo }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`bg-black p-6 text-left transition-all duration-150 group ${
                selected === id
                  ? "ring-1 ring-inset ring-white"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center border mb-5 transition-colors ${
                  selected === id
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/40 group-hover:border-white/40"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="font-bold text-sm mb-0.5">{title}</p>
              <p className="text-xs text-white/40 mb-4">{subtitle}</p>
              <p className="text-xs text-white/30 leading-relaxed mb-4">
                {description}
              </p>
              <ul className="space-y-1.5">
                {canDo.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-white/30">
                    <span className={`mt-0.5 w-1 h-1 rounded-full flex-shrink-0 ${selected === id ? "bg-white" : "bg-white/20"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Continue */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/30">
            {selected
              ? `You selected: ${ROLES.find((r) => r.id === selected)?.title}`
              : "Select a role to continue"}
          </p>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
          >
            Continue to Login
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
