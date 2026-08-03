import { createContext, useContext } from 'react';

export const BookContentContext = createContext(null);

export function useLiveBookContent() {
  return useContext(BookContentContext);
}
