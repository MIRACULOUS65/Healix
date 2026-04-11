"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Upload, Brain, QrCode, Pill, History } from "lucide-react";
import { PrescriptionModal } from "@/components/hospital/PrescriptionModal";
import { PreviousPrescriptionsModal } from "@/components/doctor/PreviousPrescriptionsModal";
import { PrescriptionQRModal } from "@/components/doctor/PrescriptionQRModal";

const features = [
  {
    icon: Pill,
    title: "Type Prescription",
    description: "Create a structured prescription with medicine fields.",
    status: "ACTIVE",
    actionId: "prescribe",
    buttonLabel: "Write Prescription",
  },
  {
    icon: History,
    title: "Previous Prescriptions",
    description: "Review all prescriptions you have previously issued to patients.",
    status: "ACTIVE",
    actionId: "previous",
    buttonLabel: "View History",
  },
  {
    icon: Brain,
    title: "AI Patient Summaries",
    description: "Look up AI-generated summaries by patient ID.",
    status: "Coming soon",
    actionId: "",
    buttonLabel: "",
  },
  {
    icon: QrCode,
    title: "Prescription QR",
    description: "Generate scannable QR codes for pharmacies to decode your prescriptions.",
    status: "ACTIVE",
    actionId: "qr",
    buttonLabel: "Generate QR",
  },
];

export default function DoctorDashboard() {
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);
  const [isPreviousOpen, setIsPreviousOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  const handleAction = (actionId: string) => {
    if (actionId === "prescribe") setIsPrescribeOpen(true);
    if (actionId === "previous") setIsPreviousOpen(true);
    if (actionId === "qr") setIsQROpen(true);
  };

  return (
    <DashboardLayout
      role="DOCTOR"
      title="Clinical Command Surface"
      subtitle="Create prescriptions, review AI summaries, and generate prescription QRs."
    >
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        {features.map(({ icon: Icon, title, description, status, actionId, buttonLabel }) => (
          <div key={title} className="bg-black p-8 flex flex-col gap-4">
            <div className={`w-10 h-10 border flex items-center justify-center ${
              status === "ACTIVE" ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400" : "border-white/20 text-white/40"
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm mb-1">{title}</h2>
              <p className="text-xs text-white/40 leading-relaxed mb-3">{description}</p>
              
              {status === "ACTIVE" ? (
                <button
                  onClick={() => handleAction(actionId)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all font-mono uppercase tracking-wider"
                >
                  <Icon className="w-3 h-3" />
                  {buttonLabel}
                </button>
              ) : (
                <span className="text-xs text-white/25 border border-white/10 px-2 py-0.5">
                  {status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <PrescriptionModal
        isOpen={isPrescribeOpen}
        onClose={() => setIsPrescribeOpen(false)}
      />

      <PreviousPrescriptionsModal
        isOpen={isPreviousOpen}
        onClose={() => setIsPreviousOpen(false)}
      />

      <PrescriptionQRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />
    </DashboardLayout>
  );
}
