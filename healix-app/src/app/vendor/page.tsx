"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PackagePlus, Hash, QrCode, Archive } from "lucide-react";
import { RegisterMedicineModal } from "@/components/vendor/RegisterMedicineModal";
import { RegisteredMedicinesModal } from "@/components/vendor/RegisteredMedicinesModal";
import { AuthenticityRegistryModal } from "@/components/vendor/AuthenticityRegistryModal";
import { CreateVerificationQRModal } from "@/components/vendor/CreateVerificationQRModal";

interface RegisteredMedicine {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  hash: string;
  registeredAt: string;
  status: string;
}

export default function VendorDashboard() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [hashModalOpen, setHashModalOpen] = useState(false);
  const [registryModalOpen, setRegistryModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [medicines, setMedicines] = useState<RegisteredMedicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch medicines when the Generate Hash modal is opening or after successful registration
  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/my-medicines");
      if (!res.ok) throw new Error("Failed to fetch medicines");
      const data = await res.json();
      if (data.success) {
        setMedicines(data.medicines);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleRegisterSuccess = () => {
    fetchMedicines();
  };

  return (
    <DashboardLayout
      role="VENDOR"
      title="Supply Chain Registry"
      subtitle="Register medicine batches, generate verification QRs, and manage authenticity records."
    >
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        
        {/* Register Medicine - ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
            <PackagePlus className="w-4 h-4 text-[#FFF04D]" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Register Medicine</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Add a new medicine batch with manufacturer, expiry, and quantity details on Algorand.
            </p>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#FFF04D] text-black hover:bg-[#e6d845] transition-all"
            >
              <PackagePlus className="w-3 h-3" />
              Register Medicine
            </button>
          </div>
        </div>

        {/* Generate Hash - ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
            <Hash className="w-4 h-4 text-[#FFF04D]" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Generate Hash</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              View cryptographic hashes from the medicine payload for tamper-proof verification.
            </p>
            <button
              onClick={() => setHashModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white text-black hover:bg-white/90 transition-all"
            >
              <Hash className="w-3 h-3" />
              View Hashes
            </button>
          </div>
        </div>

        {/* Create Verification QR - ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-blue-500/20 flex items-center justify-center bg-blue-500/10">
            <QrCode className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Create Verification QR</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Generate a QR code that pharmacies and patients can scan to verify authenticity.
            </p>
            <button
              onClick={() => setQrModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all font-mono uppercase tracking-wider"
            >
              <QrCode className="w-3 h-3" />
              Generate QR
            </button>
          </div>
        </div>

        {/* Authenticity Registry - ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-emerald-500/20 flex items-center justify-center bg-emerald-500/10">
            <Archive className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Authenticity Registry</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              View all registered medicine batches and their current verification status.
            </p>
            <button
              onClick={() => setRegistryModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-mono uppercase tracking-wider"
            >
              <Archive className="w-3 h-3" />
              Open Ledger
            </button>
          </div>
        </div>
      </div>

      <RegisterMedicineModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
      />

      <RegisteredMedicinesModal
        isOpen={hashModalOpen}
        onClose={() => setHashModalOpen(false)}
        medicines={medicines}
        isLoading={isLoading}
      />

      <AuthenticityRegistryModal
        isOpen={registryModalOpen}
        onClose={() => setRegistryModalOpen(false)}
        medicines={medicines}
        isLoading={isLoading}
      />

      <CreateVerificationQRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        medicines={medicines}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}
