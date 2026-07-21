# Ateliê Interiores — site

Site institucional + portfólio para estúdio de design de interiores.
Nuxt 4, Vue 3, TypeScript, Tailwind 4, Nuxt Content. Deploy na Vercel.

---

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run build      # build de produção
npm run preview    # serve o build local
npm run typecheck  # checagem de tipos (não roda no dev, de propósito)
```

**Node 22.5+** — o Nuxt Content está configurado para usar o SQLite embutido
do Node (`node:sqlite`) em vez do `better-sqlite3`. Isso elimina compilação
nativa no `npm install` (instala em segundos, e a Vercel não precisa de
toolchain C++), mas exige Node 22.5 ou mais novo.

Verificado neste projeto: `nuxt build` completo com 276 rotas
pré-renderizadas e `nuxt typecheck` com zero erros.

---

## As três coisas que você vai querer editar

### 1. Dados da empresa — `site.config.ts`

Nome, telefone do WhatsApp, e-mail, cidade, redes sociais e itens do menu.
É a única fonte dessas informações no projeto inteiro.

```ts
// formato internacional, só dígitos: 55 + DDD + número
whatsapp: '5541999998888',
```

Todos os botões de WhatsApp do site saem daqui, e vários deles mandam uma
mensagem contextual — quem clica no card "Comercial" chega no WhatsApp com
"Olá! Tenho interesse em comercial." já digitado. Isso qualifica o lead
antes da primeira resposta.

### 2. Textos da home — `app/data/home.ts`

Serviços, etapas do processo, números, depoimentos e FAQ. Tudo em arrays
tipados. Adicionar uma pergunta no FAQ é adicionar um objeto no array.

### 3. Projetos — `content/portfolio/*.md`

Um arquivo markdown por projeto. Criar o arquivo já:

- publica a página em `/portfolio/nome-do-arquivo`
- coloca o projeto na grade e no trilho horizontal
- inclui a URL no `sitemap.xml`
- adiciona uma cena na página imersiva (as 6 primeiras por `order`)

---

## Como cadastrar um projeto

Crie `content/portfolio/nome-do-projeto.md`:

```markdown
---
title: Casa Aurora
subtitle: Uma frase curta que aparece embaixo do título
category: Residencial        # Residencial | Comercial | Corporativo | Reforma
location: Curitiba, PR
year: 2025
area: 186 m²
scope:
  - Projeto completo
  - Marcenaria
accent: '#C8A15B'            # cor do brilho da cena imersiva
featured: true               # aparece em "Projetos" na home
order: 1                     # ordem em todas as listagens
cover:
  src: /media/projetos/casa-aurora/capa.jpg
  alt: Descrição da imagem para leitor de tela
gallery:
  - src: /media/projetos/casa-aurora/01.jpg
    alt: Estar com sofá de linho
    span: wide               # normal | wide | tall | full
---

## Título de seção

Texto em markdown. Vira a parte escrita da página do projeto.
```

O schema é validado (`content.config.ts`) — se faltar um campo obrigatório
ou a categoria estiver errada, o erro aparece no terminal ao salvar, não em
produção.

Para criar uma categoria nova, adicione em `shared/categories.ts`. Ela fica
válida no markdown e aparece no filtro do portfólio na mesma hora. (Esse
arquivo existe separado do `content.config.ts` porque importar o config do
Content dentro do app arrastaria o `@nuxt/content` inteiro para o bundle do
navegador — o build reclama disso, corretamente.)

### Vídeo em vez de imagem

Qualquer `cover` ou item de `gallery` aceita vídeo:

```yaml
cover:
  type: video
  src: /media/projetos/casa-aurora/capa.mp4
  srcWebm: /media/projetos/casa-aurora/capa.webm   # opcional, menor
  poster: /media/projetos/casa-aurora/capa.jpg     # frame de carregamento
  alt: Panorâmica da sala de estar
```

O player já vem resolvido: autoplay mudo, loop, `playsinline`, e — o que
importa — **play/pause conforme entra e sai da tela**. Dez vídeos numa
página não derrubam a bateria porque só o visível está rodando.

Recomendações para os vídeos da cliente:

| item | valor |
|---|---|
| duração | 5–12 s em loop |
| resolução | 1920×1080 (não precisa mais) |
| áudio | remover — o navegador bloqueia autoplay com som |
| formato | `.mp4` (H.264) + `.webm` (VP9) opcional |
| peso | até ~3 MB por vídeo |

Comando de conversão:

```bash
ffmpeg -i original.mov -vf scale=1920:-2 -an \
  -c:v libx264 -crf 26 -preset slow -movflags +faststart saida.mp4
```

---

## Trocando as mídias placeholder

`public/media/` está preenchido com imagens e vídeos gerados
(`scripts/gerar-placeholders.py`) só para o site rodar bonito antes do
material real.

Quando as fotos chegarem: apague `public/media/` e coloque os arquivos
com os mesmos caminhos que os markdowns e o `app/data/home.ts` referenciam.
Nenhuma linha de código muda.

Imagens são otimizadas pelo `@nuxt/image` — sirva o arquivo grande e o
Nuxt gera AVIF/WebP nos tamanhos certos automaticamente.

---

## Arquitetura

```
site.config.ts              dados da empresa
content.config.ts           schema dos projetos (validação)
shared/categories.ts        categorias — usadas pelo schema E pelo filtro
content/portfolio/*.md      os projetos
app/
  data/home.ts              textos da home
  composables/              scroll, cursor, progresso de elemento
  plugins/                  lenis.client.ts, reveal.client.ts
  components/
    ui/                     Media, Button, Cursor, Marquee, Preloader…
    layout/                 Header, Footer, WhatsappFab
    home/                   uma seção por arquivo
    project/                Card, Scene (imersiva), Horizontal
  pages/
    index.vue               home
    projetos.vue            experiência imersiva
    portfolio/index.vue     grade com filtro
    portfolio/[...slug].vue página do projeto
server/routes/              sitemap.xml, robots.txt
```

### As duas páginas de portfólio

Existem de propósito, com públicos diferentes:

- **`/projetos`** — imersiva. Cada projeto ocupa 3 telas de rolagem: a
  mídia abre de um retângulo central para tela cheia, os metadados entram
  depois, e a cena recua para dar lugar à próxima. É a página para mandar
  quando quiser impressionar.
- **`/portfolio`** — grade com filtro por categoria, filtro na URL
  (`?categoria=Comercial`) para ser compartilhável. É a página de quem
  quer comparar e decidir.

---

## Como as animações funcionam

Vale entender antes de mexer, porque a escolha aqui é o que separa esse
site de um WordPress com plugin de animação.

**Uma fonte de scroll.** O [Lenis](https://github.com/darkroomengineering/lenis)
interpola a rolagem (aquele "peso" de site de estúdio) e publica posição,
velocidade e direção em `useScrollState()`. Nenhum componente registra o
próprio listener de `scroll` — todos leem do mesmo lugar, uma vez por frame.

**Só propriedades compostas.** Todo efeito mexe em `transform`, `opacity`,
`clip-path` ou `scale`. Nada toca `top`, `left`, `width` ou `height`, que
forçariam recálculo de layout. Por isso as cenas com vídeo não engasgam.

**Progresso normalizado.** `useElementProgress` e `useStickyProgress`
devolvem 0..1 de um elemento em relação à viewport. As animações são
funções puras desse número — daí serem reversíveis e não dependerem de
"onde o scroll estava antes".

**Reveal declarativo.** `v-reveal` adiciona `.is-visible` via
IntersectionObserver; a transição em si mora no CSS. Sem biblioteca.

**Acessibilidade não é opcional.** `prefers-reduced-motion` desliga o
Lenis, o cursor customizado, o preloader e todas as transições. Quem pediu
menos movimento recebe o site parado e completamente funcional.

Outros detalhes: View Transitions nativas fazem a capa do card virar o
hero da página do projeto; o cursor customizado morfa sobre mídia; o
marquee inclina conforme a velocidade da rolagem; os botões são magnéticos.

---

## Deploy na Vercel

1. Suba para o GitHub.
2. Na Vercel, **Add New → Project** e selecione o repositório.
3. Framework preset: **Nuxt.js** (detecta sozinho). Não mude nada.
4. Em **Environment Variables**, adicione:

   ```
   NUXT_PUBLIC_SITE_URL = https://dominio-final.com.br
   ```

   Isso alimenta canonical, Open Graph e sitemap. Sem ela, cai no valor de
   `site.config.ts`.
5. Deploy.

Domínio próprio em **Settings → Domains**. Cada branch ganha uma URL de
preview — útil para a cliente aprovar mudanças antes de ir ao ar.

---

## Checklist antes de publicar

- [ ] `whatsapp` real no `site.config.ts` (formato `55DDNNNNNNNNN`)
- [ ] `url` com o domínio final
- [ ] E-mail, cidade e links de redes conferidos
- [ ] Números da seção de estatísticas conferidos com a cliente
- [ ] Depoimentos com autorização de uso
- [ ] Fotos e vídeos reais no lugar dos placeholders
- [ ] `alt` descritivo em todas as mídias (SEO e leitor de tela)
- [ ] `NUXT_PUBLIC_SITE_URL` configurada na Vercel
- [ ] `npm run build` passando
- [ ] Testado em um celular de verdade, não só no DevTools

---

## Ideias para a v2

- Página `/contato` com formulário (Nitro API route + Resend) — hoje o
  contato é todo por WhatsApp, que converte melhor, mas formulário ajuda
  quem prefere e-mail
- Tour 360º embarcado nas páginas de projeto
- Blog para SEO de cauda longa ("quanto custa projeto de interiores em…")
- Painel para a cliente cadastrar projetos sozinha (Sanity ou Strapi)
- Analytics com Vercel Analytics ou Plausible
