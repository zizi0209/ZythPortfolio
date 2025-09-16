"use client";

import { useEffect, useRef, useState } from "react";

export default function SmoothFollower() {
  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const border = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const [pos, setPos] = useState({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  });
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  const DOT_SMOOTHNESS = 0.2;
  const BORDER_SMOOTHNESS = 0.1;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      (mouse.current = { x: e.clientX, y: e.clientY });

    // Dùng event delegation để bắt hover cho cả phần tử sinh động sau này
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const hit = el?.closest?.(
        "a,button,img,input,textarea,select,[role='button']"
      );
      setHover(!!hit);
    };
    const onOut = () => setHover(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, DOT_SMOOTHNESS);
      dot.current.y = lerp(dot.current.y, mouse.current.y, DOT_SMOOTHNESS);
      border.current.x = lerp(
        border.current.x,
        mouse.current.x,
        BORDER_SMOOTHNESS
      );
      border.current.y = lerp(
        border.current.y,
        mouse.current.y,
        BORDER_SMOOTHNESS
      );
      setPos({ dot: { ...dot.current }, border: { ...border.current } });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <div
        className="absolute rounded-full dark:bg-white bg-black"
        style={{
          width: 8,
          height: 8,
          transform: "translate(-50%, -50%)",
          left: pos.dot.x,
          top: pos.dot.y,
        }}
      />
      <div
        className="absolute rounded-full border dark:border-white border-black transition-[width,height] duration-300"
        style={{
          width: hover ? 44 : 28,
          height: hover ? 44 : 28,
          transform: "translate(-50%, -50%)",
          left: pos.border.x,
          top: pos.border.y,
        }}
      />
    </div>
  );
}
