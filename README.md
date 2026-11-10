# 🎮 Noob Toon - Painel do Criador de Conteúdo no YouTube

Painel completo e interativo desenvolvido para quem quer criar, estruturar e monetizar um canal no YouTube (vídeos longos e Shorts) do zero. Inclui checklist guiado em 6 etapas, biblioteca com reprodutor de vídeos curtos integrados, 200 legendas prontas, 50 ideias de roteiro e mentor com Inteligência Artificial.

---

## 🚀 Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS 4**
- **Lucide Icons**
- **Google GenAI SDK** (Gemini 2.5 Flash)
- **Vercel Serverless Functions** (para a rota `/api/mentor`)

---

## 🛠️ Como Executar Localmente

1. Clone o repositório ou baixe o código-fonte:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd noob-toon
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. (Opcional) Crie um arquivo `.env` para habilitar as respostas do Mentor com IA:
   ```bash
   cp .env.example .env
   ```
   Adicione sua chave da API do Google Gemini no `.env`:
   ```env
   GEMINI_API_KEY="sua_chave_aqui"
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse no seu navegador: `http://localhost:3000`

---

## 📦 Como Subir para o GitHub

Se você ainda não inicializou o Git na pasta do projeto:

```bash
# 1. Inicialize o repositório local
git init

# 2. Adicione todos os arquivos
git add .

# 3. Crie o primeiro commit
git commit -m "feat: versão inicial completa do Noob Toon"

# 4. Defina o branch principal como main
git branch -M main

# 5. Conecte com o seu repositório no GitHub (crie antes um repositório vazio no github.com)
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# 6. Envie o código
git push -u origin main
```

---

## ⚡ Como Fazer o Deploy na Vercel

O projeto já está 100% configurado com `vercel.json` e a função serverless `/api/mentor.ts`.

### Passo a passo na Vercel:

1. Acesse **[vercel.com](https://vercel.com)** e faça login com sua conta do GitHub.
2. Clique no botão **"Add New..."** e selecione **"Project"**.
3. Na lista de repositórios, localize o repositório do **Noob Toon** que você acabou de subir e clique em **"Import"**.
4. A Vercel detectará automaticamente o framework como **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Configuração de Variáveis de Ambiente (Environment Variables)**:
   - Expanda a seção **"Environment Variables"**.
   - Adicione a variável:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Sua chave de API do Google Gemini (obtenha gratuitamente no [Google AI Studio](https://aistudio.google.com/app/apikey)).
6. Clique no botão azul **"Deploy"**.
7. Em menos de 1 minuto, seu aplicativo estará no ar com link público HTTPS fornecido pela Vercel!

---

## 📁 Estrutura de Arquivos Principais

```
├── api/
│   └── mentor.ts            # Serverless Function da Vercel para o Mentor com IA
├── public/
│   └── assets/              # Vídeos e banners do GTA VI
├── src/
│   ├── components/
│   │   └── ShortVideoPlayer.tsx # Player de vídeo otimizado para Shorts
│   ├── data/
│   │   ├── captions.ts      # 200 legendas prontas
│   │   ├── ideas.ts         # 50 ideias de Shorts
│   │   ├── stages.ts        # 6 etapas da trilha
│   │   └── noobToonData.ts
│   ├── App.tsx              # Componente principal e fluxo de navegação
│   ├── main.tsx             # Ponto de entrada React
│   └── index.css            # Estilos globais e temas claro/escuro
├── vercel.json              # Configurações de rotas e build da Vercel
├── vite.config.ts           # Configuração do Vite
└── package.json             # Dependências e scripts
```
