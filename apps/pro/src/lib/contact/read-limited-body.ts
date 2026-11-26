import 'server-only';

/** `too_large`: o corpo passou do teto — quem chama responde 413. */
export type LimitedBody = { text: string } | 'too_large';

async function readStreamWithCap(stream: ReadableStream<Uint8Array>, maximumBytes: number): Promise<LimitedBody> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
    receivedBytes += chunk.value.byteLength;
    if (receivedBytes > maximumBytes) {
      await reader.cancel();
      return 'too_large';
    }
    chunks.push(chunk.value);
  }
  return { text: new TextDecoder().decode(Buffer.concat(chunks)) };
}

/**
 * Lê o corpo com teto em bytes SEM carregá-lo inteiro antes: recusa pelo `Content-Length` declarado e, como o
 * header pode mentir (ou faltar, em chunked), para de ler o stream assim que o teto é ultrapassado.
 * @example const body = await readLimitedBody(request, 1024); if (body === 'too_large') return 413;
 */
export async function readLimitedBody(request: Request, maximumBytes: number): Promise<LimitedBody> {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > maximumBytes) return 'too_large';
  if (!request.body) return { text: '' };
  return readStreamWithCap(request.body, maximumBytes);
}
