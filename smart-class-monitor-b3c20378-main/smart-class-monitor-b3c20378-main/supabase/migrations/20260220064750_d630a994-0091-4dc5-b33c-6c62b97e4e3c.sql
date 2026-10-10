
-- Create students table
CREATE TABLE public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'CSE',
  year TEXT NOT NULL DEFAULT '2nd Year',
  section TEXT NOT NULL DEFAULT 'I CSE',
  face_registered BOOLEAN NOT NULL DEFAULT false,
  face_image TEXT,
  attendance_percentage INTEGER NOT NULL DEFAULT 0,
  present_days INTEGER NOT NULL DEFAULT 0,
  total_days INTEGER NOT NULL DEFAULT 120,
  warning_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  method TEXT NOT NULL DEFAULT 'manual' CHECK (method IN ('face', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Teacher (anon) can read all students (no auth yet, using anon key for now)
CREATE POLICY "Allow all read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow all insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow all delete students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Allow all read attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Allow all insert attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update attendance" ON public.attendance_records FOR UPDATE USING (true);
CREATE POLICY "Allow all delete attendance" ON public.attendance_records FOR DELETE USING (true);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
