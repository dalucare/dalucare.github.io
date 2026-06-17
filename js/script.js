const form = document.getElementById("form-contato");
const aviso = document.getElementById("aviso-form");
const formListaEspera = document.getElementById("form-lista-espera");
const avisoListaEspera = document.getElementById("aviso-lista-espera");
const btnListaEspera = document.getElementById("btn-lista-espera");
const ano = document.getElementById("ano");
const btnTema = document.getElementById("btn-tema");
const iconeTema = document.getElementById("icone-tema");
const html = document.documentElement;

const LISTA_ESPERA_EMAIL = "contato@dalucare.com.br";

function aplicarTema(tema) {
  html.setAttribute("data-theme", tema);
  localStorage.setItem("dalucare-theme", tema);

  if (iconeTema) {
    iconeTema.textContent = tema === "dark" ? "☀" : "☾";
  }

  if (btnTema) {
    const rotulo = tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro";
    btnTema.setAttribute("aria-label", rotulo);
    btnTema.setAttribute("title", rotulo);
  }
}

function alternarTema() {
  const temaAtual = html.getAttribute("data-theme") || "light";
  aplicarTema(temaAtual === "dark" ? "light" : "dark");
}

function mostrarAviso(elemento, texto, tipo) {
  elemento.className = "aviso-form";
  elemento.textContent = texto;
  elemento.classList.add(tipo === "sucesso" ? "aviso-sucesso" : "aviso-erro");
}

async function enviarListaEspera(dados) {
  const resposta = await fetch(`https://formsubmit.co/ajax/${LISTA_ESPERA_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: "Lista de espera — Dalucare",
      _template: "table",
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      cidade: dados.cidade,
      tipo: dados.tipo,
      profissional: dados.profissional || "Não informado",
      mensagem: dados.mensagem || "—",
    }),
  });

  if (!resposta.ok) {
    throw new Error("Falha ao enviar");
  }

  return resposta.json();
}

if (btnTema) {
  aplicarTema(html.getAttribute("data-theme") || "light");
  btnTema.addEventListener("click", alternarTema);
}

if (ano) {
  ano.textContent = new Date().getFullYear();
}

if (formListaEspera) {
  formListaEspera.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("espera-nome").value.trim();
    const email = document.getElementById("espera-email").value.trim();
    const telefone = document.getElementById("espera-telefone").value.trim();
    const cidade = document.getElementById("espera-cidade").value.trim();
    const tipo = document.getElementById("espera-tipo").value;
    const profissional = document.getElementById("espera-profissional").value;
    const mensagem = document.getElementById("espera-mensagem").value.trim();

    if (nome.length < 3) {
      mostrarAviso(avisoListaEspera, "Digite um nome válido com pelo menos 3 caracteres.", "erro");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      mostrarAviso(avisoListaEspera, "Digite um e-mail válido.", "erro");
      return;
    }

    if (telefone.length < 10) {
      mostrarAviso(avisoListaEspera, "Digite um telefone válido com DDD.", "erro");
      return;
    }

    if (cidade.length < 2) {
      mostrarAviso(avisoListaEspera, "Informe sua cidade.", "erro");
      return;
    }

    if (!tipo) {
      mostrarAviso(avisoListaEspera, "Selecione se você é paciente ou profissional.", "erro");
      return;
    }

    if (btnListaEspera) {
      btnListaEspera.disabled = true;
      btnListaEspera.textContent = "Enviando...";
    }

    try {
      await enviarListaEspera({ nome, email, telefone, cidade, tipo, profissional, mensagem });
      mostrarAviso(
        avisoListaEspera,
        "Cadastro realizado! Você entrou na lista de espera. Avisaremos quando a plataforma estiver no ar.",
        "sucesso"
      );
      formListaEspera.reset();
    } catch (erro) {
      mostrarAviso(
        avisoListaEspera,
        "Não foi possível enviar agora. Tente novamente ou escreva para contato@dalucare.com.br.",
        "erro"
      );
    } finally {
      if (btnListaEspera) {
        btnListaEspera.disabled = false;
        btnListaEspera.textContent = "Entrar na lista de espera";
      }
    }
  });
}

if (form) {
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    aviso.className = "aviso-form";

    if (nome.length < 3) {
      aviso.textContent = "Digite um nome válido com pelo menos 3 caracteres.";
      aviso.classList.add("aviso-erro");
      return;
    }

    if (telefone.length < 10) {
      aviso.textContent = "Digite um telefone válido com DDD.";
      aviso.classList.add("aviso-erro");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      aviso.textContent = "Digite um e-mail válido.";
      aviso.classList.add("aviso-erro");
      return;
    }

    if (mensagem.length < 10) {
      aviso.textContent = "A mensagem deve ter pelo menos 10 caracteres.";
      aviso.classList.add("aviso-erro");
      return;
    }

    aviso.textContent = "Solicitação registrada! Em breve a equipe da Dalucare entrará em contato.";
    aviso.classList.add("aviso-sucesso");

    form.reset();
  });
}
