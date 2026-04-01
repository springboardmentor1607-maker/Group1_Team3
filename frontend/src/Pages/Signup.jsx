import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListChecks, Eye, EyeOff, ArrowRight, User, Mail, Lock, Phone, MapPin, ShieldCheck, FileBarChart, Users } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API from "@/api/axios";
import AuthNavbar from "@/components/AuthNavbar";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    state: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // update handler
  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // submit
  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, mobile, state, role } = form;

    if (!name || !email || !password || !confirmPassword || !mobile || !state || !role) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...dataToSend } = form;
      console.log("Data to send:", dataToSend);

      const response = await API.post("/auth/signup", dataToSend);

      toast.success(response.data.message || "Account created successfully!");
      navigate("/login");

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  // removed location field
  const fields = [
    { key: "name", label: "Username", icon: User, placeholder: "johndoe" },
    { key: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "you@example.com" },
    { key: "password", label: "Password", icon: Lock, type: "password", placeholder: "••••••••", isPassword: true },
    { key: "confirmPassword", label: "Confirm Password", icon: Lock, type: "password", placeholder: "••••••••", isPassword: true },
    { key: "mobile", label: "Mobile Number", icon: Phone, type: "tel", placeholder: "+91 9876543210" },
  ];

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    "Delhi","Jammu and Kashmir","Ladakh","Puducherry"
  ];

    const floatingIcons = [
    { icon: FileBarChart, x: "20%", y: "18%", delay: 0 },
    { icon: Users, x: "72%", y: "25%", delay: 0.3 },
    { icon: MapPin, x: "18%", y: "72%", delay: 0.6 },
    { icon: ShieldCheck, x: "78%", y: "70%", delay: 0.9 },
  ];

  return (
    <>
    <AuthNavbar/>
    <div className="min-h-screen flex ">

      {/* LEFT SAME */}
        <div
          className="hidden lg:flex lg:w-[45%] items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220 72% 50%), hsl(152 60% 42%))" }}
        >
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/20"
                style={{
                  width: `${180 + i * 130}px`,
                  height: `${180 + i * 130}px`,
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </div>

          {floatingIcons.map((item, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { delay: 0.5 + item.delay, duration: 0.5 },
                scale: { delay: 0.5 + item.delay, duration: 0.5 },
                y: { delay: 1 + item.delay, duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <item.icon className="w-5 h-5 text-white/70" />
            </motion.div>
          ))}

          <motion.div
            className="relative z-10 text-white text-center px-12 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            >
              <ListChecks className="w-8 h-8" />
            </motion.div>
            <h2 className="font-heading text-3xl font-bold mb-4">Join CivicIssue</h2>
            <p className="text-white/80 leading-relaxed">
              Create your account and start reporting civic issues, volunteering to solve them, or managing your community.
            </p>
          </motion.div>
        </div>

      {/* RIGHT SAME */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-gradient-to-br from-slate-100 via-gray-100 to-teal-50">
        <motion.div className="w-full max-w-lg">
          
          <Card className="border-border/60 shadow-xl">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Fill in your details</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">

                {/* INPUTS (unchanged UI) */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {fields.map((f) => {
                    const isPasswordField = f.isPassword;
                    const showState =
                      f.key === "password" ? showPassword :
                      f.key === "confirmPassword" ? showConfirm : false;

                    const toggleShow =
                      f.key === "password"
                        ? () => setShowPassword(!showPassword)
                        : f.key === "confirmPassword"
                        ? () => setShowConfirm(!showConfirm)
                        : null;

                    return (
                      <div key={f.key}>
                        <Label>{f.label}</Label>
                        <div className="relative">
                          <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                          <Input
                            type={isPasswordField ? (showState ? "text" : "password") : f.type || "text"}
                            placeholder={f.placeholder}
                            className="pl-10 pr-10"
                            value={form[f.key]}
                            onChange={(e) => update(f.key, e.target.value)}
                          />

                          {isPasswordField && (
                            <button type="button" onClick={toggleShow}
                              className="absolute right-3 top-1/2 -translate-y-1/2">
                              {showState ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* STATE DROPDOWN */}
                <div>
                  <Label>State</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                    <Select value={form.state} onValueChange={(v) => update("state", v)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ROLE (unchanged) */}
                <div>
                  <Label>Role</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                    <Select value={form.role} onValueChange={(v) => update("role", v)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"} <ArrowRight size={16} />
                </Button>

              </form>

              <p className="text-center mt-4 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">Login</Link>
              </p>

            </CardContent>
          </Card>

        </motion.div>
      </div>
    </div>
    </>
  );
}