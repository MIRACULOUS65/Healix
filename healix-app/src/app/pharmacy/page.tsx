"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QrCode, Pill, ShieldCheck, List } from "lucide-react";
import { ScanPrescriptionQRModal } from "@/components/pharmacy/ScanPrescriptionQRModal";
import { MedicineDetailsModal } from "@/components/pharmacy/MedicineDetailsModal";
import { VerifyMedicineModal } from "@/components/patient/VerifyMedicineModal";
import { DispensingHistoryModal } from "@/components/pharmacy/DispensingHistoryModal";

const features = [
  {
    icon: QrCode,
    title: "Scan Prescription QR",
    description: "Scan the QR code from a doctor to view medicine instructions.",
    status: "ACTIVE",
    actionId: "scan_qr",
    buttonLabel: "Open Scanner",
  },
  {
    icon: Pill,
    title: "Medicine Details",
    description: "View structured medicine list and dosage instructions.",
    status: "ACTIVE",
    actionId: "medicine_details",
    buttonLabel: "View Inventory",
  },
  {
    icon: ShieldCheck,
    title: "Verify Medicine Authenticity",
    description: "Scan a medicine QR to check if it is genuine.",
    status: "ACTIVE",
    actionId: "verify",
    buttonLabel: "Scan & Verify",
  },
  {
    icon: List,
    title: "Dispensing History",
    description: "Track prescriptions you have dispensed.",
    status: "ACTIVE",
    actionId: "history",
    buttonLabel: "View History",
  },
];

export default function PharmacyDashboard() {
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isMedicineOpen, setIsMedicineOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleAction = (actionId: string) => {
    if (actionId === "scan_qr") setIsScanOpen(true);
    if (actionId === "medicine_details") setIsMedicineOpen(true);
    if (actionId === "verify") setIsVerifyOpen(true);
    if (actionId === "history") setIsHistoryOpen(true);
  };

  return (
    <DashboardLayout
      role="PHARMACY"
      title="Dispensing Desk"
      subtitle="Scan prescription QRs, view medicine details, and verify authenticity."
    >
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        {features.map(({ icon: Icon, title, description, status, actionId, buttonLabel }) => (
          <div key={title} className="bg-black p-8 flex flex-col gap-4">
            <div className={`w-10 h-10 border flex items-center justify-center ${
              status === "ACTIVE" ? "border-teal-500/20 bg-teal-500/10 text-teal-400" : "border-white/20 text-white/40"
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm mb-1">{title}</h2>
              <p className="text-xs text-white/40 leading-relaxed mb-3">{description}</p>
              
              <button
                onClick={() => handleAction(actionId)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-all font-mono uppercase tracking-wider"
              >
                <Icon className="w-3 h-3" />
                {buttonLabel}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ScanPrescriptionQRModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
      />

      <MedicineDetailsModal
        isOpen={isMedicineOpen}
        onClose={() => setIsMedicineOpen(false)}
      />

      <VerifyMedicineModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />

      <DispensingHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </DashboardLayout>
  );
}

