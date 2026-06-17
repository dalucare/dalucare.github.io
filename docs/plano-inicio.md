# Plano de início — Plataforma Dalucare

> Documento de orientação para a primeira versão (MVP).
> Situação atual: site vitrine em https://dalucare.github.io

## Suas decisões iniciais (confirmadas)

| Tema | Decisão |
|---|---|
| Tipo de consulta | Presencial **e** online |
| Público do MVP | Profissionais **e** pacientes juntos |
| Região inicial | Estado de São Paulo |
| Empresa | CNPJ **provisório** (pessoal/outra empresa); abrir CNPJ Dalucare em seguida |
| Regras de negócio | **Aceitas as sugestões** (ver item 6) |
| Domínio | **dalucare.com.br registrado por 2 anos** |
| Mercado Pago | **Em abertura** (CNPJ provisório) |
| Advogado (LGPD/termos) | **Cássio** (amigo — orçamento acordado) |

### Profissionais piloto (cadastro inicial)

| Nome | Especialidade | Cidade | Procedimentos / foco | Convênio | WhatsApp |
|---|---|---|---|---|---|
| Angela Couto | Cirurgia geral | Santos | Cantoplastia, cisto epidérmico, lipoma, cisto sebáceo (pequenos procedimentos) | Não | (13) 99606-6146 |
| Priscila Couto | Fisioterapeuta dermatofuncional | Santos | Full face, drenagem linfática, lipokavic | Não | (13) 99707-1837 |
| Débora Medeiros | Otorrinolaringologista (infância) | São Paulo e São Bernardo do Campo | Avaliação nasal, oral e otológica pediátrica | Não | (11) 99383-9828 |
| Jefferson França | Endocrinometabólico / emagrecimento | Santos e Guarujá | Emagrecimento e afecções endocrinometabólicas | Não | (13) 99605-3727 |

> **Nota:** Carolina Freitas foi retirada da equipe piloto por enquanto.

> **Privacidade:** telefones ficam no plano interno. No site público usaremos botão “Agendar” sem expor número, salvo autorização explícita.

### Valores de consulta (piloto)

| Profissional | Valor consulta | Observações | Modalidade |
|---|---|---|---|
| Angela Couto | **R$ 150** + valor do procedimento | Consulta separada do procedimento cirúrgico | Presencial |
| Priscila Couto | **R$ 300** | Pode ser **abatida** do valor de procedimentos | **Apenas presencial** |
| Débora Medeiros | **R$ 300** | Outros valores conforme procedimento | Presencial e online |
| Jefferson França | **R$ 500** | Apenas consulta (sem procedimento no MVP) | Presencial e online |

**Sinal de reserva (50%) — exemplos:**

| Profissional | Sinal (50%) |
|---|---|
| Angela | R$ 75 (+ procedimento definido depois) |
| Priscila | R$ 150 |
| Débora | R$ 150 |
| Jefferson | R$ 250 |

> Todos os profissionais piloto seguem o **piso de R$ 150** na consulta (Angela: consulta + procedimento à parte).

---

## 1. O que estamos construindo (visão simples)

Hoje você tem um **site vitrine** (como um folder digital).

O objetivo é evoluir para um **aplicativo web** (com login), com duas áreas:

### Área do profissional
- Perfil (formação, especialidade, planos que atende)
- Agenda de horários
- Reserva com pagamento de 50% antecipado
- Prontuário básico do paciente
- Encaminhamento para colega (com autorização do paciente)
- Publicação de conteúdos informativos

### Área do paciente
- Cadastro e login
- Guardar exames (upload ou código)
- Agendar consulta (presencial ou online)
- Autorizar acesso do profissional aos seus dados
- Ver histórico de consultas e medicações

---

## 2. Mapa do caminho (fases)

