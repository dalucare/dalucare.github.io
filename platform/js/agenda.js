/* Calendário editável do profissional — hoje de referência: 22/07/2026 */
(function (global) {
  var CHAVE = "dalucare_agenda_pro";
  var HOJE = new Date(2026, 6, 22); // 22/07/2026

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function dataISO(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseISO(iso) {
    var p = iso.split("-");
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

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) {
        var seed = seedPadrao();
        salvar(seed);
        return seed;
      }
      var lista = JSON.parse(bruto);
      return Array.isArray(lista) ? lista : seedPadrao();
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
        return String(a.hora).localeCompare(String(b.hora));
      });
  }

  function contagemPorDia(ano, mes) {
    var mapa = {};
    carregar().forEach(function (e) {
      if (!e.data) return;
      var p = e.data.split("-");
      if (Number(p[0]) === ano && Number(p[1]) === mes + 1) {
        mapa[e.data] = (mapa[e.data] || 0) + 1;
      }
    });
    return mapa;
  }

  function upsert(evento) {
    var lista = carregar();
    var i = lista.findIndex(function (e) {
      return e.id === evento.id;
    });
    if (i >= 0) lista[i] = evento;
    else lista.push(evento);
    salvar(lista);
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
    var eventos = eventosDoDia(iso);
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
      return {
        id: e.id,
        hora: e.hora,
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
    novoId: function () {
      return "ev_" + Date.now() + "_" + Math.floor(Math.random() * 999);
    },
  };
})(window);
