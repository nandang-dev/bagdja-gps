import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, avl, api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface GpsData {
  lat: number;
  lng: number;
  date_time: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get authentication headers
    const avl = req.headers.get("avl");
    const apiKey = req.headers.get("api-key");

    if (!avl || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing authentication headers (avl or api-key)" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify device authentication
    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .select("id, is_active")
      .eq("avl", avl)
      .eq("api_key", apiKey)
      .single();

    if (deviceError || !device) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication credentials" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!device.is_active) {
      return new Response(
        JSON.stringify({ error: "Device is inactive" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse GPS data from request body
    const gpsData: GpsData = await req.json();

    // Validate GPS data
    if (
      typeof gpsData.lat !== "number" ||
      typeof gpsData.lng !== "number" ||
      typeof gpsData.date_time !== "number"
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid GPS data format. Expected: { lat: number, lng: number, date_time: number }",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate coordinate ranges
    if (gpsData.lat < -90 || gpsData.lat > 90) {
      return new Response(
        JSON.stringify({ error: "Latitude must be between -90 and 90" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (gpsData.lng < -180 || gpsData.lng > 180) {
      return new Response(
        JSON.stringify({ error: "Longitude must be between -180 and 180" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert GPS data into database
    const { data: insertedData, error: insertError } = await supabase
      .from("gps_data")
      .insert({
        device_id: device.id,
        lat: gpsData.lat,
        lng: gpsData.lng,
        date_time: gpsData.date_time,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save GPS data" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "GPS data received successfully",
        data: insertedData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

