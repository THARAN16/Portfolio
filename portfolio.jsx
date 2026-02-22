import { useState, useEffect, useRef, useCallback } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  :root {
    --cyan: #00f5ff;
    --electric: #7b2fff;
    --neon-green: #39ff14;
    --dark: #020408;
    --dark2: #060d14;
    --panel: rgba(0,245,255,0.03);
    --border: rgba(0,245,255,0.15);
    --text: #c8e6ff;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--dark);
    color: var(--text);
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  .cursor {
    position: fixed;
    width: 12px; height: 12px;
    background: var(--cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed;
    width: 40px; height: 40px;
    border: 1px solid var(--cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.15s ease;
    opacity: 0.5;
  }

  canvas.bg-canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .content { position: relative; z-index: 1; }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.2rem 3rem;
    background: linear-gradient(180deg, rgba(2,4,8,0.95) 0%, transparent 100%);
    border-bottom: 1px solid rgba(0,245,255,0.08);
  }
  .nav-logo {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--cyan);
    letter-spacing: 3px;
    text-shadow: 0 0 20px var(--cyan);
  }
  .nav-links {
    display: flex; gap: 2.5rem; list-style: none;
  }
  .nav-links a {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: rgba(200,230,255,0.6);
    text-decoration: none;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: color 0.3s, text-shadow 0.3s;
    cursor: none;
  }
  .nav-links a:hover {
    color: var(--cyan);
    text-shadow: 0 0 15px var(--cyan);
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 0 2rem;
    position: relative;
    overflow: hidden;
  }

  .hero-chip {
    width: 220px; height: 220px;
    position: relative;
    margin: 0 auto 3rem;
    animation: chipFloat 4s ease-in-out infinite;
  }

  @keyframes chipFloat {
    0%, 100% { transform: translateY(0px) rotateY(0deg); }
    50% { transform: translateY(-20px) rotateY(8deg); }
  }

  .chip-svg {
    width: 100%; height: 100%;
    filter: drop-shadow(0 0 30px rgba(0,245,255,0.6)) drop-shadow(0 0 60px rgba(123,47,255,0.3));
  }

  .chip-pulse {
    position: absolute; inset: -20px;
    border-radius: 4px;
    animation: pulsate 2s ease-in-out infinite;
  }
  @keyframes pulsate {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,245,255,0.3); }
    50% { box-shadow: 0 0 0 20px rgba(0,245,255,0); }
  }

  .hero-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--cyan);
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 1rem;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.3s;
  }

  .hero-name {
    font-family: 'Orbitron', monospace;
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #fff 0%, var(--cyan) 50%, var(--electric) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.5s;
    margin-bottom: 1.5rem;
  }

  .hero-role {
    font-size: 1.3rem;
    font-weight: 600;
    color: rgba(200,230,255,0.7);
    letter-spacing: 4px;
    text-transform: uppercase;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.7s;
    margin-bottom: 2.5rem;
  }

  .hero-stats {
    display: flex; gap: 3rem;
    justify-content: center;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.9s;
    margin-bottom: 3rem;
  }
  .stat {
    text-align: center;
  }
  .stat-value {
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    font-weight: 700;
    color: var(--cyan);
    text-shadow: 0 0 20px var(--cyan);
  }
  .stat-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: rgba(200,230,255,0.4);
    letter-spacing: 2px;
    margin-top: 0.3rem;
  }

  .hero-cta {
    display: flex; gap: 1.5rem;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 1.1s;
  }
  .btn-primary {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 2px;
    padding: 0.9rem 2.5rem;
    background: transparent;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    cursor: none;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  }
  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary:hover { color: var(--dark); }
  .btn-primary span { position: relative; z-index: 1; }

  .btn-secondary {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 2px;
    padding: 0.9rem 2.5rem;
    background: transparent;
    border: 1px solid rgba(200,230,255,0.2);
    color: rgba(200,230,255,0.6);
    cursor: none;
    text-transform: uppercase;
    transition: all 0.3s;
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  }
  .btn-secondary:hover {
    border-color: var(--electric);
    color: var(--electric);
    box-shadow: 0 0 20px rgba(123,47,255,0.3);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SCAN LINE */
  .scanline {
    position: fixed; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    opacity: 0.3;
    animation: scan 6s linear infinite;
    z-index: 50;
    pointer-events: none;
  }
  @keyframes scan {
    from { top: 0; }
    to { top: 100%; }
  }

  /* SECTIONS */
  section {
    padding: 8rem 4rem;
    max-width: 1300px;
    margin: 0 auto;
  }

  .section-header {
    display: flex; align-items: center; gap: 1.5rem;
    margin-bottom: 4rem;
  }
  .section-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--cyan);
    opacity: 0.5;
    letter-spacing: 2px;
  }
  .section-title {
    font-family: 'Orbitron', monospace;
    font-size: 2.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, var(--cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
  }
  .section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--cyan), transparent);
    opacity: 0.3;
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }
  .about-text {
    font-size: 1.1rem;
    line-height: 1.9;
    color: rgba(200,230,255,0.75);
    font-weight: 300;
  }
  .about-text em {
    color: var(--cyan);
    font-style: normal;
    font-weight: 600;
  }
  .about-visual {
    position: relative;
    height: 350px;
  }

  /* Circuit board visual */
  .circuit-container {
    width: 100%; height: 100%;
    position: relative;
  }
  .circuit-svg {
    width: 100%; height: 100%;
    filter: drop-shadow(0 0 10px rgba(0,245,255,0.3));
  }

  /* EDUCATION */
  .edu-card {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 2.5rem;
    position: relative;
    margin-bottom: 1.5rem;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    transition: all 0.3s;
    overflow: hidden;
  }
  .edu-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,245,255,0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .edu-card:hover::before { opacity: 1; }
  .edu-card:hover {
    border-color: rgba(0,245,255,0.4);
    box-shadow: 0 0 30px rgba(0,245,255,0.1), inset 0 0 30px rgba(0,245,255,0.02);
  }
  .edu-year {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--cyan);
    letter-spacing: 3px;
    margin-bottom: 0.5rem;
  }
  .edu-degree {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
  }
  .edu-school {
    font-size: 1rem;
    color: rgba(200,230,255,0.6);
  }
  .edu-gpa {
    position: absolute;
    right: 2.5rem; top: 50%;
    transform: translateY(-50%);
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    font-weight: 900;
    color: var(--cyan);
    text-shadow: 0 0 20px var(--cyan);
    opacity: 0.8;
  }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .project-card {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%);
    transition: all 0.4s;
    cursor: none;
  }
  .project-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 24px; height: 24px;
    background: var(--border);
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    transition: background 0.3s;
  }
  .project-card:hover::after { background: var(--cyan); }
  .project-card::before {
    content: '';
    position: absolute;
    bottom: -100%; left: 0; right: 0;
    height: 100%;
    background: linear-gradient(0deg, rgba(0,245,255,0.08), transparent);
    transition: bottom 0.4s ease;
  }
  .project-card:hover::before { bottom: 0; }
  .project-card:hover {
    border-color: rgba(0,245,255,0.5);
    box-shadow: 0 20px 60px rgba(0,245,255,0.1);
    transform: translateY(-4px);
  }
  .project-number {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: var(--electric);
    letter-spacing: 3px;
    margin-bottom: 1rem;
  }
  .project-title {
    font-family: 'Orbitron', monospace;
    font-size: 1rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  .project-desc {
    font-size: 0.95rem;
    line-height: 1.8;
    color: rgba(200,230,255,0.6);
    margin-bottom: 1.5rem;
  }
  .project-tags {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
  }
  .tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(0,245,255,0.2);
    color: var(--cyan);
    letter-spacing: 1px;
    background: rgba(0,245,255,0.03);
  }
  .project-highlight {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: var(--neon-green);
    margin-bottom: 1rem;
    padding: 0.4rem 1rem;
    border: 1px solid rgba(57,255,20,0.2);
    background: rgba(57,255,20,0.05);
  }
  .dot { width: 6px; height: 6px; background: var(--neon-green); border-radius: 50%; animation: blink 1s infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* SKILLS */
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
  .skill-category {
    position: relative;
  }
  .skill-cat-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.8rem;
    color: var(--electric);
    letter-spacing: 3px;
    margin-bottom: 2rem;
    text-transform: uppercase;
  }
  .skill-item {
    margin-bottom: 1.5rem;
  }
  .skill-name {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    color: rgba(200,230,255,0.8);
    letter-spacing: 1px;
    margin-bottom: 0.6rem;
    display: flex; justify-content: space-between;
  }
  .skill-bar {
    height: 2px;
    background: rgba(255,255,255,0.05);
    position: relative;
    overflow: visible;
  }
  .skill-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--electric), var(--cyan));
    position: relative;
    transition: width 1.5s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 0 10px var(--cyan);
  }
  .skill-fill::after {
    content: '';
    position: absolute;
    right: -3px; top: -3px;
    width: 8px; height: 8px;
    background: var(--cyan);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--cyan);
  }

  /* CERTIFICATIONS */
  .cert-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .cert-card {
    padding: 2rem;
    border: 1px solid var(--border);
    background: var(--panel);
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }
  .cert-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--cyan), var(--electric));
  }
  .cert-card:hover {
    border-color: rgba(0,245,255,0.3);
    transform: translateX(4px);
    box-shadow: -4px 0 20px rgba(0,245,255,0.1);
  }
  .cert-org {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    color: var(--cyan);
    letter-spacing: 2px;
    margin-bottom: 0.8rem;
    opacity: 0.7;
  }
  .cert-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: rgba(200,230,255,0.9);
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  .cert-date {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(200,230,255,0.3);
  }

  /* CONTACT */
  .contact-section {
    text-align: center;
    padding: 8rem 4rem;
  }
  .contact-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(2rem, 6vw, 5rem);
    font-weight: 900;
    background: linear-gradient(135deg, #fff, var(--cyan), var(--electric));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
  }
  .contact-sub {
    font-size: 1.1rem;
    color: rgba(200,230,255,0.5);
    margin-bottom: 3rem;
    letter-spacing: 1px;
  }
  .contact-links {
    display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
  }
  .contact-link {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 2px;
    padding: 1rem 2rem;
    border: 1px solid var(--border);
    color: rgba(200,230,255,0.7);
    text-decoration: none;
    cursor: none;
    transition: all 0.3s;
    display: flex; align-items: center; gap: 0.8rem;
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }
  .contact-link:hover {
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 0 0 20px rgba(0,245,255,0.15);
    background: rgba(0,245,255,0.03);
  }

  /* FOOTER */
  footer {
    text-align: center;
    padding: 3rem;
    border-top: 1px solid rgba(0,245,255,0.08);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(200,230,255,0.2);
    letter-spacing: 2px;
  }

  /* GLITCH */
  .glitch {
    position: relative;
  }
  .glitch::before, .glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    background: linear-gradient(135deg, #fff, var(--cyan), var(--electric));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glitch::before {
    animation: glitch1 3s infinite;
    clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
    transform: translate(-2px, 0);
    opacity: 0.7;
  }
  .glitch::after {
    animation: glitch2 3s infinite;
    clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
    transform: translate(2px, 0);
    opacity: 0.7;
  }
  @keyframes glitch1 {
    0%, 95%, 100% { transform: translate(-2px, 0); }
    96% { transform: translate(6px, 2px); }
    97% { transform: translate(-4px, 1px); }
    98% { transform: translate(2px, -2px); }
  }
  @keyframes glitch2 {
    0%, 95%, 100% { transform: translate(2px, 0); }
    96% { transform: translate(-6px, -1px); }
    97% { transform: translate(4px, 2px); }
    98% { transform: translate(-2px, 1px); }
  }

  /* SCROLL REVEAL */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Terminal line effect */
  .terminal-line {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: rgba(0,245,255,0.4);
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }
  .terminal-line::before {
    content: '> ';
    color: var(--neon-green);
  }

  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    section { padding: 5rem 1.5rem; }
    .about-grid, .projects-grid, .skills-grid, .cert-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 2rem; }
    .edu-gpa { position: static; transform: none; margin-top: 0.5rem; font-size: 1.5rem; }
    .hero-cta { flex-direction: column; align-items: center; }
  }
