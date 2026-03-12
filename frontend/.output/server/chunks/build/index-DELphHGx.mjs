import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(true);
    const agendamentos = ref([]);
    const formatDateTime = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      return d.toLocaleString("pt-BR");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100"><h2 class="text-2xl font-bold text-gray-800 mb-2">Bem-vindo(a) ao Painel de Administração!</h2><p class="text-gray-500"> Utilize o menu lateral para gerenciar seus serviços oferecidos, valores e ajustar sua agenda de horários disponíveis. </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center h-32"><span class="text-3xl font-bold text-blue-600">${ssrInterpolate(unref(agendamentos).length)}</span><span class="text-gray-500 text-sm mt-1">Total de Agendamentos</span></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-100 mt-8 overflow-hidden"><div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center"><h3 class="font-bold text-lg text-gray-800">Próximos Agendamentos</h3><button class="text-blue-600 text-sm font-medium hover:underline">Atualizar</button></div><div class="overflow-x-auto"><table class="w-full text-left text-sm border-collapse"><thead><tr class="text-gray-500 border-b"><th class="p-4 font-semibold">Cliente</th><th class="p-4 font-semibold">Contato</th><th class="p-4 font-semibold">Início</th><th class="p-4 font-semibold">Status</th></tr></thead><tbody>`);
      if (unref(loading)) {
        _push(`<tr class="border-b"><td colspan="4" class="p-4 text-center">Carregando...</td></tr>`);
      } else if (unref(agendamentos).length === 0) {
        _push(`<tr class="border-b"><td colspan="4" class="p-4 text-center text-gray-500">Nenhum agendamento encontrado.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(agendamentos), (a) => {
        _push(`<tr class="border-b hover:bg-gray-50"><td class="p-4 font-medium text-gray-800">${ssrInterpolate(a.nomeCliente)}</td><td class="p-4 text-gray-600">${ssrInterpolate(a.telefoneCliente)} <br><span class="text-xs text-gray-400">${ssrInterpolate(a.emailCliente)}</span></td><td class="p-4 text-gray-900">${ssrInterpolate(formatDateTime(a.horarioInicio))}</td><td class="p-4"><span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">${ssrInterpolate(a.status)}</span></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DELphHGx.mjs.map
