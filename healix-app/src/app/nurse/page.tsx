"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ScanFace, Focus } from "lucide-react";
import { FaceMatchModal } from "@/components/nurse/FaceMatchModal";

const features = [
  {
    icon: ScanFace || Focus,
    title: "Patient Face ID Match",
    description: "Instantly scan to cross-reference an unconscious or unresponsive patient against our cryptographically secure Patient Database using local ML deep-learning models.",
    status: "Active",
    action: "open_modal",
  },
];

export default function HospitalNurseDashboard() {
  const [isFaceMatchOpen, setIsFaceMatchOpen] = useState(false);

  return (
    <DashboardLayout
      role="HOSPITAL"
      title="Hospital Nurse Dashboard"
      subtitle="Emergency Biometric Patient Identification & Care Operations"
    >
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        {features.map(({ icon: Icon, title, description, status, action }) => (
          <button
            type="button"
            key={title}
            onClick={() => action === "open_modal" && setIsFaceMatchOpen(true)}
            className="bg-black p-8 flex flex-col gap-4 text-left hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
              <Icon className="w-4 h-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <h2 className="font-bold text-sm mb-1 group-hover:text-emerald-400 transition-colors">{title}</h2>
              <p className="text-xs text-white/40 leading-relaxed mb-4 group-hover:text-white/60 transition-colors">{description}</p>
              
              <span className={`text-xs px-2 py-0.5 border ${
                status === "Active" 
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" 
                  : "text-white/25 border-white/10"
              }`}>
                {status}
              </span>
            </div>
          </button>
        ))}
      </div>

      <FaceMatchModal 
        isOpen={isFaceMatchOpen}
        onClose={() => setIsFaceMatchOpen(false)}
      />
    </DashboardLayout>
  );
}
