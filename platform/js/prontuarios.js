/* Prontuario eletronico do profissional — evolucoes, anexos e timeline */
(function (global) {
  var CHAVE = "dalucare_prontuarios_v2";

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
            tipo: "Retorno",
            titulo: "Retorno hipertensão",
            queixaPrincipal: "Retorno para controle de pressão arterial",
            hda: "Paciente em uso de losartana há 3 meses. Nega cefaleia, tontura ou dor torácica. Refere boa adesão ao tratamento.",
            interrogatorio: "Nega dispneia, edema de membros ou palpitação.",
            antecedentesPessoais: "HAS diagnosticada em janeiro/2026.",
            antecedentesFamiliares: "Mãe com HAS.",
            habitos: "Caminhada 3x/semana. Nega tabagismo.",
            medicamentos: "Losartana 50 mg 1x/dia",
            alergias: "Dipirona (rash)",
            exameFisico: "PA 128/78 mmHg. FC 72 bpm. Exame cardiovascular sem alterações.",
            hipotese: "HAS controlada",
            conduta: "Manter losartana. Retorno em 3 meses ou se sintomas.",
            texto: "PA 128/78 mmHg. Paciente refere boa adesão. Mantida losartana. Retorno em 3 meses ou se sintomas.",
            criadoEm: "2026-04-15T14:30:00.000Z",
          },
          {
            id: "ev2",
            data: "2026-01-20",
            tipo: "Consulta",
            titulo: "Primeira avaliação",
            queixaPrincipal: "Cefaleia ocasional",
            hda: "Cefaleia há 2 meses, predominantemente matinal. Mediu PA elevada em farmácia.",
            interrogatorio: "Nega náuseas, diplopia ou déficit focal.",
            antecedentesPessoais: "Negava comorbidades até então.",
            antecedentesFamiliares: "Pai com IAM aos 60 anos.",
            habitos: "Sedentária. Café 3x/dia.",
            medicamentos: "Nenhum de uso contínuo",
            alergias: "Dipirona (rash)",
            exameFisico: "PA elevada em consultório. Restante do exame sem alterações.",
            hipotese: "Hipertensão arterial sistêmica (em investigação)",
            conduta: "Solicitados exames laboratoriais e ECG. Iniciado anti-hipertensivo.",
            texto: "Queixa de cefaleia ocasional. PA elevada em consultório. Solicitados exames e iniciado anti-hipertensivo.",
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
            queixaPrincipal: "Retorno para revisão de exames",
            hda: "Em acompanhamento de dislipidemia. Aguardando lipidograma.",
            interrogatorio: "Nega dor torácica.",
            antecedentesPessoais: "Dislipidemia. Sedentarismo.",
            antecedentesFamiliares: "",
            habitos: "Sedentário. Orientações de dieta em andamento.",
            medicamentos: "Omeprazol 20 mg em jejum (SOS)",
            alergias: "Nega alergias conhecidas",
            exameFisico: "Sem alterações agudas.",
            hipotese: "Dislipidemia em investigação",
            conduta: "Aguardar lipidograma. Reforçar dieta e atividade física.",
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
            queixaPrincipal: "Avaliação inicial online",
            hda: "Queixas inespecíficas há algumas semanas. Sem sinais de alarme referidos.",
            interrogatorio: "Nega febre, perda ponderal ou dispneia.",
            antecedentesPessoais: "Sem comorbidades relatadas.",
            antecedentesFamiliares: "",
            habitos: "",
            medicamentos: "",
            alergias: "",
            exameFisico: "Teleconsulta — exame físico limitado.",
            hipotese: "Queixas inespecíficas · a esclarecer",
            conduta: "Orientações gerais. Agendar retorno presencial se persistir.",
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

  function montarTextoResumo(dados) {
    var partes = [];
    if (dados.queixaPrincipal) partes.push("QP: " + dados.queixaPrincipal);
    if (dados.hda) partes.push("HDA: " + dados.hda);
    if (dados.exameFisico) partes.push("EF: " + dados.exameFisico);
    if (dados.hipotese) partes.push("HD: " + dados.hipotese);
    if (dados.conduta) partes.push("Conduta: " + dados.conduta);
    if (!partes.length && dados.texto) return String(dados.texto).trim();
    return partes.join("\n");
  }

  function adicionarEvolucao(pacienteId, dados) {
    var mapa = carregar();
    var atual = garantir(pacienteId);
    var item = {
      id: novoId("ev"),
      data: String(dados.data || new Date().toISOString().slice(0, 10)),
      tipo: String(dados.tipo || "Consulta").trim(),
      titulo: String(dados.titulo || dados.queixaPrincipal || dados.tipo || "Atendimento").trim(),
      queixaPrincipal: String(dados.queixaPrincipal || "").trim(),
      hda: String(dados.hda || "").trim(),
      interrogatorio: String(dados.interrogatorio || "").trim(),
      antecedentesPessoais: String(dados.antecedentesPessoais || "").trim(),
      antecedentesFamiliares: String(dados.antecedentesFamiliares || "").trim(),
      habitos: String(dados.habitos || "").trim(),
      medicamentos: String(dados.medicamentos || "").trim(),
      alergias: String(dados.alergias || "").trim(),
      exameFisico: String(dados.exameFisico || "").trim(),
      hipotese: String(dados.hipotese || "").trim(),
      conduta: String(dados.conduta || "").trim(),
      texto: "",
      criadoEm: new Date().toISOString(),
    };
    item.texto = montarTextoResumo(item);
    if (!item.queixaPrincipal && !item.hda && !item.conduta && !item.texto) {
      throw new Error("Preencha ao menos queixa, HDA e conduta.");
    }
    if (!item.queixaPrincipal) throw new Error("Informe a queixa principal.");
    if (!item.hda) throw new Error("Informe a história da doença atual.");
    if (!item.conduta) throw new Error("Informe a conduta.");
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

    var atendimentoAbertoId = null;

    function mostrarSubHistoria(modo) {
      // modo: atendimentos | leitura | form
      if ($("pront-box-atendimentos")) $("pront-box-atendimentos").hidden = modo !== "atendimentos";
      if ($("pront-box-leitura")) $("pront-box-leitura").hidden = modo !== "leitura";
      if ($("pront-form-box")) $("pront-form-box").hidden = modo !== "form";
    }

    function limparFormAnamnese() {
      [
        "pront-ev-qp",
        "pront-ev-hda",
        "pront-ev-is",
        "pront-ev-ap",
        "pront-ev-af",
        "pront-ev-habitos",
        "pront-ev-meds",
        "pront-ev-alergias",
        "pront-ev-exame",
        "pront-ev-hd",
        "pront-ev-conduta",
      ].forEach(function (id) {
        var el = $(id);
        if (el) el.value = "";
      });
      if ($("pront-ev-tipo")) $("pront-ev-tipo").value = "Consulta";
      if ($("pront-ev-data")) $("pront-ev-data").value = dataHoje();
      if ($("pront-ev-aviso")) {
        $("pront-ev-aviso").textContent = "";
        $("pront-ev-aviso").className = "aviso-form";
      }
    }

    function secaoAnamnese(titulo, valor) {
      if (!valor) return "";
      return (
        '<div class="pront-anamnese-bloco"><h3>' +
        escapar(titulo) +
        "</h3><p>" +
        escapar(valor).replace(/\n/g, "<br>") +
        "</p></div>"
      );
    }

    function renderAtendimentos() {
      var lista = $("pront-atend-lista");
      if (!lista || !selecionadoId) return;
      var evolucoes = (obter(selecionadoId).evolucoes || []).slice();
      if (!evolucoes.length) {
        lista.innerHTML =
          '<li class="pront-vazio-item">Nenhum atendimento registrado. Clique em + Novo atendimento.</li>';
        return;
      }
      lista.innerHTML = evolucoes
        .map(function (e) {
          var preview = e.queixaPrincipal || e.titulo || e.texto || "Atendimento";
          return (
            '<li class="pront-atend-item" data-id="' +
            escapar(e.id) +
            '" role="button" tabindex="0">' +
            '<div class="pront-atend-topo">' +
            "<strong>" +
            escapar(e.titulo || e.queixaPrincipal || e.tipo) +
            "</strong>" +
            '<span class="pront-chip">' +
            escapar(e.tipo) +
            "</span>" +
            "<em>" +
            formatarData(e.data) +
            "</em>" +
            "</div>" +
            "<p>" +
            escapar(preview) +
            "</p>" +
            '<span class="pront-abrir-dica">Abrir anamnese →</span>' +
            "</li>"
          );
        })
        .join("");
    }

    function abrirLeitura(atendId) {
      atendimentoAbertoId = atendId;
      var pront = obter(selecionadoId);
      var e =
        (pront.evolucoes || []).find(function (item) {
          return item.id === atendId;
        }) || null;
      var box = $("pront-anamnese-leitura");
      if (!box || !e) return;
      var html = "";
      html +=
        '<div class="pront-anamnese-cabecalho"><strong>' +
        escapar(e.titulo || e.queixaPrincipal || e.tipo) +
        '</strong><span class="pront-chip">' +
        escapar(e.tipo) +
        "</span><em>" +
        formatarData(e.data) +
        "</em></div>";
      html += secaoAnamnese("Queixa principal", e.queixaPrincipal);
      html += secaoAnamnese("História da doença atual (HDA)", e.hda);
      html += secaoAnamnese("Interrogatório / revisão de sistemas", e.interrogatorio);
      html += secaoAnamnese("Antecedentes pessoais", e.antecedentesPessoais);
      html += secaoAnamnese("Antecedentes familiares", e.antecedentesFamiliares);
      html += secaoAnamnese("Hábitos de vida", e.habitos);
      html += secaoAnamnese("Medicamentos em uso", e.medicamentos);
      html += secaoAnamnese("Alergias", e.alergias);
      html += secaoAnamnese("Exame físico", e.exameFisico);
      html += secaoAnamnese("Hipótese diagnóstica", e.hipotese);
      html += secaoAnamnese("Conduta e orientações", e.conduta);
      if (!e.queixaPrincipal && !e.hda && e.texto) {
        html += secaoAnamnese("Registro clínico", e.texto);
      }
      box.innerHTML = html;
      mostrarSubHistoria("leitura");
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

      atendimentoAbertoId = null;
      limparFormAnamnese();
      renderAtendimentos();
      mostrarSubHistoria("atendimentos");
    }

    function voltarLista() {
      selecionadoId = null;
      atendimentoAbertoId = null;
      try {
        sessionStorage.removeItem("dalucare_pront_paciente");
      } catch (e) {}
      mostrarSubHistoria("atendimentos");
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
        limparFormAnamnese();
        mostrarSubHistoria("form");
        if ($("pront-ev-qp")) $("pront-ev-qp").focus();
      });
    }

    function cancelarForm() {
      limparFormAnamnese();
      mostrarSubHistoria("atendimentos");
    }

    var btnCancelar = $("btn-pront-cancelar-ev");
    if (btnCancelar) btnCancelar.addEventListener("click", cancelarForm);
    var btnCancelar2 = $("btn-pront-cancelar-ev-2");
    if (btnCancelar2) btnCancelar2.addEventListener("click", cancelarForm);

    var btnFecharLeitura = $("btn-pront-fechar-leitura");
    if (btnFecharLeitura) {
      btnFecharLeitura.addEventListener("click", function () {
        atendimentoAbertoId = null;
        mostrarSubHistoria("atendimentos");
      });
    }

    var btnExcluirAtend = $("btn-pront-excluir-atend");
    if (btnExcluirAtend) {
      btnExcluirAtend.addEventListener("click", function () {
        if (!selecionadoId || !atendimentoAbertoId) return;
        if (!window.confirm("Excluir este atendimento da história clínica?")) return;
        removerEvolucao(selecionadoId, atendimentoAbertoId);
        atendimentoAbertoId = null;
        renderHistoria();
      });
    }

    var atendLista = $("pront-atend-lista");
    if (atendLista) {
      atendLista.addEventListener("click", function (ev) {
        var item = ev.target.closest(".pront-atend-item");
        if (!item) return;
        abrirLeitura(item.getAttribute("data-id"));
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
            queixaPrincipal: $("pront-ev-qp").value,
            hda: $("pront-ev-hda").value,
            interrogatorio: $("pront-ev-is").value,
            antecedentesPessoais: $("pront-ev-ap").value,
            antecedentesFamiliares: $("pront-ev-af").value,
            habitos: $("pront-ev-habitos").value,
            medicamentos: $("pront-ev-meds").value,
            alergias: $("pront-ev-alergias").value,
            exameFisico: $("pront-ev-exame").value,
            hipotese: $("pront-ev-hd").value,
            conduta: $("pront-ev-conduta").value,
          });
          limparFormAnamnese();
          renderHistoria();
        } catch (erro) {
          if (aviso) {
            aviso.textContent = erro.message || "Não foi possível salvar.";
            aviso.className = "aviso-form aviso-erro";
          }
        }
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
