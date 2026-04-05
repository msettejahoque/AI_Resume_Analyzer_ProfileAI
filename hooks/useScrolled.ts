import { useEffect, useState } from 'react';

export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > offset);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, [offset]);

  return scrolled;
}


