import type { ActiveBuffObject } from "@/constants/types";

export function hasSwapped(prevChar: string, currentChar: string) {
  return prevChar !== currentChar
}

export function removeBuffByName(array: ActiveBuffObject[], name: string) {
  const index = array.findIndex(b => b.name === name);
  if (index !== -1) {
    array.splice(index, 1);
  }
}