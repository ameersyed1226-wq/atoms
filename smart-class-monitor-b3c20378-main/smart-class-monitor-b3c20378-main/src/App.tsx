import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getPeriodAttendance } from "@/lib/store";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import FaceAttendance from "./pages/FaceAttendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'REQUEST_ATTENDANCE_DATA') {
        // Trigger auto-absent calculations prior to syncing
        getPeriodAttendance();

        const students = localStorage.getItem('netcampus_students_v3');
        const attendance = localStorage.getItem('netcampus_attendance_v3');
        const periods = localStorage.getItem('netcampus_period_attendance_v1');
        
        if (event.source) {
          (event.source as WindowProxy).postMessage({
            type: 'SYNC_ATTENDANCE_DATA',
            students,
            attendance,
            periods
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/face-attendance" element={<FaceAttendance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
