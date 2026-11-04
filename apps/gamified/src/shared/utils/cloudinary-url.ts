export function cloudinaryOptimizedUrl(url: string, width: number): string {
  if (!url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
