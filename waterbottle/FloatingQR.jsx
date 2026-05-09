'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function FloatingQR({ src = '/qr.png', alt = 'QR Code' }) {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(true);
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 120, clientX - offset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 140, clientY - offset.current.y)),
      });
    };
    const onUp = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend',  onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onUp);
    };
  }, [dragging]);

  const startDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = ref.current.getBoundingClientRect();
    offset.current = { x: clientX - rect.left, y: clientY - rect.top };
    setDragging(true);
  };

  if (!visible) return null;

  return (
    <div
      ref={ref}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      style={{
        position:  'fixed',
        left:      pos.x,
        top:       pos.y,
        zIndex:    9999,
        cursor:    dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        transition: dragging ? 'none' : 'box-shadow 0.2s',
      }}
    >
      <div style={{
        background:   '#fff',
        borderRadius: '16px',
        boxShadow:    dragging
          ? '0 16px 48px rgba(0,0,0,0.22)'
          : '0 4px 24px rgba(0,0,0,0.13)',
        padding:      '8px 8px 4px',
        display:      'flex',
        flexDirection:'column',
        alignItems:   'center',
        gap:          '4px',
        width:        '112px',
        transition:   'box-shadow 0.2s',
      }}>
        {/* Close button */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setVisible(false)}
          style={{
            alignSelf:       'flex-end',
            background:      'none',
            border:          'none',
            cursor:          'pointer',
            padding:         '0',
            lineHeight:      1,
            color:           '#aaa',
            fontSize:        '14px',
            marginBottom:    '-2px',
          }}
          aria-label="Close QR"
        >
          ×
        </button>

        {/* QR image */}
        <Image
          src={src}
          alt={alt}
          width={96}
          height={96}
          draggable={false}
          style={{ borderRadius: '8px', display: 'block' }}
        />

        {/* Label */}
        <p style={{
          margin:     0,
          fontSize:   '9px',
          color:      '#9879d4',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          paddingBottom: '2px',
        }}>
          Scan me
        </p>
      </div>
    </div>
  );
}