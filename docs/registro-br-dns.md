# Configurar DNS no Registro.br — passo a passo

> **Por que o GitHub mostra "DNS check unsuccessful"?**  
> O domínio `dalucare.com.br` está registrado, mas **ainda não tem registros DNS** apontando para o GitHub.  
> Isso só pode ser feito **dentro do Registro.br** com seu login.

---

## Passo a passo no Registro.br

### 1. Entrar no site
- Acesse: **https://registro.br**
- Faça login com seu CPF e senha

### 2. Abrir o domínio
- Clique em **Meus domínios**
- Clique em **dalucare.com.br**

### 3. Abrir configuração DNS
- Clique em **DNS** ou **Configurar endereçamento**
- Se pedir, escolha **Modo avançado** (para editar registros manualmente)

### 4. Adicionar os 4 registros A (obrigatório)

Clique em **Nova entrada** / **Adicionar** e crie **4 registros iguais**, mudando só o IP:

| Tipo | Nome / Host | Valor / Destino |
|---|---|---|
| **A** | `@` ou deixe **vazio** | `185.199.108.153` |
| **A** | `@` ou deixe **vazio** | `185.199.109.153` |
| **A** | `@` ou deixe **vazio** | `185.199.110.153` |
| **A** | `@` ou deixe **vazio** | `185.199.111.153` |

> **Nome vazio ou @** = endereço principal `dalucare.com.br` (sem www)

### 5. Adicionar CNAME para www (recomendado)

| Tipo | Nome / Host | Valor / Destino |
|---|---|---|
| **CNAME** | `www` | `dalucare.github.io` |

### 6. Salvar
- Clique em **Salvar** / **Publicar**
- Aguarde de **30 minutos a 4 horas** (às vezes até 24h)

---

## Depois de salvar no Registro.br

### No GitHub (você já fez quase tudo)
1. Vá em: https://github.com/dalucare/dalucare.github.io/settings/pages
2. Em **Custom domain** deve estar: `dalucare.com.br`
3. Aguarde o aviso **"DNS check successful"** (pode demorar)
4. Se continuar erro após 4h:
   - Clique em **Remove** ao lado do domínio
   - Digite `dalucare.com.br` de novo
   - Clique em **Save**
5. Marque **Enforce HTTPS** quando aparecer

---

## Como saber se funcionou

Abra no navegador:
- https://dalucare.com.br
- https://dalucare.github.io (já funciona hoje)

---

## Enquanto o DNS não propaga

Use sempre:
- **https://dalucare.github.io**
- **https://dalucare.github.io/platform/login.html**

---

## Precisa de ajuda?

Me envie um **print da tela DNS do Registro.br** (com seus dados pessoais apagados) que eu digo exatamente o que falta.
