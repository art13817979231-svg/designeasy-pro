import { useState, useRef, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const historyRef = useRef<string[]>([JSON.stringify(initialState)]);
  const indexRef = useRef(0);
  const skipRef = useRef(false);

  const push = useCallback((newState: T) => {
    if (skipRef.current) { skipRef.current = false; return; }
    const json = JSON.stringify(newState);
    const current = historyRef.current[indexRef.current];
    if (json === current) return;
    const newHistory = historyRef.current.slice(0, indexRef.current + 1);
    newHistory.push(json);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    historyRef.current = newHistory;
    indexRef.current = newHistory.length - 1;
  }, []);

  const undo = useCallback((): boolean => {
    if (indexRef.current > 0) {
      indexRef.current--;
      skipRef.current = true;
      setState(JSON.parse(historyRef.current[indexRef.current]) as T);
      return true;
    }
    return false;
  }, []);

  const redo = useCallback((): boolean => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      skipRef.current = true;
      setState(JSON.parse(historyRef.current[indexRef.current]) as T);
      return true;
    }
    return false;
  }, []);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  return { state, setState, push, undo, redo, canUndo, canRedo };
}
