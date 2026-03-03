import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  AlertTriangle,
  MapPin,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { complaints as allComplaints, volunteers } from "@/data/mockData";
import { format } from "date-fns";
import { toast } from "sonner";
import ComplaintDetailModal from "@/components/volunteer/ComplaintDetailModal";

const currentVolunteer = volunteers[0];

const issueTypeLabels = {
  water_leak: "Water Leak",
  electrical: "Electrical",
  sanitation: "Sanitation",
  road_damage: "Road Damage",
};

const priorityColors = {
  high: "bg-red-100 text-red-600 border-red-200",
  medium: "bg-yellow-100 text-yellow-600 border-yellow-200",
  low: "bg-green-100 text-green-600 border-green-200",
};

const statusColors = {
  assigned: "bg-orange-100 text-orange-600 border-orange-200",
  in_progress: "bg-blue-100 text-blue-600 border-blue-200",
  resolved: "bg-green-100 text-green-600 border-green-200",
};

export default function MyComplaints({ statusFilter }) {
  const [complaints, setComplaints] = useState(
    allComplaints.filter((c) => c.assignedTo === currentVolunteer.id)
  );

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState(statusFilter || "all");
  const [sort, setSort] = useState("newest");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filtered = useMemo(() => {
    let result = [...complaints];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    if (priority !== "all") {
      result = result.filter((c) => c.priority === priority);
    }

    if (status !== "all") {
      result = result.filter((c) => c.status === status);
    }

    result.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sort === "newest" ? db - da : da - db;
    });

    return result;
  }, [complaints, search, priority, status, sort]);

  const handleStatusUpdate = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
          : c
      )
    );

    toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {!statusFilter && (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} complaint{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <SlidersHorizontal className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No complaints match your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((complaint, i) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedComplaint(complaint)}
              >
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {complaint.id}
                    </span>

                    <Badge
                      variant="outline"
                      className={statusColors[complaint.status]}
                    >
                      {complaint.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <h3 className="font-semibold mb-2">
                    {complaint.title}
                  </h3>

                  <div className="text-xs text-muted-foreground flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3" />
                    {complaint.address}
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(complaint.created_at), "dd MMM yyyy")}
                    </span>

                    {complaint.images.length > 0 && (
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {complaint.images.length}
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[10px] h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComplaint(complaint);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}