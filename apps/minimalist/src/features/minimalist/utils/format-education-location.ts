type EducationLocationParts = {
  city: string;
  federation: string;
  country: string;
};

/**
 * Texto de localização da formação para o subtexto. O CMS traz `Cidade, UF - País`; quando o valor não
 * segue esse formato (ex.: `EAD - Brasil`), `parseEducationLocation` devolve tudo em `city` e deixa
 * `federation`/`country` vazios — nesse caso o texto original é exibido como está, sem separadores soltos.
 * @example formatEducationLocation({ city: 'Belo Horizonte', federation: 'MG', country: 'Brasil' }) // 'Belo Horizonte - MG | Brasil'
 * @example formatEducationLocation({ city: 'EAD - Brasil', federation: '', country: '' }) // 'EAD - Brasil'
 */
export function formatEducationLocation({ city, federation, country }: EducationLocationParts): string {
  if (!federation || !country) return city;
  return `${city} - ${federation} | ${country}`;
}
