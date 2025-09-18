"use client"

import type React from "react"

import { useState } from "react"
import { useSite } from "@/contexts/site-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Home,
  Briefcase,
  Download,
  BookOpen,
  Phone,
  Plus,
  Trash2,
  Save,
  Inbox,
  CheckCircle,
  Clock,
  X,
  FileDown,
  FileUp,
  Share2,
} from "lucide-react"

export default function AdminPage() {
  const {
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
    updateRequestStatus,
    removeRequest,
    generateShareableUrl,
  } = useSite()

  const [activeTab, setActiveTab] = useState("geral")
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleExportData = () => {
    const dataStr = JSON.stringify(siteData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `site-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    alert("Configurações exportadas com sucesso!")
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          // Validate that it's a valid site data structure
          if (importedData.siteName && importedData.hero && importedData.services) {
            // Update all site data
            Object.keys(importedData).forEach((key) => {
              updateSiteData({ [key]: importedData[key] })
            })
            alert("Configurações importadas com sucesso!")
            window.location.reload() // Refresh to show all changes
          } else {
            alert("Arquivo inválido. Certifique-se de importar um arquivo de configuração válido.")
          }
        } catch (error) {
          alert("Erro ao importar arquivo. Verifique se o arquivo está no formato correto.")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateSiteData({ logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveChanges = () => {
    alert("Alterações salvas com sucesso!")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        )
      case "processed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Processado
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Concluído
          </Badge>
        )
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  const handlePreviewImageUpload = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const readers = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then((results) => {
        const product = siteData.products.find((p) => p.id === productId)
        const currentImages = product?.previewImages || []
        updateProduct(productId, {
          previewImages: [...currentImages, ...results],
        })
      })
    }
  }

  const removePreviewImage = (productId: string, imageIndex: number) => {
    const product = siteData.products.find((p) => p.id === productId)
    if (product?.previewImages) {
      const newImages = product.previewImages.filter((_, index) => index !== imageIndex)
      updateProduct(productId, { previewImages: newImages })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                <p className="text-muted-foreground">Gerencie o conteúdo do seu site</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="default"
                onClick={generateShareableUrl}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartilhar Site</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExportData}
                className="flex items-center space-x-2 bg-transparent"
              >
                <FileDown className="h-4 w-4" />
                <span>Exportar Config</span>
              </Button>
              <div>
                <Input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-config" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("import-config")?.click()}
                  className="flex items-center space-x-2"
                >
                  <FileUp className="h-4 w-4" />
                  <span>Importar Config</span>
                </Button>
              </div>
              <Button onClick={handleSaveChanges} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </Button>
              <Button variant="outline" asChild>
                <a href="/">Ver Site</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">🚀 Compartilhamento Automático:</h3>
          <ol className="text-sm text-green-800 space-y-1">
            <li>1. Faça suas alterações no painel admin</li>
            <li>2. Clique em "Compartilhar Site" para gerar um link automático</li>
            <li>3. O link será copiado automaticamente - envie para qualquer pessoa</li>
            <li>4. Quem acessar o link verá todas as suas alterações automaticamente!</li>
          </ol>
          <p className="text-xs text-green-700 mt-2">💡 Não precisa mais exportar/importar arquivos manualmente!</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="geral" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Geral</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Início</span>
            </TabsTrigger>
            <TabsTrigger value="servicos" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="produtos" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Produtos</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="contato" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Contato</span>
            </TabsTrigger>
            <TabsTrigger value="solicitacoes" className="flex items-center space-x-2">
              <Inbox className="h-4 w-4" />
              <span>Solicitações</span>
              {siteData.requests.filter((r) => r.status === "pending").length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  {siteData.requests.filter((r) => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais do Site</CardTitle>
                <CardDescription>Configure o nome do site, logo e informações da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="siteName">Nome do Site</Label>
                    <Input
                      id="siteName"
                      value={siteData.siteName}
                      onChange={(e) => updateSiteData({ siteName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">Logo do Site</Label>
                    <div className="flex items-center space-x-4">
                      <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="flex-1" />
                      {siteData.logo && (
                        <img
                          src={siteData.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="h-12 w-12 object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pixKey">Chave Pix</Label>
                    <Input
                      id="pixKey"
                      value={siteData.pixKey}
                      onChange={(e) => updateSiteData({ pixKey: e.target.value })}
                      placeholder="Digite sua chave Pix (email, CPF, telefone ou chave aleatória)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="formEmail">Email para Formulários</Label>
                    <Input
                      id="formEmail"
                      type="email"
                      value={siteData.formEmail}
                      onChange={(e) => updateSiteData({ formEmail: e.target.value })}
                      placeholder="Email que receberá os formulários do site"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Este email receberá todas as mensagens enviadas pelos formulários do site
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyDescription">Descrição da Empresa</Label>
                  <Textarea
                    id="companyDescription"
                    value={siteData.company.description}
                    onChange={(e) => updateCompany({ description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="foundedYear">Ano de Fundação</Label>
                  <Input
                    id="foundedYear"
                    value={siteData.company.foundedYear}
                    onChange={(e) => updateCompany({ foundedYear: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seção Principal (Hero)</CardTitle>
                <CardDescription>Configure o conteúdo da seção principal do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">Título Principal</Label>
                  <Input
                    id="heroTitle"
                    value={siteData.hero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Input
                    id="heroSubtitle"
                    value={siteData.hero.subtitle}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="heroDescription">Descrição</Label>
                  <Textarea
                    id="heroDescription"
                    value={siteData.hero.description}
                    onChange={(e) => updateHero({ description: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Serviços</h2>
              <Button
                onClick={() =>
                  addService({
                    title: "Novo Serviço",
                    description: "Descrição do serviço",
                    features: ["Recurso 1", "Recurso 2"],
                    icon: "Monitor",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siteData.services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Editar Serviço</CardTitle>
                      <Button variant="destructive" size="sm" onClick={() => removeService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, { title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, { description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Recursos (separados por vírgula)</Label>
                      <Input
                        value={service.features.join(", ")}
                        onChange={(e) =>
                          updateService(service.id, {
                            features: e.target.value.split(", ").filter((f) => f.trim()),
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="produtos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
              <Button
                onClick={() =>
                  addProduct({
                    title: "Novo Produto",
                    description: "Descrição do produto",
                    price: "R$ 0,00",
                    features: ["Recurso 1", "Recurso 2"],
                    icon: "FileSpreadsheet",
                    previewImages: [],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {siteData.products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Editar Produto</CardTitle>
                      <Button variant="destructive" size="sm" onClick={() => removeProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={product.title}
                          onChange={(e) => updateProduct(product.id, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Preço</Label>
                        <Input
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={product.description}
                        onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Recursos (separados por vírgula)</Label>
                      <Input
                        value={product.features.join(", ")}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            features: e.target.value.split(", ").filter((f) => f.trim()),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Imagens de Prévia</Label>
                        <div>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handlePreviewImageUpload(product.id, e)}
                            className="hidden"
                            id={`preview-upload-${product.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`preview-upload-${product.id}`)?.click()}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Imagens
                          </Button>
                        </div>
                      </div>

                      {product.previewImages && product.previewImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {product.previewImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePreviewImage(product.id, index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {(!product.previewImages || product.previewImages.length === 0) && (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma imagem de prévia adicionada. Clique em "Adicionar Imagens" para fazer upload.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Blog</h2>
              <Button
                onClick={() =>
                  addBlogPost({
                    title: "Novo Post",
                    description: "Descrição do post",
                    date: new Date().toLocaleDateString("pt-BR"),
                    category: "Geral",
                    readTime: "5 min",
                    icon: "BookOpen",
                    link: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Post
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siteData.blog.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Editar Post</CardTitle>
                      <Button variant="destructive" size="sm" onClick={() => removeBlogPost(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input value={post.title} onChange={(e) => updateBlogPost(post.id, { title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={post.description}
                        onChange={(e) => updateBlogPost(post.id, { description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Link do Post (opcional)</Label>
                      <Input
                        value={post.link || ""}
                        onChange={(e) => updateBlogPost(post.id, { link: e.target.value })}
                        placeholder="https://exemplo.com/meu-post"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={post.category}
                          onChange={(e) => updateBlogPost(post.id, { category: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Tempo de Leitura</Label>
                        <Input
                          value={post.readTime}
                          onChange={(e) => updateBlogPost(post.id, { readTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Data</Label>
                      <Input value={post.date} onChange={(e) => updateBlogPost(post.id, { date: e.target.value })} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contato" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Configure as informações de contato da empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={siteData.contact.phone}
                      onChange={(e) => updateContact({ phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      value={siteData.contact.email}
                      onChange={(e) => updateContact({ email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={siteData.contact.whatsapp}
                      onChange={(e) => updateContact({ whatsapp: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={siteData.contact.location}
                      onChange={(e) => updateContact({ location: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Endereço/Observações</Label>
                  <Input
                    id="address"
                    value={siteData.contact.address}
                    onChange={(e) => updateContact({ address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solicitacoes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Solicitações Recebidas</h2>
                <p className="text-muted-foreground">
                  Gerencie todas as solicitações de produtos, serviços e newsletter
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Total: {siteData.requests.length}</Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pendentes: {siteData.requests.filter((r) => r.status === "pending").length}
                </Badge>
              </div>
            </div>

            {siteData.requests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação ainda</h3>
                  <p className="text-muted-foreground text-center">
                    As solicitações de produtos, serviços e newsletter aparecerão aqui
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {siteData.requests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {request.type === "product" && <Download className="h-5 w-5 text-blue-600" />}
                            {request.type === "service" && <Briefcase className="h-5 w-5 text-green-600" />}
                            {request.type === "newsletter" && <BookOpen className="h-5 w-5 text-purple-600" />}
                            <div>
                              <CardTitle className="text-lg">
                                {request.type === "product" && `Produto: ${request.data.productName}`}
                                {request.type === "service" && `Serviço: ${request.data.serviceName}`}
                                {request.type === "newsletter" && "Inscrição Newsletter"}
                              </CardTitle>
                              <CardDescription>
                                {request.timestamp} • {request.data.name}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(request.status)}
                          <Button variant="ghost" size="sm" onClick={() => removeRequest(request.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Dados do Cliente</Label>
                          <div className="mt-1 space-y-1">
                            <p>
                              <strong>Nome:</strong> {request.data.name}
                            </p>
                            <p>
                              <strong>E-mail:</strong> {request.data.email}
                            </p>
                            {request.data.phone && (
                              <p>
                                <strong>Telefone:</strong> {request.data.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Detalhes da Solicitação</Label>
                          <div className="mt-1 space-y-1">
                            {request.data.productPrice && (
                              <p>
                                <strong>Preço:</strong> {request.data.productPrice}
                              </p>
                            )}
                            {request.data.message && (
                              <p>
                                <strong>Mensagem:</strong> {request.data.message}
                              </p>
                            )}
                            <p>
                              <strong>Chave Pix:</strong> {siteData.pixKey}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, "processed")}
                          disabled={request.status === "processed" || request.status === "completed"}
                        >
                          Marcar como Processado
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, "completed")}
                          disabled={request.status === "completed"}
                        >
                          Marcar como Concluído
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, "pending")}
                          disabled={request.status === "pending"}
                        >
                          Voltar para Pendente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
