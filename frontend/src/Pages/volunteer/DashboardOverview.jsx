import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Clock,
  Loader2,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import ComplaintDetailModal from "@/components/volunteer/ComplaintDetailModal";
import { toast } from "sonner";
import { getVolunteerComplaints, updateComplaintStatus, getDashboardStats, getWeeklyStats } from "@/services/volunteerServices";

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

const PIE_COLORS = [
  "hsl(200, 80%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(220, 72%, 50%)",
  "hsl(152, 60%, 42%)",
];

export default function DashboardOverview() {
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [barData,setBarData] = useState([]);
  const [barLoading,setBarLoading] = useState(true);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setComplaintsLoading(true);
        setError(null);
        console.log("Fetching volunteer complaints for dashboard");
        const response = await getVolunteerComplaints();
        console.log("Dashboard complaints response:", response);
        setComplaints(response.complaints || []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to load complaints";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setComplaintsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

//fetch pie chart data from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
  
        const res = await getDashboardStats();
  
        const data = res.stats;
  
        setStats({
          total: data.assigned + data.in_progress + data.resolved,
          pending: data.assigned,
          inProgress: data.in_progress,
          resolved: data.resolved,
        });
  
      } catch (err) {
        toast.error("Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };
  
    fetchStats();
  }, []);



//fetch bar chart data from backend
  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        setBarLoading(true);
  
        const res = await getWeeklyStats();
  
        console.log("Weekly API:", res);
  
        // Transform backend data → chart format
        const formatted = res.data.map((item) => ({
          name: item._id,     // e.g. "2026-12" or "18 Mar"
          resolved: item.count,
        }));
  
        setBarData(formatted);
  
      } catch (err) {
        console.error(err);
        toast.error("Failed to load chart data");
      } finally {
        setBarLoading(false);
      }
    };
  
    fetchWeeklyStats();
  }, []);





  const pieData = [
    { name: "Assigned", value: stats.pending, fill: PIE_COLORS[0] },
    { name: "In Progress", value: stats.inProgress, fill: PIE_COLORS[1] },
    { name: "Resolved", value: stats.resolved, fill: PIE_COLORS[2] },
  ];

  const barConfig = {
    resolved: { label: "Resolved", color: "hsl(152, 60%, 42%)" },
  };

  const pieConfig = {
    received: { label: "Received", color: PIE_COLORS[0] },
    assigned: { label: "Assigned", color: PIE_COLORS[1] },
    inProgress: { label: "In Progress", color: PIE_COLORS[2] },
    resolved: { label: "Resolved", color: PIE_COLORS[3] },
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, status, updated_at: new Date().toISOString() }
            : c
        )
      );

      toast.success(
        `Complaint status updated to ${status.replace("_", " ")}`
      );
      setSelectedComplaint(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (complaintsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 mb-4">⚠️ Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Assigned",
      value: stats.total,
      icon: ClipboardList,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Loader2,
      color: "bg-info/10 text-info",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "bg-success/10 text-success",
    },
  ];

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-heading text-3xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Monthly Resolved Complaints</CardTitle>
            </CardHeader>
            <CardContent>
              {barLoading ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Loading chart...
                </div>
              ) : barData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              ) : (
                <ChartContainer config={barConfig} className="h-[250px] w-full">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="resolved"
                      fill="hsl(152, 60%, 42%)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Complaint Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieConfig} className="h-[250px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Complaints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Assigned Complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComplaints.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No complaints assigned yet</p>
            ) : (
              recentComplaints.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedComplaint(c)}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground">{c._id}</span>
                      <Badge variant="outline" className={`text-[10px] ${priorityColors[c.priority]}`}>
                        {c.priority}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] ${statusColors[c.status]}`}>
                        {c.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {c.address}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(c.created_at), "dd MMM")}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComplaint(c);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Modal */}
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