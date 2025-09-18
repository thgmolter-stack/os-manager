import { type NextRequest, NextResponse } from "next/server"

// Como não temos banco de dados configurado, vamos usar uma abordagem híbrida
// que funciona com localStorage no cliente

export async function GET() {
  try {
    // Retorna dados vazios para forçar uso do localStorage
    // Isso garante que cada usuário veja suas próprias alterações
    return new NextResponse("{}", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("[v0] API: Error in GET:", error)
    return new NextResponse("{}", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const siteData = await request.json()
    console.log("[v0] API: Data received for saving")

    // Por enquanto, apenas confirmamos o recebimento
    // Os dados são salvos no localStorage pelo cliente
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API: Error in POST:", error)
    return NextResponse.json({ error: "Failed to process data" }, { status: 500 })
  }
}