### Fase 0 — Preparação (1–2 semanas) ← **QUASE CONCLUÍDA**
- [x] Definir escopo do MVP
- [x] Profissionais piloto (4)
- [x] Valores de consulta
- [x] Domínio dalucare.com.br (2 anos)
- [x] Advogado (Cássio)
- [ ] Mercado Pago aprovado
- [ ] E-mail profissional @dalucare.com.br
- [ ] Autorização dos profissionais para o site
- [ ] Termos LGPD assinados (Cássio)
- [ ] Site vitrine: profissionais + lista de espera

### Fase 1 — MVP (2–4 meses)
- Cadastro e login (profissional + paciente)
- Perfil do profissional
- Agenda + reserva + pagamento 50%
- Paciente anexa exames (PDF/imagem)
- Prontuário simples (texto + anexos)
- Painel básico para cada perfil

### Fase 2 — Rede e conteúdo (2–3 meses)
- Encaminhamento entre profissionais
- Discussão de caso (com consentimento)
- Blog/conteúdos por profissional
- Notificações (e-mail e WhatsApp)

### Fase 3 — Integrações avançadas (6+ meses)
- Código de exame integrado com laboratórios
- Autorização de convênio com operadoras
- Teleconsulta por vídeo integrada

---

## 3. O que você faz vs o que o Cursor faz

| Você (negócio) | Cursor / desenvolvimento |
|---|---|
| Decidir regras (valor do sinal, cancelamento) | Criar telas e código |
| Cadastrar profissionais piloto | Montar banco de dados |
| Abrir conta Mercado Pago / gateway | Integrar pagamentos |
| Contratar advogado para termos e LGPD | Implementar consentimentos no app |
| Testar como usuária leiga | Corrigir bugs e publicar |
| Divulgar para primeiros usuários | Monitorar e iterar |

---

## 4. Contas a abrir (Fase 0)

### Obrigatórias para o MVP
1. **Mercado Pago** — receber os 50% da reserva  
   - Site: https://www.mercadopago.com.br  
   - **Status:** em abertura (CNPJ provisório)  
   - Ative “Checkout” / link de pagamento primeiro; API depois  

2. **E-mail profissional** — ex.: contato@dalucare.com.br  
   - Google Workspace ou Zoho Mail  
   - **Status:** pendente (domínio já registrado)  

3. **Domínio** dalucare.com.br  
   - **Status:** ✅ registrado por 2 anos  

### Recomendadas em seguida
4. **Supabase** ou **Firebase** — banco + login (grátis no início)  
5. **Vercel** — hospedar o app (grátis no plano básico)  
6. **Google Analytics** — medir acessos  

---

## 5. MVP — telas que vamos construir (lista fechada)

### Público geral (sem login)
- [ ] Home (pode ser o site atual melhorado)
- [ ] Buscar profissional (lista por cidade/especialidade)
- [ ] Página do profissional (bio, planos, horários, conteúdos)
- [ ] Login / Cadastro paciente
- [ ] Login / Cadastro profissional

### Paciente (logado)
- [ ] Meus exames (upload + lista)
- [ ] Agendar consulta (escolher horário + pagar 50%)
- [ ] Minhas consultas
- [ ] Autorizações de acesso ao prontuário

### Profissional (logado)
- [ ] Minha agenda (criar/editar horários)
- [ ] Consultas do dia
- [ ] Prontuário do paciente (ler + escrever)
- [ ] Encaminhar paciente (Fase 2)
- [ ] Meus conteúdos (Fase 2)

### Admin Dalucare (você)
- [ ] Aprovar cadastro de profissionais
- [ ] Ver pagamentos e cancelamentos

---

## 6. Regras de negócio (definidas)

| Pergunta | Decisão |
|---|---|
| Valor mínimo da consulta? | **R$ 150** |
| Sinal para reservar | **50%** do valor da consulta |
| Cancelamento com reembolso do sinal? | **Sim**, até **24 horas** antes |
| Quem define preço? | **Cada profissional** |
| Profissional paga mensalidade à plataforma? | **Não** no MVP |
| Taxa da plataforma sobre consulta | **10%** |
| Consulta online no MVP | **Google Meet** (link enviado após agendamento) |
| Pagamentos | **Mercado Pago** (CNPJ provisório → migrar para CNPJ Dalucare) |
| Advogado | **Cássio** — termos de uso + LGPD + consentimento de prontuário |

