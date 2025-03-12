import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Get the request body
    const { platformId } = await req.json();

    if (!platformId) {
      throw new Error("Platform ID is required");
    }

    // Get the platform data
    const { data: platform, error: platformError } = await supabaseClient
      .from("platforms")
      .select("*")
      .eq("id", platformId)
      .eq("creator_id", user.id)
      .single();

    if (platformError || !platform) {
      throw new Error(
        "Platform not found or you do not have permission to deploy it",
      );
    }

    // Simulate deployment process
    // In a real implementation, this would trigger a Vercel deployment or similar
    const deploymentData = {
      platformId: platform.id,
      name: platform.name,
      subdomain: platform.subdomain,
      customDomain: platform.custom_domain,
      deploymentId: `deploy_${Date.now()}`,
      deploymentUrl: `https://${platform.subdomain}.sharp-jennings4-ykw3j.dev-2.tempolabs.ai`,
      status: "success",
      deployedAt: new Date().toISOString(),
    };

    // Update the platform status to active
    const { error: updateError } = await supabaseClient
      .from("platforms")
      .update({ status: "active" })
      .eq("id", platformId);

    if (updateError) {
      throw new Error("Failed to update platform status");
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: deploymentData,
        message: "Platform deployed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
