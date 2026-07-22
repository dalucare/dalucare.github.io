# HTTPS e aviso “Não seguro”

## Por que aparece “Não seguro”

O domínio `dalucare.com.br` estava em **HTTP** (sem cadeado).  
O certificado HTTPS do GitHub Pages ainda **não estava ativo**.

## Use este endereço seguro agora

**https://dalucare.github.io/platform/home.html?v=20260722g**

(O arquivo CNAME foi removido temporariamente para o GitHub.io voltar a funcionar com HTTPS sem redirecionar para HTTP.)

## Ativar HTTPS no dalucare.com.br (depois)

1. Abra: https://github.com/dalucare/dalucare.github.io/settings/pages  
2. Em **Custom domain**, digite de novo: `dalucare.com.br` e salve  
3. Aguarde o DNS check ficar verde  
4. Marque **Enforce HTTPS**  
5. Aguarde até 24h para o certificado  

DNS no Registro.br (já deve estar):

| Tipo | Nome | Valor |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | dalucare.github.io |
