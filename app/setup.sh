# OS Manager Frontend Dockerfile
# Desenvolvido por: Thiago de Souza Molter
# Versão: 1.0.0

# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Production stage
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:3000 || exit 1

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
