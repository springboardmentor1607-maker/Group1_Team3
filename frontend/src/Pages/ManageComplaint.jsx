import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ComplaintCard from "@/components/ComplaintCard";
import VolunteerListModal from "@/components/VolunteerListModal";
import { complaints as initialComplaints, volunteers } from "@/data/mockData";


const ManageComplaint = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "all" || c.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const handleAssignConfirm = (complaint, volunteer) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaint.id
          ? { ...c, status: "assigned", assignedTo: volunteer.id, updated_at: new Date().toISOString() }
          : c
      )
    );
    setSelectedComplaint(null);
    toast.success(`Complaint "${complaint.title}" assigned to ${volunteer.name}`);
  };

  const priorities = ["all", "high", "medium", "low"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Manage Complaints</h1>
              <p className="text-xs text-muted-foreground">{complaints.length} total complaints</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, address, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border p-1">
              <Filter className="w-4 h-4 text-muted-foreground ml-2" />
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                    filterPriority === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Complaint List */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No complaints found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((complaint, i) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ComplaintCard
                  complaint={complaint}
                  onAssign={setSelectedComplaint}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <VolunteerListModal
            complaint={selectedComplaint}
            volunteers={volunteers}
            onClose={() => setSelectedComplaint(null)}
            onAssignConfirm={handleAssignConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageComplaint;