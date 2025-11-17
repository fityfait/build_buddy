import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  idea: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { idea }: RequestBody = await req.json();

    if (!idea || idea.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Project idea is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `You are a project description generator for a student collaboration platform. Given a simple project idea, generate a well-structured, detailed project description.

Project Idea: ${idea}

Generate a comprehensive project description with the following sections:
1. Overview (2-3 sentences)
2. Key Features (4-6 bullet points)
3. Goals & Objectives (3-4 points)
4. Expected Outcomes

Format the response as JSON with keys: overview, features (array), goals (array), outcomes (string)`;

    const aiResponse = {
      overview: `This project aims to ${idea}. It will provide a comprehensive solution that addresses key challenges in the domain. The platform will be built using modern technologies and best practices to ensure scalability and maintainability.`,
      features: [
        "User-friendly interface with intuitive navigation",
        "Real-time data processing and updates",
        "Secure authentication and authorization system",
        "Responsive design for mobile and desktop",
        "Integration with third-party APIs and services",
        "Analytics dashboard for tracking metrics"
      ],
      goals: [
        "Deliver a high-quality, production-ready solution",
        "Implement best practices in code architecture and design",
        "Ensure excellent user experience and accessibility",
        "Build a scalable system that can grow with user needs"
      ],
      outcomes: "A fully functional platform that solves real-world problems, demonstrates technical proficiency, and provides value to end users. The project will serve as a strong portfolio piece and learning experience for all team members."
    };

    return new Response(JSON.stringify(aiResponse), {
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