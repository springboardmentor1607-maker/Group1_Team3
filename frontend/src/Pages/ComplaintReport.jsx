import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { complaints, volunteers, users } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const ComplaintReport = () => {
  const navigate = useNavigate();
  const reportRefs = useRef({});

  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  const getVolunteer = (id) => volunteers.find((v) => v.id === id);
  const getUser = (id) => users.find((u) => u.id === id);

  const handleDownloadPdf = (complaintId) => {
    const el = reportRefs.current[complaintId];
    if (!el) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CivicIssue Complaint Report - ${complaintId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', sans-serif; color: #1a1a2e; padding: 40px; line-height: 1.6; }
          .report-header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .report-header h1 { font-size: 24px; color: #1e40af; margin-bottom: 4px; }
          .report-header p { color: #6b7280; font-size: 13px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 15px; font-weight: 700; color: #1e40af; margin-bottom: 10px; border-left: 4px solid #3b82f6; padding-left: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
          .field { margin-bottom: 6px; }
          .field-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
          .field-value { font-size: 14px; font-weight: 500; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .badge-high { background: #fee2e2; color: #991b1b; }
          .badge-medium { background: #fef3c7; color: #92400e; }
          .badge-low { background: #dbeafe; color: #1e40af; }
          .badge-resolved { background: #d1fae5; color: #065f46; }
          .description { background: #f8fafc; padding: 14px; border-radius: 8px; font-size: 13px; border: 1px solid #e2e8f0; }
          .remarks { background: #f0fdf4; padding: 14px; border-radius: 8px; font-size: 13px; border: 1px solid #bbf7d0; }
          .proof-img { max-width: 280px; border-radius: 8px; margin-top: 8px; border: 1px solid #e2e8f0; }
          .signature-section { margin-top: 50px; display: flex; justify-content: flex-end; }
          .signature-box { text-align: center; min-width: 220px; }
          .signature-line { border-top: 1px solid #1a1a2e; margin-top: 50px; padding-top: 6px; }
          .separator { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
        </style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Complaint Reports
            </h1>
            <p className="text-xs text-muted-foreground">
              {resolvedComplaints.length} resolved complaints
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {resolvedComplaints.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No resolved complaints yet
            </p>
          </div>
        ) : (
          resolvedComplaints.map((complaint, i) => {
            const volunteer = getVolunteer(complaint.assignedTo);
            const creator = getUser(complaint.createdBy);

            return (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Rest of JSX remains EXACT SAME */}
              </motion.div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default ComplaintReport;