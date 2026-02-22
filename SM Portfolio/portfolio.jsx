import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from '@emailjs/browser';

// ── EmailJS credentials ──────────────────────────────────────────────────────
// 1. Sign up free at https://www.emailjs.com
// 2. Add a Gmail (or any) service  →  copy the Service ID below
// 3. Create an email template      →  copy the Template ID below
//    Template variables to use: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Go to Account → API Keys     →  copy your Public Key below
const EJ_SERVICE  = 'service_srw9yvf';    // e.g. 'service_abc123'
const EJ_TEMPLATE = 'template_ighm0bf';  // e.g. 'template_xyz456'
const EJ_PUBLIC   = 'ZguF3_IAgszbAZo7H';   // e.g. 'user_AbcDeFgHiJk'

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');

  :root {
    --cyan: #67b8aa;
    --electric: #8b7bb5;
    --neon-green: #72a88a;
    --dark: #0d1117;
    --dark2: #161b22;
    --panel: rgba(103,184,170,0.03);
    --border: rgba(148,163,184,0.1);
    --text: #94a3b8;
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
    mix-blend-mode: normal;
    opacity: 0.7;
  }
  .cursor-ring {
    position: fixed;
    width: 40px; height: 40px;
    border: 1px solid var(--cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.15s ease;
    opacity: 0.25;
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
    background: linear-gradient(180deg, rgba(13,17,23,0.97) 0%, transparent 100%);
    border-bottom: 1px solid rgba(148,163,184,0.08);
  }
  .nav-logo {
    font-family: 'Orbitron', monospace;
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--cyan);
    letter-spacing: 3px;
    text-shadow: none;
  }
  .nav-links {
    display: flex; gap: 2.5rem; list-style: none;
  }
  .nav-links a {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: rgba(148,163,184,0.6);
    text-decoration: none;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: color 0.3s, text-shadow 0.3s;
    cursor: none;
  }
  .nav-links a:hover, .nav-links a.active {
    color: var(--cyan);
    text-shadow: none;
  }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    z-index: 200;
  }
  .hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: rgba(148,163,184,0.7);
    transition: all 0.3s;
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
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .chip-svg {
    width: 100%; height: 100%;
    filter: drop-shadow(0 0 6px rgba(103,184,170,0.12));
  }

  .chip-pulse {
    position: absolute; inset: -20px;
    border-radius: 4px;
    animation: none;
  }
  @keyframes pulsate {
    0%, 100% { box-shadow: none; }
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
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%);
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
    color: rgba(148,163,184,0.7);
    letter-spacing: 4px;
    text-transform: uppercase;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.7s;
    margin-bottom: 2.5rem;
  }

  .hero-availability {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 2px;
    color: var(--neon-green);
    border: 1px solid rgba(114,168,138,0.25);
    background: rgba(114,168,138,0.05);
    padding: 0.45rem 1.2rem;
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.9s;
  }
  .avail-dot {
    width: 7px; height: 7px;
    background: var(--neon-green);
    border-radius: 50%;
    animation: blink 1.5s infinite;
    flex-shrink: 0;
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
    border: 1px solid rgba(148,163,184,0.2);
    color: rgba(148,163,184,0.6);
    cursor: none;
    text-transform: uppercase;
    transition: all 0.3s;
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  }
  .btn-secondary:hover {
    border-color: var(--electric);
    color: var(--electric);
    box-shadow: 0 0 12px rgba(167,139,250,0.15);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* SCAN LINE */
  .scanline { display: none; }
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
    color: #e2e8f0;
    letter-spacing: 2px;
  }
  .section-line {
    flex: 1;
    height: 1px;
    background: rgba(148,163,184,0.15);
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
    color: rgba(148,163,184,0.75);
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
    filter: none;
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
    background: linear-gradient(135deg, rgba(103,184,170,0.04), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .edu-card:hover::before { opacity: 1; }
  .edu-card:hover {
    border-color: rgba(148,163,184,0.2);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
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
    color: rgba(148,163,184,0.6);
  }
  .edu-gpa {
    position: absolute;
    right: 2.5rem; top: 50%;
    transform: translateY(-50%);
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    font-weight: 900;
    color: var(--cyan);
    text-shadow: none;
    opacity: 0.7;
  }

  /* PROJECTS */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .project-card.featured {
    border-color: rgba(94,234,212,0.15);
  }
  .reveal.col-full {
    grid-column: 1 / -1;
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
    background: linear-gradient(0deg, rgba(103,184,170,0.04), transparent);
    transition: bottom 0.4s ease;
  }
  .project-card:hover::before { bottom: 0; }
  .project-card:hover {
    border-color: rgba(94,234,212,0.3);
    box-shadow: 0 12px 32px rgba(94,234,212,0.06);
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
    color: rgba(148,163,184,0.6);
    margin-bottom: 1.5rem;
  }
  .project-tags {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .project-links {
    display: flex; gap: 0.8rem; flex-wrap: wrap;
  }
  .project-link {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 1.5px;
    padding: 0.35rem 0.9rem;
    border: 1px solid rgba(148,163,184,0.2);
    color: rgba(148,163,184,0.6);
    text-decoration: none;
    transition: all 0.25s;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: none;
  }
  .project-link:hover {
    border-color: var(--cyan);
    color: var(--cyan);
    background: rgba(94,234,212,0.03);
  }
  .project-link.demo:hover {
    border-color: var(--electric);
    color: var(--electric);
    background: rgba(139,123,181,0.04);
  }
  .tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(148,163,184,0.15);
    color: rgba(148,163,184,0.7);
    letter-spacing: 1px;
    background: rgba(148,163,184,0.04);
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
    border: 1px solid rgba(114,168,138,0.2);
    background: rgba(114,168,138,0.04);
  }
  .dot { width: 6px; height: 6px; background: var(--neon-green); border-radius: 50%; animation: blink 2s infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* SKILLS */
  .skill-groups { display: flex; flex-direction: column; gap: 2.5rem; }
  .skill-group {}
  .skill-cat-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    color: rgba(148,163,184,0.45);
    letter-spacing: 3px;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }
  .skill-chips { display: flex; flex-wrap: wrap; gap: 0.6rem; }
  .skill-chip {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    padding: 0.4rem 1rem;
    border-radius: 2px;
    letter-spacing: 1px;
  }
  .chip-pro {
    background: rgba(103,184,170,0.08);
    border: 1px solid rgba(103,184,170,0.25);
    color: var(--cyan);
  }
  .chip-fam {
    background: rgba(139,123,181,0.07);
    border: 1px solid rgba(139,123,181,0.2);
    color: var(--electric);
  }
  .chip-learn {
    background: rgba(148,163,184,0.05);
    border: 1px solid rgba(148,163,184,0.12);
    color: rgba(148,163,184,0.5);
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
    border-color: rgba(148,163,184,0.2);
    transform: translateX(4px);
    box-shadow: -2px 0 12px rgba(0,0,0,0.2);
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
    color: rgba(148,163,184,0.9);
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  .cert-date {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(148,163,184,0.3);
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
    color: #e2e8f0;
    margin-bottom: 1.5rem;
  }
  .contact-sub {
    font-size: 1.1rem;
    color: rgba(148,163,184,0.5);
    margin-bottom: 1.5rem;
    letter-spacing: 1px;
  }
  .contact-meta {
    display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }
  .contact-meta-item {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 1.5px;
    color: rgba(148,163,184,0.4);
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
    color: rgba(148,163,184,0.7);
    text-decoration: none;
    cursor: none;
    transition: all 0.3s;
    display: flex; align-items: center; gap: 0.8rem;
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }
  .contact-link:hover {
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: 0 0 10px rgba(94,234,212,0.08);
    background: rgba(94,234,212,0.03);
  }

  /* CONTACT FORM */
  .cf-wrapper {
    margin-top: 4rem;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
  }
  .cf-divider {
    display: flex; align-items: center; gap: 1.2rem;
    margin-bottom: 2.5rem;
  }
  .cf-divider-line {
    flex: 1; height: 1px;
    background: rgba(148,163,184,0.1);
  }
  .cf-divider-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(148,163,184,0.3);
    letter-spacing: 3px;
    white-space: nowrap;
  }
  .cf-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .cf-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }
  .cf-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 2px;
    color: rgba(148,163,184,0.4);
    text-transform: uppercase;
  }
  .cf-input, .cf-textarea {
    background: rgba(148,163,184,0.03);
    border: 1px solid rgba(148,163,184,0.12);
    color: rgba(226,232,240,0.9);
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.95rem;
    font-weight: 400;
    padding: 0.75rem 1rem;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    width: 100%;
    border-radius: 0;
  }
  .cf-input::placeholder, .cf-textarea::placeholder {
    color: rgba(148,163,184,0.2);
  }
  .cf-input:focus, .cf-textarea:focus {
    border-color: rgba(103,184,170,0.45);
    box-shadow: 0 0 0 1px rgba(103,184,170,0.1);
    background: rgba(103,184,170,0.025);
  }
  .cf-textarea {
    min-height: 140px;
    resize: vertical;
  }
  .cf-submit {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 2px;
    padding: 0.9rem 2.5rem;
    background: transparent;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    cursor: pointer;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
    width: 100%;
    margin-top: 0.5rem;
  }
  .cf-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--cyan);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .cf-submit:hover:not(:disabled)::before { transform: translateX(0); }
  .cf-submit:hover:not(:disabled) { color: var(--dark); }
  .cf-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .cf-submit span { position: relative; z-index: 1; }
  .cf-status {
    margin-top: 1.2rem;
    padding: 0.85rem 1.2rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .cf-status.success {
    border: 1px solid rgba(114,168,138,0.3);
    background: rgba(114,168,138,0.05);
    color: var(--neon-green);
  }
  .cf-status.error {
    border: 1px solid rgba(248,113,113,0.3);
    background: rgba(248,113,113,0.04);
    color: #f87171;
  }
  .cf-spin {
    display: inline-block;
    width: 12px; height: 12px;
    border: 1.5px solid rgba(103,184,170,0.3);
    border-top-color: var(--cyan);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 768px) {
    .cf-row { grid-template-columns: 1fr; }
  }

  /* FOOTER */
  footer {
    text-align: center;
    padding: 3rem;
    border-top: 1px solid rgba(148,163,184,0.08);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.65rem;
    color: rgba(148,163,184,0.2);
    letter-spacing: 2px;
  }

  .scroll-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 40px; height: 40px;
    background: rgba(13,17,23,0.9);
    border: 1px solid rgba(148,163,184,0.15);
    color: rgba(148,163,184,0.6);
    font-size: 1rem;
    cursor: pointer;
    z-index: 200;
    transition: all 0.3s;
    display: flex; align-items: center; justify-content: center;
  }
  .scroll-top:hover {
    border-color: var(--cyan);
    color: var(--cyan);
  }

  /* GLITCH */
  .glitch { position: relative; }
  .glitch::before, .glitch::after { display: none; }

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
    color: rgba(148,163,184,0.35);
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }
  .terminal-line::before {
    content: '> ';
    color: var(--neon-green);
  }

  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; }
    .nav-links {
      display: none;
      position: fixed; top: 0; left: 0; right: 0;
      background: rgba(13,17,23,0.98);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      height: 100vh;
      z-index: 150;
    }
    .nav-links.open { display: flex; }
    .nav-links a { font-size: 1rem; letter-spacing: 3px; }
    .hamburger { display: flex; }
    section { padding: 5rem 1.5rem; }
    .about-grid, .projects-grid, .cert-grid { grid-template-columns: 1fr; }
    .edu-gpa { position: static; transform: none; margin-top: 0.5rem; font-size: 1.5rem; }
    .hero-cta { flex-direction: column; align-items: center; }
    .scroll-top { bottom: 1rem; right: 1rem; }
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
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1 + 0.2,
      opacity: Math.random() * 0.2 + 0.05,
    }));

    // Grid
    const drawGrid = () => {
      ctx.strokeStyle = "rgba(94,234,212,0.025)";
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
            ctx.strokeStyle = `rgba(94,234,212,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,234,212,${p.opacity * 0.5})`;
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
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Chip body */}
      <rect x="50" y="50" width="100" height="100" rx="4" fill="url(#cg1)" stroke="rgba(94,234,212,0.3)" strokeWidth="1.5" filter="url(#glow)" />
      
      {/* Inner die */}
      <rect x="65" y="65" width="70" height="70" rx="2" fill="rgba(94,234,212,0.03)" stroke="rgba(94,234,212,0.15)" strokeWidth="1" />
      
      {/* Circuit paths */}
      <path d="M70 80 h20 v8 h-8 v4 h8 v8 h-20" stroke="rgba(94,234,212,0.4)" strokeWidth="1" fill="none" filter="url(#glow)" />
      <path d="M130 80 h-20 v8 h8 v4 h-8 v8 h20" stroke="rgba(167,139,250,0.4)" strokeWidth="1" fill="none" filter="url(#glow)" />
      <path d="M80 130 v-20 h8 v-8 h4 v8 h8 v20" stroke="rgba(94,234,212,0.4)" strokeWidth="1" fill="none" filter="url(#glow)" />
      <path d="M80 70 v20 h8 v-8 h4 v8 h8 v-20" stroke="rgba(167,139,250,0.4)" strokeWidth="1" fill="none" filter="url(#glow)" />

      {/* Center mark */}
      <rect x="90" y="90" width="20" height="20" fill="rgba(94,234,212,0.06)" stroke="rgba(94,234,212,0.25)" strokeWidth="1" />
      <line x1="90" y1="90" x2="110" y2="110" stroke="rgba(94,234,212,0.2)" strokeWidth="0.5"/>
      <line x1="110" y1="90" x2="90" y2="110" stroke="rgba(94,234,212,0.2)" strokeWidth="0.5"/>
      <circle cx="100" cy="100" r="3" fill="rgba(94,234,212,0.7)" filter="url(#glow)" />

      {/* Pins - top */}
      {[62,76,90,104,118,132].map((x, i) => (
        <line key={`t${i}`} x1={x} y1="50" x2={x} y2="38" stroke={i % 2 === 0 ? "rgba(94,234,212,0.45)" : "rgba(167,139,250,0.45)"} strokeWidth="2" filter="url(#glow)" />
      ))}
      {/* Pins - bottom */}
      {[62,76,90,104,118,132].map((x, i) => (
        <line key={`b${i}`} x1={x} y1="150" x2={x} y2="162" stroke={i % 2 === 0 ? "rgba(94,234,212,0.45)" : "rgba(167,139,250,0.45)"} strokeWidth="2" filter="url(#glow)" />
      ))}
      {/* Pins - left */}
      {[62,76,90,104,118,132].map((y, i) => (
        <line key={`l${i}`} x1="50" y1={y} x2="38" y2={y} stroke={i % 2 === 0 ? "rgba(94,234,212,0.45)" : "rgba(167,139,250,0.45)"} strokeWidth="2" filter="url(#glow)" />
      ))}
      {/* Pins - right */}
      {[62,76,90,104,118,132].map((y, i) => (
        <line key={`r${i}`} x1="150" y1={y} x2="162" y2={y} stroke={i % 2 === 0 ? "rgba(94,234,212,0.45)" : "rgba(167,139,250,0.45)"} strokeWidth="2" filter="url(#glow)" />
      ))}

      {/* Notch */}
      <circle cx="55" cy="55" r="3" fill="rgba(94,234,212,0.25)" />

      {/* Animated data flow */}
      <circle cx="0" cy="0" r="2" fill="#5eead4" filter="url(#glow)">
        <animateMotion dur="2s" repeatCount="indefinite" path="M62,50 L62,38" />
      </circle>
      <circle cx="0" cy="0" r="2" fill="#a78bfa" filter="url(#glow)">
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M50,90 L38,90" />
      </circle>
      <circle cx="0" cy="0" r="2" fill="#5eead4" filter="url(#glow)">
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
      <div className="skill-name"><span>{name}</span><span style={{color:'rgba(94,234,212,0.45)', fontSize:'0.7rem'}}>{level}%</span></div>
      <div className="skill-bar">
        <div className="skill-fill" style={{ width: filled ? `${level}%` : "0%" }} />
      </div>
    </div>
  );
}

// ── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [fields, setFields] = useState({ from_name: '', from_email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!fields.from_name.trim()) e.from_name = 'Name is required';
    if (!fields.from_email.trim()) e.from_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.from_email)) e.from_email = 'Invalid email';
    if (!fields.subject.trim()) e.subject = 'Subject is required';
    if (!fields.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('sending');
    setErrMsg('');
    try {
      emailjs.init({ publicKey: EJ_PUBLIC });
      await emailjs.send(
        EJ_SERVICE,
        EJ_TEMPLATE,
        {
          name:    fields.from_name,
          email:   fields.from_email,
          title:   fields.subject,
          message: fields.message,
        }
      );
      setStatus('success');
      setFields({ from_name: '', from_email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      const msg = err?.text || err?.message || JSON.stringify(err) || 'Unknown error';
      setErrMsg(msg);
      setStatus('error');
    }
  };

  return (
    <div className="cf-wrapper">
      <div className="cf-divider">
        <div className="cf-divider-line" />
        <span className="cf-divider-text">// SEND A MESSAGE</span>
        <div className="cf-divider-line" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="cf-row">
          <div className="cf-field">
            <label className="cf-label">Your Name</label>
            <input
              className="cf-input"
              name="from_name"
              placeholder="e.g. Rahul Kumar"
              value={fields.from_name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.from_name && <span style={{color:'#f87171',fontSize:'0.6rem',fontFamily:"'Share Tech Mono'",letterSpacing:'1px'}}>{errors.from_name}</span>}
          </div>
          <div className="cf-field">
            <label className="cf-label">Your Email</label>
            <input
              className="cf-input"
              name="from_email"
              type="email"
              placeholder="e.g. rahul@example.com"
              value={fields.from_email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.from_email && <span style={{color:'#f87171',fontSize:'0.6rem',fontFamily:"'Share Tech Mono'",letterSpacing:'1px'}}>{errors.from_email}</span>}
          </div>
        </div>

        <div className="cf-field">
          <label className="cf-label">Subject</label>
          <input
            className="cf-input"
            name="subject"
            placeholder="e.g. Internship Opportunity at XYZ Semiconductors"
            value={fields.subject}
            onChange={handleChange}
          />
          {errors.subject && <span style={{color:'#f87171',fontSize:'0.6rem',fontFamily:"'Share Tech Mono'",letterSpacing:'1px'}}>{errors.subject}</span>}
        </div>

        <div className="cf-field">
          <label className="cf-label">Message</label>
          <textarea
            className="cf-textarea"
            name="message"
            placeholder="Write your message here..."
            value={fields.message}
            onChange={handleChange}
          />
          {errors.message && <span style={{color:'#f87171',fontSize:'0.6rem',fontFamily:"'Share Tech Mono'",letterSpacing:'1px'}}>{errors.message}</span>}
        </div>

        {/* Hidden field so EmailJS template can show the reply-to address */}
        <input type="hidden" name="to_email" value="smtharan52@gmail.com" />

        <button className="cf-submit" type="submit" disabled={status === 'sending'}>
          <span>
            {status === 'sending' ? 'TRANSMITTING...' : 'SEND MESSAGE'}
          </span>
        </button>

        {status === 'sending' && (
          <div className="cf-status">
            <span className="cf-spin" /> Establishing connection...
          </div>
        )}
        {status === 'success' && (
          <div className="cf-status success">
            ✓ &nbsp;Message transmitted successfully — I'll get back to you soon!
          </div>
        )}
        {status === 'error' && (
          <div className="cf-status error">
            ✕ &nbsp;{errMsg || 'Transmission failed. Please email smtharan52@gmail.com directly'}
          </div>
        )}
      </form>
    </div>
  );
}

// Reveal wrapper
function Reveal({ children, delay = 0, className = "" }) {
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
  return <div ref={ref} className={`reveal${className ? " " + className : ""}`}>{children}</div>;
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showTop, setShowTop] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const sections = ["home","about","education","projects","skills","certifications","contact"];
    const onScroll = () => {
      setShowTop(window.scrollY > 400);
      const pos = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= pos) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const skills = {
    proficient: ["Verilog HDL", "Xilinx Vivado", "Digital System Design", "RTL Design", "FSM Design", "Testbench Writing"],
    familiar: ["Cadence Virtuoso", "EDA Tool Flow", "Clock Gating", "Python", "C Programming", "Tcl Scripting"],
    learning: ["SystemVerilog", "UVM Basics", "MATLAB", "Linux CLI", "Shell Scripting"],
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
          <ul className={`nav-links${menuOpen ? " open" : ""}`}>
            {["about","education","projects","skills","certifications","contact"].map(l => (
              <li key={l}><a href="#" className={activeSection === l ? "active" : ""} onClick={(e)=>{e.preventDefault();scrollTo(l);}}>{l}</a></li>
            ))}
          </ul>
          <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Toggle menu">
            <span/><span/><span/>
          </button>
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

          <div className="hero-availability">
            <span className="avail-dot" />
            Available for Internships — 2025 / 2026
          </div>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo("projects")}>
              <span>View Projects</span>
            </button>
            <a className="btn-secondary" href="/tharan-portfolio/resume.pdf" target="_blank" rel="noreferrer">
              Download CV
            </a>
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
                <svg viewBox="0 0 400 350" width="100%" height="100%" style={{filter:'drop-shadow(0 0 10px rgba(94,234,212,0.1))'}}>
                  <defs>
                    <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(94,234,212,0.15)"/>
                      <stop offset="100%" stopColor="rgba(167,139,250,0.08)"/>
                    </linearGradient>
                  </defs>
                  {/* Waveform display */}
                  <rect x="20" y="20" width="360" height="310" rx="4" fill="rgba(0,10,20,0.8)" stroke="rgba(94,234,212,0.12)" strokeWidth="1"/>
                  <text x="30" y="45" fill="rgba(94,234,212,0.35)" fontSize="10" fontFamily="monospace">CLK_SIGNAL_ANALYZER v2.1</text>
                  <line x1="20" y1="55" x2="380" y2="55" stroke="rgba(94,234,212,0.08)" strokeWidth="1"/>

                  {/* CLK */}
                  <text x="30" y="85" fill="rgba(94,234,212,0.5)" fontSize="9" fontFamily="monospace">CLK</text>
                  <polyline points="60,100 60,75 100,75 100,100 140,100 140,75 180,75 180,100 220,100 220,75 260,75 260,100 300,100 300,75 340,75 340,100 370,100" fill="none" stroke="#5eead4" strokeWidth="1.5">
                    <animate attributeName="stroke-dashoffset" from="500" to="0" dur="2s" fill="freeze"/>
                  </polyline>

                  {/* DATA */}
                  <text x="30" y="135" fill="rgba(167,139,250,0.7)" fontSize="9" fontFamily="monospace">DATA</text>
                  <polyline points="60,150 60,125 120,125 120,150 160,150 160,125 200,125 200,150 240,150 240,125 280,125 280,150 340,150 340,125 370,125" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>

                  {/* ALU_OUT */}
                  <text x="30" y="185" fill="rgba(134,239,172,0.65)" fontSize="9" fontFamily="monospace">ALU</text>
                  <polyline points="60,200 60,175 80,175 80,200 140,200 140,175 200,175 200,200 220,200 220,175 300,175 300,200 370,200" fill="none" stroke="#86efac" strokeWidth="1.5"/>

                  {/* CTRL FSM */}
                  <text x="30" y="235" fill="rgba(255,200,0,0.6)" fontSize="9" fontFamily="monospace">FSM</text>
                  <polyline points="60,250 60,225 100,225 100,250 180,250 180,225 240,225 240,250 320,250 320,225 370,225" fill="none" stroke="rgba(255,200,0,0.7)" strokeWidth="1.5"/>

                  {/* Grid lines */}
                  {[60,100,140,180,220,260,300,340].map((x,i)=>(
                    <line key={i} x1={x} y1="55" x2={x} y2="305" stroke="rgba(94,234,212,0.04)" strokeWidth="1" strokeDasharray="4,4"/>
                  ))}

                  {/* Time markers */}
                  {[60,100,140,180,220,260,300,340].map((x,i)=>(
                    <text key={i} x={x-5} y="320" fill="rgba(94,234,212,0.2)" fontSize="8" fontFamily="monospace">{i*10}ns</text>
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
            <Reveal delay={100} className="col-full">
              <div className="project-card featured">
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
                <div className="project-links">
                  <a className="project-link" href="https://github.com/tharansm/16bit-multicycle-processor" target="_blank" rel="noreferrer">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </a>
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
                <div className="project-links">
                  <a className="project-link" href="https://github.com/tharansm/clock-gating-sequential" target="_blank" rel="noreferrer">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="project-card">
                <div className="project-number">PRJ_003 // SEP 2025 – OCT 2025</div>
                <div className="project-title">4-Bit ALU Design with Overflow Detection</div>
                <p className="project-desc">
                  Designed and verified a 4-bit Arithmetic Logic Unit in Verilog HDL supporting ADD, SUB, AND, OR, XOR, and NOT operations. Integrated carry and overflow detection logic. Validated all operation modes using comprehensive testbenches in Xilinx Vivado.
                </p>
                <div className="project-tags">
                  {["Verilog HDL","ALU","Combinational Logic","Overflow Detection","Xilinx Vivado","Simulation"].map(t=>(
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a className="project-link" href="https://github.com/tharansm/4bit-alu" target="_blank" rel="noreferrer">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </a>
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
          <div className="skill-groups">
            <Reveal delay={100}>
              <div className="skill-group">
                <div className="skill-cat-title">Proficient</div>
                <div className="skill-chips">
                  {skills.proficient.map(s => <span key={s} className="skill-chip chip-pro">{s}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="skill-group">
                <div className="skill-cat-title">Familiar</div>
                <div className="skill-chips">
                  {skills.familiar.map(s => <span key={s} className="skill-chip chip-fam">{s}</span>)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="skill-group">
                <div className="skill-cat-title">Learning</div>
                <div className="skill-chips">
                  {skills.learning.map(s => <span key={s} className="skill-chip chip-learn">{s}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications">
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
        <section className="contact-section" id="contact">
          <Reveal>
            <p style={{fontFamily:"'Share Tech Mono'",fontSize:'0.7rem',color:'var(--cyan)',letterSpacing:'4px',marginBottom:'1rem'}}>// INITIATE CONNECTION</p>
            <h2 className="contact-title">LET'S BUILD<br/>THE FUTURE</h2>
            <p className="contact-sub">Open to internships and opportunities in the semiconductor industry</p>
            <div className="contact-meta">
              <span className="contact-meta-item">📍 Chennai, Tamil Nadu, India</span>
              <span className="contact-meta-item">🎓 B.E ECE · 2027</span>
            </div>
            <div className="contact-links">
              <a className="contact-link" href="mailto:smtharan52@gmail.com">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                smtharan52@gmail.com
              </a>
              <a className="contact-link" href="https://linkedin.com/in/tharansm" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                linkedin.com/in/tharansm
              </a>
              <a className="contact-link" href="https://github.com/THARAN16" target="_blank" rel="noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> github.com/THARAN16
              </a>
            </div>
            <ContactForm />
          </Reveal>
        </section>

        <footer>
          <p>THARAN S M // VLSI ENGINEER // smtharan52@gmail.com // {new Date().getFullYear()}</p>
          <p style={{marginTop:'0.5rem',opacity:0.5}}>DESIGNED WITH PRECISION — BUILT WITH PASSION</p>
        </footer>
      </div>

      {showTop && (
        <button className="scroll-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>
      )}
    </>
  );
}
