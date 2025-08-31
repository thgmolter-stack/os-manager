# 🚀 Guia de Instalação - OS Manager

**Sistema de Gestão de Ordens de Serviço**  
**Desenvolvido por:** Thiago de Souza Molter  
**Versão:** 1.0.0

---

## 📋 Pré-requisitos

### Opção 1: Instalação com Docker (Recomendado)
- ✅ Docker 20.0+
- ✅ Docker Compose 2.0+
- ✅ 2GB de RAM disponível
- ✅ 5GB de espaço em disco

### Opção 2: Instalação Manual
- ✅ Python 3.11+
- ✅ Node.js 18+
- ✅ MongoDB 5.0+
- ✅ 4GB de RAM disponível
- ✅ 10GB de espaço em disco

---

## 🐳 INSTALAÇÃO RÁPIDA COM DOCKER (5 minutos)

### 1. Baixar o Sistema
```bash
# Clone ou baixe o repositório
git clone https://github.com/thiagomolter/os-manager.git
cd os-manager

# OU baixe o arquivo ZIP e extraia
wget https://releases.github.com/thiagomolter/os-manager/v1.0.0.zip
unzip v1.0.0.zip
cd os-manager-1.0.0
```

### 2. Configurar Variáveis
```bash
# Copie os arquivos de exemplo
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml

# Edite as configurações (opcional)
nano .env
```

### 3. Executar o Sistema
```bash
# Inicie todos os serviços
docker-compose up -d

# Aguarde a inicialização (30-60 segundos)
docker-compose logs -f
```

### 4. Acessar o Sistema
- **URL:** http://localhost:3000
- **Usuário padrão:** admin
- **Senha padrão:** admin123

---

## 🔧 INSTALAÇÃO MANUAL COMPLETA

### 1. Preparar o Ambiente

#### MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb

# CentOS/RHEL
sudo yum install -y mongodb-server

# macOS
brew install mongodb-community

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Python e Node.js
```bash
# Python 3.11+
sudo apt install python3.11 python3.11-pip

# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn
npm install -g yarn
```

### 2. Configurar Backend

```bash
cd backend/

# Instalar dependências
pip3 install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
nano .env

# Conteúdo do .env:
MONGO_URL=mongodb://localhost:27017
DB_NAME=os_manager
SECRET_KEY=sua-chave-secreta-super-forte-aqui
CORS_ORIGINS=http://localhost:3000

# Iniciar o backend
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 3. Configurar Frontend

```bash
cd frontend/

# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env
nano .env

# Conteúdo do .env:
REACT_APP_BACKEND_URL=http://localhost:8001

# Compilar e iniciar
yarn build
yarn start
```

---

## 🏢 CONFIGURAÇÃO PARA EMPRESAS

### Configurações de Produção

#### 1. Segurança
```bash
# Gerar chave secreta forte
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Configurar HTTPS (nginx.conf)
server {
    listen 443 ssl;
    server_name sua-empresa.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api {
        proxy_pass http://localhost:8001;
    }
}
```

#### 2. Banco de Dados
```bash
# Configurar MongoDB com autenticação
mongo
> use admin
> db.createUser({
    user: "admin",
    pwd: "senha-super-forte",
    roles: ["userAdminAnyDatabase"]
})

# Atualizar .env
MONGO_URL=mongodb://admin:senha-super-forte@localhost:27017/os_manager?authSource=admin
```

#### 3. Backup Automático
```bash
# Script de backup (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://admin:senha@localhost:27017/os_manager" --out="/backup/os_manager_$DATE"
tar -czf "/backup/os_manager_$DATE.tar.gz" "/backup/os_manager_$DATE"
rm -rf "/backup/os_manager_$DATE"

# Adicionar ao crontab (backup diário às 2h)
0 2 * * * /path/to/backup.sh
```

---

## 🌐 DEPLOYMENT EM NUVEM

### AWS EC2
```bash
# 1. Criar instância EC2 (t3.medium recomendado)
# 2. Instalar Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# 3. Deploy
git clone https://github.com/thiagomolter/os-manager.git
cd os-manager
docker-compose up -d

# 4. Configurar domínio e SSL
sudo yum install -y certbot
sudo certbot --nginx -d sua-empresa.com
```

### Google Cloud Platform
```bash
# 1. Criar VM (e2-standard-2 recomendado)
# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Deploy
git clone https://github.com/thiagomolter/os-manager.git
cd os-manager
docker-compose up -d
```

### DigitalOcean
```bash
# 1. Criar Droplet (2GB RAM mínimo)
# 2. Usar Docker One-Click App
# 3. Deploy
git clone https://github.com/thiagomolter/os-manager.git
cd os-manager
docker-compose up -d
```

---

## 🔍 VERIFICAÇÃO DA INSTALAÇÃO

### Testar Componentes
```bash
# Verificar backend
curl http://localhost:8001/api/
# Resposta esperada: {"message":"Service Order Management API"}

# Verificar frontend
curl http://localhost:3000
# Deve retornar HTML da página de login

# Verificar MongoDB
mongo --eval "db.stats()"
# Deve mostrar estatísticas do banco
```

### Logs de Diagnóstico
```bash
# Logs do Docker
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Logs manuais
# Backend: verificar console onde uvicorn está rodando
# Frontend: verificar console do yarn start
# MongoDB: sudo tail -f /var/log/mongodb/mongod.log
```

---

## 👥 CONFIGURAÇÃO INICIAL

### 1. Primeiro Acesso
1. Acesse: http://localhost:3000
2. Clique em "Registrar"
3. Crie o usuário administrador:
   - Nome: Administrador da Empresa
   - Usuário: admin
   - Email: admin@suaempresa.com
   - Tipo: Administrador
   - Senha: (escolha uma senha forte)

### 2. Configurar Sistema
1. Faça login com o usuário criado
2. Vá para Dashboard
3. Crie a primeira OS de teste
4. Configure técnicos e materiais

---

## 🆘 SUPORTE E SOLUÇÃO DE PROBLEMAS

### Problemas Comuns

#### "Erro de conexão com banco de dados"
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Reiniciar MongoDB
sudo systemctl restart mongod

# Verificar logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### "Backend não inicia"
```bash
# Verificar dependências Python
pip3 install -r requirements.txt

# Verificar porta
sudo netstat -tlnp | grep 8001

# Verificar logs
python3 -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### "Frontend não carrega"
```bash
# Verificar dependências Node.js
yarn install

# Limpar cache
yarn cache clean
rm -rf node_modules package-lock.json
yarn install

# Verificar porta
sudo netstat -tlnp | grep 3000
```

### Contato para Suporte
- **Desenvolvedor:** Thiago de Souza Molter
- **Email:** suporte@osmanager.com
- **Documentação:** https://docs.osmanager.com
- **GitHub Issues:** https://github.com/thiagomolter/os-manager/issues

---

## 📄 LICENÇA E DIREITOS

Este software é propriedade de **Thiago de Souza Molter** e está licenciado sob os termos da licença MIT. Consulte o arquivo LICENSE para mais detalhes.

**© 2025 Thiago de Souza Molter. Todos os direitos reservados.**

---

*Guia de instalação atualizado em: 31 de Agosto de 2025*