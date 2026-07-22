/* Prescrições salvas do profissional — medicações frequentes */
(function (global) {
  var CHAVE = "dalucare_prescricoes_salvas_v1";

  function seed() {
    return [
      {
        id: "ps1",
        nome: "Losartana potássica",
        dose: "50 mg",
        via: "VO",
        posologia: "1 comprimido pela manhã",
        quantidade: "30 comprimidos",
        observacao: "Uso contínuo",
        usos: 0,
      },
      {
        id: "ps2",
        nome: "Omeprazol",
        dose: "20 mg",
        via: "VO",
        posologia: "1 cápsula em jejum",
        quantidade: "30 cápsulas",
        observacao: "",
        usos: 0,
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
    return "ps_" + Date.now() + "_" + Math.floor(Math.random() * 999);
  }

  function normalizar(item) {
    return {
      id: item.id || novoId(),
      nome: String(item.nome || "").trim(),
      dose: String(item.dose || "").trim(),
      via: String(item.via || "VO").trim(),
      posologia: String(item.posologia || "").trim(),
      quantidade: String(item.quantidade || "").trim(),
      observacao: String(item.observacao || "").trim(),
      usos: Number(item.usos || 0),
      atualizadoEm: new Date().toISOString(),
    };
  }

  function textoReceita(item) {
    var linhas = [];
    linhas.push(item.nome + (item.dose ? " " + item.dose : ""));
    if (item.via) linhas.push("Via: " + item.via);
    if (item.posologia) linhas.push(item.posologia);
    if (item.quantidade) linhas.push("Quantidade: " + item.quantidade);
    if (item.observacao) linhas.push("Obs.: " + item.observacao);
    return linhas.join("\n");
  }

  function buscar(termo) {
    var q = String(termo || "")
      .trim()
      .toLowerCase();
    var lista = carregar().slice().sort(function (a, b) {
      return (b.usos || 0) - (a.usos || 0) || String(a.nome).localeCompare(String(b.nome), "pt-BR");
    });
    if (!q) return lista;
    return lista.filter(function (item) {
      var blob = [item.nome, item.dose, item.via, item.posologia, item.observacao].join(" ").toLowerCase();
      return blob.indexOf(q) >= 0;
    });
  }

  function upsert(dados) {
    var item = normalizar(dados);
    if (!item.nome) throw new Error("Informe o nome do medicamento.");
    if (!item.posologia) throw new Error("Informe a posologia.");
    var lista = carregar();
    var i = lista.findIndex(function (e) {
      return e.id === item.id;
    });
    if (i >= 0) {
      item.usos = lista[i].usos || 0;
      lista[i] = item;
    } else {
      item.usos = 0;
      lista.push(item);
    }
    salvar(lista);
    return item;
  }

  function remover(id) {
    salvar(
      carregar().filter(function (e) {
        return e.id !== id;
      })
    );
  }

  function registrarUso(id) {
    var lista = carregar();
    var i = lista.findIndex(function (e) {
      return e.id === id;
    });
    if (i < 0) return null;
    lista[i].usos = (lista[i].usos || 0) + 1;
    lista[i].ultimoUso = new Date().toISOString();
    salvar(lista);
    return lista[i];
  }

  function obter(id) {
    return (
      carregar().find(function (e) {
        return e.id === id;
      }) || null
    );
  }

  global.DalucarePrescricoesSalvas = {
    carregar: carregar,
    buscar: buscar,
    upsert: upsert,
    remover: remover,
    registrarUso: registrarUso,
    obter: obter,
    textoReceita: textoReceita,
    novoId: novoId,
  };
})(window);
