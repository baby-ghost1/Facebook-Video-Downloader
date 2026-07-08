import { useEffect, useRef } from "react";

const BackgroundEffects = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      o: Math.random() * 0.3 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains("dark");
      const style = getComputedStyle(document.documentElement);
      const particleColor = style.getPropertyValue("--particle-color").trim();
      const particleLine = style.getPropertyValue("--particle-line").trim();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor || (isDark
          ? `rgba(255, 255, 255, ${p.o * 0.3})`
          : `rgba(59, 130, 246, ${p.o * 0.15})`);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * (isDark ? 0.08 : 0.05);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particleLine || (isDark
              ? `rgba(255, 255, 255, ${alpha})`
              : `rgba(59, 130, 246, ${alpha})`);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div
          className="absolute -top-56 left-[-120px] h-[520px] w-[520px] rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"
          style={{ background: "var(--primary)", opacity: 0.06 }}
        />
        <div
          className="absolute top-[25%] right-[-120px] h-[500px] w-[500px] rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite]"
          style={{ background: "var(--purple)", opacity: 0.04 }}
        />
        <div
          className="absolute bottom-[-220px] left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full blur-3xl animate-[pulse_15s_ease-in-out_infinite]"
          style={{ background: "var(--info)", opacity: 0.03 }}
        />
      </div>
      <canvas ref={canvasRef} className="noise-overlay" />
      <div className="noise-overlay" />
    </>
  );
};

export default BackgroundEffects;
