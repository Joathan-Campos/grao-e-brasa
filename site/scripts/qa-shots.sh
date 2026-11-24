#!/usr/bin/env bash
# Capturas de QA: bash scripts/qa-shots.sh <pasta-saida>
OUT="$1"; mkdir -p "$OUT"
A="agent-browser --session cafe-72c8271d3f1a"
$A set media light >/dev/null
for vp in "1440 900 desktop-1440" "768 1024 tablet-768" "390 844 celular-390"; do
  set -- $vp; W=$1; H=$2; N=$3
  $A set viewport $W $H >/dev/null
  $A open http://localhost:4173 >/dev/null
  $A eval "localStorage.clear()" >/dev/null
  $A open http://localhost:4173 >/dev/null
  $A wait 3200 >/dev/null
  $A screenshot "$OUT/$N-01-hero.png" >/dev/null
  $A eval "window.scrollTo(0, Math.round(innerHeight*0.45))" >/dev/null; $A wait 1500 >/dev/null
  $A screenshot "$OUT/$N-02-hero-grao-abrindo.png" >/dev/null
  # percorre a página para disparar as entradas
  $A eval "(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,90))}})()" >/dev/null
  $A wait 4500 >/dev/null
  i=3
  for id in historia cardapio ambiente depoimentos visita; do
    $A eval "scrollTo(0, document.getElementById('$id').getBoundingClientRect().top + scrollY - 40)" >/dev/null
    $A wait 1400 >/dev/null
    $A screenshot "$OUT/$N-0$i-$id.png" >/dev/null; i=$((i+1))
  done
  $A eval "scrollTo(0, document.documentElement.scrollHeight)" >/dev/null; $A wait 1400 >/dev/null
  $A screenshot "$OUT/$N-08-rodape.png" >/dev/null
  # pedido aberto com itens
  $A eval "scrollTo(0, document.getElementById('cardapio').getBoundingClientRect().top + scrollY)" >/dev/null; $A wait 800 >/dev/null
  $A find role button click --name "Adicionar Flat white ao pedido" >/dev/null
  $A find role button click --name "Adicionar Espresso ao pedido" >/dev/null
  $A eval "document.querySelector('header button[aria-label^=\"Abrir pedido\"]').click()" >/dev/null; $A wait 1000 >/dev/null
  $A screenshot "$OUT/$N-09-pedido.png" >/dev/null
  $A press Escape >/dev/null; $A wait 600 >/dev/null
  $A eval "scrollTo(0,0)" >/dev/null; $A wait 1500 >/dev/null
  $A screenshot --full "$OUT/$N-00-pagina-inteira.png" >/dev/null
  echo "ok $N"
done
