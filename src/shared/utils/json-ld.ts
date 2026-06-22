/**
 * Serializa um objeto JSON-LD para injeção segura em <script> via innerHTML.
 *
 * `JSON.stringify` não escapa `<`, `>` e `&`, o que permite que campos vindos
 * de fontes externas (ex.: Strapi) contenham `</script>` e quebrem o contexto
 * HTML. Unicode escapes (`<`, `>`, `&`) são válidos em JSON e
 * ignorados pelo parser JS, mas inofensivos para o parser HTML.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
