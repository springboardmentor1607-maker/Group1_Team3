import { useRef, useState, useEffect } from "react";
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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { getresolvedComplaints } from "@/services/adminServices";
import html2pdf from "html2pdf.js";

const ComplaintReport = () => {
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getresolvedComplaints();
        setComplaints(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resolvedComplaints = complaints; // already filtered from backend

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

const handleDownloadPdf = () => {
  if (!reportRef.current || !selectedComplaint) return;

  const element = reportRef.current;

  const opt = {
    margin: 0.5,
    filename: `Complaint_${selectedComplaint._id}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
};

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Loading complaints...</p>
      </div>
    );
  }

  // ── LIST VIEW ──
  if (!selectedComplaint) {
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
                Resolved Complaints
              </h1>
              <p className="text-xs text-muted-foreground">
                {resolvedComplaints.length} resolved complaints
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 space-y-3">
          {resolvedComplaints.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                No resolved complaints yet
              </p>
            </div>
          ) : (
            resolvedComplaints.map((complaint, i) => {
              const creator = complaint.user_id;
              const volunteer = complaint.assigned_to;

              return (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {complaint._id}
                          </span>

                          <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
                          </Badge>

                          <Badge
                            className={`text-[10px] capitalize ${
                              complaint.priority === "high"
                                ? "border-destructive/30 text-destructive"
                                : complaint.priority === "medium"
                                ? "border-yellow-400 text-yellow-700"
                                : "border-blue-300 text-blue-700"
                            }`}
                          >
                            {complaint.priority}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-sm truncate">
                          {complaint.title}
                        </h3>

                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {complaint.address}
                          </span>

                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {creator?.name || "Unknown"}
                          </span>

                          {volunteer && (
                            <span className="flex items-center gap-1">
                              → {volunteer.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </main>
      </div>
    );
  }

  // ── DETAIL VIEW ──
  const creator = selectedComplaint.user_id;
  const volunteer = selectedComplaint.assigned_to;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedComplaint(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>

            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                Complaint Report
              </h1>
              <p className="text-xs text-muted-foreground">
                {selectedComplaint._id}
              </p>
            </div>
          </div>

          <Button size="sm" onClick={handleDownloadPdf} className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="bg-white text-black p-6 rounded-lg">

              {/* Header */}
              <div className="text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-blue-700">
                  Civic Complaint Report
                </h1>
                <p className="text-xs text-gray-500">
                  Generated on {new Date().toLocaleString()}
                </p>
              </div>

              {/* Complaint Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <p><b>ID:</b> {selectedComplaint._id}</p>
                <p><b>Status:</b> Resolved</p>
                <p><b>Title:</b> {selectedComplaint.title}</p>
                <p><b>Priority:</b> {selectedComplaint.priority}</p>
                <p><b>Issue Type:</b> {selectedComplaint.issueType}</p>
                <p><b>Address:</b> {selectedComplaint.address}</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-blue-700">Description</h3>
                <p className="bg-gray-100 p-3 rounded text-sm">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Issue Images */}
              {selectedComplaint.images?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-blue-700">
                    Issue Images
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedComplaint.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-40 h-28 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved Images */}
              {selectedComplaint.resolvedProofImages?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-green-700">
                    Resolution Proof
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedComplaint.resolvedProofImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-40 h-28 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-green-700">
                  Remarks
                </h3>
                <p className="bg-green-50 p-3 rounded text-sm">
                  {selectedComplaint.resolvedRemarks || "No remarks provided"}
                </p>
              </div>

              {/* People */}
              <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">
                    Citizen
                  </h3>
                  <p>{creator?.name}</p>
                  <p>{creator?.email}</p>
                </div>

                {volunteer && (
                  <div>
                    <h3 className="font-semibold text-blue-700 mb-2">
                      Assigned Volunteer
                    </h3>
                    <p>{volunteer.name}</p>
                    <p>{volunteer.email}</p>
                    <p>{volunteer.mobile}</p>
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="flex justify-between mt-16">
                <div className="text-center">
                  <div className="border-t w-40 mx-auto mb-1"></div>
                  <p className="text-sm font-medium">Volunteer</p>
                  <p className="text-xs text-gray-500">
                    {volunteer?.name || "N/A"}
                  </p>
                </div>

                <div className="text-center">
                  <div className="border-t w-40 mx-auto mb-1"></div>
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-gray-500">
                    Authorized Signature
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ComplaintReport;