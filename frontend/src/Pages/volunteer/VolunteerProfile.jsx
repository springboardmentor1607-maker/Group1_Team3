import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPinned,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { complaints as allComplaints, volunteers } from "@/data/mockData";

const currentVolunteer = volunteers[0];

export default function VolunteerProfile() {
  const myComplaints = allComplaints.filter(
    (c) => c.assignedTo === currentVolunteer.id
  );

  const totalAssigned = myComplaints.length;
  const totalResolved = myComplaints.filter(
    (c) => c.status === "resolved"
  ).length;

  const completionRate =
    totalAssigned > 0
      ? Math.round((totalResolved / totalAssigned) * 100)
      : 0;

  const profileStats = [
    {
      label: "Total Assigned",
      value: totalAssigned,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Resolved",
      value: totalResolved,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Avg. Resolution",
      value: "2.5 days",
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                  {currentVolunteer.avatar}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-bold">
                {currentVolunteer.name}
              </h2>

              <span className="text-sm text-muted-foreground mt-1">
                Community Volunteer
              </span>
            </div>

            <div className="space-y-4 border-t pt-5">
              {/* Email */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <p className="font-medium">
                    {currentVolunteer.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Phone
                  </p>
                  <p className="font-medium">
                    {currentVolunteer.mobile}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <MapPinned className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Location
                  </p>
                  <p className="font-medium">
                    {currentVolunteer.location}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {profileStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}