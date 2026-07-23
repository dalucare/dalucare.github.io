/* Prontuario eletronico do profissional — evolucoes, anexos e timeline */
(function (global) {
  var CHAVE = "dalucare_prontuarios_v1";

  function seed() {
    return {
      pac1: {
        pacienteId: "pac1",
        alergias: "Dipirona (rash)",
        antecedentes: "HAS em acompanhamento. Nega DM.",
        medicamentosUso: "Losartana 50 mg 1x/dia",
        evolucoes: [
          {
            id: "ev1",
            data: "2026-04-15",
            tipo: "Consulta",
            titulo: "Retorno hipertensão",
            texto:
              "PA 128/78 mmHg. Paciente refere boa adesão. Mantida losartana. Retorno em 3 meses ou se sintomas.",
            criadoEm: "2026-04-15T14:30:00.000Z",
          },
          {
            id: "ev2",
            data: "2026-01-20",
            tipo: "Consulta",
            titulo: "Primeira avaliação",
            texto:
              "Queixa de cefaleia ocasional. PA elevada em consultório. Solicitados exames e iniciado anti-hipertensivo.",
            criadoEm: "2026-01-20T10:00:00.000Z",
          },
        ],
        anexos: [
          { id: "ax1", nome: "Hemograma 01/2026", tipo: "Exame", status: "Normal", data: "2026-01-18" },
          { id: "ax2", nome: "ECG 01/2026", tipo: "Exame", status: "Normal", data: "2026-01-18" },
        ],
      },
      pac2: {
        pacienteId: "pac2",
        alergias: "Nega alergias conhecidas",
        antecedentes: "Dislipidemia. Sedentarismo.",
        medicamentosUso: "Omeprazol 20 mg em jejum (SOS)",
        evolucoes: [
          {
            id: "ev3",
            data: "2026-06-10",
            tipo: "Retorno",
            titulo: "Revisão de exames",
            texto: "Aguardando lipidograma. Orientações de dieta e atividade física reforçadas.",
            criadoEm: "2026-06-10T11:15:00.000Z",
          },
        ],
        anexos: [
          { id: "ax3", nome: "Pedido laboratorial", tipo: "Pedido", status: "Pendente", data: "2026-06-10" },
        ],
      },
      pac3: {
        pacienteId: "pac3",
        alergias: "",
        antecedentes: "Sem comorbidades relatadas.",
        medicamentosUso: "",
        evolucoes: [
          {
            id: "ev4",
            data: "2026-07-22",
            tipo: "Teleconsulta",
            titulo: "Primeira teleconsulta",
            texto: "Avaliação inicial online. Queixas inespecíficas. Agendado retorno presencial se necessário.",
            criadoEm: "2026-07-22T09:00:00.000Z",
          },
        ],
        anexos: [],
      },
    };
  }

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        var inicial = seed();
        salvar(inicial);
        return inicial;
      }
      var dados = JSON.parse(bruto);
      return dados && typeof dados === "object" ? dados : seed();
    } catch (e) {
      return seed();
    }
  }

  function salvar(mapa) {
    localStorage.setItem(CHAVE, JSON.stringify(mapa));
  }

  function novoId(prefixo) {
    return prefixo + "_" + Date.now() + "_" + Math.floor(Math.random() * 999);
  }

  function garantir(pacienteId) {
    var mapa = carregar();
    if (!mapa[pacienteId]) {
      mapa[pacienteId] = {
        pacienteId: pacienteId,
        alergias: "",
        antecedentes: "",
        medicamentosUso: "",
        evolucoes: [],
        anexos: [],
      };
      salvar(mapa);
    }
    return mapa[pacienteId];
  }

  function obter(pacienteId) {
    return garantir(pacienteId);
  }

  function salvarCabecalho(pacienteId, dados) {
    var mapa = carregar();
    var atual = garantir(pacienteId);
    atual.alergias = String(dados.alergias || "").trim();
    atual.antecedentes = String(dados.antecedentes || "").trim();
    atual.medicamentosUso = String(dados.medicamentosUso || "").trim();
    mapa[pacienteId] = atual;
    salvar(mapa);
    return atual;
  }

  function adicionarEvolucao(pacienteId, dados) {
    var mapa = carregar();
    var atual = garantir(pacienteId);
    var item = {
      id: novoId("ev"),
      data: String(dados.data || new Date().toISOString().slice(0, 10)),
      tipo: String(dados.tipo || "Consulta").trim(),
      titulo: String(dados.titulo || "").trim(),
      texto: String(dados.texto || "").trim(),
      criadoEm: new Date().toISOString(),
    };
    if (!item.texto) throw new Error("Escreva a evolucao clinica.");
    if (!item.titulo) item.titulo = item.tipo;
    atual.evolucoes = [item].concat(atual.evolucoes || []);
    mapa[pacienteId] = atual;
    salvar(mapa);
    return item;
  }

  function removerEvolucao(pacienteId, evolucaoId) {
    var mapa = carregar();
    var atual = garantir(pacienteId);
    atual.evolucoes = (atual.evolucoes || []).filter(function (e) {
      return e.id !== evolucaoId;
    });
    mapa[pacienteId] = atual;
    salvar(mapa);
  }

  function adicionarAnexo(pacienteId, dados) {
    var mapa = carregar();
    var atual = garantir(pacienteId);
    var item = {
      id: novoId("ax"),
      nome: String(dados.nome || "").trim(),
      tipo: String(dados.tipo || "Documento").trim(),
      status: String(dados.status || "Registrado").trim(),
      data: String(dados.data || new Date().toISOString().slice(0, 10)),
    };
    if (!item.nome) throw new Error("Informe o nome do documento.");
    atual.anexos = [item].concat(atual.anexos || []);
    mapa[pacienteId] = atual;
    salvar(mapa);
    return item;
  }

  function removerAnexo(pacienteId, anexoId) {
    var mapa = carregar();
    var atual = garantir(pacienteId);
    atual.anexos = (atual.anexos || []).filter(function (a) {
      return a.id !== anexoId;
    });
    mapa[pacienteId] = atual;
    salvar(mapa);
  }

  function escapar(texto) {
    return String(texto || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatarData(iso) {
    if (!iso) return "-";
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function listarPacientes() {
    if (global.DalucarePacientes && typeof global.DalucarePacientes.carregar === "function") {
      return global.DalucarePacientes.carregar().slice().sort(function (a, b) {
        return String(a.nome).localeCompare(String(b.nome), "pt-BR");
      });
    }
    return [];
  }

  function initUI() {
    var selecionadoId = null;

    function $(id) {
      return document.getElementById(id);
    }

    function iniFn(nome) {
      if (global.DalucarePacientes && global.DalucarePacientes.iniciais) {
        return global.DalucarePacientes.iniciais(nome);
      }
      return String(nome || "?").slice(0, 2).toUpperCase();
    }

    function dataHoje() {
      var hoje = new Date();
      var mm = String(hoje.getMonth() + 1);
      var dd = String(hoje.getDate());
      if (mm.length < 2) mm = "0" + mm;
      if (dd.length < 2) dd = "0" + dd;
      return hoje.getFullYear() + "-" + mm + "-" + dd;
    }

    function mostrarVista(modo) {
      var lista = $("pront-vista-lista");
      var historia = $("pront-vista-historia");
      var topoLista = $("pront-topo-lista");
      if (lista) lista.hidden = modo !== "lista";
      if (historia) historia.hidden = modo !== "historia";
      if (topoLista) topoLista.hidden = modo !== "lista";
    }

    function renderLista() {
      var lista = $("pront-pac-lista");
      var contagem = $("pront-contagem");
      var busca = $("pront-busca");
      if (!lista) return;
      var pacientes = listarPacientes();
      var q = String(busca && busca.value ? busca.value : "").toLowerCase();
      var filtrados = pacientes.filter(function (p) {
        if (!q) return true;
        return [p.nome, p.convenio, p.cidade, p.telefone].join(" ").toLowerCase().indexOf(q) >= 0;
      });
      if (contagem) {
        contagem.textContent =
          filtrados.length + (filtrados.length === 1 ? " paciente" : " pacientes");
      }
      if (!filtrados.length) {
        lista.innerHTML =
          '<li class="pac-lista-vazio">Nenhum paciente encontrado. Cadastre em Pacientes.</li>';
        return;
      }
      lista.innerHTML = filtrados
        .map(function (p) {
          var pront = obter(p.id);
          var qtd = (pront.evolucoes || []).length;
          return (
            '<li class="pac-item pront-lista-item" data-id="' +
            escapar(p.id) +
            '" role="button" tabindex="0">' +
            '<div class="dash-avatar pac-avatar">' +
            escapar(iniFn(p.nome)) +
            "</div>" +
            '<div class="pac-item-info">' +
            "<strong>" +
            escapar(p.nome) +
            "</strong>" +
            "<span>" +
            escapar(p.convenio || "Particular") +
            (p.cidade ? " · " + escapar(p.cidade) : "") +
            "</span>" +
            "<em>" +
            qtd +
            (qtd === 1 ? " evolução na história" : " evoluções na história") +
            "</em>" +
            "</div>" +
            '<span class="pront-abrir-dica">Abrir história →</span>' +
            "</li>"
          );
        })
        .join("");
    }

    function renderHistoria() {
      if (!selecionadoId) {
        mostrarVista("lista");
        renderLista();
        return;
      }
      mostrarVista("historia");
      var pacientes = listarPacientes();
      var pac =
        pacientes.find(function (p) {
          return p.id === selecionadoId;
        }) || null;
      var pront = obter(selecionadoId);

      if ($("pront-avatar")) $("pront-avatar").textContent = iniFn(pac ? pac.nome : "?");
      if ($("pront-nome")) $("pront-nome").textContent = pac ? pac.nome : "Paciente";
      if ($("pront-meta")) {
        $("pront-meta").textContent = pac
          ? [pac.sexo, pac.convenio, pac.telefone, pac.cidade].filter(Boolean).join(" · ")
          : "";
      }

      var resumo = $("pront-resumo-leitura");
      if (resumo) {
        resumo.innerHTML =
          "<p><strong>Alergias:</strong> " +
          escapar(pront.alergias || "Não informadas") +
          "</p>" +
          "<p><strong>Antecedentes:</strong> " +
          escapar(pront.antecedentes || "Não informados") +
          "</p>" +
          "<p><strong>Medicamentos em uso:</strong> " +
          escapar(pront.medicamentosUso || "Não informados") +
          "</p>";
      }

      var evLista = $("pront-evolucoes");
      if (evLista) {
        var evolucoes = (pront.evolucoes || []).slice();
        if (!evolucoes.length) {
          evLista.innerHTML =
            '<li class="pront-vazio-item">Ainda não há história clínica registrada para este paciente.</li>';
        } else {
          evLista.innerHTML = evolucoes
            .map(function (e) {
              return (
                '<li class="pront-evolucao">' +
                '<div class="pront-evolucao-topo">' +
                "<strong>" +
                escapar(e.titulo || e.tipo) +
                "</strong>" +
                '<span class="pront-chip">' +
                escapar(e.tipo) +
                "</span>" +
                "<em>" +
                formatarData(e.data) +
                "</em>" +
                "</div>" +
                "<p>" +
                escapar(e.texto).replace(/\n/g, "<br>") +
                "</p>" +
                '<button type="button" class="link-suave" data-ev="' +
                escapar(e.id) +
                '">Excluir</button>' +
                "</li>"
              );
            })
            .join("");
        }
      }

      if ($("pront-form-box")) $("pront-form-box").hidden = true;
      if ($("pront-ev-data")) $("pront-ev-data").value = dataHoje();
    }

    function voltarLista() {
      selecionadoId = null;
      try {
        sessionStorage.removeItem("dalucare_pront_paciente");
      } catch (e) {}
      if ($("pront-form-box")) $("pront-form-box").hidden = true;
      mostrarVista("lista");
      renderLista();
    }

    function abrirHistoria(id) {
      selecionadoId = id;
      try {
        sessionStorage.setItem("dalucare_pront_paciente", id);
      } catch (e) {}
      renderHistoria();
    }

    function render(forcarHistoria) {
      if (forcarHistoria && selecionadoId) {
        renderHistoria();
        return;
      }
      if (selecionadoId) renderHistoria();
      else {
        mostrarVista("lista");
        renderLista();
      }
    }

    var busca = $("pront-busca");
    if (busca) {
      busca.addEventListener("input", function () {
        renderLista();
      });
    }

    var lista = $("pront-pac-lista");
    if (lista) {
      lista.addEventListener("click", function (ev) {
        var item = ev.target.closest(".pac-item");
        if (!item) return;
        abrirHistoria(item.getAttribute("data-id"));
      });
      lista.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        var item = ev.target.closest(".pac-item");
        if (!item) return;
        ev.preventDefault();
        abrirHistoria(item.getAttribute("data-id"));
      });
    }

    var btnVoltar = $("btn-pront-voltar");
    if (btnVoltar) btnVoltar.addEventListener("click", voltarLista);

    var btnNova = $("btn-pront-nova-ev");
    if (btnNova) {
      btnNova.addEventListener("click", function () {
        var box = $("pront-form-box");
        if (!box) return;
        box.hidden = false;
        if ($("pront-ev-data")) $("pront-ev-data").value = dataHoje();
        if ($("pront-ev-titulo")) $("pront-ev-titulo").focus();
      });
    }

    var btnCancelar = $("btn-pront-cancelar-ev");
    if (btnCancelar) {
      btnCancelar.addEventListener("click", function () {
        if ($("pront-form-box")) $("pront-form-box").hidden = true;
        if ($("pront-ev-aviso")) {
          $("pront-ev-aviso").textContent = "";
          $("pront-ev-aviso").className = "aviso-form";
        }
      });
    }

    var formEv = $("form-pront-evolucao");
    if (formEv) {
      formEv.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var aviso = $("pront-ev-aviso");
        try {
          if (!selecionadoId) throw new Error("Selecione um paciente.");
          adicionarEvolucao(selecionadoId, {
            data: $("pront-ev-data").value,
            tipo: $("pront-ev-tipo").value,
            titulo: $("pront-ev-titulo").value,
            texto: $("pront-ev-texto").value,
          });
          $("pront-ev-titulo").value = "";
          $("pront-ev-texto").value = "";
          if ($("pront-form-box")) $("pront-form-box").hidden = true;
          if (aviso) {
            aviso.textContent = "";
            aviso.className = "aviso-form";
          }
          renderHistoria();
        } catch (erro) {
          if (aviso) {
            aviso.textContent = erro.message || "Não foi possível salvar.";
            aviso.className = "aviso-form aviso-erro";
          }
        }
      });
    }

    var evLista = $("pront-evolucoes");
    if (evLista) {
      evLista.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-ev]");
        if (!btn || !selecionadoId) return;
        if (!window.confirm("Excluir esta evolução da história clínica?")) return;
        removerEvolucao(selecionadoId, btn.getAttribute("data-ev"));
        renderHistoria();
      });
    }

    global.abrirProntuarioPaciente = function (pacienteId) {
      try {
        sessionStorage.setItem("dalucare_pront_paciente", pacienteId);
      } catch (e) {}
      global.__prontAbrirId = pacienteId;
      var nav = document.querySelector('.dash-nav-item[data-aba="prontuarios"]');
      if (nav) nav.click();
      else abrirHistoria(pacienteId);
    };

    global.renderProntuarios = function (pacienteIdOpcional) {
      var id = pacienteIdOpcional || global.__prontAbrirId || null;
      global.__prontAbrirId = null;
      if (id) {
        abrirHistoria(id);
        return;
      }
      selecionadoId = null;
      mostrarVista("lista");
      renderLista();
    };

    mostrarVista("lista");
    renderLista();
  }

  global.DalucareProntuarios = {
    obter: obter,
    salvarCabecalho: salvarCabecalho,
    adicionarEvolucao: adicionarEvolucao,
    removerEvolucao: removerEvolucao,
    adicionarAnexo: adicionarAnexo,
    removerAnexo: removerAnexo,
    initUI: initUI,
  };
})(window);
