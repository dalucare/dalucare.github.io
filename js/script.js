const form = document.getElementById("form-contato");
const aviso = document.getElementById("aviso-form");
const ano = document.getElementById("ano");
const btnTema = document.getElementById("btn-tema");
const iconeTema = document.getElementById("icone-tema");
const html = document.documentElement;

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

if (btnTema) {
  aplicarTema(html.getAttribute("data-theme") || "light");
  btnTema.addEventListener("click", alternarTema);
}

if (ano) {
  ano.textContent = new Date().getFullYear();
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

    aviso.textContent = "Solicitação enviada com sucesso! Em breve a equipe da Dalucare entrará em contato.";
    aviso.classList.add("aviso-sucesso");

    form.reset();
  });
}
