/**
 * Confettis légers en Canvas — célébration à la fin d'un quiz réussi.
 * Respecte prefers-reduced-motion.
 */

const COLORS = ["#C6A15B", "#223A5E", "#E9DCC0", "#3E8E6E", "#d0ac66", "#2a4a78"];

export function burstConfetti({ intense = false } = {}) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "confetti";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const W = window.innerWidth;
  const count = intense ? 160 : 90;
  const parts = Array.from({ length: count }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 120,
    y: window.innerHeight * 0.28 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 9,
    vy: Math.random() * -9 - 4,
    size: Math.random() * 7 + 4,
    rot: Math.random() * Math.PI,
    vrot: (Math.random() - 0.5) * 0.3,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  const gravity = 0.24;
  const start = performance.now();
  const duration = 2600;

  function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach((p) => {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - t / duration);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    if (t < duration) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}
