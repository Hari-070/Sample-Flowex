"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

const DEFAULT_MARKERS = [
  { lat: 37.78, lng: -122.42, label: "San Francisco" },
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 35.68, lng: 139.69, label: "Tokyo" },
  { lat: -33.87, lng: 151.21, label: "Sydney" },
  { lat: 28.61, lng: 77.21, label: "Delhi" },
];

// const DEFAULT_CONNECTIONS = [
//   { from: [37.78, -122.42], to: [51.51, -0.13]  },
//   { from: [51.51, -0.13], to: [35.68, 139.69] },
//   { from: [35.68, 139.69], to: [-33.87, 151.21] },
//   { from: [37.78, -122.42], to: [28.61, 77.21] },
// ];
const DEFAULT_CONNECTIONS = [
  { from: [37.78, -122.42], to: [51.51, -0.13] },
  { from: [51.51, -0.13], to: [35.68, 139.69] },
  { from: [35.68, 139.69], to: [-33.87, 151.21] },
  { from: [37.78, -122.42], to: [28.61, 77.21] },
] as const;

function latLngToXYZ(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ] as [number, number, number];
}

function rotateY(x: number, y: number, z: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos] as [number, number, number];
}

function rotateX(x: number, y: number, z: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos] as [number, number, number];
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  fov: number
) {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z] as [number, number, number];
}

export function Component({
  className,
  size = 600,
  dotColor = "rgba(100,180,255,ALPHA)",
  arcColor = "rgba(100,180,255,0.5)",
  markerColor = "rgba(100,220,255,1)",
  autoRotateSpeed = 0.002,
  connections = DEFAULT_CONNECTIONS,
  markers = DEFAULT_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotY = useRef(0.4);
  const rotX = useRef(0.3);
  const animRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const fov = 600;

    rotY.current += autoRotateSpeed;

    ctx.clearRect(0, 0, w, h);

    // Outline
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100,180,255,0.1)";
    ctx.stroke();

    const dots = 1000;
    for (let i = 0; i < dots; i++) {
      const theta = (i / dots) * Math.PI * 2;
      const phi = Math.acos(1 - (2 * i) / dots);

      let x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.cos(phi);
      let z = radius * Math.sin(phi) * Math.sin(theta);

      [x, y, z] = rotateX(x, y, z, rotX.current);
      [x, y, z] = rotateY(x, y, z, rotY.current);

      if (z > 0) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const alpha = Math.max(0.2, 1 - (z + radius) / (2 * radius));

      ctx.beginPath();
      ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace("ALPHA", alpha.toFixed(2));
      ctx.fill();
    }

    // Connections
    connections.forEach((c) => {
      let [x1, y1, z1] = latLngToXYZ(c.from[0], c.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(c.to[0], c.to[1], radius);

      [x1, y1, z1] = rotateY(x1, y1, z1, rotY.current);
      [x2, y2, z2] = rotateY(x2, y2, z2, rotY.current);

      if (z1 > 0 && z2 > 0) return;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.stroke();
    });

    animRef.current = requestAnimationFrame(draw);
  }, [autoRotateSpeed, dotColor, arcColor, connections]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current!);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{ width: size, height: size }}
    />
  );
}