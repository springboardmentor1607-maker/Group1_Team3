import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import API from "@/api/axios";

const ManageComplaint = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter]= useState("");

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
    if (priority === "high")
      return "bg-red-100 text-red-600 border border-red-200";
    if (priority === "medium")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    return "bg-green-100 text-green-700 border border-green-200";
  };

  const states = [...new Set(
  complaints
    .map(c => {
      if (!c.address) return null;

      // handle both formats
      if (c.address.includes(",")) {
        const parts = c.address.split(",");
        return parts[parts.length - 1].trim();
      }

      return c.address.trim();
    })
    .filter(Boolean)
)];

  const filteredComplaints = complaints
    .filter((c) => {
      if (filter === "assigned") return c.assigned_to;
      if (filter === "unassigned") return !c.assigned_to;
      if (filter === "high") return c.priority === "high";
      if (filter === "medium") return c.priority === "medium";
      if (filter === "low") return c.priority === "low";
      return true;
    })
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter((c) => stateFilter === "" || c.address?.toLowerCase().includes(stateFilter.toLowerCase()));

  console.log("complaints:",complaints);
  console.log("states:", states);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
            AP
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Admin Panel
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
            Manage Complaints
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Profile
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-10">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage Complaints
          </h1>
          <p className="text-gray-500 text-sm">
            Showing {complaints.length} active reports
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            {/* State Dropdown FIRST */}
            <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-4 py-2 rounded-full border text-gray-600 bg-white"
            >
              <option value="">All States</option>
               {states.length > 0 &&
               states.map((state, index) => (
               <option key={index} value={state}>{state}</option>))}</select>
                {/* Existing Filters */}
                {["all", "assigned", "unassigned", "high", "medium", "low"].map(
                   (item) => (
                   <button
                   key={item}
                   onClick={() => setFilter(item)}
                    className={`px-4 py-2 rounded-full text-sm capitalize ${
                      filter === item
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-600" }`}> {item}</button> ) )}
                      </div>
                      </div>

        {/* Complaint Cards */}
        <div className="space-y-6">
          {filteredComplaints.map((complaint, index) => (
            <div
              key={complaint._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start gap-6 flex-wrap">

                {/* Left Section */}
                <div className="flex-1 space-y-4">

                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">
                      {`CMP-${String(index +1).padStart(3,"0")}`}
                    </span>

                    <span
                      className={`px-3 py-1 text-xs rounded-full capitalize ${getPriorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority} priority
                    </span>

                    {complaint.assigned_to && (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        Assigned
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    {complaint.title}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {complaint.description}
                  </p>

                  {/* IMAGE SECTION */}
                  {complaint.images && complaint.images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-2">
                        Uploaded Image
                      </p>
                      <img
                        src={complaint.images[0]}
                        alt="Complaint"
                        className="w-56 h-36 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition"
                        onClick={() =>
                          window.open(complaint.images[0], "_blank")
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={14} />
                    {complaint.address}
                  </div>
                </div>

                {/* Right Section */}
                <div className="w-64">
                  {complaint.assigned_to ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                      <p className="font-semibold mb-1">Assigned To</p>
                      <p>{complaint.assigned_to.name}</p>
                      <p className="text-xs text-gray-600">
                        {complaint.assigned_to.email}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-600">
                        Assign Volunteer
                      </p>

                      <select
                        value={selectedVolunteer[complaint._id] || ""}
                        onChange={(e) =>
                          setSelectedVolunteer({
                            ...selectedVolunteer,
                            [complaint._id]: e.target.value,
                          })
                        }
                        className="w-full border px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="">Select volunteer...</option>
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
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Assign Issue
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageComplaint;