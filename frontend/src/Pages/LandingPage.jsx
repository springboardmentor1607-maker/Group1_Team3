import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Users,
  FileBarChart,
  ArrowRight,
  CheckCircle2,
  ListChecks,
  ChevronDown,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: MapPin,
    title: "Report Issues",
    desc: "Instantly report civic issues like potholes, broken streetlights, garbage dumps, and more with photo evidence and location tagging.",
  },
  {
    icon: Users,
    title: "Volunteer Network",
    desc: "Dedicated volunteers pick up complaints in their area and work towards resolving them with full transparency.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Oversight",
    desc: "Administrators review, assign, and track every complaint ensuring accountability at every step.",
  },
  {
    icon: FileBarChart,
    title: "Transparent Reports",
    desc: "Detailed resolution reports with proof, volunteer details, and timestamps available for every resolved complaint.",
  },
];

const stats = [
  { value: "10K+", label: "Issues Reported" },
  { value: "8.5K+", label: "Resolved" },
  { value: "500+", label: "Volunteers" },
  { value: "50+", label: "Cities" },
];

const steps = [
  { num: "01", title: "Report", desc: "Submit a complaint with details & photos" },
  { num: "02", title: "Assign", desc: "Admin assigns a nearby volunteer" },
  { num: "03", title: "Resolve", desc: "Volunteer resolves & submits proof" },
  { num: "04", title: "Verify", desc: "Admin verifies and closes the issue" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight">
              Civic<span className="text-primary">Issue</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button size="sm" onClick={() => navigate("/signup")} className="gap-1.5">
              Sign Up <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              <CheckCircle2 className="w-3.5 h-3.5" /> Empowering Citizens
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
              Your Voice Builds{" "}
              <span className="bg-gradient-to-r from-primary to-[hsl(200,80%,50%)] bg-clip-text text-transparent">
                Better Cities
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CivicIssue is a citizen-driven platform to report, track, and resolve civic
              complaints — from potholes to broken streetlights — with full transparency
              and volunteer support.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button size="lg" className="gap-2 px-8 text-base" onClick={() => navigate("/signup")}>
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>

            <Button size="lg" variant="outline" className="gap-2 px-8 text-base" onClick={() => navigate("/login")}>
              Login to Dashboard
            </Button>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a href="#features" className="inline-flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
              <span className="text-xs mb-1">Explore</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="font-heading text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">
              Everything You Need to Make a Difference
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="h-full border-border/60 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-card/50 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">Process</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">How It Works</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-heading text-xl font-bold mb-4">
                  {s.num}
                </div>
                <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Ready to Make Your City Better?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Join thousands of citizens and volunteers working together for cleaner, safer communities.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gap-2 px-8" onClick={() => navigate("/signup")}>
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>

              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CivicIssue. Built for better communities.</p>
      </footer>
    </div>
  );
}