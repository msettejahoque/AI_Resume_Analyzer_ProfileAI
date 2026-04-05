'use client';
import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
}

export function ScoreRing({ score }: ScoreRingProps) {
  const [cur, setCur] = useState(0);
  const circ = 2 * Math.PI * 52;

  useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const go = () => {
        n += 2;
        if (n <= score) {
          setCur(n);
          requestAnimationFrame(go);
        } else setCur(score);
      };
      requestAnimationFrame(go);
    }, 400);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circ - (cur / 100) * circ;
  // 🎨 EDIT: high=brand mid=warning low=danger
  const strokeColor = cur >= 80 ? '#3B82F6' : cur >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 128,
        height: 128,
        flexShrink: 0,
      }}
    >
      <svg
        style={{ width: 128, height: 128, transform: 'rotate(-90deg)' }}
        viewBox="0 0 116 116"
      >
        {/* 🎨 EDIT: stroke=border-default */}
        <circle
          cx="58"
          cy="58"
          r="52"
          fill="none"
          stroke="#2D2D2D"
          strokeWidth="7"
        />
        <circle
          cx="58"
          cy="58"
          r="52"
          fill="none"
          stroke={strokeColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .04s linear, stroke .3s' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 🎨 EDIT: text-text-primary */}
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: '#F5F5F5',
            fontFamily: 'monospace',
            lineHeight: 1,
          }}
        >
          {cur}
        </span>
        {/* 🎨 EDIT: text-brand */}
        <span
          style={{
            fontSize: 10,
            color: '#3B82F6',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: 3,
          }}
        >
          Match
        </span>
      </div>
    </div>
  );
}


