import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ArrowRight, Shield, Brain, QrCode, Building2, User, Stethoscope, Pill, Package } from "lucide-react";

// (Keep existing roles and pillars arrays here, let's just make sure to include them)
const roles = [
  {
    icon: User,
    title: "Patient",
    description: "Own and control your medical documents. Decide who sees what.",
  },
  {
    icon: Stethoscope,
    title: "Doctor",
    description: "Create prescriptions. Review AI-generated patient summaries.",
  },
  {
    icon: Building2,
    title: "Hospital",
    description: "Access only patient-approved records. Every access is logged.",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Scan prescription QRs. Verify medicine authenticity.",
  },
  {
    icon: Package,
    title: "Vendor",
    description: "Register medicine batches. Generate blockchain-backed QR codes.",
  },
];

const pillars = [
  {
    number: "01",
    title: "Patient Data Control",
    description:
      "Patients upload documents and set per-file access permissions. The hospital sees only what the patient allows.",
  },
  {
    number: "02",
    title: "Doctor Prescription Intelligence",
    description:
      "Doctors work with AI summaries—not raw records. They create structured prescriptions and generate QR codes.",
  },
  {
    number: "03",
    title: "Hospital Controlled Access",
    description:
      "Hospitals search patients by ID and view only permitted documents. Every access is logged and the patient is notified.",
  },
  {
    number: "04",
    title: "Pharmacy + Vendor Trust Layer",
    description:
      "Pharmacies scan prescription QRs to dispense medicine. Vendors register batches with authenticity hashes for verification.",
  },
];

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const isLoggedIn = !!session;
  const ctaLink = isLoggedIn ? "/dashboard" : "/role-select";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-xl font-bold tracking-tight">HEALIX</span>
        <Link
          href={ctaLink}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          {isLoggedIn ? "Dashboard →" : "Get Started →"}
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8 tracking-widest uppercase">
            <Shield className="w-3 h-3" />
            Privacy-First Healthcare Platform
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Medical data.
            <br />
            <span className="text-white/30">Under your control.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
            Healix connects patients, doctors, hospitals, pharmacies, and
            vendors in one secure ecosystem. Patients own the data. Doctors read
            summaries. Hospitals access only what is permitted. Medicine
            authenticity is verifiable.
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-semibold hover:bg-white/90 transition-colors"
          >
            {isLoggedIn ? "Go to Dashboard" : "Select Your Role"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* 4 Pillars */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="text-xs text-white/40 tracking-widest uppercase mb-3">
            System Architecture
          </p>
          <h2 className="text-3xl font-black tracking-tight">4 Core Pillars</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {pillars.map((pillar) => (
            <div key={pillar.number} className="bg-black p-8">
              <p className="text-5xl font-black text-white/10 mb-4 tracking-tighter">
                {pillar.number}
              </p>
              <h3 className="text-lg font-bold mb-3">{pillar.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="mb-12">
          <p className="text-xs text-white/40 tracking-widest uppercase mb-3">
            Access Layers
          </p>
          <h2 className="text-3xl font-black tracking-tight">5 Roles</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-px bg-white/10">
          {roles.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-black p-6 flex flex-col gap-4">
              <Icon className="w-5 h-5 text-white/40" />
              <div>
                <h3 className="font-bold text-sm mb-1">{title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm hover:border-white/60 transition-colors"
          >
            {isLoggedIn ? "Access Dashboard" : "Enter as your role"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              label: "Patient-Owned Data",
              text: "Every document access requires explicit patient permission.",
            },
            {
              icon: Brain,
              label: "AI Summaries Only",
              text: "Doctors never access raw records — only structured summaries.",
            },
            {
              icon: QrCode,
              label: "QR + Hash Verification",
              text: "Prescriptions and medicine batches are verified via QR and cryptographic hashes.",
            },
          ].map(({ icon: Icon, label, text }) => (
            <div key={label} className="flex gap-4">
              <Icon className="w-5 h-5 text-white/30 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">{label}</p>
                <p className="text-xs text-white/40 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between text-xs text-white/30">
        <span>HEALIX</span>
        <span>Privacy-First Healthcare Ecosystem</span>
      </footer>
    </main>
  );
}
