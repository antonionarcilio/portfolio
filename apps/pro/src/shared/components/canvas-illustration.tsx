'use client';
import { useEffect, useRef } from 'react';

type CanvasIllustrationProps = {
  src: string;
  width: number;
  height: number;
  className?: string;
};

/**
 * Renders a static illustration (SVG/PNG) onto an HTML canvas element.
 * Preferred over next/image for decorative illustrations that should be
 * drawn as raster output instead of DOM-embedded SVG.
 */
export function CanvasIllustration({ src, width, height, className }: CanvasIllustrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = src;
  }, [src, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className={className} aria-hidden />;
}
