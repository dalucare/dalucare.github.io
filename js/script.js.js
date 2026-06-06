const form = document.getElementById("form-contato");
const aviso = document.getElementById("aviso-form");
const ano = document.getElementById("ano");

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

    if (nome.length < 3) {
      aviso.textContent = "Digite um nome válido com pelo menos 3 caracteres.";
      aviso.style.color = "#c0392b";
      return;
    }

    if (telefone.length < 10) {
      aviso.textContent = "Digite um telefone válido com DDD.";
      aviso.style.color = "#c0392b";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      aviso.textContent = "Digite um e-mail válido.";
      aviso.style.color = "#c0392b";
      return;
    }

    if (mensagem.length < 10) {
      aviso.textContent = "A mensagem deve ter pelo menos 10 caracteres.";
      aviso.style.color = "#c0392b";
      return;
    }

    aviso.textContent = "Solicitação enviada com sucesso! Em breve a equipe da Dalucare entrará em contato.";
    aviso.style.color = "#1f8a4c";

    form.reset();
  });
}
