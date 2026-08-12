const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// pega o token salvo no localStorage
function getToken() {
  return localStorage.getItem('stockeasy_token')
}

async function request(method, endpoint, body = null, publico = false) {
  const headers = { 'Content-Type': 'application/json' }

  // adiciona o token JWT em todas as rotas protegidas
  if (!publico) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  // token expirado ou inválido — redireciona para login
  if (response.status === 401) {
    localStorage.removeItem('stockeasy_token')
    localStorage.removeItem('stockeasy_user')
    window.location.href = '/login'
    return
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.mensagem || 'Erro na requisição')
  return data
}

// ── AUTH — rota pública ──
export const authAPI = {
  login: (email, senha) => request('POST', '/auth/login', { email, senha }, true),
  me:    ()             => request('GET',  '/auth/me'),
}

// ── PRODUTOS ──
export const produtosAPI = {
  listar:    ()          => request('GET',    '/produtos'),
  buscar:    (id)        => request('GET',    `/produtos/${id}`),
  criar:     (dados)     => request('POST',   '/produtos', dados),
  atualizar: (id, dados) => request('PUT',    `/produtos/${id}`, dados),
  remover:   (id)        => request('DELETE', `/produtos/${id}`),
}

// ── FORNECEDORES ──
export const fornecedoresAPI = {
  listar:    ()          => request('GET',    '/fornecedores'),
  buscar:    (id)        => request('GET',    `/fornecedores/${id}`),
  criar:     (dados)     => request('POST',   '/fornecedores', dados),
  atualizar: (id, dados) => request('PUT',    `/fornecedores/${id}`, dados),
  remover:   (id)        => request('DELETE', `/fornecedores/${id}`),
}

// ── CLIENTES ──
export const clientesAPI = {
  listar:    ()          => request('GET',    '/clientes'),
  buscar:    (id)        => request('GET',    `/clientes/${id}`),
  criar:     (dados)     => request('POST',   '/clientes', dados),
  atualizar: (id, dados) => request('PUT',    `/clientes/${id}`, dados),
  remover:   (id)        => request('DELETE', `/clientes/${id}`),
}

// ── USUÁRIOS ──
export const usuariosAPI = {
  listar:    ()          => request('GET',    '/usuarios'),
  buscar:    (id)        => request('GET',    `/usuarios/${id}`),
  criar:     (dados)     => request('POST',   '/usuarios', dados),
  atualizar: (id, dados) => request('PUT',    `/usuarios/${id}`, dados),
  remover:   (id)        => request('DELETE', `/usuarios/${id}`),
}

// ── CUSTOS FIXOS ──
export const custosAPI = {
  listar:    ()          => request('GET',    '/custos'),
  buscar:    (id)        => request('GET',    `/custos/${id}`),
  criar:     (dados)     => request('POST',   '/custos', dados),
  atualizar: (id, dados) => request('PUT',    `/custos/${id}`, dados),
  remover:   (id)        => request('DELETE', `/custos/${id}`),
}

// ── CONFIGURAÇÕES ──
export const configuracoesAPI = {
  listar: ()             => request('GET', '/configuracoes'),
  salvar: (chave, valor) => request('PUT', '/configuracoes', { chave, valor }),
}