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

    const { studentEmail, studentName } = await req.json();

    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('email', studentEmail)
      .single();

    if (!student) {
      return new Response(JSON.stringify({ success: false, error: 'Student not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:24px;color:#fff;">
          <h1 style="margin:0;font-size:22px;">⚠️ Low Attendance Warning</h1>
          <p style="margin:6px 0 0;opacity:0.85;">NetCampus · CKCET</p>
        </div>
        <div style="padding:24px;color:#374151;">
          <p>Dear <strong>${student.name}</strong>,</p>
          <p>Your current attendance is <strong style="color:#dc2626;font-size:20px;">${student.attendance_percentage}%</strong>, which is below the required <strong>75%</strong> threshold.</p>
          <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;margin:16px 0;border-radius:4px;">
            <p style="margin:0;font-weight:600;">Action Required</p>
            <p style="margin:6px 0 0;">You have attended <strong>${student.present_days}</strong> out of <strong>${student.total_days}</strong> days.</p>
            <p style="margin:4px 0 0;">Please attend classes regularly to avoid debarment from examinations.</p>
          </div>
          <p>Contact your class teacher immediately if you have any concerns.</p>
          <p style="color:#6b7280;font-size:12px;margin-top:24px;">This is an automated message from NetCampus AI Attendance System · CKCET</p>
        </div>
      </div>
    </body>
    </html>`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NetCampus <onboarding@resend.dev>',
        to: ['abineshabinesh28305@gmail.com'],
        subject: `⚠️ Low Attendance Warning – ${student.attendance_percentage}% | Action Required`,
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

    // Mark warning sent
    await supabase.from('students').update({ warning_sent: true }).eq('id', student.id);

    return new Response(JSON.stringify({ success: true, message: `Warning sent to ${student.email}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Warning email error:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
