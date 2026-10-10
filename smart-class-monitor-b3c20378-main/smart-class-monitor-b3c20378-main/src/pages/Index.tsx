import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Camera, Mail, Lock, ArrowRight } from "lucide-react";
import { getStudentByEmailPassword, TEACHER_CREDENTIALS } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

type LoginType = "student" | "teacher" | null;

const Index = () => {
  const [selected, setSelected] = useState<LoginType>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (role: "student" | "teacher") => {
    if (!email || !password) {
      toast({ title: "Error", description: "Please enter email and password", variant: "destructive" });
      return;
    }
    setLoading(true);

    if (role === "teacher") {
      if (email === TEACHER_CREDENTIALS.email && password === TEACHER_CREDENTIALS.password) {
        localStorage.setItem("nc_role", "teacher");
        localStorage.setItem("nc_user", email);
        navigate("/teacher-dashboard");
      } else {
        toast({ title: "Invalid credentials", description: "Check your email and password", variant: "destructive" });
      }
      setLoading(false);
    } else {
      const student = getStudentByEmailPassword(email, password);
      if (student) {
        localStorage.setItem("nc_role", "student");
        localStorage.setItem("nc_user", student.id);
        navigate("/student-dashboard");
      } else {
        toast({ title: "Invalid credentials", description: "Check your email and password", variant: "destructive" });
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-10 flex flex-col items-center animate-fade-in">
        <div className="icon-box-cyan mb-4 h-16 w-16 animate-pulse-glow">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl font-bold">
          <span className="text-foreground">Net</span>
          <span className="text-primary">Campus</span>
        </h1>
        <p className="mt-2 text-muted-foreground">AI-Powered Attendance System · CKCET</p>
      </div>

      {!selected ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {[
            { type: "student" as const, icon: GraduationCap, label: "Student Login", sub: "Email & Password", gradient: "gradient-purple" },
            { type: "teacher" as const, icon: BookOpen, label: "Teacher Login", sub: "Email & Password", gradient: "gradient-cyan" },
          ].map((card) => (
            <button
              key={card.type}
              onClick={() => setSelected(card.type)}
              className="glass-card group flex w-64 flex-col items-center gap-4 p-8 transition-all hover:border-primary/50 hover:glow-cyan"
            >
              <div className={`icon-box ${card.gradient}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-foreground">{card.label}</p>
                <p className="text-sm text-muted-foreground">{card.sub}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => navigate("/face-attendance")}
            className="glass-card group flex w-64 flex-col items-center gap-4 p-8 transition-all hover:border-primary/50 hover:glow-cyan"
          >
            <div className="icon-box gradient-cyan">
              <Camera className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-semibold text-foreground">Face Attendance</p>
              <p className="text-sm text-muted-foreground">Camera Based</p>
            </div>
          </button>
        </div>
      ) : (
        <div className="glass-card w-full max-w-sm p-8 animate-fade-in">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {selected === "student" ? "Student Login" : "Teacher Login"}
            </h2>
            <button onClick={() => { setSelected(null); setEmail(""); setPassword(""); }} className="text-sm text-muted-foreground hover:text-primary">
              ← Back
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin(selected)}
                className="w-full rounded-lg border border-border bg-secondary px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin(selected)}
                className="w-full rounded-lg border border-border bg-secondary px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => handleLogin(selected)}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg gradient-cyan py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 glow-cyan disabled:opacity-60"
            >
              {loading ? "Logging in..." : <><span>Login</span> <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>

          {selected === "student" && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: syedameer.r@ckcet.ac.in / QAdO22NHns
            </p>
          )}
          {selected === "teacher" && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: teacher@ckcet.ac.in / teacher123
            </p>
          )}
        </div>
      )}

      <p className="mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
        CKCET — Department of Computer Science & Engineering
      </p>
    </div>
  );
};

export default Index;
