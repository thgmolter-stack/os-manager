"use client"

import { useSite } from "@/contexts/site-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"

export function Hero() {
  const { siteData } = useSite()

  const scrollToContact = () => {
    const element = document.getElementById("contato")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="inicio" className="pt-20 pb-16 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            {siteData.hero.title.includes("Tecnologia da Informação") ? (
              <>
                Soluções Completas em <span className="text-primary">{siteData.hero.subtitle}</span>
              </>
            ) : (
              siteData.hero.title
            )}
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            {siteData.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={scrollToContact} className="group">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Conhecer Serviços
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confiabilidade</h3>
              <p className="text-muted-foreground">Mais de 5 anos de experiência em soluções tecnológicas</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Agilidade</h3>
              <p className="text-muted-foreground">Atendimento rápido e soluções eficientes para suas necessidades</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Suporte</h3>
              <p className="text-muted-foreground">Acompanhamento personalizado e suporte técnico especializado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
