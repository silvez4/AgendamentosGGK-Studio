import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrLooseContain, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "agenda",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const diasSemana = ref([
      { diaSemana: 1, ativo: true, janelas: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
      // Segunda
      { diaSemana: 2, ativo: true, janelas: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
      // Terca
      { diaSemana: 3, ativo: true, janelas: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
      // Quarta
      { diaSemana: 4, ativo: true, janelas: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
      // Quinta
      { diaSemana: 5, ativo: true, janelas: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
      // Sexta
      { diaSemana: 6, ativo: false, janelas: [] },
      // Sabado
      { diaSemana: 7, ativo: false, janelas: [] }
      // Domingo
    ]);
    const excecoes = ref([]);
    const getNomeDia = (iso) => {
      const map = { 1: "Segunda-feira", 2: "Terça-feira", 3: "Quarta-feira", 4: "Quinta-feira", 5: "Sexta-feira", 6: "Sábado", 7: "Domingo" };
      return map[iso];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[500px]" }, _attrs))}><div class="flex justify-between items-center mb-6"><div><h2 class="text-2xl font-bold text-gray-800">Organizar Agenda</h2><p class="text-gray-500 text-sm">Defina seus dias de trabalho, janelas de horários e dias de exceção.</p></div><button class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Salvando..." : "Salvar Configuração")}</button></div><div class="space-y-8"><section><h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Semana Padrão</h3><div class="space-y-6"><!--[-->`);
      ssrRenderList(unref(diasSemana), (dia, index) => {
        _push(`<div class="flex flex-col md:flex-row md:items-start gap-4 p-4 border rounded-lg bg-gray-50"><div class="w-48 flex items-center space-x-3"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(dia.ativo) ? ssrLooseContain(dia.ativo, null) : dia.ativo) ? " checked" : ""} class="h-5 w-5 text-blue-600 rounded"><span class="${ssrRenderClass([dia.ativo ? "text-gray-800" : "text-gray-400", "font-medium"])}">${ssrInterpolate(getNomeDia(dia.diaSemana))}</span></div>`);
        if (dia.ativo) {
          _push(`<div class="flex-1 space-y-3"><!--[-->`);
          ssrRenderList(dia.janelas, (janela, jIndex) => {
            _push(`<div class="flex items-center space-x-3"><input type="time"${ssrRenderAttr("value", janela.inicio)} required class="px-3 py-1.5 border rounded-md shadow-sm w-32"><span class="text-gray-500">até</span><input type="time"${ssrRenderAttr("value", janela.fim)} required class="px-3 py-1.5 border rounded-md shadow-sm w-32"><button class="text-red-500 hover:text-red-700 p-1" title="Remover Horário"> ✕ </button></div>`);
          });
          _push(`<!--]--><button class="text-sm text-blue-600 font-medium hover:text-blue-800">+ Adicionar Turno</button></div>`);
        } else {
          _push(`<div class="flex-1 text-gray-400 italic text-sm py-2">Sem expediente.</div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></section><section><div class="flex justify-between items-center mb-4 border-b pb-2"><h3 class="text-lg font-semibold text-gray-700">Exceções (Feriados, Férias ou Horários Especiais)</h3><button class="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded font-medium hover:bg-gray-300"> + Nova Exceção </button></div>`);
      if (unref(excecoes).length === 0) {
        _push(`<div class="text-gray-500 text-sm text-center py-4 border rounded-lg border-dashed"> Nenhuma data de exceção cadastrada. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(excecoes), (exc, eIndex) => {
        _push(`<div class="p-4 border border-orange-200 bg-orange-50 rounded-lg flex flex-col md:flex-row gap-4"><div class="w-48 space-y-2"><label class="block text-xs font-semibold text-gray-600 uppercase">Data</label><input type="date"${ssrRenderAttr("value", exc.data)} required class="w-full px-3 py-1.5 border rounded-md shadow-sm"><div class="flex items-center space-x-2 mt-2"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(exc.bloqueadoODiaTodo) ? ssrLooseContain(exc.bloqueadoODiaTodo, null) : exc.bloqueadoODiaTodo) ? " checked" : ""}${ssrRenderAttr("id", "block_" + eIndex)}><label${ssrRenderAttr("for", "block_" + eIndex)} class="text-sm text-gray-700">Folga o dia todo</label></div></div>`);
        if (!exc.bloqueadoODiaTodo) {
          _push(`<div class="flex-1"><label class="block text-xs font-semibold text-gray-600 uppercase mb-2">Horários Específicos para esse dia</label><div class="space-y-3"><!--[-->`);
          ssrRenderList(exc.janelasDisponiveis, (janela, jIndex) => {
            _push(`<div class="flex items-center space-x-3"><input type="time"${ssrRenderAttr("value", janela.inicio)} required class="px-3 py-1.5 border rounded-md shadow-sm w-32"><span class="text-gray-500">até</span><input type="time"${ssrRenderAttr("value", janela.fim)} required class="px-3 py-1.5 border rounded-md shadow-sm w-32"><button class="text-red-500 hover:text-red-700 p-1">✕</button></div>`);
          });
          _push(`<!--]--><button class="text-sm text-blue-600 font-medium hover:text-blue-800">+ Adicionar Turno</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-start"><button class="text-red-500 hover:text-red-700 font-medium text-sm mt-6">Remover Exceção</button></div></div>`);
      });
      _push(`<!--]--></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/agenda.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=agenda-BzQCftkD.mjs.map
