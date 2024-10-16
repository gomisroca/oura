import { atom } from 'jotai';

export const messageAtom = atom<{ message: string | null; error?: boolean; popup?: boolean }>({
  message: null,
  error: false,
  popup: false,
});
