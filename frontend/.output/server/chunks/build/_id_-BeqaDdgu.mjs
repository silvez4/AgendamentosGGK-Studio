import { _ as __nuxt_component_0 } from './nuxt-link-1zmR3BSW.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useRoute } from './server.mjs';
import { u as useState } from './state-C15HQ2wM.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const useUser = () => {
  const localUser = useState("local-user", () => null);
  const initLocalUser = () => {
    return;
  };
  const saveLocalUser = (user) => {
    localUser.value = user;
  };
  const clearLocalUser = () => {
    localUser.value = null;
  };
  return { localUser, initLocalUser, saveLocalUser, clearLocalUser };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const { localUser } = useUser();
    const hoje = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const dataEscolhida = ref("");
    const horaEscolhida = ref("");
    const slots = ref([]);
    const loadingSlots = ref(false);
    const loadingSubmit = ref(false);
    const servico = ref(null);
    const showModal = ref(false);
    const formUser = ref({ nome: "", email: "", telefone: "" });
    const formatData = (iso) => {
      if (!iso) return "";
      const [a, m, d] = iso.split("-");
      return `${d}/${m}/${a}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto space-y-6" }, _attrs))}><div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-blue-600 hover:underline text-sm font-medium mb-1 block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Voltar aos Serviços`);
          } else {
            return [
              createTextVNode("← Voltar aos Serviços")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h2 class="text-2xl font-bold text-gray-800">Escolha o Horário</h2>`);
      if (unref(servico)) {
        _push(`<p class="text-gray-500 text-sm mt-1">Serviço: <span class="font-semibold text-gray-700">${ssrInterpolate(unref(servico).nome)}</span> (${ssrInterpolate(unref(servico).duracaoMinutos)} min)</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden min-h-[400px]"><div class="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50"><label class="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Selecione uma Data</label><input type="date"${ssrRenderAttr("value", unref(dataEscolhida))}${ssrRenderAttr("min", unref(hoje))} class="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-lg text-gray-700"><div class="mt-8">`);
      if (unref(localUser)) {
        _push(`<div class="bg-blue-50 p-4 border border-blue-100 rounded-xl"><p class="text-sm text-blue-800 font-medium">Marcando como:</p><p class="font-bold text-lg text-blue-900">${ssrInterpolate(unref(localUser).nome)}</p><p class="text-sm text-blue-700">${ssrInterpolate(unref(localUser).email)}</p><button class="mt-2 text-xs font-semibold text-blue-600 hover:underline">Editar meus dados</button></div>`);
      } else {
        _push(`<div class="bg-gray-100 p-4 rounded-xl border border-gray-200"><p class="text-sm text-gray-600 text-center">Será requisitado seus dados para finalizar o agendamento.</p></div>`);
      }
      _push(`</div></div><div class="w-full md:w-1/2 p-6 flex flex-col"><label class="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Horários Disponíveis</label>`);
      if (unref(loadingSlots)) {
        _push(`<div class="flex-1 flex items-center justify-center"><span class="text-gray-400 font-medium animate-pulse">Buscando disponibilidade...</span></div>`);
      } else if (!unref(dataEscolhida)) {
        _push(`<div class="flex-1 flex items-center justify-center text-center"><span class="text-gray-400">Escolha uma data ao lado <br> para ver os horários.</span></div>`);
      } else if (unref(slots).length === 0) {
        _push(`<div class="flex-1 flex flex-col items-center justify-center text-center space-y-2"><span class="text-4xl">📅</span><h4 class="font-semibold text-gray-700">Sem horários</h4><p class="text-gray-500 text-sm max-w-xs">Não há disponibilidade para esta data. Tente outro dia.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-3 gap-3"><!--[-->`);
        ssrRenderList(unref(slots), (time) => {
          _push(`<button class="${ssrRenderClass([unref(horaEscolhida) === time ? "bg-blue-600 text-white shadow-blue-500/40 ring-2 ring-offset-1 ring-blue-600" : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600", "py-3 px-2 rounded-xl text-center font-bold text-sm shadow-sm transition-all"])}">${ssrInterpolate(time)}</button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
      if (unref(horaEscolhida)) {
        _push(`<div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 flex justify-center"><div class="max-w-3xl w-full flex items-center justify-between"><div><p class="text-sm text-gray-500 font-medium">Data escolhida:</p><p class="font-bold text-lg text-gray-900">${ssrInterpolate(formatData(unref(dataEscolhida)))} às ${ssrInterpolate(unref(horaEscolhida))}</p></div><button${ssrIncludeBooleanAttr(unref(loadingSubmit)) ? " disabled" : ""} class="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-500/30 transition-all text-lg disabled:opacity-50">${ssrInterpolate(unref(loadingSubmit) ? "Finalizando..." : "Confirmar Agendamento")}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showModal)) {
        _push(`<div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all"><h3 class="text-2xl font-bold mb-2 text-gray-800">Seus Dados</h3><p class="text-gray-500 text-sm mb-6">Preencha rapidamente para salvar seu horário.</p><form class="space-y-4"><div><label class="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label><input${ssrRenderAttr("value", unref(formUser).nome)} type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></div><div><label class="block text-sm font-semibold text-gray-700 mb-1">E-mail</label><input${ssrRenderAttr("value", unref(formUser).email)} type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></div><div><label class="block text-sm font-semibold text-gray-700 mb-1">Telefone / WhatsApp</label><input${ssrRenderAttr("value", unref(formUser).telefone)} type="tel" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></div><div class="flex justify-end space-x-3 mt-8"><button type="button" class="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl">Cancelar</button><button type="submit" class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md">Continuar</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agendar/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BeqaDdgu.mjs.map
