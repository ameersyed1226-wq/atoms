import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, ArrowLeft, CheckCircle, XCircle, Loader2, Brain, Clock, BookOpen, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getStudents, markAttendance, markPeriodAttendance } from "@/lib/store";
import { loadModels, extractFaceEmbedding, findMatchingStudent, areModelsLoaded } from "@/lib/faceRecognition";
import {
  getCurrentPeriod,
  isOverallAttendanceTime,
  getTodaySchedule,
  formatTimeDisplay,
  getCurrentDayName,
  isPeriodOver,
  isPeriodUpcoming,
  type CurrentPeriodInfo,
} from "@/lib/timetable";

const FaceAttendance = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [currentPeriodInfo, setCurrentPeriodInfo] = useState<CurrentPeriodInfo | null>(null);
  const [isOverallMode, setIsOverallMode] = useState(false);
  const [result, setResult] = useState<{
    matched: boolean;
    student_name?: string;
    confidence?: string;
    distance?: string;
    subject_name?: string;
    period?: number;
    reason?: string;
  } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Update current period info every 30 seconds
  useEffect(() => {
    const update = () => {
      setCurrentPeriodInfo(getCurrentPeriod());
      setIsOverallMode(isOverallAttendanceTime());
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load AI models on component mount
  useEffect(() => {
    loadModels()
      .then(() => {
        setModelsReady(true);
        setModelsLoading(false);
        console.log('✅ Face recognition models loaded');
      })
      .catch((err) => {
        setModelsLoading(false);
        console.error('❌ Model loading failed:', err);
        toast({
          title: "AI models failed to load",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        });
      });

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  }, []);

  const handleScan = useCallback(async () => {
    setScanning(true);
    setResult(null);

    // Wait for camera to stabilize
    await new Promise(r => setTimeout(r, 2000));

    const video = videoRef.current;
    if (!video) {
      setResult({ matched: false, reason: "Camera not available" });
      setScanning(false);
      return;
    }

    try {
      if (!areModelsLoaded()) {
        setResult({ matched: false, reason: "AI models not loaded. Please refresh the page." });
        setScanning(false);
        return;
      }

      // Extract face embedding from live camera frame
      const faceResult = await extractFaceEmbedding(video);

      stopCamera();

      if (!faceResult) {
        setResult({ matched: false, reason: "No face detected in camera. Make sure your face is clearly visible and well-lit." });
        setScanning(false);
        return;
      }

      // Get all students and find the best match
      const students = getStudents();
      const registeredStudents = students.filter(s => s.face_embedding && s.face_embedding.length > 0);

      if (registeredStudents.length === 0) {
        setResult({ matched: false, reason: "No students have registered their face yet. Ask teacher to register faces first in the Face Register tab." });
        setScanning(false);
        return;
      }

      // Find matching student using AI face comparison
      const matchResult = findMatchingStudent(faceResult.embedding, students);

      if (matchResult.matched && matchResult.student) {
        // Determine current period and subject
        const activePeriod = getCurrentPeriod();
        const overallMode = isOverallAttendanceTime();

        if (activePeriod && !overallMode) {
          // Period-specific attendance — tag to subject
          markPeriodAttendance(
            matchResult.student.id,
            activePeriod.period,
            activePeriod.subjectCode,
            "face"
          );

          setResult({
            matched: true,
            student_name: matchResult.student.name,
            confidence: `${matchResult.confidence}%`,
            distance: `${matchResult.distance}`,
            subject_name: `${activePeriod.subject.short} (${activePeriod.subject.name})`,
            period: activePeriod.period,
          });
          toast({
            title: `✅ ${matchResult.student.name} — Present!`,
            description: `Period ${activePeriod.period}: ${activePeriod.subject.short} | Confidence: ${matchResult.confidence}%`,
          });
        } else {
          // Overall attendance (9:00-9:30 or no active period)
          markAttendance(matchResult.student.id, "present", "face");

          setResult({
            matched: true,
            student_name: matchResult.student.name,
            confidence: `${matchResult.confidence}%`,
            distance: `${matchResult.distance}`,
            subject_name: overallMode ? "Overall Attendance" : "No active period",
          });
          toast({
            title: `✅ ${matchResult.student.name} — Marked Present!`,
            description: `Overall Attendance | Confidence: ${matchResult.confidence}%`,
          });
        }
      } else {
        setResult({
          matched: false,
          reason: "Face not recognized. Your face doesn't match any registered student. Ask your teacher to register your face first.",
        });
        toast({
          title: "Face not recognized",
          description: "No matching student found in the database.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      stopCamera();
      console.error("Face detect error:", e);
      setResult({ matched: false, reason: `Detection failed: ${e.message}` });
      toast({ title: "Detection failed", description: e.message, variant: "destructive" });
    }
    setScanning(false);
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    if (!modelsReady) {
      toast({ title: "⏳ AI models still loading...", description: "Please wait for models to finish loading." });
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setStreaming(true);
            setTimeout(() => handleScan(), 3000);
          }).catch(() => {
            toast({ title: "Camera failed to start", variant: "destructive" });
          });
        };
      }
    } catch {
      toast({ title: "Camera access denied", description: "Please allow camera permission.", variant: "destructive" });
    }
  }, [stopCamera, handleScan, modelsReady]);

  const todaySchedule = getTodaySchedule();
  const dayName = getCurrentDayName();

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <canvas ref={canvasRef} className="hidden" />
      <button onClick={() => { stopCamera(); navigate("/"); }} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Login
      </button>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Current Period Banner */}
        {dayName && (
          <div className={`rounded-2xl p-5 animate-fade-in ${
            isOverallMode
              ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
              : currentPeriodInfo
                ? "bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30"
                : "bg-gradient-to-r from-zinc-500/10 to-zinc-600/10 border border-border"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isOverallMode
                    ? "bg-amber-500/20 text-amber-400"
                    : currentPeriodInfo
                      ? "bg-primary/20 text-primary"
                      : "bg-zinc-500/20 text-muted-foreground"
                }`}>
                  {isOverallMode ? <Calendar className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                </div>
                <div>
                  {isOverallMode ? (
                    <>
                      <p className="font-display text-lg font-bold text-amber-400">Overall Attendance</p>
                      <p className="text-sm text-amber-300/70">9:00 AM — 9:30 AM · College Entry</p>
                    </>
                  ) : currentPeriodInfo ? (
                    <>
                      <p className="font-display text-lg font-bold text-foreground">
                        Period {currentPeriodInfo.period} — {currentPeriodInfo.subject.short}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentPeriodInfo.subject.name} · {formatTimeDisplay(currentPeriodInfo.timing.start)} – {formatTimeDisplay(currentPeriodInfo.timing.end)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-lg font-bold text-foreground">No Active Period</p>
                      <p className="text-sm text-muted-foreground">{dayName} · Break / Free Time</p>
                    </>
                  )}
                </div>
              </div>
              {currentPeriodInfo && !isOverallMode && (
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{currentPeriodInfo.subject.faculty}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Camera Card */}
        <div className="glass-card flex flex-col items-center p-8 animate-fade-in">
          <div className="icon-box-cyan mb-4 h-14 w-14">
            <Camera className="h-7 w-7" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">AI Face Attendance</h2>
          <p className="mb-4 text-sm text-muted-foreground text-center">
            {isOverallMode
              ? "Scan face for overall college attendance"
              : currentPeriodInfo
                ? `Scan face for ${currentPeriodInfo.subject.short} attendance`
                : "Real AI face recognition using TensorFlow.js"
            }
          </p>

          {/* AI Model Status */}
          <div className={`mb-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${
            modelsReady ? "bg-success/20 text-success" :
            modelsLoading ? "bg-warning/20 text-warning" :
            "bg-destructive/20 text-destructive"
          }`}>
            {modelsLoading ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Loading AI Models (SSD + Landmark + Recognition)...</>
            ) : modelsReady ? (
              <><Brain className="h-3 w-3" /> AI Models Ready — 3 Neural Networks Loaded</>
            ) : (
              <><XCircle className="h-3 w-3" /> Models Failed — Refresh to Retry</>
            )}
          </div>

          {/* Camera View */}
          <div className="relative mb-6 w-full overflow-hidden rounded-xl bg-secondary" style={{ aspectRatio: "4/3" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${streaming ? '' : 'hidden'}`}
            />

            {streaming && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-40 border-2 border-primary rounded-full opacity-70 animate-pulse" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="rounded-full bg-background/70 px-3 py-1 text-xs text-primary font-medium">🤖 AI Scanning Face...</span>
                </div>
              </div>
            )}

            {!streaming && !scanning && result && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
                {result.matched ? (
                  <>
                    <CheckCircle className="h-16 w-16 text-success" />
                    <p className="font-display text-lg font-bold text-success">AI Match Found!</p>
                    <p className="text-sm text-foreground text-center">{result.student_name} — Marked Present ✅</p>
                    {result.subject_name && (
                      <p className="text-sm font-semibold text-primary text-center">
                        📚 {result.period ? `Period ${result.period}: ` : ""}{result.subject_name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Confidence: {result.confidence}</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-16 w-16 text-destructive" />
                    <p className="font-display text-lg font-bold text-destructive">No Match</p>
                    <p className="text-sm text-muted-foreground text-center max-w-xs">{result.reason}</p>
                  </>
                )}
              </div>
            )}

            {!streaming && !scanning && !result && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Camera className="h-16 w-16 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">Camera will activate when you click scan</p>
              </div>
            )}

            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-sm font-medium text-primary">🧠 AI analyzing face...</p>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    Extracting 128D face embedding and comparing with registered students
                  </p>
                </div>
              </div>
            )}
          </div>

          {!streaming && !scanning && !result && (
            <button
              onClick={startCamera}
              disabled={!modelsReady}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-cyan py-3 font-semibold text-primary-foreground glow-cyan disabled:opacity-60"
            >
              {modelsReady ? (
                <><Camera className="h-5 w-5" /> Start AI Face Scan</>
              ) : (
                <><Loader2 className="h-5 w-5 animate-spin" /> Waiting for AI Models...</>
              )}
            </button>
          )}

          {!scanning && result && (
            <button onClick={() => { setResult(null); startCamera(); }} className="flex w-full items-center justify-center gap-2 rounded-xl gradient-cyan py-3 font-semibold text-primary-foreground">
              <Camera className="h-5 w-5" /> Scan Again
            </button>
          )}
        </div>

        {/* Today's Timetable */}
        {dayName && todaySchedule.length > 0 && (
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">Today's Schedule — {dayName}</h3>
            </div>
            <div className="space-y-2">
              {todaySchedule.map((entry) => {
                const isActive = currentPeriodInfo?.period === entry.period;
                const isDone = isPeriodOver(entry.period);
                const isUpcoming = isPeriodUpcoming(entry.period);

                return (
                  <div
                    key={entry.period}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-primary/15 border border-primary/30 shadow-lg shadow-primary/5"
                        : isDone
                          ? "bg-secondary/50 opacity-60"
                          : "bg-secondary/30"
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                      isActive
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : isDone
                          ? "bg-success/20 text-success"
                          : "bg-secondary text-muted-foreground"
                    }`}>
                      {isDone ? "✓" : `P${entry.period}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                        {entry.subject.short} — {entry.subject.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeDisplay(entry.timing.start)} – {formatTimeDisplay(entry.timing.end)}
                        {entry.subject.faculty !== "-" && ` · ${entry.subject.faculty}`}
                      </p>
                    </div>
                    {isActive && (
                      <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary whitespace-nowrap">
                        NOW
                      </span>
                    )}
                    {entry.subject.type === "lab" && (
                      <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                        LAB
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-xs font-semibold text-foreground mb-2">🧠 How AI Face Recognition Works</p>
          <ol className="text-xs text-muted-foreground space-y-1">
            <li>1. Camera captures your face</li>
            <li>2. SSD MobileNet detects face location</li>
            <li>3. Face landmark model maps 68 key points</li>
            <li>4. Recognition model extracts 128D face vector</li>
            <li>5. Compare with all registered student vectors</li>
            <li>6. Match if Euclidean distance &lt; 0.6</li>
            <li>7. <strong className="text-primary">Auto-tag attendance to current period's subject</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FaceAttendance;
