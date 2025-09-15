import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SiteProvider } from "@/contexts/site-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "TechSolutions - Serviços de Informática e Produtos Digitais | Thiago Molter",
  description:
    "Serviços especializados em formatação de computadores, consultoria em TI, configuração de redes e produtos digitais de qualidade. Atendimento profissional e personalizado.",
  keywords:
    "formatação computador, consultoria TI, configuração redes, produtos digitais, manutenção computador, suporte técnico, Thiago Molter",
  authors: [{ name: "Thiago de Souza Molter" }],
  creator: "Thiago de Souza Molter",
  publisher: "TechSolutions",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TechSolutions - Serviços de Informática e Produtos Digitais",
    description:
      "Serviços especializados em formatação de computadores, consultoria em TI, configuração de redes e produtos digitais de qualidade.",
    type: "website",
    locale: "pt_BR",
    siteName: "TechSolutions",
    url: "https://seu-dominio.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSolutions - Serviços de Informática e Produtos Digitais",
    description:
      "Serviços especializados em formatação de computadores, consultoria em TI, configuração de redes e produtos digitais de qualidade.",
  },
  verification: {
    google: "google93edd1f8058c089c",
  },
  alternates: {
    canonical: "https://seu-dominio.com",
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "TechSolutions",
              description:
                "Serviços especializados em formatação de computadores, consultoria em TI, configuração de redes e produtos digitais de qualidade.",
              founder: {
                "@type": "Person",
                name: "Thiago de Souza Molter",
              },
              serviceType: [
                "Formatação de Computadores",
                "Consultoria em TI",
                "Configuração de Redes",
                "Produtos Digitais",
              ],
              areaServed: "Brasil",
              email: "thgmolter@gmail.com",
              telephone: "(24)99315-0820",
              url: "https://seu-dominio.com",
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SiteProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </SiteProvider>
      </body>
    </html>
  )
}
