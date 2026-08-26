import React, { useRef, useEffect, useState } from "react";
import { runDoubleSlitStep } from "./SEFI_DoubleSlitEngine";

export default function DoubleSlitSimulator({ params, onTension, onCollapse }) {
  const canvasRef = useRef(null);
  const [electron, setElectron] = useState({ x: 400, y: 200 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frame;

    const render = () => {
      const { field, tension, collapsed } = runDoubleSlitStep(params, electron);

      onTension(tension);
      if (collapsed) onCollapse({ tension });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw interference field
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < field.length; i++) {
        const { x, y, intensity } = field[i];
        const idx = (y * canvas.width + x) * 4;
        const c = Math.max(0, Math.min(255, Math.round(intensity * 255)));
        imageData.data[idx] = c;
        imageData.data[idx + 1] = c;
        imageData.data[idx + 2] = 255;
        imageData.data[idx + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw slits
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      const midX = canvas.width / 2;
      const slitOffset = params.slitSeparation / 2;
      const slitWidth = params.slitWidth;
      const slitHeight = 80;
      ctx.fillRect(midX - slitOffset - slitWidth / 2, 50, slitWidth, slitHeight);
      ctx.fillRect(midX + slitOffset - slitWidth / 2, 50, slitWidth, slitHeight);

      // Draw electron
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,200,0,0.9)";
      ctx.arc(electron.x, electron.y, 8, 0, Math.PI * 2);
      ctx.fill();

      frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [params, electron, onTension, onCollapse]);

  const handleDrag = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setElectron({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      onMouseMove={handleDrag}
      className="w-full h-full cursor-crosshair"
    />
  );
}
