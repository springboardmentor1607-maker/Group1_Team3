import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import API from "@/api/axios";

const ManageComplaint = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/admin/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data.complaints);
      } catch {
        toast.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await API.get("/admin/volunteers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVolunteers(res.data.volunteers);
      } catch {
        toast.error("Failed to load volunteers");
      }
    };
    fetchVolunteers();
  }, []);

  const handleAssign = async (complaintId) => {
    const volunteerId = selectedVolunteer[complaintId];
    if (!volunteerId) return toast.error("Select volunteer");

    try {
      const res = await API.put(
        `/admin/${complaintId}/assign`,
        { volunteerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.complaint;

      setComplaints((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );

      toast.success("Assigned successfully");
    } catch {
      toast.error("Assignment failed");
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "bg-red-100 text-red-600";
    if (priority === "medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "assigned") return c.assigned_to;
    if (filter === "unassigned") return !c.assigned_to;
    if (filter === "high") return c.priority === "high";
    if (filter === "medium") return c.priority === "medium";
    if (filter === "low") return c.priority === "low";
    return true;
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-2 rounded bg-blue-600 text-white">
            Manage Complaints
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
          >
            Profile
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-10">

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["all", "assigned", "unassigned", "high", "medium", "low"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-full text-sm capitalize ${
                  filter === item
                    ? "bg-blue-600 text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Complaint Cards */}
        <div className="space-y-6">

          {filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">

                <div
                  onClick={() =>
                    setExpandedId(
                      expandedId === complaint._id ? null : complaint._id
                    )
                  }
                  className="cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">
                    {complaint.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin size={16} />
                    {complaint.address}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">

                  {/* Priority */}
                  <span
                    className={`px-4 py-1 text-sm rounded-full capitalize ${getPriorityColor(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority}
                  </span>

                  {/* Assignment Status */}
                  {complaint.assigned_to ? (
                    <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-700">
                      Assigned to {complaint.assigned_to.name}
                    </span>
                  ) : (
                    <>
                      <span className="px-4 py-1 text-sm rounded-full bg-gray-200 text-gray-600">
                        Unassigned
                      </span>

                      <select
                        value={selectedVolunteer[complaint._id] || ""}
                        onChange={(e) =>
                          setSelectedVolunteer({
                            ...selectedVolunteer,
                            [complaint._id]: e.target.value,
                          })
                        }
                        className="border px-3 py-1 rounded-lg text-sm"
                      >
                        <option value="">Select Volunteer</option>
                        {volunteers.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          handleAssign(complaint._id)
                        }
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Assign
                      </button>
                    </>
                  )}

                </div>
              </div>

              {expandedId === complaint._id && (
                <div className="mt-6 border-t pt-6">
                  <p className="text-gray-700 mb-4">
                    {complaint.description}
                  </p>

                  {complaint.image && (
                    <img
                      src={complaint.image}
                      alt="Complaint"
                      className="w-full max-h-96 object-cover rounded-xl shadow"
                    />
                  )}
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ManageComplaint;