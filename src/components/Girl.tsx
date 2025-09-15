// components/Girl.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";

gsap.registerPlugin(CustomEase, CustomWiggle);

type Bubble = { x: number; y: number };

type GirlProps = {
  message?: string;
  autoHideMs?: number;
  bubble?: Bubble;
  className?: string; // optional: để bạn tuỳ biến nếu cần
  maxWidth?: number | string; // optional: default 600
};

export default function Girl({
  message = "Hi",
  autoHideMs = 1400,
  bubble = { x: 150, y: 38 },
  className,
  maxWidth = 600,
}: GirlProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [showSpeech, setShowSpeech] = useState(false);
  const timerRef = useRef<number | null>(null);

  const percentage = (part: number, total: number) => (100 * part) / total;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const sayHi = useCallback(() => {
    setShowSpeech(true);
    if (autoHideMs) {
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setShowSpeech(false);
        timerRef.current = null;
      }, autoHideMs);
    }
  }, [autoHideMs]);

  const onKeyDown: React.KeyboardEventHandler<SVGSVGElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      sayHi();
    }
  };

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const dom = {
      face: svgEl.querySelector(".face") as Element,
      eye: svgEl.querySelectorAll(".eye") as NodeListOf<Element>,
      innerFace: svgEl.querySelector(".inner-face") as Element,
      hairFront: svgEl.querySelector(".hair-front") as Element,
      hairBack: svgEl.querySelector(".hair-back") as Element,
      shadow: svgEl.querySelectorAll(".shadow") as NodeListOf<Element>,
      ear: svgEl.querySelectorAll(".ear") as NodeListOf<Element>,
      eyebrowLeft: svgEl.querySelector(".eyebrow-left") as Element,
      eyebrowRight: svgEl.querySelector(".eyebrow-right") as Element,
    };

    gsap.set(svgEl.querySelector(".bg"), { transformOrigin: "50% 50%" });
    gsap.set(svgEl.querySelector(".ear-right"), { transformOrigin: "0% 50%" });
    gsap.set(svgEl.querySelector(".ear-left"), { transformOrigin: "100% 50%" });
    gsap.set(svgEl.querySelector(".me"), { opacity: 1 });

    const meTl = gsap.timeline({ onComplete: addMouseEvent, delay: 1 });

    meTl
      .from(
        svgEl.querySelector(".me"),
        { duration: 1, yPercent: 100, ease: "elastic.out(0.5, 0.4)" },
        0.5
      )
      .from(
        svgEl.querySelectorAll(".head , .hair , .shadow"),
        { duration: 0.9, yPercent: 20, ease: "elastic.out(0.58, 0.25)" },
        0.6
      )
      .from(
        svgEl.querySelector(".ear-right"),
        {
          duration: 1,
          rotate: 40,
          yPercent: 10,
          ease: "elastic.out(0.5, 0.2)",
        },
        0.7
      )
      .from(
        svgEl.querySelector(".ear-left"),
        {
          duration: 1,
          rotate: -40,
          yPercent: 10,
          ease: "elastic.out(0.5, 0.2)",
        },
        0.7
      )
      .to(
        svgEl.querySelector(".glasses"),
        {
          duration: 1,
          keyframes: [{ yPercent: -10 }, { yPercent: 0 }],
          ease: "elastic.out(0.5, 0.2)",
        },
        0.75
      )
      .from(
        svgEl.querySelectorAll(".eyebrow-right , .eyebrow-left"),
        { duration: 1, yPercent: 300, ease: "elastic.out(0.5, 0.2)" },
        0.7
      )
      .to(
        svgEl.querySelectorAll(".eye-right , .eye-left"),
        { duration: 0.01, opacity: 1 },
        0.85
      )
      .to(
        svgEl.querySelectorAll(".eye-right-2 , .eye-left-2"),
        { duration: 0.01, opacity: 0 },
        0.85
      );

    const blink = gsap.timeline({ repeat: -1, repeatDelay: 5, paused: true });
    blink
      .to(
        svgEl.querySelectorAll(".eye-right, .eye-left"),
        { duration: 0.01, opacity: 0 },
        0
      )
      .to(
        svgEl.querySelectorAll(".eye-right-2, .eye-left-2"),
        { duration: 0.01, opacity: 1 },
        0
      )
      .to(
        svgEl.querySelectorAll(".eye-right, .eye-left"),
        { duration: 0.01, opacity: 1 },
        0.15
      )
      .to(
        svgEl.querySelectorAll(".eye-right-2 , .eye-left-2"),
        { duration: 0.01, opacity: 0 },
        0.15
      );

    CustomWiggle.create("myWiggle", { wiggles: 6, type: "ease-out" });
    CustomWiggle.create("lessWiggle", { wiggles: 4, type: "ease-in-out" });

    let height = 0,
      width = 0,
      xPosition = 0,
      yPosition = 0,
      storedXPosition = 0,
      storedYPosition = 0,
      dizzyIsPlaying = false;

    const dizzy = gsap.timeline({
      paused: true,
      onComplete: () => {
        dizzyIsPlaying = false;
      },
    });

    dizzy
      .to(dom.eye, { duration: 0.01, opacity: 0 }, 0)
      .to(svgEl.querySelectorAll(".dizzy"), { duration: 0.01, opacity: 0.3 }, 0)
      .to(svgEl.querySelector(".mouth"), { duration: 0.01, opacity: 0 }, 0)
      .to(svgEl.querySelector(".oh"), { duration: 0.01, opacity: 0.85 }, 0)
      .to(
        svgEl.querySelectorAll(".head, .hair-back, .shadow"),
        {
          duration: 6,
          rotate: 2,
          transformOrigin: "50% 50%",
          ease: "myWiggle",
        },
        0
      )
      .to(
        svgEl.querySelector(".me"),
        {
          duration: 6,
          rotate: -2,
          transformOrigin: "50% 100%",
          ease: "myWiggle",
        },
        0
      )
      .to(
        svgEl.querySelector(".me"),
        {
          duration: 4,
          scale: 0.99,
          transformOrigin: "50% 100%",
          ease: "lessWiggle",
        },
        0
      )
      .to(
        svgEl.querySelector(".dizzy-1"),
        {
          rotate: -360,
          duration: 1,
          repeat: 5,
          transformOrigin: "50% 50%",
          ease: "none",
        },
        0.01
      )
      .to(
        svgEl.querySelector(".dizzy-2"),
        {
          rotate: 360,
          duration: 1,
          repeat: 5,
          transformOrigin: "50% 50%",
          ease: "none",
        },
        0.01
      )
      .to(dom.eye, { duration: 0.01, opacity: 1 }, 4)
      .to(svgEl.querySelectorAll(".dizzy"), { duration: 0.01, opacity: 0 }, 4)
      .to(svgEl.querySelector(".oh"), { duration: 0.01, opacity: 0 }, 4)
      .to(svgEl.querySelector(".mouth"), { duration: 0.01, opacity: 1 }, 4);

    function updateWindowSize() {
      height = window.innerHeight;
      width = window.innerWidth;
    }
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    function updateScreenCoords(event: MouseEvent) {
      if (!dizzyIsPlaying) {
        xPosition = event.clientX;
        yPosition = event.clientY;
      }
      const mvx = (event as any).movementX ?? 0;
      if (!dizzyIsPlaying && Math.abs(mvx) > 500) {
        dizzyIsPlaying = true;
        dizzy.restart();
      }
    }

    function animateFace() {
      if (!xPosition) return;
      if (storedXPosition === xPosition && storedYPosition === yPosition)
        return;

      const x = percentage(xPosition, width) - 50;
      const y = percentage(yPosition, height) - 50;
      const yHigh = percentage(yPosition, height) - 20;
      const yLow = percentage(yPosition, height) - 80;

      gsap.to(dom.face, { yPercent: yLow / 30, xPercent: x / 30 });
      gsap.to(dom.eye, { yPercent: yHigh / 3, xPercent: x / 2 });
      gsap.to(dom.innerFace, { yPercent: y / 6, xPercent: x / 8 });
      gsap.to(dom.hairFront, { yPercent: yHigh / 15, xPercent: x / 22 });
      gsap.to([dom.hairBack, ...Array.from(dom.shadow)], {
        yPercent: (yLow / 20) * -1,
        xPercent: (x / 20) * -1,
      });
      gsap.to(dom.ear, { yPercent: (y / 1.5) * -1, xPercent: (x / 10) * -1 });
      gsap.to([dom.eyebrowLeft, dom.eyebrowRight], { yPercent: y * 2.5 });

      storedXPosition = xPosition;
      storedYPosition = yPosition;
    }

    function addMouseEvent() {
      const safe = window.matchMedia(
        "(prefers-reduced-motion: no-preference)"
      ).matches;
      if (safe) {
        window.addEventListener("mousemove", updateScreenCoords);
        gsap.ticker.add(animateFace);
        blink.play();
      }
    }

    return () => {
      window.removeEventListener("resize", updateWindowSize);
      window.removeEventListener("mousemove", updateScreenCoords);
      gsap.ticker.remove(animateFace);
    };
  }, []);

  useEffect(() => () => clearTimer(), []);

  return (
    <>
      <svg
        data-girl
        ref={svgRef}
        viewBox="0 10 211.73 180"
        preserveAspectRatio="xMidYMid meet"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={
          {
            // Responsive theo container của bạn (w-[47%])
            display: "block", // tránh baseline gap
            verticalAlign: "middle", // không tụt hàng
            width: "100%", // chiếm trọn chiều ngang container
            maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth, // giới hạn giống bản gốc
            height: "auto", // giữ tỉ lệ viewBox
            flexShrink: 0,

            // variables ngay trên SVG như bản gốc:
            ["--mars-green" as any]: "#386641",
            ["--rim-red" as any]: "#8b0000",
            ["--hair-black" as any]: "#111111",
            cursor: "pointer",
          } as React.CSSProperties
        }
        role="button"
        tabIndex={0}
        aria-label={`Chạm để cô gái nói "${message}"`}
        onClick={sayHi}
        onKeyDown={onKeyDown}
      >
        <defs>
          <clipPath id="background-clip">
            <path
              d="M39 153.73s31.57 19.71 77.26 15.21 90.18-37.23 90.36-72.33-8.82-80.28-33.59-86.29C136.84-6.57 114.13-5.82 88-2.82S34.73 11.45 16.71 48.24C-1.5 66.64-4.88 125.2 39 153.73z"
              fill="none"
            />
          </clipPath>

          <linearGradient
            id="linear-gradient"
            x1="102.94"
            y1="154.47"
            x2="102.94"
            y2="36.93"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#fff5cc" />
            <stop offset="0.01" stopColor="#faf0c8" />
            <stop offset="0.19" stopColor="#c2b599" />
            <stop offset="0.35" stopColor="#998977" />
            <stop offset="0.47" stopColor="#806f62" />
            <stop offset="0.54" stopColor="#77655a" />
            <stop offset="0.6" stopColor="#77655a" />
            <stop offset="1" stopColor="#77655a" />
          </linearGradient>
        </defs>

        {/* ...toàn bộ nội dung SVG giữ nguyên như bạn đưa... */}
        <path
          className="bg"
          d="M39 153.73s31.57 19.71 77.26 15.21 90.18-37.23 90.36-72.33-10.51-57-35.28-63-50.22 17-76.31 20-60.12-15.88-78.32 2.51S-4.88 125.2 39 153.73z"
          fill="rgb(111, 220, 191)"
        />
        <g clipPath="url(#background-clip)">
          <g className="me" opacity="0">
            <g className="body">
              <path
                className="shadow"
                d="M129.86,48.47s6.76,4.91,10,12.07,7,29.06,11.71,39.82,9.06,22.5,9.91,26.42,1.57,5-2.52,10.2-14.63,12-14.63,12l-11.47,6.8s14.87,9.67,17.68,19.32a71.16,71.16,0,0,1,4.34,18.79l-21.39,4.54L113.2,164.85l-13-11.1L90.31,75.37Z"
                opacity="0.09"
                style={{ isolation: "isolate" }}
              />
              <path
                className="shadow"
                d="M69.44,54A23.64,23.64,0,0,0,58.91,64.27c-4.39,7.87-4.1,30.52-7.61,41.23S40.76,124.26,41.93,135s2.64,12.27,2.64,12.27a66.65,66.65,0,0,1,14.93,1.88c7,1.89,18.42,5.48,18.42,5.48S63.6,166.53,61.84,176a67.23,67.23,0,0,0-2.34,18.26l20.89,1.9,16.19-34,11.42-12L109.91,75Z"
                opacity="0.09"
                style={{ isolation: "isolate" }}
              />
              <path
                className="hair-back hair"
                d="M127.63,45.17c2.65,1.35,11.15,4.2,16.07,23.12,2.88,20.58,3.79,26.07,4.68,30.6s1.2,11.6,6.3,21.15.85,14.65.85,14.65l-7.63,7.08s3.45-12.65-2.63-18.13c0,0,2,14,0,17s-8.75,6.92-8.75,6.92-2.48-4.53-5.06-9.64,2.78,11,.08,12.09-18.82,6.25-30.6,3.86-21.53-5-24-5.79c0,0,2.75-1.37.77-7.62s-1-7.59-1.52-7-2.1,3-1,7.49a7.45,7.45,0,0,1-1.92,7.18s-7.11-4.65-12.77-5.21A51.35,51.35,0,0,1,51,141.14s-5-11.43-.4-23.56S58,104.1,58.32,88.87s2.41-34.66,20.41-45S116.87,35.4,127.63,45.17Z"
                fill="url(#linear-gradient)"
              />
              <path
                className="neck"
                d="M114.26 143.16v-14a9.22 9.22 0 10-18.43 0v14c-15.27 2.84-24.74 15.08-24.74 27.33H139c0-12.24-9.5-24.49-24.74-27.33z"
                fill="#ede3d1"
              />
              <path
                className="top"
                d="M105.61 167c-30.17 0-25.36-40-25.36 15.84h25.35l25-2.14c-.05-55.79 5.17-13.7-24.99-13.7z"
                fill="#fff"
                stroke="#404040"
                strokeWidth=".5"
              />
              <path
                className="shoulder"
                d="M95.82 142.87c-16 1.84-29.37 19.5-29.37 40h29.37z"
                fill="#404040"
              />
              <path
                className="shoulder"
                d="M114.23 142.67c15.76 1.85 29 19.6 29 40.2h-29z"
                fill="#404040"
              />
            </g>
            <path
              className="shadow"
              d="M95.82 122.36h18.41v14.31s-10.5 5.54-18.41 0z"
              fill="#efceb9"
            />
            <g className="head">
              <g className="ear-left ear">
                <path
                  d="M63.52 105.14A8.21 8.21 0 0072 113.2a8.36 8.36 0 008.51-8.1A8.21 8.21 0 0072 97a8.36 8.36 0 00-8.48 8.14z"
                  fill="#ede3d1"
                />
                <path
                  d="M68.54 104.48a17 17 0 014.14.41c1.07.31 1.94 1 3 1.31a.39.39 0 00.43-.57c-1.15-2.38-5.49-1.86-7.58-1.67a.26.26 0 000 .52z"
                  fill="#b5aa9a"
                />
              </g>
              <g className="ear-right ear">
                <path
                  d="M144.37 105.24a8.2 8.2 0 01-8.37 8.06 8.35 8.35 0 01-8.51-8.1 8.21 8.21 0 018.42-8.06 8.35 8.35 0 018.46 8.1z"
                  fill="#ede3d1"
                />
                <path
                  d="M139.6 104c-2.1-.19-6.43-.72-7.59 1.67a.39.39 0 00.44.57c1.07-.26 1.92-1 3-1.31a17.51 17.51 0 014.15-.41.26.26 0 000-.52z"
                  fill="#b5aa9a"
                />
              </g>
              <g className="face">
                <rect
                  x="73.99"
                  y="48.26"
                  width="61.54"
                  height="80.49"
                  rx="26.08"
                  transform="rotate(180 104.76 88.5)"
                  fill="#ede3d1"
                />
                <g className="inner-face">
                  <path
                    className="eyebrow-right"
                    d="M120.73 79a9 9 0 00-4-1.22 9.8 9.8 0 00-4.19.87"
                    fill="none"
                    stroke="#b5aa9a"
                    strokeWidth="1.04"
                  />
                  <path
                    className="eyebrow-left"
                    d="M97.12 79.41a9.53 9.53 0 00-4-1.11 10.58 10.58 0 00-4.2.76"
                    fill="none"
                    stroke="#b5aa9a"
                    strokeWidth="1.04"
                  />
                  <path
                    className="mouth"
                    d="M97 107.52s7.06 4.62 14 1.59"
                    fill="none"
                    stroke="#b5aa9a"
                    strokeWidth="1.04"
                  />
                  <path
                    className="oh"
                    opacity="0"
                    d="M105.56,117.06c4-.14,5-2.89,4.7-5.64s-1.88-6.7-4.84-6.62-4.73,4.36-4.9,6.72S101.57,117.19,105.56,117.06Z"
                    fill="#262528"
                  />
                  <g className="eyes">
                    <path
                      className="eye-left eye"
                      d="M89.48 87.37c-.07 2.08 1.25 3.8 2.94 3.85s3.1-1.59 3.16-3.67-1.25-3.8-2.94-3.85-3.1 1.59-3.16 3.67z"
                      fill="#2b343b"
                    />
                    <path
                      className="eye-right eye"
                      d="M113.67 87.37c-.07 2.08 1.25 3.8 2.94 3.85s3.1-1.59 3.16-3.67-1.25-3.8-2.94-3.85-3.1 1.59-3.16 3.67z"
                      fill="#2b343b"
                    />
                    <path
                      className="eye-right-2 eye"
                      d="M114.11 88a5.72 5.72 0 002.48.72 6.46 6.46 0 002.59-.45"
                      opacity="0"
                      fill="none"
                      stroke="#282828"
                      strokeWidth="1.04"
                    />
                    <path
                      className="eye-left-2 eye"
                      d="M89.85 88a5.77 5.77 0 002.56.3 6.48 6.48 0 002.49-.87"
                      fill="none"
                      opacity="0"
                      stroke="#282828"
                      strokeWidth="1.04"
                    />
                  </g>
                  <path
                    className="dizzy dizzy-1"
                    opacity="0"
                    d="M113.61,87.6c.54-2.66,2.66-3.84,4.63-3.37A3.3,3.3,0,0,1,117,90.71a2.53,2.53,0,0,1-2-3,2.48,2.48,0,0,1,2.73-1.92A1.71,1.71,0,0,1,119.32,88a1.59,1.59,0,0,1-1.75,1.34c-.79-.1-1.41-.59-1-1.42s1-.72,1.22-.24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.75"
                  />
                  <path
                    className="dizzy dizzy-2"
                    opacity="0"
                    d="M96.15,87.27c-.54-2.66-2.66-3.84-4.63-3.37s-2.89,1.9-2.46,4a3.11,3.11,0,0,0,3.68,2.45,2.53,2.53,0,0,0,2-3A2.49,2.49,0,0,0,92,85.49a1.71,1.71,0,0,0-1.57,2.13A1.57,1.57,0,0,0,92.19,89c.79-.11,1.41-.6,1-1.43s-1-.72-1.22-.23"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.75"
                  />
                  <path
                    className="nose"
                    d="M102.39 98.13s3.09 1.55 5.78 0"
                    fill="none"
                    stroke="#e0d5c1"
                  />
                  <path
                    className="glasses"
                    d="M133.54 81.76c-4.7-1.42-15.29-2.42-19.83-.45-5.82 2.17-3.18 1.57-8.55 1.17-5.36.4-2.74 1-8.55-1.18-7.3-2.55-15.58-.24-22.25.72v2.75c2.46.24 1.26 6.78 3.06 10.32 2.13 7.23 12.69 9.55 18.19 5.49 3.9-2 7.08-10.32 7.21-12.86 0-1.64 4.15-2.57 4.61.24.11 2.53 3.42 10.69 7.28 12.62 5.5 4 16 1.74 18.17-5.49 1.8-3.54 1.69-9.92 2.88-10.32s.74-2.67 0-2.75-1.02-.1-2.22-.26zM97.25 97.49C90.94 104.81 79 101.2 78 92.3c-.7-2.62-1-7.3 1.27-9.12s6.88-1.87 9.23-2c11.14-.26 16.62 5.6 8.75 16.31zm35.12-5.19c-3.71 17.2-27.26 7.42-22.09-7.36 1.87-3.11 9.09-3.84 11.55-3.73 8.07-.04 12.7 1.79 10.54 11.09z"
                    fill="#c6c6c6"
                    opacity=".48"
                  />
                  <path
                    className="blush-left eye"
                    d="M89.9 98.17a2.66 2.66 0 01-1.55-.93 3.73 3.73 0 01-.76-3.12 3 3 0 011-1.56 2 2 0 011.4-.42 3 3 0 012.5 2.72.76.76 0 010 .21 3.19 3.19 0 01.11.91 2.1 2.1 0 01-1.77 2.21 2.07 2.07 0 01-.93-.02zM89.34 96v-.05s-.04.05 0 .05z"
                    fill="#efceb9"
                    fillRule="evenodd"
                  />
                  <path
                    className="blush-right eye"
                    d="M118.93 98.19a2.09 2.09 0 01-1.77-2.19 3.58 3.58 0 01.1-.91v-.21a3 3 0 012.51-2.72 2 2 0 011.4.42 3 3 0 011 1.56 3.73 3.73 0 01-.76 3.12 2.66 2.66 0 01-1.55.93 2.08 2.08 0 01-.93 0zm1.53-2.2v.05c0 .05.05-.04 0-.04z"
                    fill="#efceb9"
                    fillRule="evenodd"
                  />
                </g>
                <path
                  className="hair-front"
                  d="M134.1,57.61C129.22,51.79,118,45,115.33,44.84s-13-1.87-20.65,0-16,4.51-18.77,8.26-6.17,18-4.77,24.41c0,0,3-3.09,10.46-5.73h0s.74-6.33,1.45-7.18a32.29,32.29,0,0,0-.1,6.73,59.67,59.67,0,0,1,8.22-2,37,37,0,0,1,.25-8.11,67.11,67.11,0,0,0,.54,8c2-.32,4.18-.59,6.52-.78h0s.18-2.82.61-5.5c0,0,.28,3.33.6,5.42,1.78-.12,3.64-.19,5.62-.21a76.76,76.76,0,0,1,9.11.45c-.05-2.15,0-6.82-.22-7.36s1.07,2.06,1.54,7.52a51.14,51.14,0,0,1,8.84,1.92c.23-2.37.41-5.93-.3-7.88,0,0,2.1,5,1.9,8.42h0c8.36,3,11.06,7.25,11.06,7.25S139,63.43,134.1,57.61Z"
                  fill="#77655a"
                />
              </g>
            </g>
          </g>
        </g>

        {/* Bong bóng thoại ngay trong SVG */}
        {showSpeech && (
          <g
            transform={`translate(${bubble.x} ${bubble.y})`}
            className="speech speech-enter"
          >
            <g className="speech-scale">
              <rect
                x="0"
                y="0"
                width="44"
                height="24"
                rx="6"
                ry="6"
                fill="white"
                stroke="none"
              />
              <polygon points="12,24 20,24 16,31" fill="white" stroke="none" />
              <text
                x="22"
                y="16"
                textAnchor="middle"
                fontSize="10"
                fontWeight={700}
                fill="#333"
              >
                {message}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Scoped styles – chỉ áp vào svg[data-girl] để không ảnh hưởng layout/element khác */}
      <style jsx>{`
        svg[data-girl] .bg {
          fill: #2f9e81 !important;
        }
        svg[data-girl] .hair,
        svg[data-girl] .hair-back,
        svg[data-girl] .hair-front {
          fill: var(--hair-black) !important;
          stroke: none !important;
        }
        svg[data-girl] .glasses {
          fill: none !important;
          stroke: var(--rim-red) !important;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 1 !important;
        }
        svg[data-girl] .speech {
          pointer-events: none;
          filter: drop-shadow(0 1px 0.5px rgba(0, 0, 0, 0.2));
          transform-box: fill-box;
          transform-origin: center;
        }
        svg[data-girl][role="button"]:focus {
          outline: none;
        }
        svg[data-girl][role="button"]:focus-visible {
          outline: 2px solid #0ea5e9;
          outline-offset: 4px;
          border-radius: 8px;
        }
        .speech-enter {
          animation: girlFadeIn 120ms ease-out both;
        }
        .speech-scale {
          transform-origin: 16px 24px;
          animation: girlScaleIn 200ms ease-out both;
        }
        @keyframes girlFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes girlScaleIn {
          from {
            transform: scale(0.85);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
