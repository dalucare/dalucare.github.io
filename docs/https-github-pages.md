# HTTPS e aviso “Não seguro”

## O que está acontecendo

O certificado HTTPS de `dalucare.com.br` **já funciona**.  
O aviso “Não seguro” aparece quando o navegador abre em **http://** (sem o “s”).

O GitHub ainda **não força** HTTPS: quem entra por `http://` permanece em HTTP.  
Além disso, `https://dalucare.github.io` redireciona para `http://dalucare.com.br` enquanto o Enforce HTTPS não estiver ligado.

## Use este endereço agora (com cadeado)

**https://dalucare.com.br/platform/home.html?v=20260722i**

Digite o `https://` na barra de endereço. Não use só `dalucare.com.br` sem o prefixo.

## Ativar Enforce HTTPS (definitivo)

1. Abra: https://github.com/dalucare/dalucare.github.io/settings/pages  
2. Em **Custom domain**, confirme: `dalucare.com.br`  
3. Aguarde o DNS check verde  
4. Marque **Enforce HTTPS**  
5. Depois disso, qualquer `http://` passa a redirecionar para `https://`

## Por que o F5 “não atualiza” a agenda unificada

A união de “Agenda do dia” + “Próximos pacientes” vale só para a **área do profissional**.

Se o menu lateral diz **Área do paciente** (ex.: Claudio), você está vendo outra tela.  
Faça **Sair**, entre de novo com conta **profissional**, e abra o link acima.
