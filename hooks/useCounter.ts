import { useEffect, useState } from 'react';
import { useInView } from './useInView';

export function useCounter(to: number) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible) return;

    if (to % 1 !== 0) {
      const id = setTimeout(() => setVal(to), 0);
      return () => clearTimeout(id);
    }

    let n = 0;
    const step = Math.max(1, Math.ceil(to / 55));
    const id = setInterval(() => {
      n += step;
      if (n >= to) {
        setVal(to);
        clearInterval(id);
      } else {
        setVal(n);
      }
    }, 18);

    return () => clearInterval(id);
  }, [visible, to]);

  return { ref, val };
}


