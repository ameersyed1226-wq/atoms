// @ts-nocheck — This file runs in Deno (Supabase Edge Functions), not Node.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const today = new Date().toISOString().split('T')[0];

    // Get all absent students today
    const { data: absentRecords, error } = await supabase
      .from('attendance_records')
      .select('student_id, students(name, email, department, section, attendance_percentage)')
      .eq('date', today)
      .eq('status', 'absent');

    if (error) throw error;

    const absentStudents = absentRecords?.map((r: any) => r.students).filter(Boolean) || [];

    // Build HTML email
    const tableRows = absentStudents.map((s: any) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${s.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${s.email}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${s.section}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:${s.attendance_percentage < 75 ? '#ef4444' : '#374151'};font-weight:bold;">${s.attendance_percentage}%</td>
      </tr>
    `).join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;">
      <div style="max-width:700px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#0891b2,#06b6d4);padding:24px;color:#fff;">
          <h1 style="margin:0;font-size:22px;">📋 Daily Absent Report</h1>
          <p style="margin:6px 0 0;opacity:0.85;">NetCampus · CKCET · I CSE · ${today}</p>
        </div>
        <div style="padding:24px;">
          <p style="color:#374151;font-size:15px;">
            <strong>${absentStudents.length}</strong> student(s) were absent today (${today}).
          </p>
          ${absentStudents.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 12px;text-align:left;font-weight:600;">Name</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;">Email</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;">Section</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600;">Attendance %</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
          ` : '<p style="color:#6b7280;">No absences recorded today. 🎉</p>'}
          <p style="margin-top:24px;color:#6b7280;font-size:12px;">
            This is an automated report from NetCampus AI Attendance System.
          </p>
        </div>
      </div>
    </body>
    </html>`;

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NetCampus <onboarding@resend.dev>',
        to: ['abineshabinesh28305@gmail.com'],
        subject: `📋 Daily Absent Report – ${today} | ${absentStudents.length} Absent`,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error('Resend error:', errText);
      return new Response(JSON.stringify({ success: false, error: errText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Also auto-send warnings to all low-attendance students who haven't been warned yet
    const { data: lowStudents } = await supabase
      .from('students')
      .select('*')
      .lt('attendance_percentage', 75)
      .eq('warning_sent', false);

    let warningsSent = 0;
    if (lowStudents && lowStudents.length > 0) {
      for (const s of lowStudents) {
        try {
          const warnResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'NetCampus <onboarding@resend.dev>',
              to: ['abineshabinesh28305@gmail.com'],
              subject: `⚠️ Low Attendance Warning – ${s.attendance_percentage}% | Action Required`,
              html: `
              <div style="font-family:Arial;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:24px;color:#fff;">
                  <h1 style="margin:0;">⚠️ Low Attendance Warning</h1>
                </div>
                <div style="padding:24px;color:#374151;">
                  <p>Dear <strong>${s.name}</strong>,</p>
                  <p>Your attendance is <strong style="color:#dc2626;font-size:20px;">${s.attendance_percentage}%</strong> (below 75%).</p>
                  <p>You attended <strong>${s.present_days}/${s.total_days}</strong> days. Please attend regularly.</p>
                  <p style="color:#6b7280;font-size:12px;margin-top:24px;">NetCampus AI Attendance System · CKCET</p>
                </div>
              </div>`,
            }),
          });

          if (warnResponse.ok) {
            await supabase.from('students').update({ warning_sent: true }).eq('id', s.id);
            warningsSent++;
          }
        } catch (e) {
          console.error(`Warning to ${s.email} failed:`, e);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      absentCount: absentStudents.length,
      warningsSent,
      date: today,
      message: `Daily report sent. ${warningsSent} warning emails auto-sent.`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
