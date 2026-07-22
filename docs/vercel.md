# Deploy na Vercel — Dalucare

Site estático (HTML/CSS/JS). Não precisa de build.

## Ligar o repositório (painel)

1. Acesse https://vercel.com/new
2. Importe o repositório GitHub `dalucare/dalucare.github.io`
3. Configure:
   - Framework Preset: **Other**
   - Root Directory: `.`
   - Build Command: *(vazio)*
   - Output Directory: *(vazio)*
4. Clique em **Deploy**

URL temporária: `https://….vercel.app`

## Domínio dalucare.com.br

1. No projeto → **Settings → Domains**
2. Adicione `dalucare.com.br` e `www.dalucare.com.br`
3. No Registro.br, troque o DNS pelos valores que a Vercel mostrar
4. Remova os registros A/CNAME antigos do GitHub Pages quando a Vercel estiver verde
5. HTTPS é ativado automaticamente pela Vercel

## CLI (opcional)

```bash
npx vercel login
npx vercel
npx vercel --prod
```

Cada `git push` na `main` gera um deploy automático.
