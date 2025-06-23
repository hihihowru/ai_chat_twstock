import { useState, useCallback } from 'react';

export function useBookmarkStore() {
  const [bookmarked, setBookmarked] = useState<{ id: string; content: string }[]>([]);

  const add = useCallback((id: string, content: string) => {
    setBookmarked(prev => prev.some(r => r.id === id) ? prev : [...prev, { id, content }]);
  }, []);

  const remove = useCallback((id: string) => {
    setBookmarked(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggle = useCallback((id: string, content: string) => {
    setBookmarked(prev => prev.some(r => r.id === id)
      ? prev.filter(r => r.id !== id)
      : [...prev, { id, content }]);
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarked.some(r => r.id === id);
  }, [bookmarked]);

  return { bookmarked, add, remove, toggle, isBookmarked };
} 