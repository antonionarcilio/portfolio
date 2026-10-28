import { A11Y_CLASS_BY_KEY, A11Y_FEATURE_KEYS, A11Y_STORAGE_KEY } from './store';

/**
 * Script inline para o <head>: aplica as classes de acessibilidade salvas no <html> antes da
 * primeira pintura, evitando o flash de cursor/texto/links padrão até o React hidratar.
 * Sem opção salva, só "pausar animações" acompanha `prefers-reduced-motion`. Falha em silêncio.
 * @example <script dangerouslySetInnerHTML={{ __html: A11Y_SCRIPT }} />
 */
export const A11Y_SCRIPT = `(function(){try{
var classes=${JSON.stringify(A11Y_CLASS_BY_KEY)};
var stored=JSON.parse(localStorage.getItem('${A11Y_STORAGE_KEY}')||'null')||{};
${JSON.stringify(A11Y_FEATURE_KEYS)}.forEach(function(key){
var on=stored[key]===true;
if(key==='pauseAnimations'&&stored[key]===undefined)on=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(on)document.documentElement.classList.add(classes[key]);
});
}catch(e){}})();`;