`;

// Animated background canvas
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    // Grid
    const drawGrid = () => {
      ctx.strokeStyle = "rgba(0,245,255,0.03)";
      ctx.lineWidth = 1;
      const spacing = 60;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Connect nearby
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,245,255,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,255,${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}

// Custom cursor
function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 6 + "px";
        cursorRef.current.style.top = e.clientY - 6 + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX - 20 + "px";
        ringRef.current.style.top = e.clientY - 20 + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// Chip SVG
function ChipSVG() {
  return (
    <svg viewBox="0 0 200 200" className="chip-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a3a4a" />
          <stop offset="100%" stopColor="#0a1a2a" />
        </linearGradient>
        <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="100%" stopColor="#7b2fff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Chip body */}
      <rect x="50" y="50" width="100" height="100" rx="4" fill="url(#cg1)" stroke="rgba(0,245,255,0.4)" strokeWidth="1.5" filter="url(#glow)" />
      
      {/* Inner die */}
      <rect x="65" y="65" width="70" height="70" rx="2" fill="rgba(0,245,255,0.04)" stroke="rgba(0,245,255,0.2)" strokeWidth="1" />
      
      {/* Circuit paths */}
      <path d="M70 80 h20 v8 h-8 v4 h8 v8 h-20" stroke="rgba(0,245,255,0.5)" strokeWidth="1" fill="none" filter="url(#glow)" />
      <path d="M130 80 h-20 v8 h8 v4 h-8 v8 h20" stroke="rgba(123,47,255,0.5)" strokeWidth="1" fill="none" filter="url(#glow)" />
      <path d="M80 130 v-20 h8 v-8 h4 v8 h8 v20" stroke="rgba(0,245,255,0.5)" strokeWidth="1" fill="none" filter="url(#glow)" />
      <path d="M80 70 v20 h8 v-8 h4 v8 h8 v-20" stroke="rgba(123,47,255,0.5)" strokeWidth="1" fill="none" filter="url(#glow)" />

      {/* Center mark */}
      <rect x="90" y="90" width="20" height="20" fill="rgba(0,245,255,0.08)" stroke="rgba(0,245,255,0.3)" strokeWidth="1" />
      <line x1="90" y1="90" x2="110" y2="110" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5"/>
      <line x1="110" y1="90" x2="90" y2="110" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="3" fill="rgba(0,245,255,0.8)" filter="url(#glow)" />

      {/* Pins - top */}
      {[62,76,90,104,118,132].map((x, i) => (
        <line key={`t${i}`} x1={x} y1="50" x2={x} y2="38" stroke={i % 2 === 0 ? "rgba(0,245,255,0.6)" : "rgba(123,47,255,0.6)"} strokeWidth="2" filter="url(#glow)" />
      ))}
      {/* Pins - bottom */}
      {[62,76,90,104,118,132].map((x, i) => (
        <line key={`b${i}`} x1={x} y1="150" x2={x} y2="162" stroke={i % 2 === 0 ? "rgba(0,245,255,0.6)" : "rgba(123,47,255,0.6)"} strokeWidth="2" filter="url(#glow)" />
      ))}
      {/* Pins - left */}
      {[62,76,90,104,118,132].map((y, i) => (
        <line key={`l${i}`} x1="50" y1={y} x2="38" y2={y} stroke={i % 2 === 0 ? "rgba(0,245,255,0.6)" : "rgba(123,47,255,0.6)"} strokeWidth="2" filter="url(#glow)" />
      ))}
      {/* Pins - right */}
      {[62,76,90,104,118,132].map((y, i) => (
        <line key={`r${i}`} x1="150" y1={y} x2="162" y2={y} stroke={i % 2 === 0 ? "rgba(0,245,255,0.6)" : "rgba(123,47,255,0.6)"} strokeWidth="2" filter="url(#glow)" />
      ))}

      {/* Notch */}
      <circle cx="55" cy="55" r="3" fill="rgba(0,245,255,0.3)" />

      {/* Animated data flow */}
      <circle cx="0" cy="0" r="2" fill="var(--cyan)" filter="url(#glow)">
        <animateMotion dur="2s" repeatCount="indefinite" path="M62,50 L62,38" />
      </circle>
      <circle cx="0" cy="0" r="2" fill="#7b2fff" filter="url(#glow)">
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M50,90 L38,90" />
      </circle>
      <circle cx="0" cy="0" r="2" fill="var(--cyan)" filter="url(#glow)">
        <animateMotion dur="1.8s" repeatCount="indefinite" path="M132,150 L132,162" />
      </circle>
    </svg>
  );
}

// Skill bar
function SkillBar({ name, level }) {
  const [filled, setFilled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFilled(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="skill-item" ref={ref}>
      <div className="skill-name"><span>{name}</span><span style={{color:'rgba(0,245,255,0.5)', fontSize:'0.7rem'}}>{level}%</span></div>
      <div className="skill-bar">
        <div className="skill-fill" style={{ width: filled ? `${level}%` : "0%" }} />
      </div>
    </div>
  );
}

// Reveal wrapper
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => { if (ref.current) ref.current.classList.add("visible"); }, delay);
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className="reveal">{children}</div>;
}

export default function Portfolio() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const skills = {
    languages: [
      { name: "Verilog HDL", level: 90 },
      { name: "Python", level: 75 },
      { name: "C Programming", level: 70 },
      { name: "Tcl Scripting", level: 65 },
      { name: "Linux CLI & Shell", level: 72 },
    ],
    tools: [
      { name: "Cadence Virtuoso", level: 80 },
      { name: "Xilinx Vivado", level: 85 },
      { name: "Digital System Design", level: 88 },
      { name: "EDA Tool Flow", level: 78 },
    ],
  };

  return (
    <>
      <style>{style}</style>
      <ParticleCanvas />
      <Cursor />
      <div className="scanline" />

      <div className="content">
        {/* NAV */}
        <nav>
          <div className="nav-logo">TSM</div>
          <ul className="nav-links">
            {["about","education","projects","skills","contact"].map(l => (
              <li key={l}><a href="#" onClick={(e)=>{e.preventDefault();scrollTo(l);}}>{l}</a></li>
            ))}
          </ul>
        </nav>

        {/* HERO */}
        <div className="hero" id="home">
          <div className="hero-chip">
            <div className="chip-pulse" />
            <ChipSVG />
          </div>

          <p className="hero-tag">// VLSI Engineer & Hardware Designer</p>
          
          <h1 className="hero-name glitch" data-text="THARAN S M">THARAN S M</h1>
          
          <p className="hero-role">ECE Student · Chip Designer · Verilog HDL</p>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">8.94</div>
              <div className="stat-label">CGPA</div>
            </div>
            <div className="stat">
              <div className="stat-value">2</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat">
              <div className="stat-value">40%</div>
              <div className="stat-label">Power Saved</div>
            </div>
            <div className="stat">
              <div className="stat-value">2027</div>
              <div className="stat-label">Graduating</div>
            </div>
          </div>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo("projects")}>
              <span>View Projects</span>
            </button>
            <button className="btn-secondary" onClick={() => scrollTo("contact")}>
              Contact Me
            </button>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <Reveal>
            <div className="section-header">
              <span className="section-num">01</span>
              <h2 className="section-title">ABOUT</h2>
              <div className="section-line" />
            </div>
          </Reveal>
          <div className="about-grid">
            <Reveal delay={100}>
              <div>
                <div className="terminal-line">init_profile.sh</div>
                <div className="terminal-line">loading_expertise --module=VLSI</div>
                <br />
                <p className="about-text">
                  I am a motivated <em>Electronics and Communication Engineering</em> student with a strong academic foundation in <em>Digital Electronics</em>, Analog Communication, and Semiconductor fundamentals.
                </p>
                <br />
                <p className="about-text">
                  Developing expertise in <em>VLSI and chip design</em> with hands-on knowledge of Verilog HDL, Digital System Design, and EDA tools. Strong analytical thinking and disciplined work ethic drive my pursuit of high-performance hardware solutions.
                </p>
                <br />
                <p className="about-text">
                  Seeking opportunities in the <em>semiconductor industry</em> to apply technical knowledge, contribute to high-performance design environments, and grow as a hardware engineer.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="about-visual">
                <svg viewBox="0 0 400 350" width="100%" height="100%" style={{filter:'drop-shadow(0 0 20px rgba(0,245,255,0.2))'}}>
                  <defs>
                    <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0,245,255,0.2)"/>
                      <stop offset="100%" stopColor="rgba(123,47,255,0.1)"/>
                    </linearGradient>
                  </defs>
                  {/* Waveform display */}
                  <rect x="20" y="20" width="360" height="310" rx="4" fill="rgba(0,10,20,0.8)" stroke="rgba(0,245,255,0.15)" strokeWidth="1"/>
                  <text x="30" y="45" fill="rgba(0,245,255,0.4)" fontSize="10" fontFamily="monospace">CLK_SIGNAL_ANALYZER v2.1</text>
                  <line x1="20" y1="55" x2="380" y2="55" stroke="rgba(0,245,255,0.1)" strokeWidth="1"/>

                  {/* CLK */}
                  <text x="30" y="85" fill="rgba(0,245,255,0.6)" fontSize="9" fontFamily="monospace">CLK</text>
                  <polyline points="60,100 60,75 100,75 100,100 140,100 140,75 180,75 180,100 220,100 220,75 260,75 260,100 300,100 300,75 340,75 340,100 370,100" fill="none" stroke="#00f5ff" strokeWidth="1.5">
                    <animate attributeName="stroke-dashoffset" from="500" to="0" dur="2s" fill="freeze"/>
                  </polyline>

                  {/* DATA */}
                  <text x="30" y="135" fill="rgba(123,47,255,0.8)" fontSize="9" fontFamily="monospace">DATA</text>
                  <polyline points="60,150 60,125 120,125 120,150 160,150 160,125 200,125 200,150 240,150 240,125 280,125 280,150 340,150 340,125 370,125" fill="none" stroke="#7b2fff" strokeWidth="1.5"/>

                  {/* ALU_OUT */}
                  <text x="30" y="185" fill="rgba(57,255,20,0.7)" fontSize="9" fontFamily="monospace">ALU</text>
                  <polyline points="60,200 60,175 80,175 80,200 140,200 140,175 200,175 200,200 220,200 220,175 300,175 300,200 370,200" fill="none" stroke="#39ff14" strokeWidth="1.5"/>

                  {/* CTRL FSM */}
                  <text x="30" y="235" fill="rgba(255,200,0,0.6)" fontSize="9" fontFamily="monospace">FSM</text>
                  <polyline points="60,250 60,225 100,225 100,250 180,250 180,225 240,225 240,250 320,250 320,225 370,225" fill="none" stroke="rgba(255,200,0,0.7)" strokeWidth="1.5"/>

                  {/* Grid lines */}
                  {[60,100,140,180,220,260,300,340].map((x,i)=>(
                    <line key={i} x1={x} y1="55" x2={x} y2="305" stroke="rgba(0,245,255,0.04)" strokeWidth="1" strokeDasharray="4,4"/>
                  ))}

                  {/* Time markers */}
                  {[60,100,140,180,220,260,300,340].map((x,i)=>(
                    <text key={i} x={x-5} y="320" fill="rgba(0,245,255,0.25)" fontSize="8" fontFamily="monospace">{i*10}ns</text>
                  ))}
                  
                  {/* Animated cursor */}
                  <line x1="200" y1="55" x2="200" y2="305" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                    <animateTransform attributeName="transform" type="translate" from="0,0" to="160,0" dur="4s" repeatCount="indefinite"/>
                  </line>
                </svg>
              </div>
            </Reveal>
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education">
          <Reveal>
            <div className="section-header">
              <span className="section-num">02</span>
              <h2 className="section-title">EDUCATION</h2>
              <div className="section-line" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="edu-card">
              <div className="edu-year">2023 — 2027</div>
              <div className="edu-degree">B.E Electronics & Communication Engineering</div>
              <div className="edu-school">SRM Valliammai Engineering College</div>
              <div className="edu-gpa">8.94</div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="edu-card">
              <div className="edu-year">2023</div>
              <div className="edu-degree">HSC — Higher Secondary Certificate</div>
              <div className="edu-school">Shree Niketan Matric Hr. Sec School</div>
              <div className="edu-gpa">90%</div>
            </div>
          </Reveal>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <Reveal>
            <div className="section-header">
              <span className="section-num">03</span>
              <h2 className="section-title">PROJECTS</h2>
              <div className="section-line" />
            </div>
          </Reveal>
          <div className="projects-grid">
            <Reveal delay={100}>
              <div className="project-card">
                <div className="project-number">PRJ_001 // JAN 2026 – PRESENT</div>
                <div className="project-highlight"><span className="dot" />ACTIVE DEVELOPMENT</div>
                <div className="project-title">16-Bit Multicycle Processor with Adaptive ALU & Booth MAC Unit</div>
                <p className="project-desc">
                  Developed a 16-bit multi-cycle RISC processor with Adaptive ALU and Radix-4 Booth MAC unit in Verilog HDL. Implemented a five-stage FSM control unit with clock gating to minimize dynamic power dissipation. Synthesized at 25 MHz.
                </p>
                <div style={{marginBottom:'1rem', fontFamily:"'Share Tech Mono', monospace", fontSize:'0.8rem', color:'var(--neon-green)'}}>
                  ⚡ 40% Power Reduction Achieved
                </div>
                <div className="project-tags">
                  {["Verilog HDL","RISC","FSM","Radix-4 Booth","Clock Gating","25 MHz","Testbench"].map(t=>(
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="project-card">
                <div className="project-number">PRJ_002 // NOV 2025 – DEC 2025</div>
                <div className="project-title">Low-Power Clock Gating Implementation in Sequential Circuits</div>
                <p className="project-desc">
                  Implemented clock gating methods in sequential digital circuits using Verilog HDL to minimize unnecessary switching transitions. Developed gated clock logic for flip-flop and register modules. Conducted functional verification via structured testbenches.
                </p>
                <div className="project-tags">
                  {["Verilog HDL","Sequential Logic","Flip-Flops","Registers","Power Optimization","Testbench","Simulation"].map(t=>(
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <Reveal>
            <div className="section-header">
              <span className="section-num">04</span>
              <h2 className="section-title">SKILLS</h2>
              <div className="section-line" />
            </div>
          </Reveal>
          <div className="skills-grid">
            <Reveal delay={100}>
              <div className="skill-category">
                <div className="skill-cat-title">// Languages & Scripting</div>
                {skills.languages.map(s => <SkillBar key={s.name} {...s} />)}
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="skill-category">
                <div className="skill-cat-title">// EDA Tools & Design</div>
                {skills.tools.map(s => <SkillBar key={s.name} {...s} />)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section>
          <Reveal>
            <div className="section-header">
              <span className="section-num">05</span>
              <h2 className="section-title">CERTIFICATIONS</h2>
              <div className="section-line" />
            </div>
          </Reveal>
          <div className="cert-grid">
            <Reveal delay={100}>
              <div className="cert-card">
                <div className="cert-org">NIELIT</div>
                <div className="cert-name">VLSI For Beginners</div>
                <div className="cert-date">JULY 2025</div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="cert-card">
                <div className="cert-org">SRM VALLIAMMAI ENGINEERING COLLEGE — VAC</div>
                <div className="cert-name">VLSI Design and Verification: Integrating Analog and Digital Systems with Vivado and Cadence</div>
                <div className="cert-date">APRIL 2025</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <div className="contact-section" id="contact">
          <Reveal>
            <p style={{fontFamily:"'Share Tech Mono'",fontSize:'0.7rem',color:'var(--cyan)',letterSpacing:'4px',marginBottom:'1rem'}}>// INITIATE CONNECTION</p>
            <h2 className="contact-title">LET'S BUILD<br/>THE FUTURE</h2>
            <p className="contact-sub">Open to internships and opportunities in the semiconductor industry</p>
            <div className="contact-links">
              <a className="contact-link" href="mailto:smtharan52@gmail.com">
                <span>✉</span> smtharan52@gmail.com
              </a>
              <a className="contact-link" href="tel:+918608566570">
                <span>☎</span> +91 8608566570
              </a>
              <a className="contact-link" href="#">
                <span>in</span> tharansm
              </a>
              <a className="contact-link" href="#">
                <span>⌂</span> mysite.com
              </a>
            </div>
          </Reveal>
        </div>

        <footer>
          <p>THARAN S M // VLSI ENGINEER // smtharan52@gmail.com // {new Date().getFullYear()}</p>
          <p style={{marginTop:'0.5rem',opacity:0.5}}>DESIGNED WITH PRECISION — BUILT WITH PASSION</p>
        </footer>
      </div>
    </>
  );
}
