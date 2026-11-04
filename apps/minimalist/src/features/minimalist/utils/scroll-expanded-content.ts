export function scrollExpandedContent(content: HTMLElement, key: string): boolean {
  const direction = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  if (!direction) return false;

  const maximumScrollTop = Math.max(content.scrollHeight - content.clientHeight, 0);
  const hasRoom = direction > 0 ? content.scrollTop < maximumScrollTop - 1 : content.scrollTop > 1;
  if (!hasRoom) return false;

  content.scrollBy({ top: direction * Math.max(content.clientHeight * 0.8, 1), behavior: 'auto' });
  return true;
}
