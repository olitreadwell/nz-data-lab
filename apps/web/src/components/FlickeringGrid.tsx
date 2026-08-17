'use client';

import { useEffect, useRef } from 'react';

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  flickerChance?: number;
}

/**
 * Canvas-based animated square grid, each cell flickering opacity independently.
 * Own implementation (not vendored) — see docs/ai-prompts.md for the pattern this
 * was cribbed from (magicuidesign/blog-template's hero background technique).
 */
export function FlickeringGrid({
  className,
  squareSize = 4,
  gridGap = 6,
  color = '107, 114, 128',
  maxOpacity = 0.2,
  flickerChance = 0.05,
}: FlickeringGridProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let cols = 0;
    let rows = 0;
    let opacities: Float32Array = new Float32Array(0);
    let animationFrame = 0;

    const resize = (): void => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const cell = squareSize + gridGap;
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      opacities = new Float32Array(cols * rows).map(() => Math.random() * maxOpacity);
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cell = squareSize + gridGap;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const index = row * cols + col;
          if (Math.random() < flickerChance) {
            opacities[index] = Math.random() * maxOpacity;
          }
          ctx.fillStyle = `rgba(${color}, ${opacities[index]})`;
          ctx.fillRect(col * cell, row * cell, squareSize, squareSize);
        }
      }
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [squareSize, gridGap, color, maxOpacity, flickerChance]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
