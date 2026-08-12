# 📦 StockEasy — Sistema de Controle de Estoque

> Plataforma SaaS moderna para gestão de estoque de pequenas e médias empresas.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-autenticação-orange)
![BCrypt](https://img.shields.io/badge/BCrypt-criptografia-blue)

---

## 🧑‍💻 Integrantes

| Nome |
|------|
| Pedro Paulo de Vasconcelos |
| Maria Eduarda Bandeira Eloy |

---

## 🎯 Sobre o Projeto

O **StockEasy** é uma aplicação web full stack desenvolvida para facilitar o controle de estoque de empresas de pequeno e médio porte. O sistema segue o modelo **SaaS (Software as a Service)** com foco em usabilidade, organização e experiência do usuário.

A plataforma conta com **frontend em React** integrado a um **backend Node.js + Express + MongoDB Atlas**, com autenticação segura via **JWT** e senhas criptografadas com **BCrypt**, além de controle de acesso por perfil de usuário.

---

## 🚀 Tecnologias Utilizadas

### Frontend
| Tecnologia | Uso |
|---|---|
| **React 18** | Biblioteca principal de UI |
| **Vite 5** | Bundler e servidor de desenvolvimento |
| **React Router DOM 6** | Roteamento e navegação |
| **CSS Modules** | Estilização por componente sem conflitos |
| **Context API** | Gerenciamento de tema global (dark/light mode) |

### Backend
| Tecnologia | Uso |
|---|---|
| **Node.js** | Ambiente de execução JavaScript no servidor |
| **Express** | Framework para criação das rotas da API REST |
| **Mongoose** | ODM para comunicação com o MongoDB |
| **MongoDB Atlas** | Banco de dados na nuvem |
| **JWT (jsonwebtoken)** | Autenticação segura com tokens |
| **BCrypt (bcryptjs)** | Criptografia de senhas |
| **dotenv** | Gerenciamento de variáveis de ambiente |
| **cors** | Permissão de requisições cross-origin |
| **nodemon** | Reinício automático do servidor em desenvolvimento |

---

## 🔐 Segurança

- Senhas criptografadas com **BCrypt** (10 rounds) — nunca salvas em texto puro
- Autenticação via **JWT** — token válido por 8 horas
- Todas as rotas da API são **protegidas** e exigem token válido
- **Controle de acesso por perfil (RBAC)**:
  - **Administrador** — acesso total ao sistema
  - **Operador** — pode criar e visualizar, não pode editar nem excluir
  - **Visualizador** — apenas leitura, sem permissão de escrita
- Variáveis sensíveis ficam no `.env` — nunca sobem para o GitHub

---

## 🧪 Credenciais de Teste

| Perfil | E-mail | Senha | Permissões |
|---|---|---|---|
| Administrador | admin@hotmail.com | admin123 | Acesso total |
| Visualizador  | vis@hotmail.com   | 123456   | Apenas leitura |

---

## 📁 Estrutura do Projeto

O projeto é composto por **duas pastas independentes** — cada uma deve ser executada separadamente em terminais diferentes:

```
StockEasy/
├── Criar_Servi-os_Web_Rest/   ← Frontend React (porta 5173)
└── stockEasy-backend/          ← Backend Node.js (porta 3000)
```

---

## ⚙️ Como Rodar o Projeto

> ⚠️ **Importante:** O projeto possui duas partes independentes. É necessário rodar o **backend** e o **frontend** em terminais separados ao mesmo tempo.

---

### 1️⃣ Backend

Abra um terminal e execute:

```bash
cd stockEasy-backend
npm install
```

Crie o arquivo `.env` a partir do `.env.example`:

```
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/stockeasy
JWT_SECRET=sua_chave_secreta_longa_aqui
```

Inicie o servidor:

```bash
npm run dev
```

✅ Servidor rodando em `http://localhost:3000`

---

### 2️⃣ Frontend

Abra **outro terminal** e execute:

```bash
cd Criar_Servi-os_Web_Rest
npm install
npm run dev
```

✅ Aplicação rodando em `http://localhost:5173`

---

> 💡 **Os dois precisam estar rodando ao mesmo tempo para o sistema funcionar!**

---

## 🖥️ Telas Desenvolvidas

### 🏠 Landing Page
- Hero com preview do dashboard animado
- Seção de serviços, avaliações e FAQ
- Formulário de contato e Footer completo
- Toggle de tema claro/escuro

### 🔐 Login
- Autenticação real com JWT + BCrypt
- Sem opção de cadastro público — apenas admin cria usuários
- Redirecionamento automático para o Dashboard após login

### 📊 Dashboard
- Saudação personalizada com nome do usuário
- Alertas de estoque em tempo real
- Resumo financeiro e últimos produtos cadastrados

### 📋 Cadastro
- **4 abas:** Produtos · Fornecedores · Clientes · Usuários
- CRUD completo integrado com MongoDB Atlas
- Validação de campos únicos
- Botões de ação ocultos para Visualizador

### 📦 Estoque
- Cards de resumo clicáveis por status
- Filtros por busca e categoria
- Movimentação (Entrada e Saída) com preview visual

### 💼 Administrativo
- CRUD de custos fixos mensais salvo no Atlas
- Precificação sugerida com preço mínimo por produto

### 💰 Financeiro
- Valor total em estoque, receita e lucro estimados
- Alerta de produtos com preço abaixo do mínimo
- Resumo de custos fixos

---

## 🗄️ Modelagem do Banco de Dados

### Usuario
| Campo | Tipo | Descrição |
|---|---|---|
| nome | String | Nome completo |
| email | String (único) | E-mail de acesso |
| senha | String | Hash BCrypt |
| cargo | String | Cargo na empresa |
| permissao | Enum | Administrador / Operador / Visualizador |
| status | Enum | Ativo / Inativo |

### Produto
| Campo | Tipo | Descrição |
|---|---|---|
| nome | String | Nome do produto |
| codigoBarras | String (único) | Código de barras |
| categoria | String | Categoria do produto |
| unidade | String | Unidade de medida |
| fornecedor | String | Nome do fornecedor vinculado |
| custo | Number | Preço de custo |
| margem | Number | Markup percentual |
| venda | Number | Preço de venda calculado |
| estoque | Number | Quantidade em estoque |
| estoqueMinimo | Number | Estoque mínimo ideal |

### Fornecedor
| Campo | Tipo | Descrição |
|---|---|---|
| nome | String | Razão social |
| cnpj | String (único) | CNPJ |
| telefone | String | Telefone |
| email | String | E-mail |
| cidade | String | Cidade |
| estado | String | Estado |
| prazoEntrega | Number | Prazo em dias |

### Cliente
| Campo | Tipo | Descrição |
|---|---|---|
| nome | String | Nome completo |
| tipo | Enum | Pessoa Física / Pessoa Jurídica |
| documento | String (único) | CPF ou CNPJ |
| telefone | String | Telefone |
| email | String | E-mail |
| cidade | String | Cidade |
| estado | String | Estado |
| totalCompras | Number | Contador de compras |

### CustoFixo
| Campo | Tipo | Descrição |
|---|---|---|
| nome | String | Descrição do custo |
| categoria | String | Categoria (Infraestrutura, Pessoal...) |
| valor | Number | Valor mensal |

### Configuracao
| Campo | Tipo | Descrição |
|---|---|---|
| chave | String (único) | Nome da configuração |
| valor | Mixed | Valor da configuração |

---

## 🔀 Rotas da API

### Autenticação (pública)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login com email e senha → retorna JWT |
| GET  | `/api/auth/me`    | Dados do usuário logado |

### Rotas protegidas por JWT

| Método | Rota | Admin | Operador | Visualizador |
|---|---|---|---|---|
| GET | `/api/produtos` | ✅ | ✅ | ✅ |
| POST | `/api/produtos` | ✅ | ✅ | ❌ |
| PUT/DELETE | `/api/produtos/:id` | ✅ | ✅ | ❌ |
| GET | `/api/fornecedores` | ✅ | ✅ | ✅ |
| POST | `/api/fornecedores` | ✅ | ✅ | ❌ |
| PUT/DELETE | `/api/fornecedores/:id` | ✅ | ✅ | ❌ |
| GET | `/api/clientes` | ✅ | ✅ | ✅ |
| POST | `/api/clientes` | ✅ | ✅ | ❌ |
| PUT/DELETE | `/api/clientes/:id` | ✅ | ✅ | ❌ |
| GET | `/api/usuarios` | ✅ | ✅ | ✅ |
| POST/PUT/DELETE | `/api/usuarios/:id` | ✅ | ❌ | ❌ |
| GET | `/api/custos` | ✅ | ✅ | ✅ |
| POST/PUT/DELETE | `/api/custos/:id` | ✅ | ✅ | ❌ |
| GET | `/api/configuracoes` | ✅ | ✅ | ✅ |
| PUT | `/api/configuracoes` | ✅ | ✅ | ❌ |

---

## 🔀 Rotas do Frontend

| Rota | Página | Acesso |
|---|---|---|
| `/` | Landing Page | Público |
| `/login` | Login | Público |
| `/dashboard` | Dashboard geral | 🔒 Autenticado |
| `/cadastro` | Gestão de cadastros | 🔒 Autenticado |
| `/estoque` | Controle de estoque | 🔒 Autenticado |
| `/administrativo` | Custos e precificação | 🔒 Autenticado |
| `/financeiro` | Visão financeira | 🔒 Autenticado |
| `/ajuda` | Ajuda | 🔒 Em desenvolvimento |

---

## 🎨 Identidade Visual

| Variável | Claro | Escuro |
|---|---|---|
| Fundo página | `#f4f6f8` | `#0a0f0c` |
| Fundo card | `#ffffff` | `#111a14` |
| Verde principal | `#1a7a4a` | `#22a860` |
| Fonte títulos | **Syne 800** | **Syne 800** |
| Fonte corpo | **DM Sans** | **DM Sans** |

