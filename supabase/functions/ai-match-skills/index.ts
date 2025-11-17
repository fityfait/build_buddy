import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  projectSkills: string[];
  studentSkills: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { projectSkills, studentSkills }: RequestBody = await req.json();

    if (!projectSkills || !studentSkills) {
      return new Response(
        JSON.stringify({ error: "Both projectSkills and studentSkills are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const projectSet = new Set(projectSkills.map(s => s.toLowerCase()));
    const studentSet = new Set(studentSkills.map(s => s.toLowerCase()));

    const matchingSkills = [...projectSet].filter(skill => studentSet.has(skill));
    const missingSkills = [...projectSet].filter(skill => !studentSet.has(skill));
    const extraSkills = [...studentSet].filter(skill => !projectSet.has(skill));

    let matchPercentage = 0;
    if (projectSkills.length > 0) {
      matchPercentage = Math.round((matchingSkills.length / projectSkills.length) * 100);
    }

    let explanation = '';
    if (matchPercentage >= 80) {
      explanation = 'Excellent match! You have most of the required skills for this project.';
    } else if (matchPercentage >= 60) {
      explanation = 'Good match! You have many of the required skills. Consider learning the missing skills.';
    } else if (matchPercentage >= 40) {
      explanation = 'Moderate match. You have some relevant skills, but may need to learn several new technologies.';
    } else if (matchPercentage >= 20) {
      explanation = 'Low match. This project requires skills you may need to develop first.';
    } else {
      explanation = 'Minimal match. Consider building foundational skills before applying to this project.';
    }

    const response = {
      matchPercentage,
      explanation,
      matchingSkills,
      missingSkills,
      extraSkills,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});