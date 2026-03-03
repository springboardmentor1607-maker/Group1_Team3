import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const issueTypeLabels = {
  water_leak: "Water Leak",
  electrical: "Electrical",
  sanitation: "Sanitation",
  road_damage: "Road Damage",
};

const priorityColors = {
  high: "bg-high/10 text-high border-high/20",
  medium: "bg-medium/10 text-medium border-medium/20",
  low: "bg-low/10 text-low border-low/20",
};

const statusColors = {
  received: "bg-info/10 text-info border-info/20",
  assigned: "bg-warning/10 text-warning border-warning/20",
  in_review: "bg-primary/10 text-primary border-primary/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-success/10 text-success border-success/20",
};

const timelineSteps = [
  { key: "received", label: "Received" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

const statusOrder = ["received", "assigned", "in_progress", "resolved"];

export default function ComplaintDetailModal({
  complaint,
  onClose,
  onStatusUpdate,
}) {
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const currentIdx = statusOrder.indexOf(complaint.status);

  const handleSubmit = () => {
    onStatusUpdate(complaint.id, newStatus, remarks);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">
                {complaint.id}
              </span>
              <Badge variant="outline" className={priorityColors[complaint.priority]}>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {complaint.priority}
              </Badge>
              <Badge variant="outline" className={statusColors[complaint.status]}>
                {complaint.status.replace("_", " ")}
              </Badge>
            </div>
            <h2 className="text-xl font-bold">{complaint.title}</h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {complaint.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">
                Issue Type
              </p>
              <p className="text-sm font-medium">
                {issueTypeLabels[complaint.issueType] || complaint.issueType}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">
                Location
              </p>
              <p className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {complaint.landmark}, {complaint.address}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">
                Created
              </p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(complaint.created_at), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">
                Coordinates
              </p>
              <p className="text-sm font-medium">
                {complaint.location_coords.lat.toFixed(4)},{" "}
                {complaint.location_coords.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Images */}
          {complaint.images.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                Attached Images
              </h3>
              <div className="flex gap-2 flex-wrap">
                {complaint.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIdx(idx)}
                    className="w-28 h-20 rounded-lg overflow-hidden border bg-muted"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Status Timeline</h3>
            <div className="flex items-center gap-2">
              {timelineSteps.map((step, idx) => {
                const stepIdx = statusOrder.indexOf(step.key);
                const isCompleted = stepIdx <= currentIdx;

                return (
                  <div key={step.key} className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          isCompleted
                            ? "bg-primary border-primary text-white"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-[10px] text-center">
                        {step.label}
                      </span>
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mb-5 ${
                          stepIdx < currentIdx ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Update Section */}
          {complaint.status !== "resolved" && (
            <div className="border-t pt-5">
              <h3 className="text-sm font-semibold mb-3">Update Status</h3>
              <div className="space-y-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Add remarks (optional)..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />

                <Button onClick={handleSubmit} className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Submit Update
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            <img
              src={complaint.images[lightboxIdx]}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}