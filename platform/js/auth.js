/* auth helpers — também embutidos no home para não depender só deste arquivo */
const CHAVE_USUARIOS = "dalucare_usuarios";
const CHAVE_SESSAO = "dalucare_sessao";

function hashSenha(senha) {
  let hash = 0;
  for (let i = 0; i < senha.length; i += 1) {
    hash = (hash << 5) - hash + senha.charCodeAt(i);
    hash |= 0;
  }
  return "h" + Math.abs(hash).toString(36);
}

function obterUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
  } catch (erro) {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function obterSessao() {
  try {
    const bruto = localStorage.getItem(CHAVE_SESSAO);
    if (!bruto) return null;
    const sessao = JSON.parse(bruto);
    if (!sessao || typeof sessao !== "object") return null;
    if (!sessao.nome || !sessao.email) return null;
    return sessao;
  } catch (erro) {
    return null;
  }
}

function criarSessao(usuario) {
  const sessao = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo || "paciente",
    criadoEm: new Date().toISOString(),
  };
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
}

function buscarUsuarioPorEmail(email) {
  const emailNormalizado = email.trim().toLowerCase();
  return obterUsuarios().find(function (usuario) {
    return usuario.email === emailNormalizado;
  });
}

function cadastrarUsuario(dados) {
  const email = dados.email.trim().toLowerCase();
  const usuarios = obterUsuarios();

  if (buscarUsuarioPorEmail(email)) {
    throw new Error("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
  }

  if (dados.senha.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  if (dados.senha !== dados.confirmarSenha) {
    throw new Error("As senhas não coincidem.");
  }

  const novoUsuario = {
    id: "u_" + Date.now(),
    nome: dados.nome.trim(),
    email: email,
    senhaHash: hashSenha(dados.senha),
    tipo: dados.tipo || "paciente",
    cadastroEm: new Date().toISOString(),
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  return novoUsuario;
}

function autenticarUsuario(email, senha) {
  const usuario = buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new Error("E-mail ou senha incorretos.");
  }

  if (usuario.senhaHash !== hashSenha(senha)) {
    throw new Error("E-mail ou senha incorretos.");
  }

  return criarSessao(usuario);
}

function exigirLogin() {
  const sessao = obterSessao();
  if (!sessao) {
    window.location.replace("login.html");
    return null;
  }
  return sessao;
}

function mostrarAviso(elemento, texto, tipo) {
  if (!elemento) return;
  elemento.className = "aviso-form";
  elemento.textContent = texto;
  elemento.classList.add(tipo === "sucesso" ? "aviso-sucesso" : "aviso-erro");
}

function aplicarTemaInicial() {
  try {
    const salvo = localStorage.getItem("dalucare-theme");
    const tema = salvo || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", tema);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

aplicarTemaInicial();
