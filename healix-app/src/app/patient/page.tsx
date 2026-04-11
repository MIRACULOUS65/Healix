"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UploadDocumentModal } from "@/components/patient/UploadDocumentModal";
import { MyDocumentsModal } from "@/components/patient/MyDocumentsModal";
import { VerifyMedicineModal } from "@/components/patient/VerifyMedicineModal";
import { NotificationsModal, DashboardNotification } from "@/components/patient/NotificationsModal";
import { ViewPrescriptionsModal } from "@/components/patient/ViewPrescriptionsModal";
import { Upload, FileText, Bell, QrCode, Pill } from "lucide-react";

interface UploadedDocument {
  id: string;
  url?: string;
  fileUrl?: string;
  name?: string;
  fileName?: string;
  documentType: string;
  uploadedAt?: string;
  createdAt?: string;
}

export default function PatientDashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [myDocsModalOpen, setMyDocsModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [prescriptionsOpen, setPrescriptionsOpen] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/my-documents");
        if (!res.ok) throw new Error("Failed to fetch documents");
        const data = await res.json();
        if (data.success) {
          setDocuments(data.documents);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoadingDocs(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/patient/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocuments();
    fetchNotifications();

    // Poll for notifications every 10 seconds to simulate instant push mapping
    const notificationInterval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(notificationInterval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/patient/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: "ALL" }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSuccess = (doc: UploadedDocument) => {
    // Add to the top of the list
    setDocuments((prev) => [doc, ...prev]);
  };

  const DOCUMENT_TYPE_LABELS: Record<string, string> = {
    lab_report: "Lab Report",
    prescription: "Prescription",
    insurance: "Insurance Document",
    discharge_summary: "Discharge Summary",
    radiology: "Radiology / Scan",
    vaccination: "Vaccination Record",
    other: "Other",
  };


  return (
    <DashboardLayout
      role="PATIENT"
      title="Your Medical Vault"
      subtitle="Upload documents, control access, and verify medicine authenticity."
    >
      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        {/* Upload Documents — ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
            <Upload className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Upload Documents</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Add lab reports, prescriptions, insurance files, and more. Stored
              securely in your medical vault.
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white text-black hover:bg-white/90 transition-all"
            >
              <Upload className="w-3 h-3" />
              Upload Document
            </button>
          </div>
        </div>

        {/* My Documents */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">My Documents</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              View and download your uploaded medical records. Stored securely in your vault.
            </p>
            <button
              onClick={() => setMyDocsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white text-black hover:bg-white/90 transition-all"
            >
              <FileText className="w-3 h-3" />
              View Documents
            </button>
          </div>
        </div>

        {/* Notifications — ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="relative w-10 h-10 border border-emerald-500/20 flex items-center justify-center bg-emerald-500/10">
            <Bell className="w-4 h-4 text-emerald-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center text-[9px] font-bold text-black border border-black shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Access Logging</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Monitor immutable audit trails when hospitals interact with your permitted records.
            </p>
            <button
              onClick={() => setNotificationsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-mono uppercase tracking-wider"
            >
              <Bell className="w-3 h-3" />
              View Alerts
            </button>
          </div>
        </div>

        {/* Verify Medicine — ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-indigo-500/20 flex items-center justify-center bg-indigo-500/10">
            <QrCode className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">Verify Medicine</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Scan a medicine QR to check authenticity on the immutable blockchain ledger.
            </p>
            <button
              onClick={() => setVerifyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all font-mono uppercase tracking-wider"
            >
              <QrCode className="w-3 h-3" />
              Scan QR
            </button>
          </div>
        </div>

        {/* View Prescriptions — ACTIVE */}
        <div className="bg-black p-8 flex flex-col gap-4">
          <div className="w-10 h-10 border border-indigo-500/20 flex items-center justify-center bg-indigo-500/10">
            <Pill className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-1">View Prescriptions</h2>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              View prescriptions issued to you by hospital doctors.
            </p>
            <button
              onClick={() => setPrescriptionsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all font-mono uppercase tracking-wider"
            >
              <Pill className="w-3 h-3" />
              View Prescriptions
            </button>
          </div>
        </div>
      </div>



      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* My Documents Modal */}
      <MyDocumentsModal
        isOpen={myDocsModalOpen}
        onClose={() => setMyDocsModalOpen(false)}
        documents={documents}
        isLoading={isLoadingDocs}
        documentTypeLabels={DOCUMENT_TYPE_LABELS}
      />

      {/* Verify Medicine Modal */}
      <VerifyMedicineModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        isLoading={false}
      />

      <ViewPrescriptionsModal
        isOpen={prescriptionsOpen}
        onClose={() => setPrescriptionsOpen(false)}
      />
    </DashboardLayout>
  );
}
