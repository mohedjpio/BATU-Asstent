import { useState, useEffect } from 'react';
import { chatApi } from '../services/api.js';

const DEFAULT_BRANDING = {
  logo: null,
  colors: [],
  title: 'جامعة برج العرب التكنولوجية',
};

// Try to derive a usable primary color from scraped colors
const pickAccent = (colors = []) => {
  if (!colors.length) return null;
  // Prefer non-white, non-black, non-near-grey hex colors
  return (
    colors.find((c) => {
      if (!c.startsWith('#')) return false;
      const hex = c.replace('#', '');
      if (hex.length !== 6) return false;
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // Skip near-grey, near-white, near-black
      return max - min > 30 && max < 240 && max > 30;
    }) || null
  );
};

export const useBranding = () => {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatApi
      .getBranding()
      .then(({ branding: b }) => {
        if (!b) return;
        setBranding({ ...DEFAULT_BRANDING, ...b });

        // Apply extracted accent color as CSS variable if found
        const accent = pickAccent(b.colors);
        if (accent) {
          document.documentElement.style.setProperty('--accent', accent);
        }
      })
      .catch(() => {
        /* use defaults silently */
      })
      .finally(() => setLoading(false));
  }, []);

  return { branding, loading };
};
