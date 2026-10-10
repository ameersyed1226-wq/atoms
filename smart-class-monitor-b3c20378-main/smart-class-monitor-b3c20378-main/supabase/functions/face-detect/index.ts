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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { capturedImage } = await req.json();
    if (!capturedImage) throw new Error('No captured image provided');

    // Get all students with registered faces
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .eq('face_registered', true)
      .not('face_image', 'is', null);

    if (error) throw error;
    if (!students || students.length === 0) {
      return new Response(JSON.stringify({ matched: false, reason: 'No registered faces in database' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build comparison prompt with all registered face images
    const imageContents: any[] = [
      {
        type: 'image_url',
        image_url: { url: capturedImage },
      },
    ];

    // Add registered face images (limit to 10 to stay within context)
    const studentsToCompare = students.slice(0, 10);
    for (const s of studentsToCompare) {
      imageContents.push({
        type: 'image_url',
        image_url: { url: s.face_image },
      });
    }

    // Build the student list for the prompt
    const studentList = studentsToCompare.map((s, i) => `Image ${i + 2}: ${s.name} (ID: ${s.id})`).join('\n');

    const prompt = `You are a face recognition system. Compare the FIRST image (the captured webcam photo) against the remaining images which are registered student faces.

The registered students are:
${studentList}

Your task:
1. Analyze the facial features in Image 1 (the webcam capture)
2. Compare it against each registered face image
3. Determine if there is a match based on facial similarity (face shape, eyes, nose, mouth, overall appearance)

IMPORTANT: Be reasonably flexible - the webcam photo may have different lighting, angle, or expression than the registered photo. Focus on core facial structure.

Respond with ONLY a JSON object (no markdown, no code blocks):
{"matched": true, "student_id": "STU001", "student_name": "Name", "confidence": "high"}
or
{"matched": false, "student_id": null, "student_name": null, "confidence": "none"}

confidence can be: "high", "medium", or "low". Only return matched:true if confidence is "medium" or "high".`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              ...imageContents,
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ matched: false, reason: 'Rate limited, try again shortly' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    console.log('AI response:', content);

    // Parse the AI response - extract JSON
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON in response');
      }
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(JSON.stringify({ matched: false, reason: 'AI response parsing failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If matched, also mark attendance and check for low attendance warning
    if (result.matched && result.student_id) {
      const today = new Date().toISOString().split('T')[0];
      
      // Mark attendance
      await supabase.from('attendance_records').upsert({
        student_id: result.student_id,
        date: today,
        status: 'present',
        method: 'face',
      }, { onConflict: 'student_id,date' });

      // Update student stats
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', result.student_id)
        .single();

      if (student) {
        const newPresent = student.present_days + 1;
        const newPct = Math.round((newPresent / student.total_days) * 100);
        await supabase.from('students').update({
          present_days: newPresent,
          attendance_percentage: newPct,
        }).eq('id', result.student_id);
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('face-detect error:', err);
    return new Response(JSON.stringify({ matched: false, reason: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
