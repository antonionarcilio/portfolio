'use client';
import { useEffect, useState, type RefObject } from 'react';

const HOST_ATTRIBUTE = 'data-animated-icon-host';

/** O hospedeiro do modo `parent`: o ancestral marcado com `data-animated-icon-host` ou, sem marcação, o pai direto. */
function resolveParentHost(element: HTMLElement): HTMLElement | null {
  return element.closest<HTMLElement>(`[${HOST_ATTRIBUTE}]`) ?? element.parentElement;
}

/**
 * `true` enquanto o ponteiro ou o foco do teclado estiver sobre o hospedeiro. `scope` escolhe quem é ele:
 * o próprio ícone (`self`) ou o elemento ao redor (`parent`). Com `isEnabled` falso não escuta nada.
 * @example const isActive = useHostActivity(wrapperRef, 'parent', true);
 */
export function useHostActivity(
  elementRef: RefObject<HTMLElement | null>,
  scope: 'self' | 'parent',
  isEnabled: boolean,
): boolean {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!isEnabled || !element) return;
    const host = scope === 'parent' ? resolveParentHost(element) : element;
    if (!host) return;
    const activate = () => setIsActive(true);
    const deactivate = () => setIsActive(false);
    const events: Array<[string, () => void]> = [
      ['pointerenter', activate],
      ['pointerleave', deactivate],
      ['focusin', activate],
      ['focusout', deactivate],
    ];
    events.forEach(([name, listener]) => host.addEventListener(name, listener));
    return () => {
      events.forEach(([name, listener]) => host.removeEventListener(name, listener));
      setIsActive(false);
    };
  }, [elementRef, scope, isEnabled]);

  return isActive;
}
