"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Request {
  id: string
  type: "product" | "service" | "newsletter"
  timestamp: string
  status: "pending" | "processed" | "completed"
  data: {
    name: string
    email: string
    phone?: string
    message?: string
    productName?: string
    productPrice?: string
    serviceName?: string
  }
}

interface SiteData {
  siteName: string
  logo?: string
  pixKey: string
  formEmail: string
  requests: Request[]
  hero: {
    title: string
    subtitle: string
    description: string
  }
  services: Array<{
    id: string
    title: string
    description: string
    features: string[]
    icon: string
  }>
  products: Array<{
    id: string
    title: string
    description: string
    price: string
    features: string[]
    icon: string
    previewImages?: string[]
  }>
  blog: Array<{
    id: string
    title: string
    description: string
    date: string
    category: string
    readTime: string
    icon: string
    link?: string
  }>
  contact: {
    phone: string
    email: string
    whatsapp: string
    location: string
    address: string
  }
  company: {
    description: string
    foundedYear: string
  }
}

const defaultSiteData: SiteData = {
  siteName: "TechSolutions",
  pixKey: "thgmolter@gmail.com",
  formEmail: "thgmolter@gmail.com",
  requests: [],
  hero: {
    title: "Soluções Completas em Tecnologia da Informação",
    subtitle: "Tecnologia da Informação",
    description:
      "Oferecemos serviços especializados em formatação, consultoria em TI, configuração de redes e produtos digitais de alta qualidade para impulsionar seu negócio.",
  },
  services: [
    {
      id: "1",
      title: "Formatação de Computadores",
      description: "Formatação completa, instalação de sistema operacional e programas essenciais.",
      features: ["Windows e Linux", "Backup de dados", "Otimização de performance"],
      icon: "Monitor",
    },
    {
      id: "2",
      title: "Configuração de Redes",
      description: "Instalação e configuração de redes cabeadas e wireless para empresas.",
      features: ["Redes corporativas", "Wi-Fi empresarial", "Segurança de rede"],
      icon: "Network",
    },
    {
      id: "3",
      title: "Consultoria em TI",
      description: "Planejamento de equipamentos, upgrades e estratégias tecnológicas.",
      features: ["Análise de necessidades", "Planejamento de upgrades", "Consultoria estratégica"],
      icon: "Settings",
    },
    {
      id: "4",
      title: "Manutenção Preventiva",
      description: "Atualizações regulares e manutenção para evitar problemas futuros.",
      features: ["Limpeza de sistema", "Atualizações de segurança", "Monitoramento"],
      icon: "Shield",
    },
  ],
  products: [
    {
      id: "1",
      title: "Planilha de Controle Financeiro",
      description: "Controle completo de receitas, despesas e fluxo de caixa.",
      price: "R$ 29,90",
      features: ["Controle de receitas e despesas", "Gráficos automáticos", "Relatórios mensais"],
      icon: "FileSpreadsheet",
      previewImages: ["/placeholder-yrg5s.png", "/placeholder-1pv6q.png", "/placeholder-7kb6h.png"],
    },
    {
      id: "2",
      title: "Calculadora de Orçamentos",
      description: "Ferramenta para calcular orçamentos de serviços de TI.",
      price: "R$ 19,90",
      features: ["Cálculo automático", "Modelos personalizáveis", "Exportação em PDF"],
      icon: "Calculator",
      previewImages: ["/placeholder-2vdiz.png", "/placeholder-3bg1a.png"],
    },
    {
      id: "3",
      title: "Sistema de Inventário",
      description: "Controle de equipamentos e componentes de informática.",
      price: "R$ 39,90",
      features: ["Cadastro de equipamentos", "Controle de estoque", "Relatórios detalhados"],
      icon: "Database",
      previewImages: ["/placeholder-urze3.png", "/placeholder-ww09c.png"],
    },
    {
      id: "4",
      title: "Kit de Ferramentas de Diagnóstico",
      description: "Conjunto de programas para diagnóstico de hardware.",
      price: "R$ 49,90",
      features: ["Teste de memória RAM", "Diagnóstico de HD/SSD", "Análise de temperatura"],
      icon: "HardDrive",
      previewImages: ["/placeholder-yis0g.png", "/placeholder-el2ch.png"],
    },
  ],
  blog: [
    {
      id: "1",
      title: "Tendências em Tecnologia para 2024",
      description: "Descubra as principais tendências tecnológicas que vão impactar os negócios este ano.",
      date: "15 de Janeiro, 2024",
      category: "Tendências",
      readTime: "5 min",
      icon: "TrendingUp",
      link: "https://example.com/tendencias-tecnologia-2024",
    },
    {
      id: "2",
      title: "Dicas de Produtividade com Planilhas",
      description: "Como usar planilhas avançadas para automatizar tarefas e aumentar a produtividade.",
      date: "10 de Janeiro, 2024",
      category: "Produtividade",
      readTime: "7 min",
      icon: "Lightbulb",
      link: "https://example.com/produtividade-planilhas",
    },
    {
      id: "3",
      title: "Programas Essenciais para Empresas",
      description: "Lista dos softwares mais importantes para pequenas e médias empresas.",
      date: "5 de Janeiro, 2024",
      category: "Software",
      readTime: "4 min",
      icon: "LinkIcon",
      link: "https://example.com/programas-essenciais",
    },
  ],
  contact: {
    phone: "(24)99315-0820",
    email: "thgmolter@gmail.com",
    whatsapp: "(24)99315-0820",
    location: "São Paulo, SP",
    address: "Atendimento presencial e remoto",
  },
  company: {
    description:
      "Sua parceira em soluções tecnológicas. Oferecemos serviços especializados em informática e produtos digitais de qualidade para impulsionar seu negócio.",
    foundedYear: "2024",
  },
}

