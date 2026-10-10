
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  leave_date DATE NOT NULL,
  leave_end_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  teacher_remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read leave_requests" ON public.leave_requests FOR SELECT USING (true);
CREATE POLICY "Allow all insert leave_requests" ON public.leave_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update leave_requests" ON public.leave_requests FOR UPDATE USING (true);
CREATE POLICY "Allow all delete leave_requests" ON public.leave_requests FOR DELETE USING (true);

CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
