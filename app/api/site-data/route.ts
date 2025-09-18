import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("site_config").select("data").eq("id", "default").limit(1).single()

    if (error) {
      if (error.message.includes("Could not find the table")) {
        console.log("[v0] API: Table 'site_config' not found. Please run the SQL script to create it.")
        return NextResponse.json(
          {
            error: "TABLE_NOT_FOUND",
            message: "Please run the SQL script to create the site_config table",
          },
          { status: 200 },
        )
      }

      if (error.code === "PGRST116") {
        console.log("[v0] API: No config found, returning defaults")
        return NextResponse.json({})
      }

      console.error("[v0] API: Error loading from Supabase:", error.message)
      return NextResponse.json(
        {
          error: "SUPABASE_ERROR",
          message: "Using local storage fallback",
        },
        { status: 200 },
      )
    }

    const configData = data?.data || {}
    console.log("[v0] API: Site data loaded from Supabase")

    return NextResponse.json(configData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("[v0] API: Error in GET:", error)
    return NextResponse.json(
      {
        error: "SUPABASE_ERROR",
        message: "Using local storage fallback",
      },
      { status: 200 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("site_config").upsert({
      id: "default",
      data: siteData,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      if (error.message.includes("Could not find the table")) {
        console.log("[v0] API: Table 'site_config' not found. Data not saved to Supabase.")
        return NextResponse.json(
          {
            error: "TABLE_NOT_FOUND",
            message: "Please run the SQL script to create the site_config table",
          },
          { status: 200 },
        )
      }

      console.error("[v0] API: Error updating Supabase:", error.message)
      return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
    }

    console.log("[v0] API: Site data saved to Supabase successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API: Error in POST:", error)
    return NextResponse.json(
      {
        error: "SUPABASE_ERROR",
        message: "Data not saved to Supabase",
      },
      { status: 200 },
    )
  }
}