interface SiteContextType {
  siteData: SiteData
  updateSiteData: (data: Partial<SiteData>) => void
  updateHero: (hero: Partial<SiteData["hero"]>) => void
  updateService: (id: string, service: Partial<SiteData["services"][0]>) => void
  updateProduct: (id: string, product: Partial<SiteData["products"][0]>) => void
  updateBlogPost: (id: string, post: Partial<SiteData["blog"][0]>) => void
  updateContact: (contact: Partial<SiteData["contact"]>) => void
  updateCompany: (company: Partial<SiteData["company"]>) => void
  addService: (service: Omit<SiteData["services"][0], "id">) => void
  addProduct: (product: Omit<SiteData["products"][0], "id">) => void
  addBlogPost: (post: Omit<SiteData["blog"][0], "id">) => void
  removeService: (id: string) => void
  removeProduct: (id: string) => void
  removeBlogPost: (id: string) => void
  addRequest: (request: Omit<Request, "id" | "timestamp">) => void
  updateRequestStatus: (id: string, status: Request["status"]) => void
  removeRequest: (id: string) => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/site-data")
        if (response.ok) {
          const serverData = await response.json()
          if (Object.keys(serverData).length > 0) {
            setSiteData({
              ...defaultSiteData,
              ...serverData,
              requests: Array.isArray(serverData.requests) ? serverData.requests : [],
            })
          }
        }
      } catch (error) {
        console.error("Error loading site data from server:", error)
        // Fallback to localStorage
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("siteData")
          if (saved) {
            try {
              const parsedData = JSON.parse(saved)
              setSiteData({
                ...defaultSiteData,
                ...parsedData,
                requests: Array.isArray(parsedData.requests) ? parsedData.requests : [],
              })
            } catch (error) {
              console.error("Error loading site data:", error)
              setSiteData(defaultSiteData)
            }
          }
        }
      }
      setIsLoaded(true)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const saveData = async () => {
        try {
          await fetch("/api/site-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(siteData),
          })

          // Also save to localStorage as backup
          if (typeof window !== "undefined") {
            localStorage.setItem("siteData", JSON.stringify(siteData))
          }
        } catch (error) {
          console.error("Error saving site data to server:", error)
          // Fallback to localStorage only
          if (typeof window !== "undefined") {
            localStorage.setItem("siteData", JSON.stringify(siteData))
          }
        }
      }

      saveData()
    }
  }, [siteData, isLoaded])

  const updateSiteData = (data: Partial<SiteData>) => {
    setSiteData((prev) => ({ ...prev, ...data }))
  }

  const updateHero = (hero: Partial<SiteData["hero"]>) => {
    setSiteData((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }))
  }

  const updateService = (id: string, service: Partial<SiteData["services"][0]>) => {
    setSiteData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...service } : s)),
    }))
  }

  const updateProduct = (id: string, product: Partial<SiteData["products"][0]>) => {
    setSiteData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    }))
  }

  const updateBlogPost = (id: string, post: Partial<SiteData["blog"][0]>) => {
    setSiteData((prev) => ({
      ...prev,
      blog: prev.blog.map((b) => (b.id === id ? { ...b, ...post } : b)),
    }))
  }

  const updateContact = (contact: Partial<SiteData["contact"]>) => {
    setSiteData((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }))
  }

  const updateCompany = (company: Partial<SiteData["company"]>) => {
    setSiteData((prev) => ({ ...prev, company: { ...prev.company, ...company } }))
  }

  const addService = (service: Omit<SiteData["services"][0], "id">) => {
    const newService = { ...service, id: Date.now().toString() }
    setSiteData((prev) => ({ ...prev, services: [...prev.services, newService] }))
  }

  const addProduct = (product: Omit<SiteData["products"][0], "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      previewImages: product.previewImages || [],
    }
    setSiteData((prev) => ({ ...prev, products: [...prev.products, newProduct] }))
  }

  const addBlogPost = (post: Omit<SiteData["blog"][0], "id">) => {
    const newPost = { ...post, id: Date.now().toString() }
    setSiteData((prev) => ({ ...prev, blog: [...prev.blog, newPost] }))
  }

  const removeService = (id: string) => {
    setSiteData((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }))
  }

  const removeProduct = (id: string) => {
    setSiteData((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }))
  }

  const removeBlogPost = (id: string) => {
    setSiteData((prev) => ({ ...prev, blog: prev.blog.filter((b) => b.id !== id) }))
  }

  const addRequest = (request: Omit<Request, "id" | "timestamp">) => {
    const newRequest: Request = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString("pt-BR"),
    }
    setSiteData((prev) => ({
      ...prev,
      requests: [newRequest, ...(Array.isArray(prev.requests) ? prev.requests : [])],
    }))
  }

  const updateRequestStatus = (id: string, status: Request["status"]) => {
    setSiteData((prev) => ({
      ...prev,
      requests: Array.isArray(prev.requests) ? prev.requests.map((r) => (r.id === id ? { ...r, status } : r)) : [],
    }))
  }

  const removeRequest = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      requests: Array.isArray(prev.requests) ? prev.requests.filter((r) => r.id !== id) : [],
    }))
  }

  return (
    <SiteContext.Provider
      value={{
        siteData,
        updateSiteData,
        updateHero,
        updateService,
        updateProduct,
        updateBlogPost,
        updateContact,
        updateCompany,
        addService,
        addProduct,
        addBlogPost,
        removeService,
        removeProduct,
        removeBlogPost,
        addRequest,
        updateRequestStatus,
        removeRequest,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}
