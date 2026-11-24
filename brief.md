# Brief — Site Grão & Brasa

## 1. Identidade
- **Nome:** Grão & Brasa (provisório — pode ser trocado)
- **Personalidade:** café de especialidade com toque aconchegante. Técnica no preparo, calor no atendimento.
- **Logo:** não existe; criar logotipo tipográfico simples (wordmark) em Fraunces.
- **Endereço:** fictício — Pinheiros, São Paulo (ex.: Rua dos Pinheiros, 1234). Trocar pelo real.

## 2. Público
- **Principal:** turistas e quem procura "um lugar bonito para ir". A decisão é visual (galeria, Instagram).
- **Implicações:** galeria do ambiente com peso, localização e "como chegar" muito claros, tom convidativo.

## 3. Tom do texto
- **Títulos:** poéticos e sensoriais, frases curtas. Ex.: *"Torra lenta. Conversa longa."*
- **Textos de apoio:** calorosos e informais, como um amigo convidando.
- Idioma: português do Brasil.

## 4. Identidade visual
- **Paleta mista "noite → manhã":**
  - Hero escuro: marrom-café quase preto, creme, cobre/brasa, laranja aceso de destaque.
  - Resto do site claro: creme/aveia, texto marrom profundo, terracota de destaque.
  - Transição de cor suave conforme o scroll.
- **Tipografia:** Fraunces (títulos) + sem serifa limpa (Inter Tight ou General Sans) no corpo.

## 5. 3D e animação
- **Hero:** grão de café 3D gigante, com textura e brilho quente. Gira devagar, reage ao mouse e, com o scroll, se divide ou se multiplica.
- **Outras seções:** detalhes sutis na mesma linguagem: pequenos grãos 3D e efeito de inclinação nos cards do cardápio e da galeria.
- Geometria gerada em código (sem modelos externos pesados).
- **Fallback:** em celulares fracos, sem WebGL ou com `prefers-reduced-motion`, imagem estática da cena e animações reduzidas.
- Animações de entrada e de scroll elegantes, sem exagero.

## 6. Seções
1. Hero (grão 3D + título + CTAs "Ver cardápio" / "Como chegar")
2. Sobre / história (origem dos grãos, torra)
3. Cardápio com filtros por categoria + carrinho de retirada
4. Ambiente (galeria)
5. Depoimentos
6. Localização e horário (mapa + botão "Como chegar")
7. Rodapé (Instagram, contato, créditos das fotos)

## 7. Cardápio (5 categorias, R$ 8–38)
- **Espressos:** espresso, cortado, cappuccino, flat white, latte
- **Coados:** V60, Chemex, prensa francesa (com notas de sabor do grão do dia)
- **Gelados:** cold brew, espresso tônica, affogato, latte gelado
- **Para comer:** pão de queijo, croissant, tostas, bolos da casa
- **Sem café:** chocolate quente, chás, matcha
- Selos opcionais: "da casa", "vegano", "sem glúten".

## 8. Pedido para retirada (demonstração)
- Carrinho: adicionar, remover, alterar quantidade, total.
- Checkout: nome + horário de retirada, com validação.
- Finaliza com a confirmação **"Pedido recebido!"** e **não envia nada** (só demonstração).
- Carrinho salvo no navegador (localStorage).
- **Pendente (você):** ligar a WhatsApp ou pagamento real (Stripe, Mercado Pago) numa próxima versão.

## 9. Fotos
- Provisórias do Unsplash, tons quentes, baixadas para o projeto, otimizadas em WebP, créditos registrados.
- **Pendente (você):** substituir por fotos reais.

## 10. Stack e entrega
- **Next.js + Tailwind + React Three Fiber + GSAP + Lenis**
- 100% responsivo, mobile primeiro; deploy previsto na Vercel.
- Estrutura: `site/` (código), `entregas/videos/`, `entregas/screenshots/`.

## 11. Vídeo (HyperFrames)
- Loop de 6–10s no estilo do site (grão / vapor / logo aparecendo).
- Exportar MP4 + WebM leves (16:9) e versão vertical 9:16 para Reels.

## 12. QA (agent-browser)
- Screenshots em 1440px, 768px e 390px.
- Testar scroll, animações, filtros, carrinho, formulário e links.
- Console sem erros; desempenho aceitável do 3D.

## Depende de você
- Nome e logo definitivos, endereço, horário e contatos reais
- Fotos reais
- Revisão dos textos e preços
- Domínio e deploy
- Integração real de pedidos (se desejar)
