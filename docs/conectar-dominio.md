# Conectar dalucare.com.br ao site (GitHub Pages)

O site **já está no ar** em: https://dalucare.github.io

O domínio **dalucare.com.br** está registrado, mas ainda **não aponta** para o site.
Por isso, ao abrir `dalucare.com.br`, nada aparece ou aparece versão antiga.

## Passo 1 — No Registro.br

1. Acesse [registro.br](https://registro.br) e faça login
2. Clique em **dalucare.com.br** → **DNS**
3. Adicione estes registros:

| Tipo | Nome | Valor |
|---|---|---|
| **A** | @ (vazio) | `185.199.108.153` |
| **A** | @ | `185.199.109.153` |
| **A** | @ | `185.199.110.153` |
| **A** | @ | `185.199.111.153` |
| **CNAME** | www | `dalucare.github.io` |

4. Salve e aguarde **até 24 horas** (geralmente 1–4 horas)

## Passo 2 — No GitHub

1. Acesse https://github.com/dalucare/dalucare.github.io/settings/pages
2. Em **Custom domain**, digite: `dalucare.com.br`
3. Clique **Save**
4. Marque **Enforce HTTPS** quando aparecer

## Passo 3 — Testar

- https://dalucare.github.io/platform/login.html ← login (funciona agora)
- https://dalucare.com.br ← após DNS propagar

## Se o navegador mostrar versão antiga

Pressione **`Ctrl + Shift + R`** ou abra em **aba anônima**.
