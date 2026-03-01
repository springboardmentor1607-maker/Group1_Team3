import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
 
const issueTypeLabels = {
  water_leak: "Water Leak",
  electrical: "Electrical",
  sanitation: "Sanitation",
  road_damage: "Road Damage",
};

const statusColors = {
  received: "bg-info/10 text-info border-info/20",
  assigned: "bg-warning/10 text-warning border-warning/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-success/10 text-success border-success/20",
};

const priorityColors = {
  high: "bg-high/10 text-high border-high/20",
  medium: "bg-medium/10 text-medium border-medium/20",
  low: "bg-low/10 text-low border-low/20",
};

const ComplaintCard = ({ complaint, onAssign }) => {
  const [expanded, setExpanded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">
                  {complaint.displayId}
                </span>
                <Badge
                  variant="outline"
                  className={priorityColors[complaint.priority]}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {complaint.priority}
                </Badge>
              </div>
              <h3 className="font-heading text-lg font-semibold text-card-foreground truncate">
                {complaint.title}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={statusColors[complaint.status]}
            >
              {complaint.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Type & Location */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground text-xs font-medium">
              {issueTypeLabels[complaint.issueType] ||
                complaint.issueType}
            </span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {complaint.landmark}, {complaint.address}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {format(
                new Date(complaint.created_at),
                "dd MMM yyyy, hh:mm a"
              )}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {complaint.description}
          </p>

          {/* Expandable Section */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              {/* Images */}
              {complaint.images.length > 0 ? (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Attached Images
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {complaint.images.map((img, i) => (
                      <div
                        key={i}
                        className="w-32 h-24 rounded-lg overflow-hidden border border-border bg-muted"
                        onClick={() => setPreviewImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Complaint ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  No images attached
                </p>
              )}

              {/* Coordinates */}
              <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3">
                <span className="font-medium">Coordinates:</span>{" "}
                {complaint.location_coords.lat.toFixed(6)},{" "}
                {complaint.location_coords.lng.toFixed(6)}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {expanded ? "Show Less" : "Show More"}
            </button>

            {complaint.status === "received" ? (
              <Button size="sm" onClick={() => onAssign(complaint)}>
                Assign To
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">
                Assigned to {complaint.assigned_to?.name || "Volunteer"}
              </span>
            )}
          </div>
        </div>
      </Card>
      {previewImage && (
        
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white text-2xl"
            onClick={() => setPreviewImage(null)}
          >
            ✕
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ComplaintCard;