# OS Manager - Sistema de Gestão de Ordens de Serviço

**Copyright © 2025 Thiago de Souza Molter**

## 👨‍💻 Desenvolvedor
**Thiago de Souza Molter**  
*Desenvolvedor Full-Stack*

---

## 📋 Sobre o Sistema

Sistema completo de gestão de ordens de serviço desenvolvido com tecnologias modernas, oferecendo uma solução robusta para empresas que precisam gerenciar serviços técnicos, materiais e relatórios de performance.

## 🚀 Tecnologias Utilizadas

### Backend
- **FastAPI 0.110.1** - Framework Python moderno e rápido
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação segura
- **Pydantic** - Validação de dados
- **Motor** - Driver assíncrono para MongoDB

### Frontend
- **React 19** - Biblioteca JavaScript moderna
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes elegantes e acessíveis
- **Lucide React** - Ícones modernos
- **Axios** - Cliente HTTP

### Infraestrutura
- **Docker** - Containerização
- **Kubernetes** - Orquestração
- **Nginx** - Proxy reverso

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login seguro com JWT
- Tipos de usuário (Admin/Técnico)
- Registro de novos usuários

### 📝 Gestão de Ordens de Serviço
- CRUD completo de OS
- Campos detalhados (número, descrição, responsável, prioridade, etc.)
- Sistema de status (Aberta, Em Andamento, Concluída, etc.)
- Filtros e busca avançada

### 📦 Sistema de Materiais
- Solicitação de materiais vinculados às OS
- Fluxo de aprovação (Solicitado → Aprovado → Entregue)
- Controle por administradores

### 📊 Dashboard e Relatórios
- Métricas em tempo real
- Gráficos interativos
- Relatórios completos em CSV
- Análise de performance por técnico

### 🎨 Interface Moderna
- Design responsivo e acessível
- Componentes reutilizáveis
- Animações suaves
- Tema profissional

## 🏗 Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │◄──►│     Backend     │◄──►│    MongoDB      │
│   (React)       │    │   (FastAPI)     │    │   (Database)    │
│   Port: 3000    │    │   Port: 8001    │    │   Port: 27017   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estrutura do Projeto

```
/app/
├── backend/                 # API FastAPI
│   ├── server.py           # Aplicação principal
│   ├── requirements.txt    # Dependências Python
│   └── .env               # Configurações
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── App.js         # Componente principal
│   │   ├── components/    # Componentes React
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ServiceOrders.jsx
│   │   │   ├── Materials.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── ui/        # Componentes Shadcn/UI
│   │   └── App.css        # Estilos personalizados
│   ├── package.json       # Dependências Node.js
│   └── .env              # Configurações frontend
├── COPYRIGHT.md           # Direitos autorais
├── LICENSE               # Licença MIT
└── README.md            # Este arquivo
```

## 🎯 Como Usar

### Acesso Online
**URL:** https://task-manager-77.preview.emergentagent.com  
**Usuário:** `admin`  
**Senha:** `123456`

### Fluxo de Trabalho
1. **Login** → Acessar o sistema
2. **Dashboard** → Visualizar métricas gerais
3. **Criar OS** → Registrar nova ordem de serviço
4. **Solicitar Materiais** → Vincular materiais às OS
5. **Acompanhar Status** → Monitorar progresso
6. **Gerar Relatórios** → Exportar dados em CSV

## 📈 Métricas do Sistema

- ✅ **100% Funcional** - Todas as funcionalidades implementadas
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile
- ✅ **Seguro** - Autenticação JWT e validações
- ✅ **Moderno** - Tecnologias atualizadas
- ✅ **Escalável** - Arquitetura preparada para crescimento

## 📊 Relatórios Disponíveis

### Tipos de Relatório
- **Relatório Geral** - Todos os dados (OS + Materiais)
- **Apenas OS** - Ordens de serviço detalhadas
- **Apenas Materiais** - Solicitações de materiais

### Dados Exportados
- Informações completas das OS
- Status e prioridades
- Desempenho por técnico
- Controle de materiais
- Métricas de conclusão

## 🛡 Segurança

- **Autenticação JWT** - Tokens seguros
- **Validação de dados** - Pydantic + React
- **CORS configurado** - Acesso controlado
- **Senhas criptografadas** - Hash bcrypt
- **Autorização baseada em roles** - Admin/Técnico

## 🎨 Design System

- **Cores modernas** - Paleta profissional
- **Tipografia** - Inter font family
- **Componentes** - Shadcn/UI consistency
- **Animações** - Transições suaves
- **Acessibilidade** - WCAG compliance

## 📝 Histórico de Desenvolvimento

- **31/08/2025** - Desenvolvimento inicial completo
- **31/08/2025** - Sistema de autenticação
- **31/08/2025** - CRUD de Ordens de Serviço
- **31/08/2025** - Sistema de materiais
- **31/08/2025** - Dashboard e métricas
- **31/08/2025** - Sistema de relatórios CSV
- **31/08/2025** - Interface moderna finalizada

## 📞 Contato

Para questões sobre o desenvolvimento ou direitos autorais deste software:

**Desenvolvedor:** Thiago de Souza Molter  
**Sistema:** OS Manager v1.0.0  
**Data:** 31 de Agosto de 2025

---

**© 2025 Thiago de Souza Molter. Todos os direitos reservados.**

*Este é um sistema proprietário desenvolvido com tecnologias modernas para gestão eficiente de ordens de serviço.*
