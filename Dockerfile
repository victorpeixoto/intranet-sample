# Estágio 1: Builder - Onde a aplicação é construída
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json ./

# Instala todas as dependências, incluindo as de desenvolvimento
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Executa o script de build para gerar os arquivos de produção
RUN npm run build

# Estágio 2: Produção - A imagem final e otimizada
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de manifesto e instala apenas as dependências de produção
COPY package.json package-lock.json ./
RUN npm install

# Copia os artefatos de build do estágio anterior
COPY --from=builder /app/dist ./dist

# Expõe a porta em que a aplicação será executada
EXPOSE 5000

# Define o ambiente como produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]