/* Pacientes do profissional — lista + ficha (inspirado em agendas clínicas) */
(function (global) {
  var CHAVE = "dalucare_pacientes_v1";

  function seed() {
    return [
      {
        id: "pac1",
        nome: "Maria Silva",
        nascimento: "1994-03-12",
        sexo: "Feminino",
        telefone: "(13) 99912-3344",
        email: "maria.silva@email.com",
        convenio: "Bradesco Saúde",
        cidade: "Santos",
        cpf: "",
        tags: ["Hipertensão", "Retorno"],
        observacoes: "Paciente refere melhora com a medicação atual.",
        ultimaConsulta: "2026-04-15",
        proximaConsulta: "2026-07-22",
        status: "ativo",
      },
      {
        id: "pac2",
        nome: "João Pedro Santos",
        nascimento: "1988-11-02",
        sexo: "Masculino",
        telefone: "(13) 98877-2211",
        email: "joao.pedro@email.com",
        convenio: "Unimed",
        cidade: "Guarujá",
        cpf: "",
        tags: ["Retorno"],
        observacoes: "Aguardando resultado de exames laboratoriais.",
        ultimaConsulta: "2026-06-10",
        proximaConsulta: "2026-07-22",
        status: "ativo",
      },
      {
        id: "pac3",
        nome: "Ana Carolina Lemos",
        nascimento: "1999-07-21",
        sexo: "Feminino",
        telefone: "(11) 97766-5544",
        email: "ana.lemos@email.com",
        convenio: "Particular",
        cidade: "São Paulo",
        cpf: "",
        tags: ["Teleconsulta", "Novo"],
        observacoes: "Primeira consulta online.",
        ultimaConsulta: "",
        proximaConsulta: "2026-07-22",
        status: "ativo",
      },
      {
        id: "pac4",
        nome: "Carlos Alberto",
        nascimento: "1975-01-30",
        sexo: "Masculino",
        telefone: "(13) 99100-8899",
        email: "",
        convenio: "SulAmérica",
        cidade: "Santos",
        cpf: "",
        tags: [],
        observacoes: "",
        ultimaConsulta: "2026-05-02",
        proximaConsulta: "2026-07-22",
        status: "ativo",
      },
      {
        id: "pac5",
        nome: "Fernanda Costa",
        nascimento: "1991-09-08",
        sexo: "Feminino",
        telefone: "(13) 99655-4433",
        email: "fernanda.costa@email.com",
        convenio: "Amil",
        cidade: "São Vicente",
        cpf: "",
        tags: ["Retorno"],
        observacoes: "Controle de rotina.",
        ultimaConsulta: "2026-03-18",
        proximaConsulta: "2026-07-22",
        status: "ativo",
      },
    ];
  }

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        var inicial = seed();
        salvar(inicial);
        return inicial;
      }
      var lista = JSON.parse(bruto);
      return Array.isArray(lista) ? lista : seed();
    } catch (e) {
      return seed();
    }
  }

  function salvar(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  function novoId() {
    return "pac_" + Date.now() + "_" + Math.floor(Math.random() * 999);
  }

  function normalizar(dados) {
    var tags = dados.tags;
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map(function (t) {
          return t.trim();
        })
        .filter(Boolean);
    }
    if (!Array.isArray(tags)) tags = [];
    return {
      id: dados.id || novoId(),
      nome: String(dados.nome || "").trim(),
      nascimento: String(dados.nascimento || "").trim(),
      sexo: String(dados.sexo || "").trim(),
      telefone: String(dados.telefone || "").trim(),
      email: String(dados.email || "").trim(),
      convenio: String(dados.convenio || "").trim(),
      cidade: String(dados.cidade || "").trim(),
      cpf: String(dados.cpf || "").trim(),
      tags: tags,
      observacoes: String(dados.observacoes || "").trim(),
      ultimaConsulta: String(dados.ultimaConsulta || "").trim(),
      proximaConsulta: String(dados.proximaConsulta || "").trim(),
      status: String(dados.status || "ativo").trim(),
      atualizadoEm: new Date().toISOString(),
    };
  }

  function iniciais(nome) {
    var partes = String(nome || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!partes.length) return "?";
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  function idade(nascimento) {
    if (!nascimento) return null;
    var d = new Date(nascimento + "T12:00:00");
    if (isNaN(d.getTime())) return null;
    var hoje = new Date();
    var anos = hoje.getFullYear() - d.getFullYear();
    var m = hoje.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < d.getDate())) anos -= 1;
    return anos >= 0 ? anos : null;
  }

  function formatarData(iso) {
    if (!iso) return "-";
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function buscar(termo, filtro) {
    var q = String(termo || "")
      .trim()
      .toLowerCase();
    var lista = carregar().slice().sort(function (a, b) {
      return String(a.nome).localeCompare(String(b.nome), "pt-BR");
    });
    if (filtro === "retorno") {
      lista = lista.filter(function (p) {
        return p.proximaConsulta || (p.tags || []).indexOf("Retorno") >= 0;
      });
    } else if (filtro === "novos") {
      lista = lista.filter(function (p) {
        return (p.tags || []).indexOf("Novo") >= 0 || !p.ultimaConsulta;
      });
    } else if (filtro === "tele") {
      lista = lista.filter(function (p) {
        return (p.tags || []).indexOf("Teleconsulta") >= 0;
      });
    }
    if (!q) return lista;
    return lista.filter(function (p) {
      var blob = [p.nome, p.telefone, p.email, p.convenio, p.cidade, (p.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return blob.indexOf(q) >= 0;
    });
  }

  function obter(id) {
    return (
      carregar().find(function (p) {
        return p.id === id;
      }) || null
    );
  }

  function upsert(dados) {
    var item = normalizar(dados);
    if (!item.nome || item.nome.length < 2) throw new Error("Informe o nome do paciente.");
    var lista = carregar();
    var i = lista.findIndex(function (p) {
      return p.id === item.id;
    });
    if (i >= 0) {
      item.ultimaConsulta = item.ultimaConsulta || lista[i].ultimaConsulta;
      lista[i] = item;
    } else {
      lista.push(item);
    }
    salvar(lista);
    return item;
  }

  function remover(id) {
    salvar(
      carregar().filter(function (p) {
        return p.id !== id;
      })
    );
  }

  function estatisticas() {
    var lista = carregar();
    var comRetorno = lista.filter(function (p) {
      return !!p.proximaConsulta;
    }).length;
    var novos = lista.filter(function (p) {
      return (p.tags || []).indexOf("Novo") >= 0 || !p.ultimaConsulta;
    }).length;
    return { total: lista.length, comRetorno: comRetorno, novos: novos };
  }

  global.DalucarePacientes = {
    carregar: carregar,
    buscar: buscar,
    obter: obter,
    upsert: upsert,
    remover: remover,
    estatisticas: estatisticas,
    iniciais: iniciais,
    idade: idade,
    formatarData: formatarData,
    novoId: novoId,
    initUI: initUI,
  };

  function escapar(texto) {
    return String(texto || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initUI(opcoes) {
    var opts = opcoes || {};
    var selecionadoId = null;
    var filtroAtual = "todos";
    var modoForm = "fechado";

    function $(id) {
      return document.getElementById(id);
    }

    function metaPaciente(p) {
      var partes = [];
      var anos = idade(p.nascimento);
      if (anos !== null) partes.push(anos + " anos");
      if (p.sexo) partes.push(p.sexo);
      if (p.convenio) partes.push(p.convenio);
      return partes.join(" · ") || "Sem dados complementares";
    }

    function preencherForm(p) {
      $("pac-form-id").value = p ? p.id : "";
      $("pac-form-nome").value = p ? p.nome : "";
      $("pac-form-nasc").value = p ? p.nascimento || "" : "";
      $("pac-form-sexo").value = p ? p.sexo || "" : "";
      $("pac-form-tel").value = p ? p.telefone || "" : "";
      $("pac-form-email").value = p ? p.email || "" : "";
      $("pac-form-convenio").value = p ? p.convenio || "" : "";
      $("pac-form-cidade").value = p ? p.cidade || "" : "";
      $("pac-form-tags").value = p ? (p.tags || []).join(", ") : "";
      $("pac-form-obs").value = p ? p.observacoes || "" : "";
      $("pac-form-prox").value = p ? p.proximaConsulta || "" : "";
      $("pac-form-ult").value = p ? p.ultimaConsulta || "" : "";
      $("pac-form-titulo").textContent = p ? "Editar paciente" : "Novo paciente";
      var aviso = $("pac-form-aviso");
      if (aviso) {
        aviso.textContent = "";
        aviso.className = "aviso-form";
      }
    }

    function mostrarPainel(qual) {
      var ficha = $("pac-painel-ficha");
      var form = $("pac-painel-form");
      var vazio = $("pac-painel-vazio");
      if (ficha) ficha.hidden = qual !== "ficha";
      if (form) form.hidden = qual !== "form";
      if (vazio) vazio.hidden = qual !== "vazio";
      modoForm = qual === "form" ? "aberto" : "fechado";
    }

    function renderFicha(p) {
      if (!p) {
        mostrarPainel("vazio");
        return;
      }
      mostrarPainel("ficha");
      $("pac-ficha-avatar").textContent = iniciais(p.nome);
      $("pac-ficha-nome").textContent = p.nome;
      $("pac-ficha-meta").textContent = metaPaciente(p);
      $("pac-ficha-tel").textContent = p.telefone || "-";
      $("pac-ficha-email").textContent = p.email || "-";
      $("pac-ficha-cidade").textContent = p.cidade || "-";
      $("pac-ficha-convenio").textContent = p.convenio || "-";
      $("pac-ficha-ult").textContent = formatarData(p.ultimaConsulta);
      $("pac-ficha-prox").textContent = formatarData(p.proximaConsulta);
      $("pac-ficha-obs").textContent = p.observacoes || "Nenhuma observação registrada.";
      var tagsEl = $("pac-ficha-tags");
      if (tagsEl) {
        tagsEl.innerHTML = (p.tags || [])
          .map(function (t) {
            return '<span class="pac-tag">' + escapar(t) + "</span>";
          })
          .join("") || '<span class="pac-tag pac-tag-suave">Sem etiquetas</span>';
      }
    }

    function renderLista() {
      var busca = $("pac-busca");
      var listaEl = $("pac-lista");
      var contagem = $("pac-contagem");
      if (!listaEl) return;
      var itens = buscar(busca ? busca.value : "", filtroAtual);
      var stats = estatisticas();
      if ($("pac-stat-total")) $("pac-stat-total").textContent = String(stats.total);
      if ($("pac-stat-novos")) $("pac-stat-novos").textContent = String(stats.novos);
      if ($("pac-stat-retorno")) $("pac-stat-retorno").textContent = String(stats.comRetorno);
      if (contagem) {
        contagem.textContent =
          itens.length + (itens.length === 1 ? " paciente" : " pacientes") +
          (busca && busca.value ? " encontrados" : "");
      }
      if (!itens.length) {
        listaEl.innerHTML =
          '<li class="pac-lista-vazio">Nenhum paciente nesta busca. Cadastre com + Novo paciente.</li>';
        return;
      }
      listaEl.innerHTML = itens
        .map(function (p) {
          var ativo = p.id === selecionadoId ? " ativo" : "";
          return (
            '<li class="pac-item' +
            ativo +
            '" data-id="' +
            escapar(p.id) +
            '" role="button" tabindex="0">' +
            '<div class="dash-avatar pac-avatar">' +
            escapar(iniciais(p.nome)) +
            "</div>" +
            '<div class="pac-item-info">' +
            "<strong>" +
            escapar(p.nome) +
            "</strong>" +
            "<span>" +
            escapar(metaPaciente(p)) +
            "</span>" +
            "<em>" +
            (p.proximaConsulta
              ? "Próxima: " + formatarData(p.proximaConsulta)
              : p.ultimaConsulta
                ? "Última: " + formatarData(p.ultimaConsulta)
                : "Sem consultas") +
            "</em>" +
            "</div></li>"
          );
        })
        .join("");
    }

    function selecionar(id) {
      selecionadoId = id;
      var p = obter(id);
      renderLista();
      renderFicha(p);
    }

    function abrirNovo() {
      selecionadoId = null;
      renderLista();
      preencherForm(null);
      mostrarPainel("form");
      var nome = $("pac-form-nome");
      if (nome) nome.focus();
    }

    function abrirEdicao() {
      var p = obter(selecionadoId);
      if (!p) return;
      preencherForm(p);
      mostrarPainel("form");
    }

    function render() {
      renderLista();
      if (modoForm === "aberto") return;
      if (selecionadoId && obter(selecionadoId)) renderFicha(obter(selecionadoId));
      else mostrarPainel("vazio");
    }

    var busca = $("pac-busca");
    if (busca) {
      busca.addEventListener("input", function () {
        renderLista();
      });
    }

    document.querySelectorAll("[data-pac-filtro]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filtroAtual = btn.getAttribute("data-pac-filtro") || "todos";
        document.querySelectorAll("[data-pac-filtro]").forEach(function (b) {
          b.classList.toggle("ativo", b === btn);
        });
        renderLista();
      });
    });

    var listaEl = $("pac-lista");
    if (listaEl) {
      listaEl.addEventListener("click", function (ev) {
        var item = ev.target.closest(".pac-item");
        if (!item) return;
        selecionar(item.getAttribute("data-id"));
      });
      listaEl.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        var item = ev.target.closest(".pac-item");
        if (!item) return;
        ev.preventDefault();
        selecionar(item.getAttribute("data-id"));
      });
    }

    var btnNovo = $("btn-novo-paciente");
    if (btnNovo) btnNovo.addEventListener("click", abrirNovo);

    var btnCancelar = $("btn-pac-form-cancelar");
    if (btnCancelar) {
      btnCancelar.addEventListener("click", function () {
        if (selecionadoId) renderFicha(obter(selecionadoId));
        else {
          modoForm = "fechado";
          mostrarPainel("vazio");
        }
      });
    }

    var btnEditar = $("btn-pac-editar");
    if (btnEditar) btnEditar.addEventListener("click", abrirEdicao);

    var btnExcluir = $("btn-pac-excluir");
    if (btnExcluir) {
      btnExcluir.addEventListener("click", function () {
        if (!selecionadoId) return;
        if (!window.confirm("Excluir este paciente da sua lista?")) return;
        remover(selecionadoId);
        selecionadoId = null;
        modoForm = "fechado";
        render();
      });
    }

    var btnConsulta = $("btn-pac-nova-consulta");
    if (btnConsulta) {
      btnConsulta.addEventListener("click", function () {
        var p = obter(selecionadoId);
        if (typeof opts.onNovaConsulta === "function") opts.onNovaConsulta(p);
      });
    }

    var btnPront = $("btn-pac-prontuario");
    if (btnPront) {
      btnPront.addEventListener("click", function () {
        var p = obter(selecionadoId);
        if (typeof opts.onProntuario === "function") opts.onProntuario(p);
      });
    }

    var btnMsg = $("btn-pac-mensagem");
    if (btnMsg) {
      btnMsg.addEventListener("click", function () {
        if (typeof opts.onMensagem === "function") opts.onMensagem(obter(selecionadoId));
      });
    }

    var form = $("form-paciente");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var aviso = $("pac-form-aviso");
        try {
          var salvo = upsert({
            id: $("pac-form-id").value,
            nome: $("pac-form-nome").value,
            nascimento: $("pac-form-nasc").value,
            sexo: $("pac-form-sexo").value,
            telefone: $("pac-form-tel").value,
            email: $("pac-form-email").value,
            convenio: $("pac-form-convenio").value,
            cidade: $("pac-form-cidade").value,
            tags: $("pac-form-tags").value,
            observacoes: $("pac-form-obs").value,
            proximaConsulta: $("pac-form-prox").value,
            ultimaConsulta: $("pac-form-ult").value,
          });
          selecionadoId = salvo.id;
          modoForm = "fechado";
          render();
          if (aviso) {
            aviso.textContent = "Paciente salvo.";
            aviso.className = "aviso-form aviso-sucesso";
          }
        } catch (erro) {
          if (aviso) {
            aviso.textContent = erro.message || "Não foi possível salvar.";
            aviso.className = "aviso-form aviso-erro";
          }
        }
      });
    }

    global.renderPacientes = render;
    global.abrirNovoPaciente = abrirNovo;
    render();
  }
})(window);
