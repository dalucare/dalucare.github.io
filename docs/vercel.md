# Deploy na Vercel — Dalucare

Site estático (HTML/CSS/JS). Sem build.

## 1) Ligar o repositório

1. Acesse https://vercel.com/new
2. Entre com a conta **GitHub** do `dalucare`
3. Importe o repositório `dalucare/dalucare.github.io`
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `.` (raiz)
   - **Build Command:** (vazio)
   - **Output Directory:** (vazio)
   - **Install Command:** (vazio)
5. Clique em **Deploy**

URL temporária: `https://dalucare-….vercel.app`

Atalhos já configurados em `vercel.json`:
- `/app` → `/platform/app.html`
- `/login` → `/platform/login.html`
- `/plataforma` → `/platform/entrar.html`

Cada `git push` na `main` gera deploy automático.

## 2) Domínio dalucare.com.br

1. No projeto Vercel → **Settings → Domains**
2. Adicione `dalucare.com.br` e `www.dalucare.com.br`
3. A Vercel mostra os DNS a usar. Em geral:

| Tipo | Nome | Valor (exemplo Vercel) |
|---|---|---|
| **A** | @ | `76.76.21.21` |
| **CNAME** | www | `cname.vercel-dns.com` |

> Use **exatamente** os valores que a Vercel mostrar no painel (podem mudar).

4. No [Registro.br](https://registro.br) → `dalucare.com.br` → **DNS**:
   - Remova os A/CNAME antigos do **GitHub Pages**
   - Cadastre os registros da Vercel
   - Salve
5. Na Vercel, aguarde o domínio ficar **Valid** (HTTPS automático)

## 3) Depois do DNS

- Teste: https://dalucare.com.br/platform/entrar.html
- No GitHub Pages, pode deixar o custom domain ou remover (o tráfego passa a ser da Vercel)
- Force atualizar o navegador (`Ctrl+F5`) na primeira visita

## 4) CLI (opcional)

Com Node instalado:

```bash
npx vercel login
npx vercel
npx vercel --prod
```
