<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:text-sm focus:text-void"
    >
      Pular para o conteúdo
    </a>

    <LayoutHeader />

    <main id="conteudo" class="flex-1">
      <slot />
    </main>

    <LayoutFooter />
    <LayoutWhatsappFab />
  </div>
</template>