---

## 7. LGPD e saúde (essencial)

Como haverá **dados de saúde**, você precisa:

1. **Política de Privacidade** escrita por advogado  
2. **Termo de Consentimento** — paciente autoriza acesso ao prontuário  
3. **Registro de quem acessou** cada prontuário (auditoria)  
4. **HTTPS** em todo o site (obrigatório)  
5. **Não compartilhar prontuário** sem consentimento explícito  

Orçamento jurídico inicial: R$ 1.500 – R$ 4.000 (varia por advogado).

---

## 8. Custos mensais estimados (início)

| Item | Custo aproximado |
|---|---|
| Domínio .com.br | R$ 40/ano |
| Hospedagem app (Vercel) | R$ 0 – R$ 100/mês |
| Banco (Supabase) | R$ 0 – R$ 120/mês |
| E-mail profissional | R$ 30 – R$ 50/mês |
| Mercado Pago | taxa por transação (~3–5%) |
| Advogado (one-time) | ver item 7 |

**Total inicial:** cerca de R$ 0 – R$ 200/mês + taxas por consulta.

---

## 9. Profissionais piloto — status

**4 profissionais confirmados** (jun/2026). Ver tabelas no início deste documento.

Pendências:
- [x] Confirmar cidades — **concluído**
- [x] Definir preço de consulta — **concluído**
- [ ] Autorização de cada um para aparecer no site (nome + especialidade + foto)
- [ ] Débora: tabela de valores por procedimento
- [ ] Angela: tabela de valores por procedimento (cantoplastia, lipoma, etc.)

---

## 10. Checklist desta semana

### Segunda–terça (você)
- [x] Ler este documento inteiro
- [x] Listar profissionais piloto
- [ ] Abrir ou verificar conta Mercado Pago no CNPJ
- [x] Confirmar domínio dalucare.com.br

### Quarta–quinta (você + Cursor)
- [x] Preencher tabela de regras de negócio (item 6)
- [x] Site vitrine: profissionais + lista de espera
- [ ] Ativar FormSubmit no e-mail contato@dalucare.com.br (ver abaixo)
- [ ] Cursor: estrutura do app (Fase 1 — Supabase)

### Ativar lista de espera (FormSubmit)

O formulário envia cadastros para **contato@dalucare.com.br**.

1. Preencha o formulário no site **uma vez** com um e-mail de teste
2. Verifique a caixa de **contato@dalucare.com.br**
3. Clique no link de **ativação** que o FormSubmit envia
4. Pronto — novos cadastros chegarão por e-mail

Se o e-mail ainda não estiver configurado no domínio, altere temporariamente em `js/script.js` a linha `LISTA_ESPERA_EMAIL`.

### Sexta (você)
- [ ] Contato com advogado para orçamento LGPD/termos
- [ ] Enviar feedback do que entendeu / dúvidas

---

## 11. Glossário

| Termo | Significado |
|---|---|
| **MVP** | Primeira versão simples, só com o essencial |
| **Frontend** | O que o usuário vê (telas) |
| **Backend** | Servidor, banco de dados, regras |
| **API** | Forma de sistemas conversarem (ex.: pagamento) |
| **LGPD** | Lei de proteção de dados pessoais |
| **Prontuário** | Registro clínico do paciente |
| **Gateway** | Serviço que processa pagamento (Mercado Pago) |
| **Deploy** | Publicar o app na internet |

---

## 12. Próximo passo técnico (Cursor)

Quando você confirmar as regras de negócio (item 6), iniciamos:

1. Novo projeto `dalucare-app` (separado do site vitrine)
2. Login paciente + profissional
3. Tela de perfil do profissional
4. Agenda simples (sem pagamento — depois integra Mercado Pago)

---

*Última atualização: junho/2026*
