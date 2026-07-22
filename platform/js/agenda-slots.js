/* Calendário editável do profissional — hoje: 22/07/2026 */
(function (global) {
  var CHAVE = "dalucare_agenda_pro_v2";
  var CHAVE_ANTIGA = "dalucare_agenda_pro";
  var HOJE = new Date(2026, 6, 22); // 22/07/2026
  var SLOT_INICIO = 7; // 07:00
  var SLOT_FIM = 20; // até 20:00
  var SLOT_MIN = 30;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function dataISO(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseISO(iso) {
    var p = String(iso || "").split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function iniciaisDe(nome) {
    var partes = String(nome || "").trim().split(/\s+/);
    if (!partes[0]) return "—";
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  function statusClass(status) {
    if (status === "Teleconsulta") return "status-tele";
    if (status === "Livre") return "status-livre";
    if (status === "Cancelado") return "status-atencao";
    return "status-ok";
  }

  function normalizarHora(hora) {
    var bruto = String(hora || "").trim().toLowerCase();
    if (!bruto) return "";

    var am = /\b(am|a\.m\.)\b/.test(bruto);
    var pm = /\b(pm|p\.m\.)\b/.test(bruto);
    bruto = bruto.replace(/\s*(a\.?m\.?|p\.?m\.?)\s*/g, "");

    var partes = bruto.split(":");
    var h = Number(partes[0]);
    var m = Number(partes[1] || 0);
    if (isNaN(h) || isNaN(m)) return "";

    if (pm && h < 12) h += 12;
    if (am && h === 12) h = 0;

    h = Math.max(0, Math.min(23, h));
    m = Math.max(0, Math.min(59, m));
    return pad(h) + ":" + pad(m);
  }

  function seedPadrao() {
    var dia = dataISO(HOJE);
    return [
      { id: "a1", data: dia, hora: "08:00", nome: "Maria Silva", tipo: "Consulta", status: "Confirmado" },
      { id: "a2", data: dia, hora: "08:30", nome: "João Pedro Santos", tipo: "Retorno", status: "Confirmado" },
      { id: "a3", data: dia, hora: "09:00", nome: "Ana Carolina Lemos", tipo: "Teleconsulta", status: "Teleconsulta" },
      { id: "a4", data: dia, hora: "10:00", nome: "Carlos Alberto", tipo: "Consulta", status: "Confirmado" },
      { id: "a5", data: dia, hora: "10:30", nome: "Fernanda Costa", tipo: "Retorno", status: "Confirmado" },
      { id: "a6", data: "2026-07-23", hora: "09:00", nome: "Paula Mendes", tipo: "Consulta", status: "Confirmado" },
      { id: "a7", data: "2026-07-24", hora: "14:00", nome: "Ricardo Alves", tipo: "Teleconsulta", status: "Teleconsulta" },
    ];
  }

  function deduplicar(lista) {
    var vistos = {};
    var limpa = [];
    lista.forEach(function (e) {
      if (!e) return;
      var item = {
        id: e.id || "ev_" + Date.now() + "_" + Math.floor(Math.random() * 999),
        data: e.data,
        hora: normalizarHora(e.hora),
        nome: e.nome || "Paciente",
        tipo: e.tipo || "Consulta",
        status: e.status || "Confirmado",
        obs: e.obs || "",
      };
      if (!item.data || !item.hora) return;
      var chave = item.data + "|" + item.hora;
      if (item.status !== "Cancelado" && vistos[chave]) return;
      if (item.status !== "Cancelado") vistos[chave] = true;
      limpa.push(item);
    });
    return limpa;
  }

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        var antigo = localStorage.getItem(CHAVE_ANTIGA);
        var base = antigo ? JSON.parse(antigo) : seedPadrao();
        if (!Array.isArray(base)) base = seedPadrao();
        var migrado = deduplicar(base);
        salvar(migrado);
        return migrado;
      }
      var lista = JSON.parse(bruto);
      if (!Array.isArray(lista)) return seedPadrao();
      var limpa = deduplicar(lista);
      if (limpa.length !== lista.length) salvar(limpa);
      return limpa;
    } catch (e) {
      return seedPadrao();
    }
  }

  function salvar(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  function eventosDoDia(iso) {
    return carregar()
      .filter(function (e) {
        return e.data === iso;
      })
      .sort(function (a, b) {
        return normalizarHora(a.hora).localeCompare(normalizarHora(b.hora));
      });
  }

  function contagemPorDia(ano, mes) {
    var mapa = {};
    carregar().forEach(function (e) {
      if (!e.data || e.status === "Cancelado") return;
      var p = e.data.split("-");
      if (Number(p[0]) === ano && Number(p[1]) === mes + 1) {
        mapa[e.data] = (mapa[e.data] || 0) + 1;
      }
    });
    return mapa;
  }

  function horarioOcupado(data, hora, ignorarId) {
    var h = normalizarHora(hora);
    if (!data || !h) return false;
    return carregar().some(function (e) {
      if (ignorarId && e.id === ignorarId) return false;
      if (e.status === "Cancelado") return false;
      return e.data === data && normalizarHora(e.hora) === h;
    });
  }

  function gerarSlots() {
    var slots = [];
    for (var h = SLOT_INICIO; h <= SLOT_FIM; h += 1) {
      for (var m = 0; m < 60; m += SLOT_MIN) {
        if (h === SLOT_FIM && m > 0) break;
        slots.push(pad(h) + ":" + pad(m));
      }
    }
    return slots;
  }

  function slotsDisponiveis(data, ignorarId) {
    return gerarSlots().filter(function (slot) {
      return !horarioOcupado(data, slot, ignorarId);
    });
  }

  function upsert(evento) {
    var registro = {
      id: evento.id,
      data: evento.data,
      hora: normalizarHora(evento.hora),
      nome: String(evento.nome || "").trim(),
      tipo: evento.tipo || "Consulta",
      status: evento.status || "Confirmado",
      obs: evento.obs || "",
    };

    if (!registro.data || !registro.hora || !registro.nome) {
      throw new Error("Preencha data, horário e paciente.");
    }

    if (registro.status !== "Cancelado" && horarioOcupado(registro.data, registro.hora, registro.id)) {
      throw new Error("Horário " + registro.hora + " já ocupado em " + registro.data.split("-").reverse().join("/") + ". Escolha outro.");
    }

    var lista = carregar();
    var i = lista.findIndex(function (e) {
      return e.id === registro.id;
    });
    if (i >= 0) lista[i] = registro;
    else lista.push(registro);
    salvar(deduplicar(lista));
    return lista;
  }

  function remover(id) {
    var lista = carregar().filter(function (e) {
      return e.id !== id;
    });
    salvar(lista);
    return lista;
  }

  function paraListaDia(iso) {
    var eventos = eventosDoDia(iso).filter(function (e) {
      return e.status !== "Cancelado";
    });
    if (!eventos.length) {
      return [
        {
          hora: "—",
          nome: "Nenhuma consulta",
          tipo: "Dia livre",
          status: "Livre",
          statusClass: "status-livre",
          iniciais: "—",
          livre: true,
        },
      ];
    }
    return eventos.map(function (e) {
      var hora = normalizarHora(e.hora);
      return {
        id: e.id,
        hora: hora,
        nome: e.nome,
        tipo: e.tipo,
        status: e.status,
        statusClass: statusClass(e.status),
        iniciais: iniciaisDe(e.nome),
        meta: e.tipo + " · " + e.status,
        ultima: "Agendado para " + e.data.split("-").reverse().join("/"),
        obs: e.obs || "",
        docs: [],
      };
    });
  }

  global.DalucareAgenda = {
    HOJE: HOJE,
    dataISO: dataISO,
    parseISO: parseISO,
    carregar: carregar,
    salvar: salvar,
    eventosDoDia: eventosDoDia,
    contagemPorDia: contagemPorDia,
    upsert: upsert,
    remover: remover,
    paraListaDia: paraListaDia,
    iniciaisDe: iniciaisDe,
    statusClass: statusClass,
    horarioOcupado: horarioOcupado,
    normalizarHora: normalizarHora,
    gerarSlots: gerarSlots,
    slotsDisponiveis: slotsDisponiveis,
    novoId: function () {
      return "ev_" + Date.now() + "_" + Math.floor(Math.random() * 999);
    },
  };
})(window);
