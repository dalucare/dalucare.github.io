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
    var abaAtiva = "evolucoes";

    function $(id) {
      return document.getElementById(id);
    }

    function setAba(nome) {
      abaAtiva = nome;
      document.querySelectorAll("[data-pront-aba]").forEach(function (btn) {
        btn.classList.toggle("ativo", btn.getAttribute("data-pront-aba") === nome);
      });
      ["evolucoes", "resumo", "anexos"].forEach(function (nomeAba) {
        var painel = $("pront-aba-" + nomeAba);
        if (painel) painel.hidden = nomeAba !== nome;
      });
    }

    function preencherSelect(pacientes) {
      var sel = $("pront-paciente-select");
      if (!sel) return;
      var atual = selecionadoId;
      sel.innerHTML =
        '<option value="">Selecione um paciente</option>' +
        pacientes
          .map(function (p) {
            return '<option value="' + escapar(p.id) + '">' + escapar(p.nome) + "</option>";
          })
          .join("");
      if (atual) sel.value = atual;
    }

    function renderListaLateral(pacientes, termo) {
      var lista = $("pront-pac-lista");
      if (!lista) return;
      var q = String(termo || "").toLowerCase();
      var filtrados = pacientes.filter(function (p) {
        if (!q) return true;
        return [p.nome, p.convenio, p.cidade].join(" ").toLowerCase().indexOf(q) >= 0;
      });
      if (!filtrados.length) {
        lista.innerHTML = '<li class="pac-lista-vazio">Nenhum paciente encontrado.</li>';
        return;
      }
      var iniFn =
        global.DalucarePacientes && global.DalucarePacientes.iniciais
          ? global.DalucarePacientes.iniciais
          : function (n) {
              return String(n || "?").slice(0, 2).toUpperCase();
            };
      lista.innerHTML = filtrados
        .map(function (p) {
          var ativo = p.id === selecionadoId ? " ativo" : "";
          var pront = obter(p.id);
          var qtd = (pront.evolucoes || []).length;
          return (
            '<li class="pac-item' +
            ativo +
            '" data-id="' +
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
            (qtd === 1 ? " evolucao" : " evolucoes") +
            "</em>" +
            "</div></li>"
          );
        })
        .join("");
    }

    function renderDetalhe() {
      var vazio = $("pront-vazio");
      var corpo = $("pront-corpo");
      if (!selecionadoId) {
        if (vazio) vazio.hidden = false;
        if (corpo) corpo.hidden = true;
        return;
      }
      if (vazio) vazio.hidden = true;
      if (corpo) corpo.hidden = false;

      var pacientes = listarPacientes();
      var pac =
        pacientes.find(function (p) {
          return p.id === selecionadoId;
        }) || null;
      var pront = obter(selecionadoId);
      var iniFn =
        global.DalucarePacientes && global.DalucarePacientes.iniciais
          ? global.DalucarePacientes.iniciais
          : function (n) {
              return "?";
            };

      if ($("pront-avatar")) $("pront-avatar").textContent = iniFn(pac ? pac.nome : "?");
      if ($("pront-nome")) $("pront-nome").textContent = pac ? pac.nome : "Paciente";
      if ($("pront-meta")) {
        $("pront-meta").textContent = pac
          ? [pac.sexo, pac.convenio, pac.telefone].filter(Boolean).join(" · ")
          : "";
      }

      if ($("pront-alergias")) $("pront-alergias").value = pront.alergias || "";
      if ($("pront-antecedentes")) $("pront-antecedentes").value = pront.antecedentes || "";
      if ($("pront-meds")) $("pront-meds").value = pront.medicamentosUso || "";

      var evLista = $("pront-evolucoes");
      if (evLista) {
        var evolucoes = (pront.evolucoes || []).slice();
        if (!evolucoes.length) {
          evLista.innerHTML =
            '<li class="pront-vazio-item">Nenhuma evolucao ainda. Registre a primeira a direita.</li>';
        } else {
          evLista.innerHTML = evolucoes
            .map(function (e) {
              return (
                '<li class="pront-evolucao" data-id="' +
                escapar(e.id) +
                '">' +
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
                '<button type="button" class="link-suave pront-ev-excluir" data-ev="' +
                escapar(e.id) +
                '">Excluir</button>' +
                "</li>"
              );
            })
            .join("");
        }
      }

      var axLista = $("pront-anexos");
      if (axLista) {
        var anexos = pront.anexos || [];
        if (!anexos.length) {
          axLista.innerHTML = '<li class="pront-vazio-item">Nenhum documento registrado.</li>';
        } else {
          axLista.innerHTML = anexos
            .map(function (a) {
              return (
                '<li class="pront-anexo">' +
                "<div><strong>" +
                escapar(a.nome) +
                "</strong><span>" +
                escapar(a.tipo) +
                " · " +
                formatarData(a.data) +
                '</span></div><span class="status status-ok">' +
                escapar(a.status) +
                '</span><button type="button" class="link-suave" data-ax="' +
                escapar(a.id) +
                '">Remover</button></li>'
              );
            })
            .join("");
        }
      }

      var hoje = new Date();
      var yyyy = hoje.getFullYear();
      var mm = String(hoje.getMonth() + 1);
      if (mm.length < 2) mm = "0" + mm;
      var dd = String(hoje.getDate());
      if (dd.length < 2) dd = "0" + dd;
      if ($("pront-ev-data") && !$("pront-ev-data").value) {
        $("pront-ev-data").value = yyyy + "-" + mm + "-" + dd;
      }
      if ($("pront-ax-data") && !$("pront-ax-data").value) {
        $("pront-ax-data").value = yyyy + "-" + mm + "-" + dd;
      }
    }

    function selecionar(id) {
      selecionadoId = id || null;
      try {
        if (selecionadoId) sessionStorage.setItem("dalucare_pront_paciente", selecionadoId);
        else sessionStorage.removeItem("dalucare_pront_paciente");
      } catch (e) {}
      var sel = $("pront-paciente-select");
      if (sel) sel.value = selecionadoId || "";
      render();
    }

    function render() {
      var pacientes = listarPacientes();
      preencherSelect(pacientes);
      renderListaLateral(pacientes, $("pront-busca") ? $("pront-busca").value : "");
      renderDetalhe();
      setAba(abaAtiva);
    }

    var busca = $("pront-busca");
    if (busca) {
      busca.addEventListener("input", function () {
        renderListaLateral(listarPacientes(), busca.value);
      });
    }

    var lista = $("pront-pac-lista");
    if (lista) {
      lista.addEventListener("click", function (ev) {
        var item = ev.target.closest(".pac-item");
        if (!item) return;
        selecionar(item.getAttribute("data-id"));
      });
    }

    var sel = $("pront-paciente-select");
    if (sel) {
      sel.addEventListener("change", function () {
        selecionar(sel.value || null);
      });
    }

    document.querySelectorAll("[data-pront-aba]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setAba(btn.getAttribute("data-pront-aba") || "evolucoes");
      });
    });

    var formResumo = $("form-pront-resumo");
    if (formResumo) {
      formResumo.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (!selecionadoId) return;
        salvarCabecalho(selecionadoId, {
          alergias: $("pront-alergias").value,
          antecedentes: $("pront-antecedentes").value,
          medicamentosUso: $("pront-meds").value,
        });
        var aviso = $("pront-resumo-aviso");
        if (aviso) {
          aviso.textContent = "Resumo clinico salvo.";
          aviso.className = "aviso-form aviso-sucesso";
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
          if (aviso) {
            aviso.textContent = "Evolucao registrada.";
            aviso.className = "aviso-form aviso-sucesso";
          }
          setAba("evolucoes");
          renderDetalhe();
          renderListaLateral(listarPacientes(), $("pront-busca") ? $("pront-busca").value : "");
        } catch (erro) {
          if (aviso) {
            aviso.textContent = erro.message || "Nao foi possivel salvar.";
            aviso.className = "aviso-form aviso-erro";
          }
        }
      });
    }

    var formAx = $("form-pront-anexo");
    if (formAx) {
      formAx.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var aviso = $("pront-ax-aviso");
        try {
          if (!selecionadoId) throw new Error("Selecione um paciente.");
          adicionarAnexo(selecionadoId, {
            nome: $("pront-ax-nome").value,
            tipo: $("pront-ax-tipo").value,
            status: $("pront-ax-status").value,
            data: $("pront-ax-data").value,
          });
          $("pront-ax-nome").value = "";
          if (aviso) {
            aviso.textContent = "Documento adicionado.";
            aviso.className = "aviso-form aviso-sucesso";
          }
          setAba("anexos");
          renderDetalhe();
        } catch (erro) {
          if (aviso) {
            aviso.textContent = erro.message || "Nao foi possivel salvar.";
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
        if (!window.confirm("Excluir esta evolucao?")) return;
        removerEvolucao(selecionadoId, btn.getAttribute("data-ev"));
        render();
      });
    }

    var axLista = $("pront-anexos");
    if (axLista) {
      axLista.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-ax]");
        if (!btn || !selecionadoId) return;
        removerAnexo(selecionadoId, btn.getAttribute("data-ax"));
        renderDetalhe();
      });
    }

    var btnIrPac = $("btn-pront-ir-pacientes");
    if (btnIrPac) {
      btnIrPac.addEventListener("click", function () {
        if (typeof global.abrirAbaPacientes === "function") global.abrirAbaPacientes();
        else {
          var nav = document.querySelector('.dash-nav-item[data-aba="pacientes"]');
          if (nav) nav.click();
        }
      });
    }

    global.renderProntuarios = function (pacienteIdOpcional) {
      if (pacienteIdOpcional) selecionadoId = pacienteIdOpcional;
      else {
        try {
          var salvo = sessionStorage.getItem("dalucare_pront_paciente");
          if (salvo) selecionadoId = salvo;
        } catch (e) {}
      }
      render();
    };

    global.abrirProntuarioPaciente = function (pacienteId) {
      try {
        sessionStorage.setItem("dalucare_pront_paciente", pacienteId);
      } catch (e) {}
      selecionadoId = pacienteId;
      var nav = document.querySelector('.dash-nav-item[data-aba="prontuarios"]');
      if (nav) nav.click();
      else if (typeof global.renderProntuarios === "function") global.renderProntuarios(pacienteId);
    };

    try {
      var inicial = sessionStorage.getItem("dalucare_pront_paciente");
      if (inicial) selecionadoId = inicial;
    } catch (e) {}
    render();
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
