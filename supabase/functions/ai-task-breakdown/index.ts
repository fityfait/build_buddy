import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  description: string;
  duration?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { description, duration }: RequestBody = await req.json();

    if (!description || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Project description is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const roadmap = {
      phases: [
        {
          name: "Planning & Setup",
          duration: "Week 1-2",
          tasks: [
            "Define project requirements and scope",
            "Set up development environment",
            "Create project architecture diagram",
            "Set up version control and CI/CD",
            "Design database schema"
          ]
        },
        {
          name: "Core Development",
          duration: "Week 3-8",
          tasks: [
            "Implement authentication system",
            "Build core features and functionality",
            "Develop API endpoints",
            "Create user interface components",
            "Integrate third-party services"
          ]
        },
        {
          name: "Testing & Refinement",
          duration: "Week 9-11",
          tasks: [
            "Write unit and integration tests",
            "Perform security audit",
            "Optimize performance",
            "Fix bugs and refine features",
            "Conduct user testing"
          ]
        },
        {
          name: "Deployment & Documentation",
          duration: "Week 12-13",
          tasks: [
            "Prepare production environment",
            "Deploy application",
            "Write user documentation",
            "Create technical documentation",
            "Plan for future enhancements"
          ]
        }
      ],
      milestones: [
        {
          name: "Project Kickoff",
          description: "Team assembled and project scope defined"
        },
        {
          name: "MVP Complete",
          description: "Core functionality working end-to-end"
        },
        {
          name: "Beta Release",
          description: "Feature-complete version ready for testing"
        },
        {
          name: "Production Launch",
          description: "Project deployed and publicly available"
        }
      ],
      recommendations: [
        "Use agile methodology with weekly sprints",
        "Hold daily standup meetings to track progress",
        "Maintain clear documentation throughout",
        "Conduct code reviews for all pull requests",
        "Set up automated testing early in development"
      ]
    };

    return new Response(JSON.stringify(roadmap), {
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