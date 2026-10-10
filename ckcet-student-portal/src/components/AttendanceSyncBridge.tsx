import { useEffect } from 'react';

export default function AttendanceSyncBridge() {
  useEffect(() => {
    // Vite dev server ports
    const targetPorts = [5173, 5174, 5175, 8080, 8081];
    const frames: HTMLIFrameElement[] = [];

    targetPorts.forEach(port => {
      // Create a hidden iframe pointing to each port's home page
      const iframe = document.createElement('iframe');
      iframe.src = `http://localhost:${port}/`;
      iframe.style.display = 'none';
      iframe.title = `Attendance Sync Bridge - Port ${port}`;
      document.body.appendChild(iframe);
      frames.push(iframe);
    });

    const handleMessage = (event: MessageEvent) => {
      // Handle the synced data response from the smart-class-monitor
      if (event.data && event.data.type === 'SYNC_ATTENDANCE_DATA') {
        const { students, attendance, periods } = event.data;
        
        let changed = false;
        if (students && localStorage.getItem('netcampus_students_v3') !== students) {
          localStorage.setItem('netcampus_students_v3', students);
          changed = true;
        }
        if (attendance && localStorage.getItem('netcampus_attendance_v3') !== attendance) {
          localStorage.setItem('netcampus_attendance_v3', attendance);
          changed = true;
        }
        if (periods && localStorage.getItem('netcampus_period_attendance_v1') !== periods) {
          localStorage.setItem('netcampus_period_attendance_v1', periods);
          changed = true;
        }

        if (changed) {
          console.log('🔄 Synced live attendance data from smart-class-monitor');
          // Trigger a storage event to force UI update in StudentDashboard
          window.dispatchEvent(new Event('storage'));
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Request sync from all iframes every 2 seconds
    const interval = setInterval(() => {
      frames.forEach(iframe => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'REQUEST_ATTENDANCE_DATA' }, '*');
        }
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
      frames.forEach(iframe => {
        try {
          iframe.remove();
        } catch (e) {
          // ignore
        }
      });
    };
  }, []);

  return null;
}
