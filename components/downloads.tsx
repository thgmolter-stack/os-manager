"use client"

import type React from "react"
import { useState } from "react"
import { useSite } from "@/contexts/site-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Download,
  FileSpreadsheet,
  HardDrive,
  Calculator,
  Database,
  Copy,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const iconMap = {
  FileSpreadsheet,
  Calculator,
  Database,
  HardDrive,
}

export function Downloads() {
  const { siteData, addRequest } = useSite()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showPixKey, setShowPixKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      addRequest({
        type: "product",
        status: "pending",
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          productName: selectedProduct?.title,
          productPrice: selectedProduct?.price,
          message: `Solicitação de produto: ${selectedProduct?.title} - ${selectedProduct?.description}`,
        },
      })

      setShowPixKey(true)
      console.log("[v0] Product request saved successfully")
    } catch (error) {
      console.error("[v0] Error saving request:", error)
      alert("Erro ao processar solicitação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", phone: "", email: "" })
    setShowPixKey(false)
    setSelectedProduct(null)
  }

  const copyPixKey = () => {
    navigator.clipboard.writeText(siteData.pixKey)
    alert("Chave Pix copiada para a área de transferência!")
  }

  const nextImage = () => {
    if (selectedProduct?.previewImages) {
      setCurrentImageIndex((prev) => (prev === selectedProduct.previewImages.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (selectedProduct?.previewImages) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.previewImages.length - 1 : prev - 1))
    }
  }

  const openPreview = (product: any) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
    setShowPreview(true)
  }

  return (
    <section id="downloads" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">Downloads - Planilhas & Programas</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Produtos digitais desenvolvidos para otimizar seu trabalho e aumentar sua produtividade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {siteData.products.map((product) => {
            const IconComponent = iconMap[product.icon as keyof typeof iconMap] || FileSpreadsheet
            return (
              <Card key={product.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <div className="text-2xl font-bold text-primary mt-1">{product.price}</div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-3">
                    {product.previewImages && product.previewImages.length > 0 && (
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => openPreview(product)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Prévia do Produto
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          style={{
                            width: "100%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                            transition: "all 0.2s",
                            height: "36px",
                            padding: "8px 16px",
                            backgroundColor: "#15803d",
                            color: "#ffffff",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#166534"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#15803d"
                          }}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Adquirir Produto
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        {!showPixKey ? (
                          <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="name">Nome Completo</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Telefone</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">E-mail</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                              {isLoading ? "Processando..." : "Solicitar Chave Pix"}
                            </Button>
                          </form>
                        ) : (
                          <div className="text-center space-y-4">
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                              <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                <p className="text-green-800 font-medium">✅ Solicitação registrada!</p>
                              </div>
                              <p className="text-sm text-green-700">
                                Sua solicitação foi registrada em nosso sistema. Use a chave Pix abaixo para pagamento:
                              </p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                              <h3 className="font-semibold mb-2">Chave Pix para Pagamento:</h3>
                              <div className="bg-background p-3 rounded border font-mono text-sm flex items-center justify-between">
                                <span className="break-all">{siteData.pixKey}</span>
                                <Button variant="ghost" size="sm" onClick={copyPixKey} className="ml-2 h-8 w-8 p-0">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">Valor: {selectedProduct?.price}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Após o pagamento, enviaremos o produto por e-mail em até 2 horas úteis.
                            </p>
                            <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
                              Fechar
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Prévia: {selectedProduct?.title}</DialogTitle>
              <DialogDescription>Veja como será o produto antes de adquirir</DialogDescription>
            </DialogHeader>

            {selectedProduct?.previewImages && (
              <div className="relative">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.previewImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`Preview ${currentImageIndex + 1} de ${selectedProduct.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {selectedProduct.previewImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <div className="flex justify-center mt-4 space-x-2">
                      {selectedProduct.previewImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Imagem {currentImageIndex + 1} de {selectedProduct.previewImages.length}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
