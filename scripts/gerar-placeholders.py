#!/usr/bin/env python3
"""
Gera as mídias placeholder do site (imagens + vídeos).

Existe para o projeto rodar bonito antes de a cliente entregar as fotos
reais. Assim que houver material de verdade, apague public/media e solte
os arquivos com os mesmos nomes — nada no código precisa mudar.

Uso:  python3 scripts/gerar-placeholders.py
Requer: Pillow  (pip install Pillow) e ffmpeg no PATH para os vídeos.
"""

from __future__ import annotations

import math
import random
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
MEDIA = RAIZ / "public" / "media"

# Paletas quentes, no espírito de fotografia de interiores.
PALETAS = [
    ((38, 30, 24), (122, 96, 71), (206, 182, 148)),
    ((30, 28, 26), (104, 92, 78), (198, 186, 165)),
    ((42, 32, 27), (138, 96, 66), (222, 190, 156)),
    ((26, 28, 28), (86, 100, 96), (186, 198, 190)),
    ((34, 30, 34), (110, 92, 104), (206, 188, 196)),
    ((40, 34, 26), (146, 116, 74), (232, 208, 170)),
]


def mistura(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gerar_imagem(destino: Path, largura: int, altura: int, semente: int) -> None:
    """Gradiente quente + planos geométricos + grão. Lê como 'ambiente'."""
    rnd = random.Random(semente)
    escuro, medio, claro = PALETAS[semente % len(PALETAS)]

    img = Image.new("RGB", (largura, altura), escuro)
    d = ImageDraw.Draw(img, "RGBA")

    # Gradiente vertical de base.
    for y in range(altura):
        t = y / max(1, altura - 1)
        d.line([(0, y), (largura, y)], fill=mistura(escuro, medio, t**0.7))

    # Feixe de luz diagonal — o que dá a leitura de "janela".
    cx = rnd.uniform(0.25, 0.75) * largura
    largura_feixe = largura * rnd.uniform(0.18, 0.32)
    for i in range(60):
        t = i / 59
        x0 = cx - largura_feixe / 2 + t * largura_feixe
        alfa = int(46 * math.sin(math.pi * t))
        d.polygon(
            [(x0, 0), (x0 + largura * 0.06, 0),
             (x0 + largura * 0.34, altura), (x0 + largura * 0.28, altura)],
            fill=(*claro, alfa),
        )

    # Planos horizontais: piso e uma faixa de parede.
    piso = int(altura * rnd.uniform(0.62, 0.78))
    d.rectangle([0, piso, largura, altura], fill=(*mistura(escuro, medio, 0.35), 235))
    faixa = int(altura * rnd.uniform(0.20, 0.42))
    d.rectangle([0, faixa, largura, faixa + int(altura * 0.05)],
                fill=(*mistura(medio, claro, 0.4), 40))

    # Blocos verticais soltos: móveis / vãos.
    for _ in range(rnd.randint(2, 4)):
        bx = rnd.uniform(0, largura * 0.8)
        bw = largura * rnd.uniform(0.08, 0.22)
        bh = altura * rnd.uniform(0.18, 0.45)
        by = piso - bh
        tom = mistura(medio, claro, rnd.uniform(0.1, 0.6))
        d.rectangle([bx, by, bx + bw, piso], fill=(*tom, rnd.randint(50, 110)))

    # Suaviza para tirar o aspecto de vetor.
    img = img.filter(ImageFilter.GaussianBlur(radius=max(largura, altura) / 260))

    # Grão.
    ruido = Image.effect_noise((largura, altura), 18).convert("L")
    img = Image.blend(img, Image.merge("RGB", (ruido, ruido, ruido)), 0.045)

    # Vinheta.
    vinheta = Image.new("L", (largura, altura), 0)
    dv = ImageDraw.Draw(vinheta)
    dv.ellipse([-largura * 0.25, -altura * 0.25, largura * 1.25, altura * 1.25], fill=255)
    vinheta = vinheta.filter(ImageFilter.GaussianBlur(radius=min(largura, altura) / 7))
    escura = Image.new("RGB", (largura, altura), (10, 9, 8))
    img = Image.composite(img, escura, vinheta)

    destino.parent.mkdir(parents=True, exist_ok=True)
    img.save(destino, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"  imagem  {destino.relative_to(RAIZ)}")


def gerar_video(origem: Path, destino_mp4: Path, segundos: int = 8) -> None:
    """Zoom lento sobre a imagem — suficiente para validar o player de vídeo."""
    if not shutil.which("ffmpeg"):
        print("  ! ffmpeg ausente, pulando vídeos")
        return

    destino_mp4.parent.mkdir(parents=True, exist_ok=True)
    frames = segundos * 30

    filtro = (
        f"scale=2560:-2,"
        f"zoompan=z='min(zoom+0.00035,1.18)':d={frames}:"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=30,"
        f"format=yuv420p"
    )

    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(origem),
         "-vf", filtro, "-t", str(segundos), "-an",
         "-c:v", "libx264", "-preset", "slow", "-crf", "30",
         "-movflags", "+faststart", str(destino_mp4)],
        check=True,
    )
    print(f"  vídeo   {destino_mp4.relative_to(RAIZ)}")

    destino_webm = destino_mp4.with_suffix(".webm")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(destino_mp4),
         "-c:v", "libvpx-vp9", "-crf", "42", "-b:v", "0", "-an",
         "-row-mt", "1", "-cpu-used", "4", str(destino_webm)],
        check=True,
    )
    print(f"  vídeo   {destino_webm.relative_to(RAIZ)}")


# Espelha o que os markdowns em content/portfolio pedem.
PROJETOS = {
    "casa-aurora": 6,
    "restaurante-mesa": 4,
    "apartamento-batel": 4,
    "clinica-lumen": 4,
    "escritorio-norte": 4,
    "reforma-vila-izabel": 4,
}

SERVICOS = [
    "projeto-completo", "marcenaria", "iluminacao",
    "render-3d", "tour-360", "obra",
]


def main() -> None:
    print("Gerando mídia placeholder…")

    # Hero
    hero = MEDIA / "hero" / "hero-poster.jpg"
    gerar_imagem(hero, 2400, 1350, semente=1)
    gerar_video(hero, MEDIA / "hero" / "hero.mp4")

    # Projetos
    for i, (slug, qtd) in enumerate(PROJETOS.items()):
        capa = MEDIA / "projetos" / slug / "capa.jpg"
        gerar_imagem(capa, 2000, 2500, semente=10 + i * 7)
        for n in range(1, qtd + 1):
            gerar_imagem(
                MEDIA / "projetos" / slug / f"{n:02d}.jpg",
                1800, 1400, semente=100 + i * 20 + n,
            )

    # Capa em vídeo só do primeiro projeto — demonstra o suporte.
    gerar_video(MEDIA / "projetos" / "casa-aurora" / "capa.jpg",
                MEDIA / "projetos" / "casa-aurora" / "capa.mp4")

    # Serviços
    for i, nome in enumerate(SERVICOS):
        gerar_imagem(MEDIA / "servicos" / f"{nome}.jpg", 900, 1125, semente=200 + i * 9)

    # Avulsas
    gerar_imagem(MEDIA / "sobre" / "estudio.jpg", 1600, 2000, semente=311)
    gerar_imagem(MEDIA / "cta" / "ambiente.jpg", 2400, 1200, semente=407)
    gerar_imagem(MEDIA / "og" / "home.jpg", 1200, 630, semente=503)
    gerar_imagem(MEDIA / "og" / "projetos.jpg", 1200, 630, semente=601)

    print("Pronto.")


if __name__ == "__main__":
    main()
