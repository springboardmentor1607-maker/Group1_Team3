import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, Eye, EyeOff, ArrowRight, Mail, Lock, ShieldCheck, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import API from "@/api/axios";
import AuthNavbar from "@/components/AuthNavbar";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ YOUR HANDLE SUBMIT ADDED
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      // store data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Successful");

      // role-based navigation
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "volunteer") {
        navigate("/volunteer");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };
    const floatingIcons = [
    { icon: ShieldCheck, x: "15%", y: "20%", delay: 0 },
    { icon: MapPin, x: "75%", y: "30%", delay: 0.3 },
    { icon: Users, x: "25%", y: "70%", delay: 0.6 },
    { icon: ListChecks, x: "70%", y: "75%", delay: 0.9 },
  ];

  return (
    <>
    <AuthNavbar/>
    <div className="min-h-screen flex bg-background">
      

      {/* LEFT SAME */}
 <div
          className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220 72% 50%), hsl(200 80% 50%))" }}
        >
          {/* Animated rings */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/20"
                style={{
                  width: `${200 + i * 120}px`,
                  height: `${200 + i * 120}px`,
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

          {/* Floating icons */}
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
            <h2 className="font-heading text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-white/80 leading-relaxed">
              Login to your CivicIssue account and continue making your city a better place.
            </p>
          </motion.div>
        </div>

      {/* RIGHT SAME */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">
              Civic<span className="text-primary">Issue</span>
            </span>
          </div>

          <Card className="border-border/60 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">

                {/* EMAIL */}
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"} <ArrowRight size={16} />
                </Button>

              </form>

              <p className="text-center text-sm mt-6">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Sign Up
                </Link>
              </p>

            </CardContent>
          </Card>

        </motion.div>
      </div>
    </div>
    </>
  );
  
}