"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search, FileText, History, ShieldCheck, User, Pill } from "lucide-react";
import { SearchPatientModal } from "@/components/hospital/SearchPatientModal";
import { AccessLogsModal } from "@/components/hospital/AccessLogsModal";
import { PrescriptionModal } from "@/components/hospital/PrescriptionModal";
import { useState } from "react";

const features = [
  {
    icon: Search,
    title: "Search Patient by ID",
    description: "Find a patient and view their shared medical records.",
    status: "ACTIVE",
    actionId: "search_patient"
  },
  {
    icon: History,
    title: "Access Logs",
    description: "Review your document access history for audit purposes.",
    status: "ACTIVE",
    actionId: "access_logs"
  },
  {
    icon: Pill,
    title: "Type Prescription",
    description: "Create a structured prescription with medicine fields.",
    status: "ACTIVE",
    actionId: "prescribe"
  }
];
export default function HospitalDoctorDashboard() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);

  return (
    <DashboardLayout
      role="HOSPITAL"
      title="Hospital Doctor Dashboard"
      subtitle="Search patients and evaluate their permitted clinical history."
    >
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        {features.map(({ icon: Icon, title, description, status, actionId }) => (
          <div key={title} className="bg-black p-8 flex flex-col gap-4">
            <div className={`w-10 h-10 border flex items-center justify-center ${
              status === "ACTIVE" ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400" : "border-white/20 text-white/40"
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm mb-1">{title}</h2>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{description}</p>
              
              {status === "ACTIVE" ? (
                <button
                  onClick={() => {
                    if (actionId === "search_patient") setIsSearchOpen(true);
                    if (actionId === "access_logs") setIsLogsOpen(true);
                    if (actionId === "prescribe") setIsPrescribeOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all font-mono uppercase tracking-wider"
                >
                  <Icon className="w-3 h-3" />
                  {actionId === "search_patient" ? "Initiate Search" : actionId === "access_logs" ? "View Logs" : "Write Prescription"}
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

      <SearchPatientModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AccessLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
      />

      <PrescriptionModal
        isOpen={isPrescribeOpen}
        onClose={() => setIsPrescribeOpen(false)}
      />
    </DashboardLayout>
  );
}
