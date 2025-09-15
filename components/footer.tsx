"use client"

import { useSite } from "@/contexts/site-context"
import { Monitor, Mail, Phone, MessageCircle } from "lucide-react"

export function Footer() {
  const { siteData } = useSite()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {siteData.logo ? (
                <img
                  src={siteData.logo || "/placeholder.svg"}
                  alt={siteData.siteName}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <Monitor className="h-8 w-8" />
              )}
              <span className="text-2xl font-bold">{siteData.siteName}</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">{siteData.company.description}</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{siteData.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{siteData.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: {siteData.contact.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              {siteData.services.slice(0, 4).map((service) => (
                <li key={service.id}>{service.title}</li>
              ))}
            </ul>
          </div>

          {/* Produtos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produtos Digitais</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Planilhas Especializadas</li>
              <li>Programas de Diagnóstico</li>
              <li>Ferramentas de Produtividade</li>
              <li>Sistemas de Controle</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center space-y-2">
          <p className="text-primary-foreground/60">
            © {siteData.company.foundedYear} {siteData.siteName}. Todos os direitos reservados.
          </p>
          <p className="text-primary-foreground/50 text-sm">
            Desenvolvido e criado por <span className="font-semibold">Thiago de Souza Molter</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
