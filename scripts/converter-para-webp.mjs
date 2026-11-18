#!/usr/bin/env node
/**
 * Converte as imagens de uma pasta para webp otimizado, prontas para public/media.
 *
 * Uso:
 *   node scripts/converter-para-webp.mjs <pasta-de-origem> <pasta-de-destino> [largura-maxima] [qualidade]
 *
 * Exemplo:
 *   node scripts/converter-para-webp.mjs ~/Downloads/fotos-novas public/media/projetos/casa-nova
 *
 * - Aceita png, jpg/jpeg, tif/tiff e webp.
 * - Respeita a rotação EXIF (foto de celular não sai deitada).
 * - Nunca aumenta a imagem: a largura máxima só reduz (padrão 1800 px, qualidade 80).
 * - Mantém o nome do arquivo e troca a extensão para .webp.
 *
 * Usa o `sharp`, que já vem junto com o @nuxt/image (nada novo para instalar).
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

const [, , origem, destino, larguraArg = '1800', qualidadeArg = '80'] = process.argv

if (!origem || !destino) {
  console.error('uso: node scripts/converter-para-webp.mjs <pasta-de-origem> <pasta-de-destino> [largura-maxima=1800] [qualidade=80]')
  process.exit(1)
}

const largura = Number(larguraArg)
const qualidade = Number(qualidadeArg)
const aceitas = new Set(['.png', '.jpg', '.jpeg', '.tif', '.tiff', '.webp'])

const entrada = resolve(origem)
const saida = resolve(destino)

const arquivos = (await readdir(entrada))
  .filter(nome => aceitas.has(extname(nome).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))

if (!arquivos.length) {
  console.error(`Nenhuma imagem (png, jpg, tiff, webp) em ${entrada}`)
  process.exit(1)
}

await mkdir(saida, { recursive: true })

let totalAntes = 0
let totalDepois = 0

for (const nome of arquivos) {
  const origemArquivo = join(entrada, nome)
  const destinoArquivo = join(saida, `${basename(nome, extname(nome))}.webp`)

  const info = await sharp(origemArquivo)
    .rotate()
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: qualidade, effort: 5, smartSubsample: true })
    .toFile(destinoArquivo)

  const antes = (await stat(origemArquivo)).size
  totalAntes += antes
  totalDepois += info.size
  console.log(`${nome} -> ${basename(destinoArquivo)}  ${info.width}x${info.height}  ${Math.round(antes / 1024)} KB -> ${Math.round(info.size / 1024)} KB`)
}

console.log(`\n${arquivos.length} imagens: ${(totalAntes / 1e6).toFixed(1)} MB -> ${(totalDepois / 1e6).toFixed(1)} MB em ${saida}`)
