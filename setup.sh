#!/bin/bash

# OS Manager - Setup Automático
# Desenvolvido por: Thiago de Souza Molter
# Versão: 1.0.0

set -e

echo "🚀 OS Manager - Setup Automático"
echo "Desenvolvido por: Thiago de Souza Molter"
echo "================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   log_error "Este script não deve ser executado como root"
   exit 1
fi

# Detectar sistema operacional
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
        elif [ -f /etc/redhat-release ]; then
            OS="redhat"
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    else
        log_error "Sistema operacional não suportado: $OSTYPE"
        exit 1
    fi
    log_info "Sistema detectado: $OS"
}

# Instalar Docker
install_docker() {
    log_info "Verificando instalação do Docker..."
    
    if command -v docker &> /dev/null; then
        log_success "Docker já está instalado"
        return
    fi
    
    log_info "Instalando Docker..."
    
    case $OS in
        "debian")
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            ;;
        "redhat")
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            sudo systemctl start docker
            sudo systemctl enable docker
            ;;
        "macos")
            log_warning "Para macOS, instale Docker Desktop manualmente:"
            log_warning "https://www.docker.com/products/docker-desktop"
            exit 1
            ;;
    esac
    
    # Adicionar usuário ao grupo docker
    sudo usermod -aG docker $USER
    log_success "Docker instalado com sucesso"
    log_warning "IMPORTANTE: Faça logout e login novamente para usar Docker sem sudo"
}

# Instalar Docker Compose
install_docker_compose() {
    log_info "Verificando Docker Compose..."
    
    if docker compose version &> /dev/null; then
        log_success "Docker Compose já está disponível"
        return
    fi
    
    log_info "Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose instalado"
}

# Configurar ambiente
setup_environment() {
    log_info "Configurando ambiente..."
    
    # Copiar arquivo de exemplo se não existir
    if [ ! -f .env ]; then
        cp .env.example .env
        log_success "Arquivo .env criado"
        
        # Gerar chave secreta
        SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))" 2>/dev/null || openssl rand -base64 32)
        sed -i "s/gere-uma-chave-secreta-forte-aqui/$SECRET_KEY/g" .env
        
        # Gerar senha do MongoDB
        MONGO_PASSWORD=$(python3 -c "import secrets; print(secrets.token_urlsafe(16))" 2>/dev/null || openssl rand -base64 16)
        sed -i "s/senha-super-forte-aqui/$MONGO_PASSWORD/g" .env
        
        log_success "Chaves de segurança geradas automaticamente"
    else
        log_warning "Arquivo .env já existe, mantendo configurações atuais"
    fi
}

# Iniciar serviços
start_services() {
    log_info "Iniciando serviços..."
    
    # Build e start
    docker compose build --no-cache
    docker compose up -d
    
    log_info "Aguardando inicialização dos serviços..."
    sleep 30
    
    # Verificar se os serviços estão rodando
    if docker compose ps | grep -q "Up"; then
        log_success "Serviços iniciados com sucesso!"
    else
        log_error "Erro ao iniciar serviços"
        docker compose logs
        exit 1
    fi
}

# Verificar instalação
verify_installation() {
    log_info "Verificando instalação..."
    
    # Verificar backend
    if curl -s http://localhost:8001/api/ | grep -q "Service Order Management API"; then
        log_success "Backend funcionando"
    else
        log_error "Backend não está funcionando"
        return 1
    fi
    
    # Verificar frontend
    if curl -s http://localhost:3000 | grep -q "OS Manager"; then
        log_success "Frontend funcionando"
    else
        log_error "Frontend não está funcionando"
        return 1
    fi
    
    log_success "Verificação concluída com sucesso!"
}

# Mostrar informações finais
show_final_info() {
    echo ""
    echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
    echo "==================================="
    echo ""
    echo "📱 Acesse o sistema em:"
    echo "   http://localhost:3000"
    echo ""
    echo "🔐 Usuário padrão:"
    echo "   Usuário: admin"
    echo "   Senha: admin123"
    echo ""
    echo "📚 Comandos úteis:"
    echo "   docker compose logs -f          # Ver logs"
    echo "   docker compose stop             # Parar serviços"
    echo "   docker compose start            # Iniciar serviços"
    echo "   docker compose restart          # Reiniciar serviços"
    echo ""
    echo "📞 Suporte:"
    echo "   Desenvolvedor: Thiago de Souza Molter"
    echo "   GitHub: https://github.com/thiagomolter/os-manager"
    echo ""
    echo "© 2025 Thiago de Souza Molter - Todos os direitos reservados"
}

# Menu principal
main() {
    echo ""
    echo "Escolha o tipo de instalação:"
    echo "1) Instalação completa (Docker + Sistema)"
    echo "2) Apenas configurar ambiente"
    echo "3) Apenas iniciar serviços"
    echo "4) Verificar instalação"
    echo ""
    read -p "Digite sua opção (1-4): " choice
    
    case $choice in
        1)
            detect_os
            install_docker
            install_docker_compose
            setup_environment
            start_services
            verify_installation
            show_final_info
            ;;
        2)
            setup_environment
            log_success "Ambiente configurado! Execute './setup.sh' e escolha opção 3 para iniciar."
            ;;
        3)
            start_services
            verify_installation
            show_final_info
            ;;
        4)
            verify_installation
            ;;
        *)
            log_error "Opção inválida"
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"