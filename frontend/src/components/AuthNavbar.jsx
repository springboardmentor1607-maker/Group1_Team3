import { Link, useLocation } from "react-router-dom";
import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthNavbar() {
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border/50">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <ListChecks className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-lg font-bold">
          Civic<span className="text-primary">Issue</span>
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link to={isLogin ? "/signup" : "/login"}>
          <Button variant="outline" size="sm">
            {isLogin ? "Sign Up" : "Login"}
          </Button>
        </Link>

        <Link to="/">
          <Button variant="ghost" size="sm">
            Home
          </Button>
        </Link>
      </div>

    </nav>
  );
}