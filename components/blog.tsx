"use client"
import { useState } from "react"
import type React from "react"

import { useSite } from "@/contexts/site-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Lightbulb, LinkIcon, BookOpen, Mail, CheckCircle } from "lucide-react"

const iconMap = {
  TrendingUp,
  Lightbulb,
  LinkIcon,
  BookOpen,
}

export function Blog() {
  const { siteData, addRequest } = useSite()
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) {
      alert("Por favor, digite seu e-mail")
      return
    }

    setIsSubscribing(true)

    try {
      addRequest({
        type: "newsletter",
        status: "pending",
        data: {
          name: "Inscrição Newsletter",
          email: newsletterEmail,
          message: "Solicitação de inscrição na newsletter para receber dicas digitais",
        },
      })

      setIsSubscribed(true)
      setNewsletterEmail("")
      console.log("[v0] Newsletter subscription saved successfully")
    } catch (error) {
      console.error("Erro ao processar inscrição:", error)
      alert("Erro ao processar inscrição. Tente novamente.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <section id="blog" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Blog - Dicas Digitais</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Mantenha-se atualizado com as últimas novidades em tecnologia, dicas de produtividade e tutoriais
            especializados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteData.blog.map((post) => {
            const IconComponent = iconMap[post.icon as keyof typeof iconMap] || BookOpen
            return (
              <Card
                key={post.id}
                className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  if (post.link) {
                    window.open(post.link, "_blank", "noopener,noreferrer")
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {post.date}
                    </div>
                    {post.link && <div className="text-xs text-primary font-medium">Clique para ler →</div>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          {isSubscribed ? (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 font-medium">✅ Inscrição realizada!</p>
                </div>
                <p className="text-sm text-green-700">
                  Sua inscrição na newsletter foi registrada com sucesso. Em breve você receberá nossas dicas!
                </p>
              </div>
              <Button onClick={() => setIsSubscribed(false)} variant="outline" className="mt-4">
                Fazer Nova Inscrição
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">Quer receber nossas dicas por e-mail?</p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" disabled={isSubscribing || !newsletterEmail}>
                  {isSubscribing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Inscrevendo...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Inscrever-se
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
