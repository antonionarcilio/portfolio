import { serializeJsonLd } from '@/shared/utils/json-ld';

type JsonLdScriptProps = { document: Record<string, unknown> };

/** Injeta um documento JSON-LD (já escapado por `serializeJsonLd`) como `<script type="application/ld+json">`. */
export function JsonLdScript({ document }: JsonLdScriptProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(document) }} />;
}
