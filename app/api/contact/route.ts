import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, formEmail } = await request.json()

    // Validação dos campos obrigatórios
    if (!name || !email || !phone || !subject || !message || !formEmail) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Criar o corpo do email
    const emailBody = `
Nome: ${name}
Email: ${email}
Telefone: ${phone}
Assunto: ${subject}

Mensagem:
${message}

---
Enviado através do formulário de contato do site
Data: ${new Date().toLocaleString("pt-BR")}
    `.trim()

    // Criar o link mailto
    const mailtoLink = `mailto:${formEmail}?subject=${encodeURIComponent(`Contato do site - ${subject}`)}&body=${encodeURIComponent(emailBody)}`

    return NextResponse.json({
      success: true,
      message: "Formulário processado com sucesso",
      mailtoLink,
    })
  } catch (error) {
    console.error("Erro ao processar formulário:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
