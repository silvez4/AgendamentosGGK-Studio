<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
    <!-- Navbar -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="max-w-7xl mx-auto py-4 px-6 lg:px-8 flex justify-between items-center bg-transparent">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-inner flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900">Agendamentos</h1>
        </div>
        <nav class="flex items-center space-x-1 sm:space-x-4 bg-gray-50/50 sm:bg-transparent p-1 sm:p-0 rounded-2xl border sm:border-transparent border-gray-100">
          <NuxtLink to="/" class="px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 font-semibold transition-all">Início</NuxtLink>
          <NuxtLink to="/admin" class="px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 font-semibold transition-all">Admin</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-100 mt-auto">
      <div class="max-w-7xl mx-auto py-8 px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>Sistemas Operacionais</span>
        </div>
        <div>
          &copy; {{ new Date().getFullYear() }} Sistema de Agendamentos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>
