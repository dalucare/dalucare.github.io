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
    crm: usuario.crm || "",
    crmUf: usuario.crmUf || "SP",
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

  const tipo = dados.tipo || "paciente";
  const crm = String(dados.crm || "").replace(/\D/g, "");
  const crmUf = String(dados.crmUf || "SP").trim().toUpperCase().slice(0, 2);

  if (tipo === "profissional") {
    if (!crm) {
      throw new Error("Informe o número do CRM.");
    }
    if (!crmUf || crmUf.length !== 2) {
      throw new Error("Informe a UF do CRM (ex.: SP).");
    }
  }

  const novoUsuario = {
    id: "u_" + Date.now(),
    nome: dados.nome.trim(),
    email: email,
    senhaHash: hashSenha(dados.senha),
    tipo: tipo,
    crm: crm,
    crmUf: crmUf || "SP",
    cadastroEm: new Date().toISOString(),
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  return novoUsuario;
}

function autenticarUsuario(email, senha) {
  const usuario = buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new Error(
      "Conta não encontrada neste navegador. Cadastre-se de novo (comum ao mudar de http para https)."
    );
  }

  if (usuario.senhaHash !== hashSenha(senha)) {
    throw new Error("Senha incorreta. Use “Esqueci minha senha” abaixo.");
  }

  return criarSessao(usuario);
}

function redefinirSenha(email, novaSenha, confirmarSenha) {
  const usuario = buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new Error(
      "Conta não encontrada neste navegador. Clique em Cadastre-se e crie a conta de novo."
    );
  }

  if (novaSenha.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  if (novaSenha !== confirmarSenha) {
    throw new Error("As senhas não coincidem.");
  }

  const usuarios = obterUsuarios();
  const indice = usuarios.findIndex(function (item) {
    return item.email === usuario.email;
  });

  if (indice < 0) {
    throw new Error("Não foi possível atualizar a senha. Cadastre-se de novo.");
  }

  usuarios[indice].senhaHash = hashSenha(novaSenha);
  salvarUsuarios(usuarios);
  return criarSessao(usuarios[indice]);
}

function garantirUsuarioDemo(dados) {
  var existente = buscarUsuarioPorEmail(dados.email);
  if (existente) {
    existente.senhaHash = hashSenha(dados.senha);
    existente.tipo = dados.tipo;
    existente.nome = dados.nome;
    if (dados.crm) existente.crm = String(dados.crm).replace(/\D/g, "");
    if (dados.crmUf) existente.crmUf = String(dados.crmUf).trim().toUpperCase().slice(0, 2);
    var usuarios = obterUsuarios();
    var indice = usuarios.findIndex(function (u) {
      return u.email === existente.email;
    });
    if (indice >= 0) {
      usuarios[indice] = existente;
      salvarUsuarios(usuarios);
    }
    return existente;
  }
  return cadastrarUsuario({
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha,
    confirmarSenha: dados.senha,
    tipo: dados.tipo,
    crm: dados.crm || (dados.tipo === "profissional" ? "123456" : ""),
    crmUf: dados.crmUf || "SP",
  });
}

function atualizarPerfilProfissional(dados) {
  var sessao = obterSessao();
  if (!sessao) throw new Error("Faça login novamente.");
  var usuarios = obterUsuarios();
  var indice = usuarios.findIndex(function (u) {
    return u.email === sessao.email;
  });
  var crm = String(dados.crm || "").replace(/\D/g, "");
  var crmUf = String(dados.crmUf || "SP").trim().toUpperCase().slice(0, 2);
  var nome = String(dados.nome || sessao.nome).trim();
  if (!nome) throw new Error("Informe o nome.");
  if (!crm) throw new Error("Informe o número do CRM.");
  if (!crmUf || crmUf.length !== 2) throw new Error("Informe a UF do CRM.");

  if (indice >= 0) {
    usuarios[indice].nome = nome;
    usuarios[indice].crm = crm;
    usuarios[indice].crmUf = crmUf;
    salvarUsuarios(usuarios);
    return criarSessao(usuarios[indice]);
  }

  sessao.nome = nome;
  sessao.crm = crm;
  sessao.crmUf = crmUf;
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

function perfilMedHub(sessao) {
  var s = sessao || obterSessao() || {};
  return {
    name: s.nome || "",
    crmUf: s.crmUf || "SP",
    crmNumber: s.crm || "",
  };
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
