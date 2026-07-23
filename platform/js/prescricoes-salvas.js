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

  function dadosMedico(perfil) {
    var p = perfil || {};
    return {
      nome: p.name || p.nome || "Médico(a)",
      uf: p.crmUf || "SP",
      crm: p.crmNumber || p.crm || "",
    };
  }

  function rodapeMedico(perfil) {
    var m = dadosMedico(perfil);
    var linhas = [m.nome];
    if (m.crm) linhas.push("CRM " + m.uf + " " + m.crm);
    return linhas.join("\n");
  }

  function cabecalhoMedico(perfil) {
    return "RECEITUÁRIO\n--------------------------------";
  }

  function textoReceitaCompleta(itens, perfil) {
    var lista = Array.isArray(itens) ? itens : [];
    var blocos = ["RECEITUÁRIO", "Data: ___/___/______"];
    if (!lista.length) {
      blocos.push("(Nenhum medicamento selecionado)");
    } else {
      lista.forEach(function (item, indice) {
        blocos.push(indice + 1 + ") " + textoReceita(item));
      });
    }
    blocos.push("Orientações adicionais:\n");
    blocos.push("--------------------------------");
    blocos.push(rodapeMedico(perfil));
    return blocos.join("\n\n");
  }

  function escaparHtml(texto) {
    return String(texto || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function htmlItensReceita(itens) {
    var lista = Array.isArray(itens) ? itens : [];
    if (!lista.length) {
      return "<p>(Nenhum medicamento selecionado)</p>";
    }
    return (
      "<ol class=\"rx-itens\">" +
      lista
        .map(function (item) {
          var linhas = [];
          linhas.push(
            "<strong>" +
              escaparHtml(item.nome) +
              (item.dose ? " — " + escaparHtml(item.dose) : "") +
              "</strong>"
          );
          if (item.via) linhas.push("<div>Via: " + escaparHtml(item.via) + "</div>");
          if (item.posologia) linhas.push("<div>" + escaparHtml(item.posologia) + "</div>");
          if (item.quantidade) {
            linhas.push("<div>Quantidade: " + escaparHtml(item.quantidade) + "</div>");
          }
          if (item.observacao) {
            linhas.push("<div>Obs.: " + escaparHtml(item.observacao) + "</div>");
          }
          return "<li>" + linhas.join("") + "</li>";
        })
        .join("") +
      "</ol>"
    );
  }

  function abrirJanelaReceita(itens, perfil) {
    var m = dadosMedico(perfil);
    var crmLinha = m.crm ? "CRM " + m.uf + " " + m.crm : "CRM ________________";
    var dataHoje = new Date();
    var dataFmt =
      (dataHoje.getDate() < 10 ? "0" : "") +
      dataHoje.getDate() +
      "/" +
      (dataHoje.getMonth() + 1 < 10 ? "0" : "") +
      (dataHoje.getMonth() + 1) +
      "/" +
      dataHoje.getFullYear();

    var html =
      "<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\">" +
      "<title>Receituário — Dalucare</title>" +
      "<style>" +
      "@page{size:A4;margin:18mm;}" +
      "*{box-sizing:border-box;}" +
      "body{margin:0;background:#e8eef3;font-family:Georgia,'Times New Roman',serif;color:#122033;}" +
      ".barra{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:12px;background:#0f2740;position:sticky;top:0;z-index:2;}" +
      ".barra button{border:0;border-radius:8px;padding:10px 16px;font:600 14px system-ui,sans-serif;cursor:pointer;}" +
      ".btn-print{background:#3aa0d8;color:#fff;}" +
      ".btn-copy{background:#243b55;color:#fff;}" +
      ".btn-close{background:#5a6b7d;color:#fff;}" +
      ".folha{width:210mm;min-height:297mm;margin:16px auto;background:#fff;padding:18mm;display:flex;flex-direction:column;" +
      "box-shadow:0 8px 28px rgba(15,39,64,.18);}" +
      "h1{margin:0 0 8px;font-size:22px;letter-spacing:.04em;text-align:center;}" +
      ".meta{display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;font-size:14px;}" +
      ".rx-corpo{flex:1;}" +
      ".rx-itens{margin:0;padding-left:22px;}" +
      ".rx-itens li{margin:0 0 14px;line-height:1.45;}" +
      ".rx-orientacoes{margin-top:22px;}" +
      ".rx-orientacoes label{display:block;font-weight:700;margin-bottom:6px;font-size:14px;}" +
      ".rx-orientacoes [contenteditable]{min-height:90px;border:1px dashed #9aa8b8;border-radius:6px;padding:10px 12px;" +
      "outline:none;line-height:1.5;font-size:15px;}" +
      ".rx-orientacoes [contenteditable]:empty:before{content:attr(data-placeholder);color:#8a97a8;}" +
      ".rx-rodape{margin-top:auto;padding-top:36px;text-align:center;}" +
      ".rx-assinatura{width:220px;margin:0 auto 8px;border-top:1px solid #122033;}" +
      ".rx-rodape strong{display:block;font-size:16px;}" +
      ".rx-rodape span{display:block;font-size:14px;margin-top:4px;}" +
      ".rx-marca{margin-top:18px;font-size:11px;color:#7a8796;font-family:system-ui,sans-serif;}" +
      "@media print{" +
      "body{background:#fff;}" +
      ".barra{display:none!important;}" +
      ".folha{margin:0;box-shadow:none;width:auto;min-height:auto;padding:0;}" +
      ".rx-orientacoes [contenteditable]{border:none;padding:0;min-height:0;}" +
      "}" +
      "</style></head><body>" +
      "<div class=\"barra no-print\">" +
      "<button type=\"button\" class=\"btn-print\" id=\"btn-imprimir\">Imprimir</button>" +
      "<button type=\"button\" class=\"btn-copy\" id=\"btn-copiar\">Copiar texto</button>" +
      "<button type=\"button\" class=\"btn-close\" id=\"btn-fechar\">Fechar</button>" +
      "</div>" +
      "<article class=\"folha\" id=\"folha-receita\">" +
      "<h1>RECEITUÁRIO</h1>" +
      "<div class=\"meta\"><span>Paciente: _______________________________</span><span>Data: " +
      escaparHtml(dataFmt) +
      "</span></div>" +
      "<div class=\"rx-corpo\">" +
      htmlItensReceita(itens) +
      "<div class=\"rx-orientacoes\">" +
      "<label>Orientações adicionais</label>" +
      "<div id=\"rx-extra\" contenteditable=\"true\" data-placeholder=\"Escreva aqui orientações extras para o paciente...\"></div>" +
      "</div></div>" +
      "<footer class=\"rx-rodape\">" +
      "<div class=\"rx-assinatura\"></div>" +
      "<strong>" +
      escaparHtml(m.nome) +
      "</strong>" +
      "<span>" +
      escaparHtml(crmLinha) +
      "</span>" +
      "<div class=\"rx-marca\">Dalucare</div>" +
      "</footer></article>" +
      "<script>" +
      "function textoFolha(){" +
      "var itens=[].slice.call(document.querySelectorAll('.rx-itens li')).map(function(li,i){return (i+1)+') '+li.innerText.trim();});" +
      "var extra=(document.getElementById('rx-extra').innerText||'').trim();" +
      "var nome=document.querySelector('.rx-rodape strong').textContent;" +
      "var crm=document.querySelector('.rx-rodape span').textContent;" +
      "var blocos=['RECEITUÁRIO','Data: " +
      dataFmt.replace(/\\/g, "/") +
      "'].concat(itens);" +
      "if(extra)blocos.push('Orientações adicionais:\\n'+extra);" +
      "blocos.push('--------------------------------');blocos.push(nome+'\\n'+crm);" +
      "return blocos.join('\\n\\n');" +
      "}" +
      "document.getElementById('btn-imprimir').onclick=function(){window.print();};" +
      "document.getElementById('btn-fechar').onclick=function(){window.close();};" +
      "document.getElementById('btn-copiar').onclick=function(){" +
      "var t=textoFolha();" +
      "if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t);}" +
      "else{var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);}" +
      "};" +
      "<\/script></body></html>";

    var janela = global.open("", "dalucare_receita", "noopener,noreferrer,width=900,height=1000");
    if (!janela) {
      throw new Error("Permita pop-ups para abrir a receita.");
    }
    janela.document.open();
    janela.document.write(html);
    janela.document.close();
    try {
      janela.focus();
    } catch (e) {}
    return janela;
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
    cabecalhoMedico: cabecalhoMedico,
    rodapeMedico: rodapeMedico,
    textoReceitaCompleta: textoReceitaCompleta,
    abrirJanelaReceita: abrirJanelaReceita,
    novoId: novoId,
  };
})(window);
