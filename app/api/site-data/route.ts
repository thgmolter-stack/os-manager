import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const DATA_FILE = join(DATA_DIR, "site-data.json")

export async function GET() {
  try {
    // Ensure data directory exists
    await mkdir(DATA_DIR, { recursive: true })

    const data = await readFile(DATA_FILE, "utf-8")
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    // Return empty object if file doesn't exist
    return NextResponse.json({})
  }
}

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()

    // Ensure data directory exists
    await mkdir(DATA_DIR, { recursive: true })

    // Save data to file
    await writeFile(DATA_FILE, JSON.stringify(siteData, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving site data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
