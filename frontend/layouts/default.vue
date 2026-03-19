<template>
  <v-app-bar color="background" elevation="0" class="px-2 border-b border-opacity-25 pb-2 pt-2">
    <v-container class="d-flex align-center pa-0" style="max-width: 1280px; margin: 0 auto;">
      <div class="d-flex align-center mr-auto">
        <img src="/logo.png" alt="Logo Ana Bruno" style="height: 60px; object-fit: contain;" class="mr-3" />
        <div class="d-flex flex-column justify-center" style="line-height: 1.1;">
          <span class="text-h6 font-weight-black text-primary letter-spacing-1">Studio Ana Bruno</span>
          <span class="text-caption text-secondary font-weight-bold">Equilíbrio & Bem-Estar</span>
        </div>
      </div>
      
      <!-- Desktop Menu -->
      <div class="d-none d-sm-flex align-center">
        <v-btn to="/" variant="text" class="text-none font-weight-bold mr-2 text-primary" rounded="xl">Início</v-btn>
        <v-btn to="/admin" variant="text" class="text-none font-weight-bold text-secondary" rounded="xl">Admin</v-btn>
      </div>

      <!-- Mobile Menu -->
      <v-menu class="d-sm-none">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-menu" variant="text" color="primary" v-bind="props" class="d-sm-none"></v-btn>
        </template>
        <v-list>
          <v-list-item to="/" title="Início" class="text-primary font-weight-bold"></v-list-item>
          <v-list-item to="/admin" title="Admin" class="text-secondary font-weight-bold"></v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>

  <v-main class="bg-background">
    <v-container class="py-6 py-sm-10 px-4" style="max-width: 1280px; margin: 0 auto; min-height: 80vh;">
      <slot />
    </v-container>
  </v-main>

  <v-footer border class="bg-accent text-white py-6">
    <v-container class="d-flex flex-column align-center text-body-2" style="max-width: 1280px; margin: 0 auto;">
      <div class="d-flex align-center mb-4 flex-wrap justify-center" style="gap: 24px;">
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-2 opacity-80">mdi-instagram</v-icon>
          <span class="font-weight-medium">studioanabruno</span>
        </div>
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-2 opacity-80">mdi-whatsapp</v-icon>
          <span class="font-weight-medium">(74) 98805-0436</span>
        </div>
      </div>
      <div class="text-center opacity-80 mb-4 px-4">
        Empresarial Castelo Center- Maria Dias. R. Um, 02 - Quadra B - Castelo Branco, Juazeiro - BA
      </div>
      <div class="text-caption opacity-50">
        &copy; 2026 Studio Ana Bruno. Todos os direitos reservados.
      </div>
    </v-container>
  </v-footer>
</template>
