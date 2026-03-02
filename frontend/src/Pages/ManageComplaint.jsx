import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import VolunteerListModal from "@/components/VolunteerListModal";
import API from "@/api/axios";

const ManageComplaint = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await API.get("/admin/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = response.data.complaints.map((item, index) => ({
          ...item,
          id: item._id,
          displayId: `CMP-${String(index + 1).padStart(3, "0")}`,
        }));

        setComplaints(formatted);
      } catch (error) {
        toast.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Fetch volunteers when complaint selected
  useEffect(() => {
    if (!selectedComplaint) return;

    const fetchVolunteers = async () => {
      try {
        const response = await API.get("/admin/volunteers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = response.data.volunteers.map((item) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          mobile: item.mobile,
          location: item.location ?? "N/A",
        }));

        setVolunteers(formatted);
      } catch (error) {
        toast.error("Failed to load volunteers");
      }
    };

    fetchVolunteers();
  }, [selectedComplaint]);

  // Filter logic
  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.address?.toLowerCase().includes(search.toLowerCase()) ||
      c.displayId?.toLowerCase().includes(search.toLowerCase());

    const matchPriority =
      filterPriority === "all" || c.priority === filterPriority;

    return matchSearch && matchPriority;
  });

  // Assign volunteer
  const handleAssignConfirm = async (complaint, volunteer) => {
    try {
      const response = await API.put(
        `/admin/${complaint.id}/assign`,
        { volunteerId: volunteer.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedComplaint = response.data.complaint;

      // ✅ UPDATED PART (added assigned_to update)
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === updatedComplaint._id
            ? {
                ...c,
                status: updatedComplaint.status,
                assigned_to: updatedComplaint.assigned_to,
              }
            : c
        )
      );

      // ✅ Update selected complaint instantly
      setSelectedComplaint((prev) => ({
        ...prev,
        status: updatedComplaint.status,
        assigned_to: updatedComplaint.assigned_to,
      }));

      toast.success(`Assigned to ${updatedComplaint.assigned_to.name}`);
    } catch (error) {
      toast.error("Failed to assign complaint");
    }
  };

  return (
    <div className="h-screen relative bg-[#f8fafc] overflow-hidden">

      {/* Background Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40" />

      <div className="relative h-full flex">

        {/* LEFT PANEL */}
        <div className="w-[34%] p-12 overflow-y-auto">

          <h1 className="text-3xl font-semibold text-gray-800 mb-12 tracking-tight">
            Complaint Workspace
          </h1>

          <div className="space-y-6">
            {filtered.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => setSelectedComplaint(complaint)}
                className={`p-6 rounded-2xl backdrop-blur-lg transition-all cursor-pointer ${
                  selectedComplaint?.id === complaint.id
                    ? "bg-white shadow-2xl scale-[1.02]"
                    : "bg-white/70 hover:bg-white hover:shadow-lg"
                }`}
              >
                <div className="flex justify-between items-center">

                  <h2 className="text-lg font-medium text-gray-800">
                    {complaint.title}
                  </h2>

                  <div
                    className={`px-3 py-1 text-xs rounded-full ${
                      complaint.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : complaint.priority === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {complaint.priority}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {complaint.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-20 overflow-y-auto">

          {!selectedComplaint ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-lg">
              Choose a complaint to inspect details
            </div>
          ) : (
            <div className="relative bg-white rounded-[50px] shadow-2xl p-16 max-w-5xl mx-auto">

              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-[50px] bg-gradient-to-r from-purple-400 to-blue-400" />

              <h2 className="text-4xl font-semibold text-gray-800 mb-8">
                {selectedComplaint.title}
              </h2>

              <div className="flex gap-10 text-sm text-gray-500 mb-10">
                <span>ID: {selectedComplaint.displayId}</span>
                <span>Status: {selectedComplaint.status}</span>
                <span>Priority: {selectedComplaint.priority}</span>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                {selectedComplaint.description}
              </p>

              {selectedComplaint.image && (
                <img
                  src={selectedComplaint.image}
                  alt="Complaint"
                  className="mt-12 rounded-3xl max-h-[420px] object-cover shadow-lg"
                />
              )}

              {/* ✅ UPDATED BUTTON LOGIC */}
              <div className="mt-16">

                {selectedComplaint.assigned_to ? (

                  <div className="px-10 py-4 rounded-2xl bg-green-100 text-green-700 font-medium shadow">
                    Assigned to: {selectedComplaint.assigned_to.name}
                  </div>

                ) : (

                  <button
                    onClick={() => setAssignOpen(true)}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Assign Volunteer
                  </button>

                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Assign Modal */}
      <AnimatePresence>
        {assignOpen && selectedComplaint && (
          <VolunteerListModal
            complaint={selectedComplaint}
            volunteers={volunteers}
            onClose={() => setAssignOpen(false)}
            onAssignConfirm={(complaint, volunteer) => {
              handleAssignConfirm(complaint, volunteer);
              setAssignOpen(false);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageComplaint;