import type { KeyboardEvent } from 'react';

/**
 * Handles arrow-key navigation for a radio group: ArrowDown/ArrowRight move
 * to the next option and ArrowUp/ArrowLeft to the previous one, wrapping at
 * the ends. The newly selected option is selected immediately and focus
 * moves to it, matching the WAI-ARIA radio pattern.
 *
 * @param event - the keydown event from a radio option
 * @param currentIndex - index of the option that received the event
 * @param options - the group's options, in display order
 * @param onSelect - callback invoked with the option to select
 */
export function handleRadioGroupKeyDown<T>(
  event: KeyboardEvent<HTMLElement>,
  currentIndex: number,
  options: readonly T[],
  onSelect: (option: T) => void,
): void {
  if (options.length === 0) {
    return;
  }
  let nextIndex: number | null = null;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % options.length;
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + options.length) % options.length;
  }
  if (nextIndex === null) {
    return;
  }
  event.preventDefault();
  const option = options[nextIndex];
  if (option !== undefined) {
    onSelect(option);
    const group = event.currentTarget.closest('[role="radiogroup"]');
    const radios = group?.querySelectorAll<HTMLElement>('[role="radio"]');
    radios?.[nextIndex]?.focus();
  }
}
